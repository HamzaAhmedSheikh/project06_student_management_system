#! /usr/bin/env node
import inquirer from "inquirer";
import PIAIC_SMS from "./SMS.js";
import { coursesList, instructorsList } from './types.js';
let studentData;
let quit = false;
const delay = async (ms = 2000) => {
    return new Promise((res) => setTimeout(res, ms));
};
const updatingComponent = async (msg) => {
    for (let i = 1; i < 100; i++) {
        const show = "=".repeat(i);
        console.clear();
        console.log();
        console.log(msg);
        console.log(show);
        console.log();
        await delay(10);
    }
};
const welcomeMsg = () => {
    console.log("");
    console.log("Welcome to", PIAIC_SMS.name + "\n");
};
const loggedInWelcomMsg = () => {
    console.log("");
    if (studentData) {
        console.clear();
        console.log("Welcome to PIAIC Student Management System");
        console.log("");
        console.table([
            {
                "First_Name": studentData?.first_name,
                "Last_Name": studentData?.last_name,
                "Student Id": studentData?.studentId,
                "Balance": studentData?.balance
            }
        ]);
        console.log("");
    }
};
const handleLoggedOutUser = async () => {
    welcomeMsg();
    const answers = await inquirer.prompt([
        {
            name: "LogIn",
            type: "list",
            choices: ["Log In", "Sign Up", "Quit"],
            message: "Log in or create a new account"
        }
    ]);
    switch (answers.LogIn) {
        case "Log In":
            await handleLogin();
            break;
        case "Sign Up":
            await handleSingUp();
            break;
        case "Quit":
            handleQuit();
            break;
    }
};
const handleSingUp = async () => {
    const answer = await inquirer.prompt([
        {
            name: "first_name",
            message: "enter you first_name:",
            type: "input"
        },
        {
            name: "last_name",
            message: "enter you last_name:",
            type: "input"
        },
        {
            name: "CNIC",
            message: "enter your CNIC:",
            type: "number"
        },
        {
            name: "secion",
            message: "Choose a section:",
            type: "list",
            choices: ["Morning", "Evening"]
        }
    ]);
    const newStudent = PIAIC_SMS.enrollStudentinUMS(answer.first_name, answer.last_name, answer.CNIC, answer.secion);
    console.clear();
    console.log("");
    console.log("Student Id: ", newStudent.id);
    console.log("Password: ", newStudent.password + "\n");
    console.log(`Your account has been created successfully in our Student Management System`);
    console.log("");
};
const handleLogin = async () => {
    const answer = await inquirer.prompt([
        {
            name: "id",
            message: "enter your student_id:",
            type: "number"
        },
        {
            name: "password",
            message: "enter your password:",
            type: "password",
            masked: true
        }
    ]);
    const result = PIAIC_SMS.logIn(answer.id, answer.password);
    if (result.status) {
        let student = PIAIC_SMS.getStudentById(answer.id);
        studentData = student;
        console.log("");
        console.log(`You were successful in signing in.`);
        console.log("You can register for the course, change your profile,");
        console.log("and view all the instructors who specialize in various fields.");
        console.log("");
    }
    else {
        console.log("");
        console.log(result.msg);
        console.log("");
    }
};
const handleQuit = () => {
    quit = true;
    console.log("Bye. See you later");
};
await handleLoggedOutUser();
/**************************** Student Profile *******************************************/
const handleLoggedInUser = async () => {
    const options = await inquirer.prompt([
        {
            name: "Options",
            type: "list",
            choices: ["My Profile", "Edit Profile", "Update Password", "Enroll In a Course", "All Courses", "All Instructors", "Log Out"]
        }
    ]);
    switch (options.Options) {
        case "My Profile":
            studentCompleteProfile();
            break;
        case "Edit Profile":
            await editProfile();
            break;
        case "Update Password":
            await updatePassword();
            break;
        case "Enroll In a Course":
            await enrollInACourse();
            break;
        case "All Courses":
            availableCoursesList();
            break;
        case "All Instructors":
            availableInstructorsList();
            break;
        case "Log Out":
            handleLogOut();
            break;
    }
};
const studentCompleteProfile = () => {
    if (studentData) {
        loggedInWelcomMsg();
        console.table([studentData]);
        console.log("");
    }
};
const editProfile = async () => {
    loggedInWelcomMsg();
    const answer = await inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Your first_name:",
            default: studentData?.first_name
        },
        {
            name: "last_name",
            type: "input",
            message: "Your last_name:",
            default: studentData?.last_name
        },
        {
            name: "age",
            type: "number",
            message: "Your age:",
            default: studentData?.age
        },
        {
            name: "address",
            type: "input",
            message: "Your address:",
            default: studentData?.address
        },
        {
            name: "cnic",
            type: "number",
            message: "Your CNIC:",
            default: studentData?.cnic
        },
    ]);
    const { first_name, last_name, age, address, cnic } = answer;
    if (studentData) {
        PIAIC_SMS.setProfile(studentData.studentId, first_name, last_name, age, address, cnic);
    }
    await updatingComponent("Updating Profile");
    loggedInWelcomMsg();
};
const updatePassword = async () => {
    if (!studentData)
        return;
    loggedInWelcomMsg();
    const answer = await inquirer.prompt([
        {
            name: "oldPassword",
            type: "input",
            message: "Enter Your old password",
        },
        {
            name: "newPassword",
            type: "input",
            message: "Enter Your new password",
        },
        {
            name: "confimredNewPassword",
            type: "input",
            message: "Enter Your confirmed new password",
        },
    ]);
    console.log("answer: ", answer);
    console.log("studentData.password: ", studentData.password);
    if (answer.oldPassword !== studentData.password) {
        console.log("Password not matched with old password");
    }
    else if (answer.newPassword !== answer.confimredNewPassword) {
        console.log("Confirmed password not matched with new password");
    }
    else {
        PIAIC_SMS.setPassword(studentData.studentId, answer.newPassword, studentData.password);
        await updatingComponent(`Updating Password`);
        loggedInWelcomMsg();
    }
};
/*********************************** enroll in the course section **************************/
// add all dummy data
PIAIC_SMS.AddCoursesinUMS(coursesList);
const enrollInACourse = async () => {
    if (studentData) {
        loggedInWelcomMsg();
        console.log("Already Enrolled In Courses:");
        if (studentData.courses_enrolled.length === 0) {
            console.log("None");
            console.log("");
        }
        else {
            const coursesNames = studentData.courses_enrolled.map((course) => {
                return PIAIC_SMS.getCourseById(course)?.course_name;
            });
            console.table(coursesNames);
            console.log("");
        }
        console.log("(See detail in courses section) Available Courses:");
        let allCourses = PIAIC_SMS.getAllCourseInUMS();
        let allAvailabeCourses = [];
        allCourses.map((course) => {
            if (studentData && !studentData.courses_enrolled.includes(course.course_code)) {
                allAvailabeCourses.push(course);
            }
        });
        const listOfCourseNames = allAvailabeCourses.map((course) => course.course_name);
        const answer = await inquirer.prompt([{
                name: "course",
                type: "checkbox",
                choices: listOfCourseNames,
                message: "Select A Course:"
            }]);
        let totalfee = 0;
        let allSelectedCorseCodes = [];
        allAvailabeCourses.map((course) => {
            if (answer.course.includes(course.course_name)) {
                totalfee = totalfee + Number(course.tuition_fee);
                allSelectedCorseCodes.push(course.course_code);
            }
        });
        console.log("Total Fee for selected courses: ", totalfee);
        console.log("");
        if (totalfee > studentData.balance) {
            console.log("You don't have enough Balance for this transaction");
        }
        else {
            const answer = await inquirer.prompt([{
                    name: "course",
                    type: "confirm",
                    message: `Your balance is ${studentData.balance} and this will cost you ${totalfee}`
                }]);
            if (answer.course) {
                PIAIC_SMS.enrollInCourses(studentData.studentId, allSelectedCorseCodes);
                await updatingComponent(`Enrolling in following courses: ${allSelectedCorseCodes}`);
                loggedInWelcomMsg();
            }
        }
    }
};
const availableCoursesList = () => {
    if (studentData) {
        loggedInWelcomMsg();
        const allCourses = PIAIC_SMS.getAllCourseInUMS();
        console.table(allCourses);
        console.log("");
    }
};
/************************* Instructor Section ******************************************/
// add all dummy data
PIAIC_SMS.AddInstructorsInUMS(instructorsList);
const availableInstructorsList = () => {
    if (studentData) {
        loggedInWelcomMsg();
        const allInstructors = PIAIC_SMS.getAllInstructorsInUMS();
        const formatedData = [];
        allInstructors.forEach((instructor) => {
            const coursesName = instructor.course_codes.map((code) => PIAIC_SMS.getCourseById(code)?.course_name).join(", ");
            formatedData.push({
                "Name": instructor.name,
                "Courses Teaching": coursesName
            });
        });
        console.table(formatedData);
        console.log("");
    }
};
const handleLogOut = () => {
    console.clear();
    studentData = undefined;
};
do {
    if (!studentData || !studentData.loginStatus) {
        await handleLoggedOutUser();
    }
    else {
        await handleLoggedInUser();
    }
} while (!quit);
