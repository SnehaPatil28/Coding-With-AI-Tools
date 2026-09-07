# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

# Database configuration (SQLite for local storage)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- 1. Database Model ---


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    roll_number = db.Column(db.String(50), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    marks = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "roll_number": self.roll_number,
            "department": self.department,
            "marks": self.marks
        }


# Initialize database tables
with app.app_context():
    db.create_all()

# --- 2. REST API Endpoints ---

# CREATE: Add a new student record


@app.route('/api/students', methods=['POST'])
def create_student():
    data = request.get_json()
    if not all(k in data for k in ("name", "roll_number", "department", "marks")):
        return jsonify({"error": "Missing required fields"}), 400

    if Student.query.filter_by(roll_number=data['roll_number']).first():
        return jsonify({"error": "Roll number already exists"}), 400

    new_student = Student(
        name=data['name'],
        roll_number=data['roll_number'],
        department=data['department'],
        marks=float(data['marks'])
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify(new_student.to_dict()), 201

# READ (All): Get list of all students


@app.route('/api/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([student.to_dict() for student in students]), 200

# READ (Single): Get student details by ID


@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.get_or_404(student_id)
    return jsonify(student.to_dict()), 200

# UPDATE: Edit an existing student record


@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    student = Student.query.get_or_404(student_id)
    data = request.get_json()

    student.name = data.get('name', student.name)
    student.roll_number = data.get('roll_number', student.roll_number)
    student.department = data.get('department', student.department)
    student.marks = float(data.get('marks', student.marks))

    db.session.commit()
    return jsonify(student.to_dict()), 200

# DELETE: Remove a student record


@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({"message": f"Student with ID {student_id} deleted successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
