// db.js
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const cors = require('cors'); // Priekš portiem
const path = require('path'); // module provides utilities for working with file and directory paths.
const multer = require('multer'); // For handling file uploads
const moment = require('moment'); // For date and time
const fs = require('fs'); // For reading and writing files
const bcrypt = require('bcrypt');
const colors = require('colors'); // Colors


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


// Initialize session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Note: Set secure to true if using HTTPS
}));


// Add middleware to handle OPTIONS requests for CORS
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(200).send();
});


con.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


//
// Server Storage 
//


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
const uploadedImgPath = multer({ storage: quizImgStorage }); // Pasaku, kur ir jātiek saglabātām bildēm


// Set up multer storage for user profile images
const userProfileImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/users_profile_pictures/'); // Destination directory for user profile pictures
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname.split('.')[0]; // Extracting original filename without extension png/jpg/jpeg
        const timestamp = req.body.timestamp; // Use timestamp provided by the client
        const extension = path.extname(file.originalname); // stores File extension png/jpg/jpeg
        const newFilename = `${req.body.username}-${originalName}-${timestamp}${extension}`; // Constructing new filename
        req.newFilename = newFilename; // Save new filename to req object for later use
        cb(null, newFilename); // Callback with the new filename
    }
});

const uploadUserProfileImg = multer({ storage: userProfileImageStorage }).single('profile_image');



//
// Authentication methods
//


// User registration endpoint
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const saltRounds = 10; // Define saltRounds here

    // Log the request body
    console.log('Received username:', username);
    console.log('Received email:', email);
    console.log('Received password:', password);

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal server error');
        }

        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        con.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('User registered successfully');
        });
    });
});


// Login user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    con.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Log the user login with the current date and time
            const loginTime = new Date().toLocaleString();
            console.log(`User "${email}" just logged in at ${loginTime}`.green.italic);

            // Remove quotes from profile_image_url if present
            let profileImageUrl = user.profile_image_url;
            if (profileImageUrl.startsWith("'") && profileImageUrl.endsWith("'")) {
                profileImageUrl = profileImageUrl.slice(1, -1);
            }

            // Return user data along with success message
            const userProfile = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                profile_image_url: profileImageUrl
            };
            // Create session and store user data
            req.session.user = userProfile; // Store user profile in session | localStorage
            res.status(200).json({ message: 'Login successful', userProfile });
        });
    });
});


// Logout user
app.post('/api/logout', (req, res) => {
    const { email } = req.body; // Get email from request body
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Logout successful' });
            const logOutTime = new Date().toLocaleString();
            console.log(`User "${email}" just logged out at ${logOutTime}`.red.dim);
        }
    });
});


//
// Profile
//


const DEFAULT_PROFILE_IMAGE = "../server/users_profile_pictures/default_user_img.png";

// Function to delete old profile image
function deleteOldProfileImage(oldProfileImageUrl) {
    if (oldProfileImageUrl && oldProfileImageUrl !== DEFAULT_PROFILE_IMAGE) {
        // Construct the absolute path to the old profile image
        const oldImagePath = path.resolve(__dirname, '..', oldProfileImageUrl.replace('../', ''));

        console.log("Checking for old image at:", oldImagePath.yellow);

        if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Error deleting old profile image:', err);
                } else {
                    console.log('Old profile image deleted successfully: ', oldProfileImageUrl.red);
                }
            });
        } else {
            console.log('Old profile image does not exist:', oldImagePath);
        }
    } else {
        if (!oldProfileImageUrl) {
            console.log('No old profile image URL provided.');
        } else {
            console.log('Old profile image is the default image, no need to delete.');
        }
    }
}

