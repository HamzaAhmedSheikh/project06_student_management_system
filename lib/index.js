#! /usr/bin/env node
import inquirer from "inquirer";
import PIAIC_SMS from "./SMS.js";
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
    console.log("Welcome to", PIAIC_SMS.name + "\n");
};
const loggedInWelcomMsg = () => {
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
    const res = PIAIC_SMS.logIn(answer.id, answer.password);
    if (res.status) {
        let student = PIAIC_SMS.getStudentById(answer.id);
        studentData = student;
    }
    else {
        console.log("");
        console.log(res.msg);
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
            // await enrollInACourse();
            break;
        case "All Courses":
            // availabelCoursesList();
            break;
        case "All Instructors":
            // availabelInstructorsList();
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
    const ans = await inquirer.prompt([
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
    console.log("answer: ", ans);
    console.log("studentData.password: ", studentData.password);
    if (ans.oldPassword !== studentData.password) {
        console.log("Password not matched with old password");
    }
    else if (ans.newPassword !== ans.confimredNewPassword) {
        console.log("Confirmed password not matched with new password");
    }
    else {
        PIAIC_SMS.setPassword(studentData.studentId, ans.newPassword, studentData.password);
        await updatingComponent(`Updating Password`);
        loggedInWelcomMsg();
    }
};
// console.clear();
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
