// db.js
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session'); 
const cors = require('cors'); //Priekš portiem
const path = require('path'); //module provides utilities for working with file and directory paths.
const multer = require('multer'); // For handling file uploads
const moment = require('moment'); // For date and time
const fs = require('fs'); // For reading and writing files


/*
Local
// Db connection
const con = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'admin',
    database: 'quizies_db'
})
*/

// Db connection
const con = mysql.createConnection({
    host    : 'quiziesdb-mihailsfut-e984.d.aivencloud.com',
    user    : 'avnadmin',
    port    : '21836',
    password: 'AVNS_fH_1hLx8kDRLVeSv_7_',
    database: 'quizies_db'
})


// Initialize Express app dsd
const app = express();
app.use(cors()); //Lai strādātu citi porti
app.use(express.json());


// Add middleware to handle OPTIONS requests for CORS
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(200).send();
});


// Set up multer storage for file uploads
const quizImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/quizzes_uploaded_images/');
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname.split('.')[0]; // Extracting original filename without extension png/jpg/jpeg
        const timestamp = Date.now(); // Current timestamp
        const extension = path.extname(file.originalname); // stores File extension png/jpg/jpeg
        const newFilename = `${originalName}-${timestamp}${extension}`; // Constructing new filename
        cb(null, newFilename); // Callback with the new filename
    }
});


//
// Create and edit quizzes
//
const uploadedImgPath = multer({ storage: quizImgStorage }); // Pasaku, kur ir jātiek saglabātām bildēm
// Define route for handling POST requests to /api/quizzes
app.post('/api/quizzes', uploadedImgPath.single('image'), (req, res) => {
//.single() function indicates that only one file will be uploaded. By default, Multer, the file uploading middleware for Express, expects the name attribute of the form field that contains the file to be image. So, uploadedImgPath.single() would expect a file input field with the name attribute set to image. If you have a different name for your file input field, you should pass that name as an argument to the single() function. For example, if your file input field has the name myImage, you would use uploadedImgPath.single('myImage').
    let { quiz_id, imgUrl, title, description } = req.body;
    console.log(req.body);
    // Check if a file is uploaded in the request, if so, update imgUrl
    if (req.file) {
        imgUrl = req.file.path;
    }
    console.log("imgUrl: " + imgUrl);
    console.log("quiz_id: " + quiz_id);
    console.log("");
    //const createdAt = new Date(); // Built in js function date()
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss'); // date from moment library


    if (quiz_id !== undefined  & imgUrl !== undefined) { // if post request came with quiz_id and with image change ----> UPDATE
        const lastUpdate_at = moment().format('YYYY-MM-DD HH:mm:ss');
        const updateQuizQuery = "UPDATE quizzes SET imgUrl = ?, title = ?, description = ?, lastUpdate_at = ? WHERE quiz_id = ?";
        con.query(updateQuizQuery, [imgUrl, title, description, lastUpdate_at, quiz_id], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Error updating quiz');
            }
            else {
                console.log("Quiz updated successfully with image change");
                res.status(200).send('Quiz updated successfully with image change');
            }
        });
    }
    else if (quiz_id !== undefined & imgUrl === undefined) { // if post request came with quiz_id and without image change ----> UPDATE
        const lastUpdate_at = moment().format('YYYY-MM-DD HH:mm:ss');
        const updateQuizQuery = "UPDATE quizzes SET title = ?, description = ?, lastUpdate_at = ? WHERE quiz_id = ?";
        con.query(updateQuizQuery, [title, description, lastUpdate_at, quiz_id], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Error updating quiz');
            }
            else {
                console.log("Quiz updated successfully without image change");
                res.status(200).send('Quiz updated successfully without image change');
            }
        });
    }
    else if (quiz_id === undefined) { // if post request came without quiz_id ----> INSERT
        const addNewQuizQuery = "INSERT INTO quizzes (imgUrl, title, description, created_at) VALUES (?, ?, ?, ?)";
        con.query(addNewQuizQuery, [imgUrl, title, description, createdAt], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Error adding quiz');
            }
            else {
                console.log("New quiz added to the database");
                res.status(200).send('Quiz added successfully');
            }
        });
    }
});



// Load quizzes data from DB
app.get('/api/quizzes', (req, res) => {
    const query = "SELECT quiz_id, imgUrl, title, description, created_at FROM quizzes";
    con.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data from quizzes');
        }
        else {
            res.json(result)
        }
    });
});


// Images API
app.delete('/api/quizzes_delete', (req, res) => {
    const { quiz_id, imagePath } = req.query;
    console.log("quiz_id: " + quiz_id);
    console.log("To delete image on server is needed imagePath: " + imagePath);

    if (quiz_id !== undefined) {
        const deleteQuizQuery = "DELETE FROM quizzes WHERE quiz_id = ?";
        con.query(deleteQuizQuery, [quiz_id], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting quiz');
            } else {
                console.log("Quiz deleted successfully");
                deleteImage(imagePath, res);
            }
        });
    } else {
        deleteImage(imagePath, res);
    }
});

function deleteImage(imagePath, res) {
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting image from server');
        } else {
            console.log('Image:'+ imagePath + ' successfully deleted from server');
            res.status(200).send('Image successfully deleted from server');
        }
    });
}


// Start the server
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port: '+ PORT);
});