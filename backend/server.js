const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());

// Serve BlogSpace frontend
app.use(express.static(path.join(__dirname, "..")));

const users = [];

// Backend test
app.get("/api", (req, res) => {
    res.json({
        message: "BlogSpace Backend API is running!"
    });
});

// Registration API
app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password
    };

    users.push(newUser);

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});


// =========================
// LOGIN API
// =========================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter email and password"
        });
    }

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
    console.log(
        `BlogSpace backend running at http://localhost:${PORT}`
    );
});