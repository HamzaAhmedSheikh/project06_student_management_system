export class Student {
    first_name: string;
    last_name: string;
    cnic: number;
    studentId: number;
    student_section: "Morning" | "Evening";
    password: string;

    // Default parameters
    courses_enrolled: string[] = [];
    loginStatus = false;
    balance = 10_000;

    // Optional parameters
    age?: number;
    address?: string;


    constructor(
        _first_name: string,
        _last_name: string,
        _cnic: number,
        _student_section: "Morning" | "Evening",
        _studentId: number,
        _password: string,
    ) {

        this.first_name = _first_name;
        this.last_name = _last_name;
        this.cnic = _cnic;
        this.student_section = _student_section;
        this.studentId = _studentId;
        this.password = _password;
    }

}