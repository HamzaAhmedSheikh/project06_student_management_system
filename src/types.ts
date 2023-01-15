export type CourseInput = {
    course_code: string,
    course_name: string,
    description: string,
    instructor: string,
    tuition_fee: number
}

export type InstructorInput = {
    course_codes: string[],
    instructor_name: string,
}

export const coursesList = [
    {
        course_code: "01WMD",
        course_name: "Meraverse Development",
        description: "Meraverse Development",
        instructor: "Zia Khan",
        tuition_fee: 3000
    },
    {
        course_code: "02BC",
        course_name: "Blockchain",
        description: "Blockchian",
        instructor: "Zeeshan Hanif",
        tuition_fee: 5000
    },
    {
        course_code: "03CC",
        course_name: "Cloud Computing",
        description: "Cloud Computing",
        instructor: "Daniyal Nagori",
        tuition_fee: 4000
    },
    {
        course_code: "04AI",
        course_name: "Artificial Intelligence",
        description: "Artificial Intelligence",
        instructor: "Zia Khan",
        tuition_fee: 2500
    },
    {
        course_code: "05IOT",
        course_name: "Internet of things",
        description: "Internet of things",
        instructor: "Zia Khan",
        tuition_fee: 2800
    },
    {
        course_code: "CNC",
        course_name: "Cloud Native Computing",
        description: "Cloud Native Computing",
        instructor: "Adil Altaf",
        tuition_fee: 6000
    }
];

export const instructorsList = [
    {
        instructor_name: "Zia Khan",
        course_codes: ["01WMD", "04AI", "05IOT"]
    },
    {
        instructor_name: "Daniyal Nagori",
        course_codes: ["03CC"]
    },
    {
        instructor_name: "Zeeshan Hanif",
        course_codes: ["02BC"]
    },
    {
        instructor_name: "Adil Altaf",
        course_codes: ["CNC"]        
    }
];