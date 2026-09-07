# app.py

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


# --------------------------------------------------
# 1. Flask Application Configuration
# --------------------------------------------------

app = Flask(__name__)

# Allow requests from the React frontend.
CORS(app)

# Use SQLite for local database storage.
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the SQLAlchemy database.
db = SQLAlchemy(app)


# --------------------------------------------------
# 2. Database Model
# --------------------------------------------------

class Student(db.Model):
    """Database model representing a student."""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Roll number must be unique so two students cannot
    # accidentally have the same identifier.
    roll_number = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    department = db.Column(db.String(100), nullable=False)
    marks = db.Column(db.Float, nullable=False)

    def to_dict(self):
        """Convert the Student object into a dictionary.

        Returns:
            dict: Student information in dictionary format.
        """
        return {
            "id": self.id,
            "name": self.name,
            "roll_number": self.roll_number,
            "department": self.department,
            "marks": self.marks
        }


# --------------------------------------------------
# 3. Initialize Database
# --------------------------------------------------

# Create the database tables if they do not already exist.
with app.app_context():
    db.create_all()


# --------------------------------------------------
# 4. CREATE - Add a New Student
# --------------------------------------------------

@app.route('/api/students', methods=['POST'])
def create_student():
    """Create a new student record.

    Returns:
        Response: JSON response containing the newly created
            student and HTTP status code 201.

    Raises:
        ValueError: If the marks value cannot be converted
            to a float.
    """

    data = request.get_json()

    # Check that all required fields are provided before
    # attempting to create the database record.
    if not all(
        key in data
        for key in ("name", "roll_number", "department", "marks")
    ):
        return jsonify({
            "error": "Missing required fields"
        }), 400

    # Check for an existing roll number because the database
    # requires roll_number to be unique.
    if Student.query.filter_by(
        roll_number=data['roll_number']
    ).first():
        return jsonify({
            "error": "Roll number already exists"
        }), 400

    # Convert marks to float so numeric values are stored
    # consistently in the database.
    # Invalid input will raise ValueError.
    new_student = Student(
        name=data['name'],
        roll_number=data['roll_number'],
        department=data['department'],
        marks=float(data['marks'])
    )

    db.session.add(new_student)
    db.session.commit()

    return jsonify(new_student.to_dict()), 201


# --------------------------------------------------
# 5. READ - Get All Students
# --------------------------------------------------

@app.route('/api/students', methods=['GET'])
def get_students():
    """Retrieve all student records.

    Returns:
        Response: JSON array containing all student records
            with HTTP status code 200.
    """

    students = Student.query.all()

    # Convert database objects into dictionaries because
    # Flask JSON responses cannot directly serialize models.
    return jsonify(
        [student.to_dict() for student in students]
    ), 200


# --------------------------------------------------
# 6. READ - Get One Student
# --------------------------------------------------

@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Retrieve a single student by ID.

    Args:
        student_id (int): Unique ID of the student to retrieve.

    Returns:
        Response: JSON representation of the requested
            student with HTTP status code 200.

    Raises:
        NotFound: If no student exists with the specified ID.
    """

    # Automatically returns HTTP 404 if the ID does not exist.
    student = Student.query.get_or_404(student_id)

    return jsonify(student.to_dict()), 200


# --------------------------------------------------
# 7. UPDATE - Edit an Existing Student
# --------------------------------------------------

@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """Update an existing student record.

    Args:
        student_id (int): Unique ID of the student to update.

    Returns:
        Response: JSON representation of the updated
            student with HTTP status code 200.

    Raises:
        NotFound: If no student exists with the specified ID.
        ValueError: If the supplied marks value cannot be
            converted to a float.
    """

    # Prevent updating a record that does not exist.
    student = Student.query.get_or_404(student_id)

    data = request.get_json()

    # Keep the old value when the client does not provide
    # that particular field in the update request.
    student.name = data.get(
        'name',
        student.name
    )

    student.roll_number = data.get(
        'roll_number',
        student.roll_number
    )

    student.department = data.get(
        'department',
        student.department
    )

    # Convert the new marks value to float.
    # If marks is omitted, the existing value is retained.
    student.marks = float(
        data.get(
            'marks',
            student.marks
        )
    )

    db.session.commit()

    return jsonify(student.to_dict()), 200


# --------------------------------------------------
# 8. DELETE - Remove a Student
# --------------------------------------------------

@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete a student record by ID.

    Args:
        student_id (int): Unique ID of the student to delete.

    Returns:
        Response: JSON confirmation message with HTTP
            status code 200.

    Raises:
        NotFound: If no student exists with the specified ID.
    """

    # Verify that the student exists before attempting deletion.
    student = Student.query.get_or_404(student_id)

    db.session.delete(student)
    db.session.commit()

    return jsonify({
        "message": (
            f"Student with ID {student_id} "
            "deleted successfully"
        )
    }), 200


# --------------------------------------------------
# 9. Run Flask Application
# --------------------------------------------------

if __name__ == '__main__':
    # Start the development server on port 5000.
    app.run(
        debug=True,
        port=5000
    )