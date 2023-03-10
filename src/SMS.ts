import { Course } from "./Course.js";
import { Instructor } from "./Instructor.js";
import { Student } from "./Student.js";
import { CourseInput, InstructorInput } from "./types.js";

class SMS {
    name: string;
    private _idsGenetor = 0;
    students = new Map<number, Student>();
    courses = new Map<string, Course>();
    instructors = new Map<string, Instructor>();
    balance = 0;


    constructor(_name: string) {
        this.name = _name;
    }


    /***********************  Student Section ***********************************************/

    getAllStudents(): Student[] {
        return [...this.students.values()]
    }

    getStudentById(id: number): Student | undefined {
        return this.students.get(id);
    }

    enrollStudentinUMS(first_name: string, last_name: string, cnic: number, section: "Morning" | "Evening") {
        const newId = ++this._idsGenetor;
        var password = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const student = new Student(first_name, last_name, cnic, section, newId, password);
        this.students.set(newId, student);
        return { id: newId, password: password };
    }

    /************************ sign up, login in section **************************************/

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

    /************************ Course Section ************************************************/

    AddCoursesinUMS(_courses: CourseInput[]) {
        _courses.map((course) => {
            const { course_code, course_name, description, instructor, tuition_fee } = course;
            const newCourse = new Course(course_code, course_name, description, instructor, tuition_fee)
            this.courses.set(course.course_code, newCourse);
        })
    }

    enrollInCourses(studentId: number, courseCodes: string[]) {
        let student = this.students.get(studentId);
        if (!student) throw Error("Student do not exist");
        if (!student.loginStatus) throw Error("You are not logged In");

        let totalFeeToPay = 0

        courseCodes.map((code: string) => {
            const course = this.courses.get(code);
            if (course) {
                totalFeeToPay = totalFeeToPay + course.tuition_fee;
            }
        })

        if (student.balance < Number(totalFeeToPay)) {
            throw Error("You don't have enough balance to enroll in these courses");
        }

        courseCodes.forEach((code) => {
            const course = this.courses.get(code)
            if (!course) throw Error(`course do not exist ${code}`);

            if (student) {
                this.balance += course.tuition_fee;
                student.balance -= course.tuition_fee;
                student.courses_enrolled.push(course.course_code);
            }
        })

        this.students.set(studentId, student);
    }

    getAllCourseInUMS(): Course[] {
        return [...this.courses.values()]
    }

    getCourseById(code: string): Course | undefined {
        return this.courses.get(code);
    }

    /************************* Instructor Section ******************************************/

    AddInstructorsInUMS(_instructors: InstructorInput[]) {
        _instructors.map((instructor) => {
          let newInstructor = new Instructor(instructor.instructor_name, instructor.course_codes)
          this.instructors.set(instructor.instructor_name, newInstructor);
        })
    }

    getAllInstructorsInUMS(): Instructor[] {
        return [...this.instructors.values()]
    }
}

export default new SMS("STUDENT MANAGEMENT SYSTEM");
