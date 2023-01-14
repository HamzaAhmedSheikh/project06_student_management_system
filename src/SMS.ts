import { Student } from "./Student.js";

class SMS {
    name: string;
    students = new Map<number, Student>();
    private _idsGenetor = 0;

    constructor(_name: string) {
        this.name = _name;
    }


    /********************* Student Section ***************/

    getAllStudents(): Student[] {
        return [...this.students.values()]
    }

    getStudentById(id: number): Student | undefined {
        return this.students.get(id);
    }

    enrollStudentinUMS(first_name: string, last_name: string, cnic: number, section: "Morning"|"Evening") {
        const newId = ++this._idsGenetor;
        var password = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const student = new Student(first_name, last_name, cnic, section, newId, password);
        this.students.set(newId, student);
        return { id: newId, password: password };
      }

    logIn(studentId: number, password: string): { status: boolean, msg: string } {

        let student = this.students.get(studentId);

        if (!student) {
            return {
                status: false,
                msg: "Student do not exist"
            }
        }

        if (student.password == password) {
            student.loginStatus = true;
            this.students.set(studentId, student);
            return {
                status: true,
                msg: "Successfully Logged In"
            }
        }
        else {
            return {
                status: false,
                msg: "Incorrect password"
            }

        }
    }

    setProfile(studentId: number, first_name: string, last_name: string, age: number, address: string, cnic: number) {
        let student = this.students.get(studentId);

        if (!student) throw Error("Student do not exist");
        if (!student.loginStatus) throw Error("Not logged In");

        student.first_name = first_name;
        student.last_name = last_name;
        student.age = age;
        student.address = address;
        student.cnic = cnic;
    }

    setPassword(studentId: number, newPassword: string, oldPassword: string) {
        let student = this.students.get(studentId);

        if (!student) throw Error("Student do not exist");
        if (!student.loginStatus) throw Error("Not logged In");

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
