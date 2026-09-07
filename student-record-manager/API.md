# User API Documentation

Base URL: `http://localhost:5000`

This API manages user records with the following endpoints under the `/api/v1/users` resource.

---

## 1. Create User

### HTTP Method & Path

- `POST /api/v1/users`

### Required Request Headers

| Header         | Required | Description                       |
| -------------- | -------- | --------------------------------- |
| `Content-Type` | Yes      | Must be `application/json`        |
| `Accept`       | Optional | Recommended as `application/json` |

### Request Body Parameters

| Field      | Data Type | Required | Description                  |
| ---------- | --------- | -------- | ---------------------------- |
| `username` | `string`  | Yes      | Unique username for the user |
| `email`    | `string`  | Yes      | User email address           |
| `age`      | `integer` | No       | User age                     |

### Sample JSON Request

```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "age": 28
}
```

### Sample JSON Response

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "age": 28
}
```

### Status Codes

| Status Code | Meaning                                            |
| ----------- | -------------------------------------------------- |
| `201`       | User created successfully                          |
| `400`       | Missing required fields or invalid request payload |
| `409`       | Username or email already exists                   |

---

## 2. Get All Users

### HTTP Method & Path

- `GET /api/v1/users`

### Required Request Headers

| Header   | Required | Description                       |
| -------- | -------- | --------------------------------- |
| `Accept` | Optional | Recommended as `application/json` |

### Request Body Parameters

No request body is required for this endpoint.

### Sample JSON Request

```json
{}
```

### Sample JSON Response

```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "john.doe@example.com",
    "age": 28
  },
  {
    "id": 2,
    "username": "janedoe",
    "email": "jane.doe@example.com",
    "age": 32
  }
]
```

### Status Codes

| Status Code | Meaning                      |
| ----------- | ---------------------------- |
| `200`       | Users retrieved successfully |
| `400`       | Invalid request              |

---

## 3. Get Single User

### HTTP Method & Path

- `GET /api/v1/users/<user_id>`

### Required Request Headers

| Header   | Required | Description                       |
| -------- | -------- | --------------------------------- |
| `Accept` | Optional | Recommended as `application/json` |

### Request Body Parameters

No request body is required for this endpoint.

### Sample JSON Request

```json
{}
```

### Sample JSON Response

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "age": 28
}
```

### Status Codes

| Status Code | Meaning                                   |
| ----------- | ----------------------------------------- |
| `200`       | User found and returned successfully      |
| `404`       | User with the specified ID does not exist |

---

## 4. Update User

### HTTP Method & Path

- `PUT /api/v1/users/<user_id>`

### Required Request Headers

| Header         | Required | Description                       |
| -------------- | -------- | --------------------------------- |
| `Content-Type` | Yes      | Must be `application/json`        |
| `Accept`       | Optional | Recommended as `application/json` |

### Request Body Parameters

| Field      | Data Type | Required | Description           |
| ---------- | --------- | -------- | --------------------- |
| `username` | `string`  | Optional | Updated username      |
| `email`    | `string`  | Optional | Updated email address |
| `age`      | `integer` | Optional | Updated user age      |

### Sample JSON Request

```json
{
  "username": "johnsmith",
  "email": "john.smith@example.com",
  "age": 29
}
```

### Sample JSON Response

```json
{
  "id": 1,
  "username": "johnsmith",
  "email": "john.smith@example.com",
  "age": 29
}
```

### Status Codes

| Status Code | Meaning                                                   |
| ----------- | --------------------------------------------------------- |
| `200`       | User updated successfully                                 |
| `400`       | Invalid request payload or bad data                       |
| `404`       | User not found                                            |
| `409`       | Updated username or email conflicts with an existing user |

---

## 5. Delete User

### HTTP Method & Path

- `DELETE /api/v1/users/<user_id>`

### Required Request Headers

| Header   | Required | Description                       |
| -------- | -------- | --------------------------------- |
| `Accept` | Optional | Recommended as `application/json` |

### Request Body Parameters

No request body is required for this endpoint.

### Sample JSON Request

```json
{}
```

### Sample JSON Response

```json
{
  "message": "User deleted successfully"
}
```

### Status Codes

| Status Code | Meaning                   |
| ----------- | ------------------------- |
| `200`       | User deleted successfully |
| `404`       | User not found            |

---

## Error Response Format

```json
{
  "error": "Description of the error"
}
```

This API follows a standard REST structure where successful create/update operations return the created or updated user object, while delete operations often return a confirmation message.
