const API_URL = "https://blogspace-codomax-module4.onrender.com";
document.addEventListener("DOMContentLoaded", async function () {

    /* =========================
       PROFILE + LOGOUT
    ========================= */

    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const profileCard = document.getElementById("profileCard");
    const closeProfile = document.getElementById("closeProfile");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");


    /* =========================
       PROFILE BUTTON
    ========================= */

    if (profileBtn) {

        profileBtn.onclick = function (event) {

            event.preventDefault();

            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (!token || !savedUser) {

                alert("Please login first.");

                window.location.href = "login.html";

                return;
            }

            try {

                const user = JSON.parse(savedUser);

                if (profileName) {
                    profileName.textContent =
                        user.name || "Not available";
                }

                if (profileEmail) {
                    profileEmail.textContent =
                        user.email || "Not available";
                }

                if (profileCard) {
                    profileCard.style.display = "flex";
                }

            } catch (error) {

                console.error("Profile error:", error);

                alert("Unable to load profile.");

            }

        };

    }


    /* =========================
       CLOSE PROFILE
    ========================= */

    if (closeProfile) {

        closeProfile.onclick = function (event) {

            event.preventDefault();

            if (profileCard) {
                profileCard.style.display = "none";
            }

        };

    }


    /* =========================
       LOGOUT BUTTON
    ========================= */

    if (logoutBtn) {

        logoutBtn.onclick = function (event) {

            event.preventDefault();

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Logged out successfully.");

            window.location.href = "login.html";

        };

    }


    /* =========================
       REGISTER
    ========================= */

    const registerForm =
        document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const name =
                    document.getElementById("name")
                        .value.trim();

                const email =
                    document.getElementById("email")
                        .value.trim();

                const password =
                    document.getElementById("password")
                        .value;

                const confirmPassword =
                    document.getElementById("confirmPassword")
                        .value;

                if (password !== confirmPassword) {

                    alert("Passwords do not match.");

                    return;
                }

                try {

                    const response =
                        await
                            fetch(`${API_URL}/api/register`, {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    name,
                                    email,
                                    password
                                })

                            }
                        );

                    const data =
                        await response.json();

                    if (response.ok) {

                        alert(data.message);

                        window.location.href =
                            "login.html";

                    } else {

                        alert(
                            data.message ||
                            "Registration failed."
                        );

                    }

                } catch (error) {

                    console.error(
                        "Registration error:",
                        error
                    );

                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    /* =========================
       LOGIN
    ========================= */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const email =
                    document.getElementById("loginEmail")
                        .value.trim();

                const password =
                    document.getElementById("loginPassword")
                        .value;

                try {

                    const response =
                        await
                            fetch(`${API_URL}/api/login`, {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    email,
                                    password
                                })

                            }
                        );

                    const data =
                        await response.json();

                    if (response.ok) {

                        localStorage.setItem(
                            "token",
                            data.token
                        );

                        localStorage.setItem(
                            "user",
                            JSON.stringify(data.user)
                        );

                        alert(data.message);

                        window.location.href =
                            "dashboard.html";

                    } else {

                        alert(
                            data.message ||
                            "Login failed."
                        );

                    }

                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );

                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    /* =========================
       CREATE / PUBLISH BLOG
    ========================= */

    const blogForm =
        document.getElementById("blogForm");

    if (blogForm) {

        blogForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const title =
                    document.getElementById("blogTitle")
                        .value.trim();

                const category =
                    document.getElementById("category")
                        .value;

                const content =
                    document.getElementById("blogContent")
                        .value.trim();

                const token =
                    localStorage.getItem("token");

                const savedUser =
                    localStorage.getItem("user");

                if (!token) {

                    alert(
                        "Please login before creating a blog."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }

                if (!title || !content) {

                    alert(
                        "Please fill in all required fields."
                    );

                    return;
                }

                let user = null;

                try {

                    user =
                        JSON.parse(savedUser);

                } catch (error) {

                    console.error(
                        "User data error:",
                        error
                    );

                }

                if (!user || !user.name) {

                    alert(
                        "User information not found. Please login again."
                    );

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    window.location.href =
                        "login.html";

                    return;
                }

                try {

                    const response =
                        await 
                            fetch(`${API_URL}/api/blogs`, {
                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`

                                },

                                body: JSON.stringify({

                                    title,
                                    category,
                                    author: user.name,
                                    content

                                })

                            }
                        );

                    const data =
                        await response.json();

                    if (response.ok) {

                        alert(data.message);

                        window.location.href =
                            "dashboard.html";

                    } else {

                        alert(
                            data.message ||
                            "Failed to publish blog."
                        );

                    }

                } catch (error) {

                    console.error(
                        "Blog publishing error:",
                        error
                    );

                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    /* =========================
       DASHBOARD
       LOGGED-IN USER BLOGS
    ========================= */

    const blogsContainer =
        document.getElementById(
            "blogsContainer"
        );

    if (blogsContainer) {

        const token =
            localStorage.getItem("token");

        const savedUser =
            localStorage.getItem("user");

        if (!token) {

            alert(
                "Please login to access the dashboard."
            );

            window.location.href =
                "login.html";

            return;
        }

        let currentUser = null;

        try {

            currentUser =
                JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "User data error:",
                error
            );

        }

        try {

            const response =
                await 
                    fetch(`${API_URL}/api/blogs`, {
                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }

                    }
                );

            const blogs =
                await response.json();

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert(
                    "Your session has expired. Please login again."
                );

                window.location.href =
                    "login.html";

                return;
            }

            if (!response.ok) {

                throw new Error(
                    blogs.message ||
                    "Failed to load blogs"
                );

            }

            let userBlogs = blogs;

            if (currentUser && currentUser.name) {

                userBlogs =
                    blogs.filter(function (blog) {

                        return (
                            blog.author ===
                            currentUser.name
                        );

                    });

            }


            /* TOTAL POSTS */

            const totalPosts =
                document.getElementById(
                    "totalPosts"
                );

            if (totalPosts) {

                totalPosts.textContent =
                    userBlogs.length;

            }


            /* NO BLOGS */

            if (userBlogs.length === 0) {

                blogsContainer.innerHTML = `

                    <p class="muted">
                        No blogs published yet.
                    </p>

                `;

                return;

            }


            blogsContainer.innerHTML = "";


            /* DISPLAY BLOGS */

            userBlogs.forEach(function (blog) {

                const postRow =
                    document.createElement("div");

                postRow.className =
                    "post-row";

                postRow.innerHTML = `

                    <div>

                        <span class="tag">
                            ${blog.category || "General"}
                        </span>

                        <h3>
                            ${blog.title}
                        </h3>

                        <small>
                            Published ·
                            ${
                                new Date(blog.date)
                                    .toLocaleDateString()
                            }
                            · By ${blog.author}
                        </small>

                        <p>
                            ${blog.content}
                        </p>

                    </div>

                    <div class="actions">

                        <a
                            href="blog-details.html?id=${blog._id}"
                            class="btn">

                            View Details

                        </a>

                        <button
                            class="edit-btn"
                            data-id="${blog._id}">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            data-id="${blog._id}">

                            Delete

                        </button>

                    </div>

                `;

                blogsContainer.appendChild(
                    postRow
                );


                /* =========================
                   EDIT BLOG
                ========================= */

                const editButton =
                    postRow.querySelector(
                        ".edit-btn"
                    );

                editButton.addEventListener(
                    "click",
                    async function () {

                        const blogId =
                            this.dataset.id;

                        const newTitle =
                            prompt(
                                "Edit blog title:",
                                blog.title
                            );

                        if (newTitle === null) {
                            return;
                        }

                        const newCategory =
                            prompt(
                                "Edit category:",
                                blog.category ||
                                "General"
                            );

                        if (newCategory === null) {
                            return;
                        }

                        const newContent =
                            prompt(
                                "Edit blog content:",
                                blog.content
                            );

                        if (newContent === null) {
                            return;
                        }

                        if (
                            !newTitle.trim() ||
                            !newContent.trim()
                        ) {

                            alert(
                                "Title and content cannot be empty."
                            );

                            return;
                        }

                        const currentToken =
                            localStorage.getItem(
                                "token"
                            );

                        if (!currentToken) {

                            alert(
                                "Please login again."
                            );

                            window.location.href =
                                "login.html";

                            return;
                        }

                        try {

                            const response =
                                await 
                                fetch(`${API_URL}/api/blogs/${blogId}`, {
                                        method: "PUT",

                                        headers: {

                                            "Content-Type":
                                                "application/json",

                                            "Authorization":
                                                `Bearer ${currentToken}`

                                        },

                                        body:
                                            JSON.stringify({

                                                title:
                                                    newTitle.trim(),

                                                category:
                                                    newCategory.trim() ||
                                                    "General",

                                                author:
                                                    blog.author,

                                                content:
                                                    newContent.trim()

                                            })

                                    }
                                );

                            const data =
                                await response.json();

                            if (response.ok) {

                                alert(
                                    data.message
                                );

                                window.location.reload();

                            } else {

                                alert(
                                    data.message ||
                                    "Unable to update blog."
                                );

                            }

                        } catch (error) {

                            console.error(
                                "Edit error:",
                                error
                            );

                            alert(
                                "Unable to connect to the server."
                            );

                        }

                    }
                );


                /* =========================
                   DELETE BLOG
                ========================= */

                const deleteButton =
                    postRow.querySelector(
                        ".delete-btn"
                    );

                deleteButton.addEventListener(
                    "click",
                    async function () {

                        const blogId =
                            this.dataset.id;

                        const confirmation =
                            confirm(
                                "Are you sure you want to delete this blog?"
                            );

                        if (!confirmation) {
                            return;
                        }

                        const currentToken =
                            localStorage.getItem(
                                "token"
                            );

                        if (!currentToken) {

                            alert(
                                "Please login again."
                            );

                            window.location.href =
                                "login.html";

                            return;
                        }

                        try {

                            const response =
                                await 
                                    fetch(`${API_URL}/api/blogs/${blogId}`, {
                                        method: "DELETE",

                                        headers: {

                                            "Authorization":
                                                `Bearer ${currentToken}`

                                        }

                                    }
                                );

                            const data =
                                await response.json();

                            if (response.ok) {

                                alert(
                                    data.message
                                );

                                postRow.remove();

                                const totalPosts =
                                    document.getElementById(
                                        "totalPosts"
                                    );

                                if (totalPosts) {

                                    totalPosts.textContent =
                                        Math.max(
                                            0,
                                            Number(
                                                totalPosts.textContent
                                            ) - 1
                                        );

                                }

                            } else {

                                alert(
                                    data.message ||
                                    "Unable to delete blog."
                                );

                            }

                        } catch (error) {

                            console.error(
                                "Delete error:",
                                error
                            );

                            alert(
                                "Unable to connect to the server."
                            );

                        }

                    }
                );

            });

        } catch (error) {

            console.error(
                "Error loading blogs:",
                error
            );

            blogsContainer.innerHTML = `

                <p class="muted">
                    Unable to load blogs.
                </p>

            `;

        }

    }


    /* =========================
       BLOG DETAILS
    ========================= */

    const blogTitle =
        document.getElementById(
            "blogTitle"
        );

    const blogCategory =
        document.getElementById(
            "blogCategory"
        );

    const blogMeta =
        document.getElementById(
            "blogMeta"
        );

    const blogContent =
        document.getElementById(
            "blogContent"
        );

    if (
        blogTitle &&
        blogCategory &&
        blogMeta &&
        blogContent
    ) {

        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        const blogId =
            urlParams.get("id");

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert(
                "Please login to view this blog."
            );

            window.location.href =
                "login.html";

            return;
        }

        if (!blogId) {

            blogTitle.textContent =
                "Blog not found";

            blogCategory.textContent =
                "Error";

            blogMeta.textContent =
                "";

            blogContent.textContent =
                "No blog ID was provided.";

        } else {

            try {

                const response =
                    await 
                        fetch(`${API_URL}/api/blogs/${blogId}`, {
                            headers: {

                                "Authorization":
                                    `Bearer ${token}`

                            }

                        }
                    );

                const blog =
                    await response.json();

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    alert(
                        "Your session has expired. Please login again."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }

                if (!response.ok) {

                    throw new Error(
                        blog.message ||
                        "Failed to load blog"
                    );

                }

                blogCategory.textContent =
                    blog.category ||
                    "General";

                blogTitle.textContent =
                    blog.title;

                blogMeta.textContent =
                    `Published · ${
                        new Date(blog.date)
                            .toLocaleDateString()
                    } · By ${blog.author}`;

                blogContent.textContent =
                    blog.content;

            } catch (error) {

                console.error(
                    "Error loading blog details:",
                    error
                );

                blogTitle.textContent =
                    "Unable to load blog";

                blogCategory.textContent =
                    "Error";

                blogMeta.textContent =
                    "";

                blogContent.textContent =
                    "Unable to load the blog details.";

            }

        }

    }

});