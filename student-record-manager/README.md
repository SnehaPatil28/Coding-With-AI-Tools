# Student Record Manager API

A Flask-based CRUD application for managing student records. This project demonstrates a simple REST API built with Python and Flask, using SQLite as the local database for storing student details such as name, roll number, department, and marks.

---

## Key Features

- Create new student records
- Retrieve all student records
- Fetch a single student by ID
- Update an existing student record
- Delete a student record
- Input validation for required fields
- Duplicate roll number prevention
- JSON-based API responses
- SQLite database for lightweight local persistence

---

## Tech Stack & Prerequisites

### Tech Stack

- Python 3
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- SQLite

### Prerequisites

Before running the project, make sure you have the following installed:

- Python 3.8 or newer
- pip (Python package manager)
- Virtual environment support (`venv`)
- A terminal or command prompt

---

## Installation & Virtual Environment Setup

1. Open a terminal and navigate to the project root:

   ```bash
   cd student-record-manager
   ```

2. Change into the backend folder:

   ```bash
   cd backend
   ```

3. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:

   ### Windows (PowerShell)

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

   ### Windows (Command Prompt)

   ```cmd
   venv\Scripts\activate.bat
   ```

   ### macOS/Linux

   ```bash
   source venv/bin/activate
   ```

5. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

6. Verify installation:

   ```bash
   python -c "import flask; import flask_sqlalchemy; print('Dependencies installed successfully')"
   ```

---

## Usage / Run Commands

### Start the Flask server

From the `backend` directory, run:

```bash
python app.py
```

The API will run on:

```text
http://127.0.0.1:5000
```

### Available Endpoints

- `POST /api/students` - Create a student
- `GET /api/students` - Get all students
- `GET /api/students/<student_id>` - Get one student by ID
- `PUT /api/students/<student_id>` - Update a student
- `DELETE /api/students/<student_id>` - Delete a student

### Sample `curl` Request

#### Create a student

```bash
curl -X POST http://127.0.0.1:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "roll_number": "CS-101",
    "department": "Computer Science",
    "marks": 92.5
  }'
```

#### Get all students

```bash
curl http://127.0.0.1:5000/api/students
```

#### Get one student

```bash
curl http://127.0.0.1:5000/api/students/1
```

#### Update a student

```bash
curl -X PUT http://127.0.0.1:5000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "marks": 95
  }'
```

#### Delete a student

```bash
curl -X DELETE http://127.0.0.1:5000/api/students/1
```

---

## Project Directory Tree

```text
student-record-manager/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── instance/
│   └── students.db
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   └── src/
├── README.md
└── .gitignore
```

---

## Notes

- The backend uses SQLite, so data persists locally in `students.db` unless the database file is removed.
- The API includes basic validation and prevents duplicate roll numbers.
- The frontend may consume the Flask API from the backend server running on port `5000`.

---

## License

This project is intended for academic or educational use.
