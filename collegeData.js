/*********************************************************************************
* WEB700 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Alexa Agabon Student ID: 151904232 Date: July 6, 2024
*
********************************************************************************/


// Import the file system module
const fs = require('fs'); // Imports the 'fs' module for file system operations

// Define a class to hold the students and the courses data
class Data { // Defining a class called 'Data' to hold the students and the courses data
    constructor(students, courses) { // Constructor function to initialize students and courses
        this.students = students; // Assigning the 'students' parameter to the 'students' property of the class instance
        this.courses = courses; // Assigning the 'courses' parameter to the 'courses' property of the class instance
    }
}

// Initialize dataCollection variable to hold the students and the courses data
let dataCollection = {
    students: [], // This array will hold all student objects
    courses: [] // Other data collections as needed
}; 

// Function to initialize the data by reading files
function initialize() { // Defining a function named 'initialize' to read data from files
    return new Promise((resolve, reject) => { // Returning a Promise for asynchronous operations
        // Read students.json file
        fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => { // Reading 'students.json' file asynchronously
            if (err) { // Handling any errors that occur during file read
                reject("Unable to read courses.json"); // Rejecting the Promise with an error message
                return; // Exiting the function
            }

            fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                if (err) {
                    reject("Unable to read courses.json");
                    return;
                }

                // Parse student and course data from files
                const students = JSON.parse(studentDataFromFile); // Parsing JSON data from 'students.json' file
                const courses = JSON.parse(courseDataFromFile); // Parsing JSON data from 'courses.json' file

                // Create a Data object with parsed data
                dataCollection = new Data(students, courses); // Creating a new 'Data' instance with parsed data
                resolve(); // Resolving the Promise indicating successful initialization
            });
        });
    });
}

// Function to get all students
function getAllStudents() { // Defining a function named 'getAllStudents' to get all students data
    return new Promise((resolve, reject) => { // Returning a Promise for asynchronous operations
        // Checking if dataCollection is empty or invalid
        if (!dataCollection || !dataCollection.students || dataCollection.students.length === 0) { // Checking if dataCollection is empty or invalid
            reject("No students found"); // Rejecting the Promise with an error message
            return; // Exiting the function
        }

        // Resolve with students data
        resolve(dataCollection.students); // Resolving the Promise with students data
    });
}

// Function to get all courses
function getCourses() { // Defining a function named 'getCourses' to get all courses data
    return new Promise((resolve, reject) => { // Returning a Promise for asynchronous operations
        // Check if dataCollection is empty or invalid
        if (!dataCollection || !dataCollection.courses || dataCollection.courses.length === 0) { // Checking if dataCollection is empty or invalid
            reject("No courses found"); // Rejecting the Promise with an error message
            return; // Exiting the function
        }
        // Resolve with courses data
        resolve(dataCollection.courses); // Resolving the Promise with courses data
    });
}

// Function to get all TAs
function getTAs() { // Defining a function named 'getTAs' to get all Teaching Assistants (TAs) data
    return new Promise((resolve, reject) => { // Returning a Promise for asynchronous operations
        // Check if dataCollection is empty or invalid
        if (!dataCollection || !dataCollection.students || dataCollection.students.length === 0) { // Checking if dataCollection is empty or invalid
            reject("No students found"); // Rejecting the Promise with an error message
            return; // Exiting the function
        }
        // Filter students to get only TAs
        const tas = dataCollection.students.filter(student => student.TA); // Filtering students to get only those who are Teaching Assistants (TAs)
        // Resolve with TAs data
        resolve(tas); // Resolving the Promise with TAs data
    });
}

// Function to get students by course
function getStudentsByCourse(course) { // Defining a function named 'getStudentsByCourse' to get students by their course
    return new Promise((resolve, reject) => {
        // Check if dataCollection or students array is empty or invalid
        if (!dataCollection || !dataCollection.students || dataCollection.students.length === 0) {
            reject("No students found"); // Reject the Promise with an error message
            return; // Exit the function
        }

        // Filter students by course
        const studentsByCourse = dataCollection.students.filter(student => student.course === course);

        if (studentsByCourse.length === 0) {
            reject("No students found for the specified course"); // Reject if no students found for the course
        } else {
            resolve(studentsByCourse); // Resolve with students matching the course
        }
    });
}

// Function to get student by studentNum
function getStudentByNum(num) { // Defining a function named 'getStudentByNum' to get students by studentNum
    return new Promise((resolve, reject) => {
        // Check if dataCollection or students array is empty or invalid
        if (!dataCollection || !dataCollection.students || dataCollection.students.length === 0) {
            reject("No students found"); // Reject the Promise with an error message
            return; // Exit the function
        }

        // Find student by studentNum
        const student = dataCollection.students.find(student => student.studentNum === num);

        if (!student) {
            reject("No student found for the specified student number"); // Reject if no student found
        } else {
            resolve(student); // Resolve with the student object
        }
    });
}


// Function to add a new student
function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Normalize TA field
        if (studentData.TA === undefined) {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }

        // Assign student number
        studentData.studentNum = dataCollection.students.length + 261;

        // Push studentData to students array
        dataCollection.students.push(studentData);

        // Resolve the promise
        resolve();
    });
}


// Export functions to be used by other modules
module.exports = { // Exporting functions to be used by other modules
    initialize, // Exporting 'initialize' function
    getAllStudents, // Exporting 'getAllStudents' function
    getCourses, // Exporting 'getCourses' function
    getTAs, // Exporting 'getTAs' function
    getStudentsByCourse, // Exporting 'getStudentsByCourse' function
    getStudentByNum, // Exporting 'getStudentByNum' function
    addStudent
};
