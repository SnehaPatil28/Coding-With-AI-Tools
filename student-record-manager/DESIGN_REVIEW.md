# Design Review

## Design Assumptions

- The source of truth is the current implementation in `backend/app.py`, plus the React client in `frontend/src/App.jsx`. The older root `API.md` documents a different user API and does not describe the implemented student API.
- SQLite is the configured persistence layer (`sqlite:///students.db`); Flask-SQLAlchemy is the ORM. The `Student` model is currently declared in `app.py`; `backend/models.py` is empty.
- The requested entity has exactly five attributes: `id`, `name`, `roll_number`, `department`, and `marks`. No independent department data or relationship is currently required.
- No marks scale is specified by the code or current API. A numeric range such as 0 to 100 must be confirmed before it becomes a constraint.
- These documents describe the current implementation and label suggested behavior separately. No application code has been changed as part of this design documentation.

## Consistency Checks

| Check                             | Finding                                                                                                                                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API operations map to persistence | Yes. Create adds and commits; list/detail query; update mutates and commits; delete removes and commits. All operate on the single `Student` model.                                                                                                                                               |
| Duplicate roll numbers prevented  | The model declares `unique=True` and `nullable=False`; create also performs a pre-query. The database constraint is authoritative. Create reports a pre-detected duplicate as `400`, not `409`. Update conflicts are not caught and can become `500`.                                             |
| Required/missing fields handled   | Create checks only that the four keys exist. It does not reject empty strings, null values, incorrect field types, or malformed/non-object JSON reliably. Update accepts omitted keys by preserving prior values, but does not validate supplied text fields.                                     |
| Nonexistent IDs handled           | `get_or_404()` is used by detail, update, and delete, so they return `404`. The application does not customize the default 404 body into JSON.                                                                                                                                                    |
| Marks range suitable              | No lower or upper bound exists in the model or routes; the React number input is not a server-side range check. A grading scale must be agreed before validation is added.                                                                                                                        |
| Transaction/error handling        | Writes call `db.session.commit()`, which runs within SQLAlchemy's transaction behavior. Route handlers do not catch commit/constraint/conversion failures or explicitly roll back after an error.                                                                                                 |
| Concurrent duplicate creation     | SQLite's unique constraint prevents two committed rows from sharing a roll number even if two requests both pass the pre-query. One request can still fail at commit; without handling, that failure is not returned as a controlled `409` and the failed session may need rollback before reuse. |
| Frontend/API alignment            | React calls the implemented `/api/students` routes and handles JSON error text if present. It sends form values as strings, including `marks`; the backend converts marks to float.                                                                                                               |

## Edge Cases and Risks

- `request.get_json()` may reject wrong content types or malformed JSON before application validation; `data` can also be `None` or a non-object. The handlers assume a dictionary.
- Create checks key presence, not whether values are valid. For example, `null` or a nonnumeric `marks` value can fail during model construction or `float()` conversion.
- Empty strings pass the required-key check and satisfy SQLite `NOT NULL`; whitespace-only names and departments are also accepted.
- `float()` accepts values such as `NaN` and infinity in Python. Their serialization/storage behavior is not a defined marks policy and should be rejected if finite ordinary grades are expected.
- Updating a roll number to one already owned by another student fails at the database constraint. The current handler has no `IntegrityError` response mapping.
- The existence query and subsequent mutation are not caught for database errors. Error paths should roll back the SQLAlchemy session before it is reused.
- `PUT` has partial-update semantics. This is usable by the current UI but differs from the conventional full-replacement meaning of `PUT`.
- Detail and delete missing-ID responses are 404, but the default HTML body is inconsistent with the JSON API responses used elsewhere.
- The SQLite database is local and appropriate for this experiment; the development server with `debug=True` and hard-coded frontend URL should not be exposed as a production deployment.

## Recommended Improvements

These are recommendations only; they are not implemented in the current project.

1. **Centralize payload validation:** Require a JSON object; validate required fields, non-empty trimmed strings, field types, and finite numeric marks. Return consistent JSON `400` responses with useful field messages.
2. **Make uniqueness errors explicit:** Keep the database unique constraint. Treat the create pre-query as a usability check, but also catch `IntegrityError` around commit, call `db.session.rollback()`, and return `409 Conflict`. Apply the same handling to updates.
3. **Normalize API errors:** Add JSON error handlers for `400`, `404`, and relevant server errors so consumers do not receive framework HTML for API routes. Avoid returning internal exception details.
4. **Clarify update semantics:** For minimal disruption, keep current partial update behavior but document that the route accepts partial bodies. For stricter REST semantics, make `PUT` require all fields and add `PATCH` for partial changes; update the React client and tests accordingly.
5. **Define marks policy:** Confirm whether marks are 0-100 or another scale. Then validate finite values and the approved range in the API; optionally mirror the rule with a SQLite `CHECK` constraint. Do not guess the academic scale.
6. **Protect operational boundaries:** Keep debug mode for local development only, configure CORS for the expected frontend origin outside development, and use environment-based configuration if deployment is introduced.

## Overall Assessment

The architecture and one-table schema are coherent for a student-level CRUD experiment. The existing API and frontend align on the resource path and fields, and the database enforces the most important uniqueness invariant. The main gaps are inconsistent validation and error responses, unhandled uniqueness/commit failures, and an unspecified marks range. The recommendations above address those gaps without adding unnecessary entities or infrastructure.