// API endpoint to update user profile
app.post('/api/update-user-profile', (req, res) => {
    uploadUserProfileImg(req, res, (err) => {
        if (err) {
            return res.status(500).send('Error uploading profile image');
        }

        const { user_id, username, oldProfileImageUrl } = req.body;
        let profileImageUrl = oldProfileImageUrl; // Default to the old profile image URL

        // Check if a new profile image was uploaded
        if (req.file) {
            profileImageUrl = `../server/users_profile_pictures/${req.newFilename}`; // Construct full path using new filename
            // Delete the old profile image if it exists and is not the default image
            deleteOldProfileImage(oldProfileImageUrl);
        }

        // Update user profile in the database
        const updateUserProfileQuery = `
            UPDATE users 
            SET username = ?, profile_image_url = ? 
            WHERE user_id = ?
        `;

        con.query(updateUserProfileQuery, [username, profileImageUrl, user_id], function(err, result) {
            if (err) {
                console.error('Error updating user profile:', err);
                return res.status(500).send('Error updating user profile');
            } else {
                console.log('User profile updated successfully');
                console.log(username, profileImageUrl, user_id);
                return res.status(200).json({ message: 'User profile updated successfully', profileImageUrl });
            }
        });
    });
});


//
// Session protect routes
//


app.get('/api/protected-route', (req, res) => {
    if (req.session.user) {
        // User is authenticated, allow access
        res.status(200).json({ message: 'Access granted' });
    } else {
        // User is not authenticated, deny access
        res.status(401).json({ error: 'Unauthorized' });
    }
});


// Middleware to protect routes
const protectRoute = (req, res, next) => {
    if (req.session.user) {
        // User is authenticated, allow access
        next();
    } else {
        // User is not authenticated, return unauthorized error
        res.status(401).json({ error: 'Unauthorized' });
    }
};


// Example protected route
app.get('/api/protected-route', protectRoute, (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});


//
// Create and edit quizzes
//


// Define route for handling POST requests to /api/quizzes
app.post('/api/quizzes', uploadedImgPath.single('image'), (req, res) => {
    let { quiz_id, imgUrl, title, description, user_id } = req.body;
    console.log(req.body); // Ensure quiz_id is present in the body

    if (req.file) {
        imgUrl = req.file.path; 
    }
    console.log("imgUrl: " + imgUrl);
    console.log("quiz_id: " + quiz_id);
    
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

    if (quiz_id !== undefined && imgUrl !== undefined) {
        const lastUpdate_at = moment().format('YYYY-MM-DD HH:mm:ss');
        const updateQuizQuery = "UPDATE quizzes SET imgUrl = ?, title = ?, description = ?, lastUpdate_at = ? WHERE quiz_id = ?";
        con.query(updateQuizQuery, [imgUrl, title, description, lastUpdate_at, quiz_id], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Error updating quiz');
            } else {
                console.log("Quiz updated successfully with image change");
                res.status(200).send('Quiz updated successfully with image change'.bgYellow);
            }
        });
    } else if (quiz_id !== undefined && imgUrl === undefined) {
        const lastUpdate_at = moment().format('YYYY-MM-DD HH:mm:ss');
        const updateQuizQuery = "UPDATE quizzes SET title = ?, description = ?, lastUpdate_at = ? WHERE quiz_id = ?";
        con.query(updateQuizQuery, [title, description, lastUpdate_at, quiz_id], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Error updating quiz');
            } else {
                console.log("Quiz updated successfully without image change");
                res.status(200).send('Quiz updated successfully without image change'.bgYellow);
            }
        });
    } else {
        const addNewQuizQuery = "INSERT INTO quizzes (imgUrl, title, description, creator_id, created_at) VALUES (?, ?, ?, ?, ?)";
        con.query(addNewQuizQuery, [imgUrl, title, description, user_id, createdAt], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Error adding quiz');
            } else {
                console.log("New quiz added to the database".bgYellow);
                res.status(200).send('Quiz added successfully');
            }
        });
    }
});




