document.addEventListener("DOMContentLoaded", async function () {

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
                    document.getElementById(
                        "confirmPassword"
                    ).value;


                if (password !== confirmPassword) {

                    alert("Passwords do not match.");

                    return;
                }


                try {

                    const response =
                        await fetch("/api/register", {

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

                        });


                    const data =
                        await response.json();


                    if (response.ok) {

                        alert(data.message);

                        window.location.href =
                            "login.html";

                    } else {

                        alert(data.message);

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
                    document.getElementById("email")
                        .value.trim();

                const password =
                    document.getElementById("password")
                        .value;


                try {

                    const response =
                        await fetch("/api/login", {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })

                        });


                    const data =
                        await response.json();


                    if (response.ok) {

                        alert(data.message);

                        window.location.href =
                            "dashboard.html";

                    } else {

                        alert(data.message);

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

                const author =
                    document.getElementById("author")
                        .value.trim();

                const content =
                    document.getElementById("blogContent")
                        .value.trim();


                if (!title || !author || !content) {

                    alert(
                        "Please fill in all required fields."
                    );

                    return;
                }


                try {

                    const response =
                        await fetch("/api/blogs", {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                title,
                                category,
                                author,
                                content

                            })

                        });


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
    ========================= */

    const blogsContainer =
        document.getElementById(
            "blogsContainer"
        );


    if (blogsContainer) {

        try {

            const response =
                await fetch("/api/blogs");


            console.log(
                "Blog API status:",
                response.status
            );


            const blogs =
                await response.json();


            console.log(
                "Blogs received:",
                blogs
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to load blogs"
                );

            }


            /* =========================
               TOTAL POSTS
            ========================= */

            const totalPosts =
                document.getElementById(
                    "totalPosts"
                );


            if (totalPosts) {

                totalPosts.textContent =
                    blogs.length;

            }


            /* =========================
               NO BLOGS
            ========================= */

            if (blogs.length === 0) {

                blogsContainer.innerHTML = `

                    <p class="muted">
                        No blogs published yet.
                    </p>

                `;

                return;

            }


            blogsContainer.innerHTML = "";


            /* =========================
               DISPLAY BLOGS
            ========================= */

            blogs.forEach(function (blog) {

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
                   UPDATE MONGODB
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


                        const newAuthor =
                            prompt(
                                "Edit author:",
                                blog.author
                            );


                        if (newAuthor === null) {
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
                            !newAuthor.trim() ||
                            !newContent.trim()
                        ) {

                            alert(
                                "Title, author and content cannot be empty."
                            );

                            return;

                        }


                        try {

                            const response =
                                await fetch(
                                    `/api/blogs/${blogId}`,
                                    {

                                        method: "PUT",

                                        headers: {

                                            "Content-Type":
                                                "application/json"

                                        },

                                        body:
                                            JSON.stringify({

                                                title:
                                                    newTitle.trim(),

                                                category:
                                                    newCategory
                                                        .trim() ||
                                                    "General",

                                                author:
                                                    newAuthor.trim(),

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
                   DELETE FROM MONGODB
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


                        try {

                            const response =
                                await fetch(
                                    `/api/blogs/${blogId}`,
                                    {

                                        method: "DELETE"

                                    }
                                );


                            const data =
                                await response.json();


                            if (response.ok) {

                                alert(
                                    data.message
                                );


                                postRow.remove();


                                /* Update Total Posts */

                                const totalPosts =
                                    document.getElementById(
                                        "totalPosts"
                                    );


                                if (totalPosts) {

                                    totalPosts.textContent =
                                        Math.max(
                                            0,
                                            Number(
                                                totalPosts
                                                    .textContent
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
                    await fetch(
                        `/api/blogs/${blogId}`
                    );


                const blog =
                    await response.json();


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