import { Student } from "./Student.js";
class SMS {
    name;
    students = new Map();
    _idsGenetor = 0;
    constructor(_name) {
        this.name = _name;
    }
    /********************* Student Section ***************/
    getAllStudents() {
        return [...this.students.values()];
    }
    getStudentById(id) {
        return this.students.get(id);
    }
    enrollStudentinUMS(first_name, last_name, cnic, section) {
        const newId = ++this._idsGenetor;
        var password = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const student = new Student(first_name, last_name, cnic, section, newId, password);
        this.students.set(newId, student);
        return { id: newId, password: password };
    }
    logIn(studentId, password) {
        let student = this.students.get(studentId);
        if (!student) {
            return {
                status: false,
                msg: "Student do not exist"
            };
        }
        if (student.password == password) {
            student.loginStatus = true;
            this.students.set(studentId, student);
            return {
                status: true,
                msg: "Successfully Logged In"
            };
        }
        else {
            return {
                status: false,
                msg: "Incorrect password"
            };
        }
    }
    setProfile(studentId, first_name, last_name, age, address, cnic) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        if (!student.loginStatus)
            throw Error("Not logged In");
        student.first_name = first_name;
        student.last_name = last_name;
        student.age = age;
        student.address = address;
        student.cnic = cnic;
    }
    setPassword(studentId, newPassword, oldPassword) {
        let student = this.students.get(studentId);
        if (!student)
            throw Error("Student do not exist");
        if (!student.loginStatus)
            throw Error("Not logged In");
        if (student.password === oldPassword) {
            student.password = newPassword;
            this.students.set(studentId, student);
        }
        else {
            throw Error("Incorrect password");
        }
    }
}
export default new SMS("PIAIC STUDENT MANAGEMENT SYSTEM");
