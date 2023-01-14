export class Student {
    first_name;
    last_name;
    cnic;
    studentId;
    student_section;
    password;
    // Default parameters
    courses_enrolled = [];
    loginStatus = false;
    balance = 10000;
    // Optional parameters
    age;
    address;
    constructor(_first_name, _last_name, _cnic, _student_section, _studentId, _password) {
        this.first_name = _first_name;
        this.last_name = _last_name;
        this.cnic = _cnic;
        this.student_section = _student_section;
        this.studentId = _studentId;
        this.password = _password;
    }
}
