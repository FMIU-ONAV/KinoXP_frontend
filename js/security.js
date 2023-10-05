let div = ''
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('logoutForm').addEventListener('submit', logout);
    div = document.getElementById('container');
});

function login(event) {
    event.preventDefault();
    const usernameField = document.getElementById("usernameField").value;
    const passwordField = document.getElementById("passwordField").value;
    let payload = {
        username: usernameField,
        password: passwordField
    };
    payload = JSON.stringify(payload);
    fetch("http://localhost:3333/login", {
        method: "POST",
        body: payload,
        headers: { 'content-type': 'application/json' }
    })
        .then(function (res) {
            if (res.ok) {
                // Redirect to the "login" page upon successful login
                window.location.href = "movies-admin.html"; // Replace with the actual login page URL
                localStorage.setItem('user', JSON.stringify(res));
            }
            else {
                printThis(div, "Wrong username or password", "red");
            }
        })
}

function logout(event) {
    event.preventDefault();

    if (localStorage.getItem('user') === null) {
        printThis(div, "You are not logged in.", "red");
    }
    else {
        localStorage.removeItem('user');
        printThis(div, "You have logged out.", "green");
        window.location.href = "index.html";
    }

}

function printThis(mydiv, txt, color){
    mydiv.insertAdjacentHTML(
        'beforeend',
        `<span style="background-color: ${color}">${txt}</code>`,
    );
}