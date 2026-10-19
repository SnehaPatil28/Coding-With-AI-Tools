# REST API Specification

## Overview

Base URL for the local backend: `http://127.0.0.1:5000`. The implemented student resource is `/api/students`. Successful responses use JSON. `Content-Type: application/json` is needed for JSON writes; `Accept: application/json` is recommended. The frontend uses Axios and sends requests to this base URL.

This specification distinguishes **Current behavior** from **Recommended behavior**. The status and error details below reflect `backend/app.py`, including cases where Flask or SQLAlchemy currently produces an unhandled response.

## Endpoint Summary

| Method   | URL                  | Purpose                | Current success status |
| -------- | -------------------- | ---------------------- | ---------------------- |
| `POST`   | `/api/students`      | Create a student       | `201`                  |
| `GET`    | `/api/students`      | Retrieve all students  | `200`                  |
| `GET`    | `/api/students/<id>` | Retrieve one student   | `200`                  |
| `PUT`    | `/api/students/<id>` | Update supplied fields | `200`                  |
| `DELETE` | `/api/students/<id>` | Delete a student       | `200`                  |

The `<id>` path segment is an integer matched by Flask's `<int:student_id>` converter. A non-integer path segment does not match these routes.

## Student JSON Representation

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "roll_number": "CS-101",
  "department": "Computer Science",
  "marks": 92.5
}
```

For create, the required request fields are `name`, `roll_number`, `department`, and `marks`. The server converts `marks` to a Python float. The response contains the generated integer `id` and the four submitted fields.

## Endpoint Details

### Create Student

**Method and URL:** `POST /api/students`  
**Purpose:** Create and persist a student record.  
**Headers:** `Content-Type: application/json` required for JSON parsing; `Accept: application/json` recommended.  
**Path parameters:** None.

Request body:

```json
{
  "name": "Alice Johnson",
  "roll_number": "CS-101",
  "department": "Computer Science",
  "marks": 92.5
}
```

Current success response (`201 Created`):

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "roll_number": "CS-101",
  "department": "Computer Science",
  "marks": 92.5
}
```

Current errors: missing one or more required keys returns `400` with `{"error":"Missing required fields"}`. A roll number found in an initial query returns `400` with `{"error":"Roll number already exists"}`. The duplicate constraint in SQLite also protects the stored data, but a race between the pre-check and insert is not translated into a controlled response. Invalid/missing JSON and values that cannot be converted with `float()` are not handled by a route-level JSON error handler and may result in Flask error responses or `500`.

Recommended: return `409 Conflict` for duplicate roll numbers and consistently return JSON `400` for malformed payloads, missing/null/blank fields, invalid marks, and unsupported numeric values.

### Retrieve All Students

**Method and URL:** `GET /api/students`  
**Purpose:** Return all student records.  
**Headers:** `Accept: application/json` recommended.  
**Path parameters/body:** None.

Current success response (`200 OK`):

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "roll_number": "CS-101",
    "department": "Computer Science",
    "marks": 92.5
  }
]
```

An empty database returns `200 OK` with `[]`. No explicit sorting or pagination is implemented.

### Retrieve Student by ID

**Method and URL:** `GET /api/students/<id>`  
**Purpose:** Return one student.  
**Headers:** `Accept: application/json` recommended.  
**Path parameter:** `id` is the integer student primary key.  
**Request body:** None.

Current success response (`200 OK`) is one Student JSON object as shown above. If the ID does not exist, `get_or_404()` returns `404 Not Found`; the application does not define a JSON error handler, so the default body is generally Flask's HTML 404 page, not `{"error":"Student not found"}`.

Recommended: use a JSON error response for the 404 case.

### Update Student

**Method and URL:** `PUT /api/students/<id>`  
**Purpose:** Update an existing student.  
**Headers:** `Content-Type: application/json` required for a JSON body; `Accept: application/json` recommended.  
**Path parameter:** `id` is the integer student primary key.

The implemented handler preserves every field omitted from the request, so this `PUT` currently behaves as a partial update. Example request:

```json
{
  "name": "Alice Smith",
  "marks": 95
}
```

Current success response (`200 OK`):

```json
{
  "id": 1,
  "name": "Alice Smith",
  "roll_number": "CS-101",
  "department": "Computer Science",
  "marks": 95.0
}
```

If the ID does not exist, the handler returns `404` through `get_or_404()` (currently Flask's default error body). A roll-number change that conflicts with another student violates the unique database constraint; the route does not catch the resulting database error, so it may return `500` rather than `409`. Invalid marks and malformed/missing JSON are also not handled with a route-level error response.

Recommended: either keep partial semantics and document them clearly, or make `PUT` require a complete representation and add `PATCH` for partial changes. Validate candidate fields before mutation and translate duplicate conflicts to `409`.

### Delete Student

**Method and URL:** `DELETE /api/students/<id>`  
**Purpose:** Delete a student record.  
**Headers:** `Accept: application/json` recommended.  
**Path parameter:** `id` is the integer student primary key.  
**Request body:** None.

Current success response (`200 OK`):

```json
{
  "message": "Student with ID 1 deleted successfully"
}
```

If the ID does not exist, the handler returns `404` via `get_or_404()`; the default Flask response is not explicitly JSON.

## Validation and Error Handling

| Condition                           | Current behavior                                               | Recommended behavior                                                     |
| ----------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Missing create keys                 | `400`, JSON error                                              | Keep `400`; list missing fields                                          |
| Duplicate roll number on create     | `400`, JSON error after pre-query                              | `409 Conflict`; retain DB unique constraint                              |
| Duplicate roll number on update     | Uncaught database error may produce `500`                      | Roll back and return `409 Conflict`                                      |
| Student ID does not exist           | `404` from `get_or_404()`, default Flask body                  | `404` with JSON `{"error":"Student not found"}`                          |
| Non-numeric marks                   | `float()` exception is uncaught and may produce `500`          | `400` with a field-specific JSON error                                   |
| Missing/null/non-object JSON        | Not consistently checked; may cause framework or runtime error | Validate JSON object and return JSON `400`                               |
| Blank strings or out-of-range marks | No server-side check                                           | Reject blank required text; define and validate the official marks range |

The current route has no explicit `409` response. `409` is an appropriate recommended response for uniqueness conflicts, not an existing status. Flask may itself return `400` for malformed JSON or `415` when the request content type is not JSON, depending on the failure and Flask version; these framework responses are not normalized by the application.
