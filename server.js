/*********************************************************************************
* WEB700 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Alexa Agabon Student ID: 151904232 Date: July 6, 2024
*
*  Online (vercel) Link: ________________________________________________________
*
********************************************************************************/


const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const { initialize, getStudentByNum, getCourses, getTAs, getAllStudents, getStudentsByCourse } = require('./collegeData');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve addStudent.html
app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

// Add the express.urlencoded middleware
app.use(express.urlencoded({ extended: true }));

// Route to handle adding a new student
app.post('/students/add', async (req, res) => {
    try {
        await addStudent(req.body); // Assuming addStudent handles adding a student to data
        res.redirect('/students'); // Redirect to list of students after adding
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Error adding student');
    }
});



// Route to serve home.html
app.get('/', (req, res) => {
    const homePath = path.join(__dirname, 'views', 'home.html');
    fs.readFile(homePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(data);
    });
});


// Route to serve about.html
app.get('/about', (req, res) => {
    const aboutPath = path.join(__dirname, 'views', 'about.html');
    fs.readFile(aboutPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(data);
    });
});


// Route to serve htmlDemo.html
app.get('/htmlDemo', (req, res) => {
    const htmlDemoPath = path.join(__dirname, 'views', 'htmlDemo.html');
    fs.readFile(htmlDemoPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(data);
    });
});


// Route to get all students by student:num
app.get('/student/:num', async (req, res) => {
    try {
        const studentNum = parseInt(req.params.num);
        const student = await getStudentByNum(studentNum);

        if (!student) {
            res.status(404).json({ message: "no results" });
        } else {
            res.json(student);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to get all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await getCourses();
        if (courses.length === 0) {
            res.status(404).json({ message: "no results" });
        } else {
            res.json(courses);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to get all TAs
app.get('/tas', async (req, res) => {
    try {
        const tas = await getTAs();
        if (tas.length === 0) {
            res.status(404).json({ message: "no results" });
        } else {
            res.json(tas);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to get all students or students by course
app.get('/students', async (req, res) => {
    try {
        let students;
        if (req.query.course) {
            const course = parseInt(req.query.course);
            if (isNaN(course) || course < 1 || course > 7) {
                return res.status(400).json({ message: "Invalid course number. Must be between 1 and 7." });
            }
            students = await getStudentsByCourse(course);
        } else {
            students = await getAllStudents();
        }

        if (students.length === 0) {
            res.status(404).json({ message: "no results" });
        } else {
            res.json(students);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


// Initialize collegeData and start server
// Also uses catch function for errors
initialize().then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to initialize data:", err);
});