require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// MONGODB CONNECTION
// =========================

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

// =========================
// JWT AUTHENTICATION MIDDLEWARE
// =========================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token =
        authHeader && authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            message: "Access denied. Please login."
        });

    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error, user) => {

            if (error) {

                return res.status(403).json({
                    message: "Invalid or expired token."
                });

            }

            req.user = user;

            next();

        }
    );
}

// =========================
// SERVE FRONTEND
// =========================

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

// =========================
// BACKEND TEST
// =========================

app.get("/api", (req, res) => {

    res.json({
        message: "BlogSpace Backend API is running!"
    });

});

// =========================
// REGISTER API
// =========================

app.post("/api/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill all fields"
            });

        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const newUser =
            await User.create({
                name,
                email,
                password
            });

        res.status(201).json({

            message: "Registration successful",

            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Registration failed"
        });

    }

});

// =========================
// LOGIN API
// =========================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Please enter email and password"
            });

        }

        const user =
            await User.findOne({
                email,
                password
            });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        // Generate JWT token

        const token = jwt.sign(

            {
                id: user._id,
                name: user.name,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "2h"
            }

        );

        res.status(200).json({

            message: "Login successful",

            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Login failed"
        });

    }

});

// =========================
// GET ALL BLOGS API
// READ
// =========================

app.get(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            const blogs =
                await Blog.find()
                    .sort({ date: -1 });

            res.status(200).json(blogs);

        } catch (error) {

            console.error(
                "GET BLOGS ERROR:",
                error
            );

            res.status(500).json({

                message: "Error fetching blogs",

                error: error.message

            });

        }

    }
);

// =========================
// GET SINGLE BLOG API
// READ
// =========================

app.get(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const blog =
                await Blog.findById(
                    req.params.id
                );

            if (!blog) {

                return res.status(404).json({
                    message: "Blog not found"
                });

            }

            res.status(200).json(blog);

        } catch (error) {

            console.error(
                "GET SINGLE BLOG ERROR:",
                error
            );

            res.status(500).json({

                message: "Error fetching blog",

                error: error.message

            });

        }

    }
);

// =========================
// CREATE BLOG API
// CREATE
// =========================

app.post(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                category,
                content
            } = req.body;

            if (!title || !content) {

                return res.status(400).json({

                    message:
                        "Title and content are required"

                });

            }

            // Use logged-in user's name
            // instead of trusting the frontend author field

            const author = req.user.name;

            const newBlog =
                await Blog.create({

                    title,

                    category:
                        category || "General",

                    author,

                    content

                });

            res.status(201).json({

                message:
                    "Blog published successfully",

                blog: newBlog

            });

        } catch (error) {

            console.error(
                "Blog creation error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to publish blog",

                error: error.message

            });

        }

    }
);

// =========================
// UPDATE BLOG API
// UPDATE
// =========================

app.put(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                category,
                content
            } = req.body;

            if (!title || !content) {

                return res.status(400).json({

                    message:
                        "Title and content are required"

                });

            }

            // Find blog first

            const existingBlog =
                await Blog.findById(
                    req.params.id
                );

            if (!existingBlog) {

                return res.status(404).json({

                    message:
                        "Blog not found"

                });

            }

            // Only the owner can edit

            if (
                existingBlog.author !==
                req.user.name
            ) {

                return res.status(403).json({

                    message:
                        "You can only edit your own blogs"

                });

            }

            const updatedBlog =
                await Blog.findByIdAndUpdate(

                    req.params.id,

                    {
                        title,

                        category:
                            category || "General",

                        content
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );

            res.status(200).json({

                message:
                    "Blog updated successfully",

                blog: updatedBlog

            });

        } catch (error) {

            console.error(
                "UPDATE BLOG ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Error updating blog",

                error: error.message

            });

        }

    }
);

// =========================
// DELETE BLOG API
// DELETE
// =========================

app.delete(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            // Find blog first

            const existingBlog =
                await Blog.findById(
                    req.params.id
                );

            if (!existingBlog) {

                return res.status(404).json({

                    message:
                        "Blog not found"

                });

            }

            // Only the owner can delete

            if (
                existingBlog.author !==
                req.user.name
            ) {

                return res.status(403).json({

                    message:
                        "You can only delete your own blogs"

                });

            }

            await Blog.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({

                message:
                    "Blog deleted successfully"

            });

        } catch (error) {

            console.error(
                "DELETE BLOG ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Error deleting blog",

                error: error.message

            });

        }

    }
);

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log(
        `BlogSpace backend running at http://localhost:${PORT}`
    );

});