// Load quizzes data from DB
app.get('/api/quizzes', (req, res) => {
    const userId = req.query.user_id;
    let query = "SELECT quiz_id, imgUrl, title, description, creator_id, created_at, lastUpdate_at, play_count, likes, rating FROM quizzes";
    
    // Load quizzes created by a specific user
    // If user_id is provided, add a WHERE clause to filter quizzes by creator_id
    if (userId) {
        query += " WHERE creator_id = ?";
    }

    con.query(query, [userId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data from quizzes');
        } else {
            res.json(result);
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


// Load the 10 newest quizzes
app.get('/api/newest-quizzes', (req, res) => {
    const query = "SELECT quiz_id, imgUrl, title, description, created_at FROM quizzes ORDER BY created_at DESC LIMIT 10";
    
    con.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching newest quizzes');
        } else {
            res.json(result);
        }
    });
});

//
// Admin requests
//

// users
app.get('/api/users', (req, res) => {
    const { user_id } = req.query; // Extract user_id from query params

    // Construct SQL query to fetch users excluding the current user
    let sql = 'SELECT * FROM users';
    if (user_id) {
        sql += ` WHERE user_id != ${mysql.escape(user_id)}`;
    }

    con.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

//
// Friend requesting
//


// Route to handle sending a friend request
app.post('/api/friend_requests', (req, res) => {
    const { sender_id, receiver_id } = req.body;

    // Validate input (e.g., check if sender_id and receiver_id are valid)

    const newFriendRequest = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: 'pending', // Initial status
        sent_at: new Date() // Timestamp of when the request was sent
    };

    con.query('INSERT INTO friend_requests SET ?', newFriendRequest, (error, results) => {
        if (error) {
            console.error('Error creating friend request:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('Friend request created successfully');

        // Create a notification for the receiver
        createFriendRequestNotification(receiver_id, sender_id);

        // Respond with the newly created friend request object
        res.status(201).json(newFriendRequest);
    });
});


// Function to create notification for friend request
function createFriendRequestNotification(receiver_id, sender_id) {
    // First, fetch the request_id from friend_requests table
    const query = `
        SELECT request_id
        FROM friend_requests
        WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
    `;

    con.query(query, [sender_id, receiver_id], (error, results) => {
        if (error) {
            console.error('Error fetching friend request details:', error);
            return;
        }

        if (results.length > 0) {
            const request_id = results[0].request_id;

            const newNotification = {
                user_id: receiver_id,
                type: 'friend_request',
                request_id: request_id,
                created_at: new Date() // Assuming your database handles timestamp
            };

            con.query('INSERT INTO notifications SET ?', newNotification, (error, results) => {
                if (error) {
                    console.error('Error creating notification:', error);
                } else {
                    console.log('Notification created successfully');
                }
            });
        }
    });
}


// Notifications Endpoint
app.get('/api/notifications', (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id parameter' });
    }

    const query = `
        SELECT n.notification_id, n.user_id, n.type, n.request_id, n.is_read, n.created_at,
               fr.sender_id, u.username, u.profile_image_url
        FROM notifications n
        JOIN friend_requests fr ON n.request_id = fr.request_id
        JOIN users u ON fr.sender_id = u.user_id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
    `; // retrieves created_at, is_read, notification_id, profile_image_url, request_id, sender_id, type, user_id, username


    con.query(query, [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(results);
    });
});


// API endpoint to get the count of notifications for a user
app.get('/api/notifications/count', (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id parameter' });
    }

    // Query to count notifications for the user
    const query = `
        SELECT COUNT(*) AS notificationCount
        FROM notifications
        WHERE user_id = ?
    `;

    con.query(query, [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching notification count:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const notificationCount = results[0].notificationCount;
        res.json({ notificationCount });
    });
});


// Endpoint to check for existing notifications
app.get('/api/notifications/check', (req, res) => {
    const { user_id, sender_id, type } = req.query;

    // Validate inputs
    if (!user_id || !sender_id || !type) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Query to check if a notification exists in the database
    const query = `
        SELECT *
        FROM notifications
        WHERE user_id = ? AND sender_id = ? AND type = ?
    `;

    con.query(query, [user_id, sender_id, type], (error, results) => {
        if (error) {
            console.error('Error checking existing notification:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            res.status(200).json({ exists: true, notification: results[0] });
        } else {
            res.status(404).json({ exists: false });
        }
    });
});



// Start the server
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});