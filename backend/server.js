require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./models/User");
const Blog = require("./models/Blog");

const app = express();
const PORT = 5000;


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

// Serve BlogSpace frontend
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


        res.status(200).json({

            message: "Login successful",

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

app.get("/api/blogs", async (req, res) => {

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

});


// =========================
// GET SINGLE BLOG API
// READ
// =========================

app.get("/api/blogs/:id", async (req, res) => {

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

});


// =========================
// CREATE BLOG API
// CREATE
// =========================

app.post("/api/blogs", async (req, res) => {

    try {

        const {
            title,
            category,
            author,
            content
        } = req.body;


        if (!title || !author || !content) {

            return res.status(400).json({

                message:
                    "Please fill in all required fields"

            });

        }


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

});


// =========================
// UPDATE BLOG API
// UPDATE
// =========================

app.put("/api/blogs/:id", async (req, res) => {

    try {

        const {
            title,
            category,
            author,
            content
        } = req.body;


        if (!title || !author || !content) {

            return res.status(400).json({

                message:
                    "Please fill in all required fields"

            });

        }


        const updatedBlog =
            await Blog.findByIdAndUpdate(

                req.params.id,

                {
                    title,

                    category:
                        category || "General",

                    author,

                    content
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedBlog) {

            return res.status(404).json({

                message:
                    "Blog not found"

            });

        }


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

});


// =========================
// DELETE BLOG API
// DELETE
// =========================

app.delete("/api/blogs/:id", async (req, res) => {

    try {

        const deletedBlog =
            await Blog.findByIdAndDelete(
                req.params.id
            );


        if (!deletedBlog) {

            return res.status(404).json({

                message:
                    "Blog not found"

            });

        }


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

});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log(
        `BlogSpace backend running at http://localhost:${PORT}`
    );

});