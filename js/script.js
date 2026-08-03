document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       REGISTER
    ========================= */

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            try {

                const response = await fetch("/api/register", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {

                    alert(data.message);

                    window.location.href = "login.html";

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.error("Registration error:", error);

                alert("Unable to connect to the server.");

            }
        });
    }


  /* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch("/api/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {

                alert(data.message);

                window.location.href = "dashboard.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Unable to connect to the server.");

        }
    });
}


    /* =========================
       CREATE / PUBLISH BLOG
    ========================= */

    const blogForm = document.getElementById("blogForm");

    if (blogForm) {
        blogForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const title =
                document.getElementById("blogTitle").value.trim();

            const category =
                document.getElementById("category").value;

            const author =
                document.getElementById("author").value.trim();

            const content =
                document.getElementById("blogContent").value.trim();

            if (!title || !author || !content) {
                alert("Please fill in all required fields.");
                return;
            }

            const newPost = {
                id: Date.now(),
                title: title,
                category: category,
                author: author,
                content: content,
                date: new Date().toLocaleDateString()
            };

            let posts =
                JSON.parse(localStorage.getItem("blogPosts")) || [];

            posts.push(newPost);

            localStorage.setItem(
                "blogPosts",
                JSON.stringify(posts)
            );

            alert("Your blog has been published successfully!");

            window.location.href = "dashboard.html";
        });
    }


    /* =========================
       DASHBOARD
    ========================= */

    const postsContainer =
        document.querySelector(".table-card");

    if (postsContainer) {

        const posts =
            JSON.parse(localStorage.getItem("blogPosts")) || [];


        /* Add newly created posts */

        posts.forEach(function (post) {

            const postRow =
                document.createElement("div");

            postRow.className = "post-row";

            postRow.innerHTML = `
                <div>
                    <span class="tag">
                        ${post.category}
                    </span>

                    <h3>
                        ${post.title}
                    </h3>

                    <small>
                        Published · ${post.date} · By ${post.author}
                    </small>
                </div>

                <div class="actions">

                    <button
                        class="edit-btn"
                        data-id="${post.id}">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${post.id}">
                        Delete
                    </button>

                </div>
            `;

            postsContainer.appendChild(postRow);
        });


        /* =========================
           EDIT & DELETE
        ========================= */

        postsContainer.addEventListener("click", function (event) {

            /* ---------- EDIT ---------- */

            if (event.target.classList.contains("edit-btn")) {

                const postId =
                    event.target.dataset.id;

                /* Only edit posts created by the user */

                if (!postId) {
                    alert(
                        "This is a sample post. Create your own post to edit it."
                    );
                    return;
                }

                let currentPosts =
                    JSON.parse(
                        localStorage.getItem("blogPosts")
                    ) || [];

                const post =
                    currentPosts.find(function (item) {
                        return String(item.id) === String(postId);
                    });

                if (!post) {
                    alert("Blog post not found.");
                    return;
                }


                /* Ask for updated information */

                const newTitle =
                    prompt(
                        "Edit blog title:",
                        post.title
                    );

                if (newTitle === null) {
                    return;
                }


                const newCategory =
                    prompt(
                        "Edit category:",
                        post.category
                    );

                if (newCategory === null) {
                    return;
                }


                const newContent =
                    prompt(
                        "Edit blog content:",
                        post.content
                    );

                if (newContent === null) {
                    return;
                }


                /* Update post */

                post.title =
                    newTitle.trim() || post.title;

                post.category =
                    newCategory.trim() || post.category;

                post.content =
                    newContent.trim() || post.content;


                localStorage.setItem(
                    "blogPosts",
                    JSON.stringify(currentPosts)
                );


                alert("Blog updated successfully!");

                window.location.reload();
            }


            /* ---------- DELETE ---------- */

            if (event.target.classList.contains("delete-btn")) {

                const postId =
                    event.target.dataset.id;


                /* Sample post */

                if (!postId) {

                    const oldPost =
                        event.target.closest(".post-row");

                    if (oldPost) {

                        const confirmation =
                            confirm(
                                "Are you sure you want to delete this blog post?"
                            );

                        if (confirmation) {
                            oldPost.remove();
                        }
                    }

                    return;
                }


                /* User-created post */

                const confirmation =
                    confirm(
                        "Are you sure you want to delete this blog post?"
                    );

                if (!confirmation) {
                    return;
                }


                let currentPosts =
                    JSON.parse(
                        localStorage.getItem("blogPosts")
                    ) || [];


                currentPosts =
                    currentPosts.filter(function (post) {

                        return String(post.id) !==
                               String(postId);

                    });


                localStorage.setItem(
                    "blogPosts",
                    JSON.stringify(currentPosts)
                );


                event.target
                    .closest(".post-row")
                    .remove();


                alert("Blog deleted successfully.");
            }

        });
    }

});