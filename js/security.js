const url = 'kinoxpkea.azurewebsites.net' // 'localhost:8081'

let div = ''

if (window.location.pathname.includes('/login')) {
    document.getElementById('signupForm').addEventListener('submit', signup);
    document.getElementById('loginForm').addEventListener('submit', login);
}
    div = document.getElementById('container');


function signup(event) {
    event.preventDefault();
    const nameField = document.getElementById("nameField").value;
    const passwordFieldSignup = document.getElementById("passwordFieldSignup").value;
    let payload = {
        username: nameField,
        password: passwordFieldSignup
    };
    payload = JSON.stringify(payload);
    fetch(`https://${url}/signup`, {
        method: "POST",
        body: payload,
        headers: {'content-type': 'application/json'}
    })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            printThis(div, JSON.stringify(data), "green");
        });
}

function login(event) {
    event.preventDefault();
    const usernameField = document.getElementById("usernameField").value;
    const passwordField = document.getElementById("passwordField").value;
    let payload = {
        username: usernameField,
        password: passwordField
    };
    payload = JSON.stringify(payload);
    fetch(`https://${url}/login`, {
        method: "POST",
        body: payload,
        headers: {'content-type': 'application/json'}
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Wrong username or password');
            }
        })
        .then(function (data) {
            localStorage.setItem('user', JSON.stringify(data));
            window.navigateTo('/movies-admin');
        })
        .catch(function (error) {
            printThis(div, error.message, "red");
        });
}

function logout(event) {
    event.preventDefault();

    if (localStorage.getItem('user') === null) {
        printThis(div, "You are not logged in.", "red");
    } else {
        localStorage.removeItem('user');
        printThis(div, "You have logged out.", "green");
        window.location.href = "index.html";
    }

}


function printThis(mydiv, txt, color) {
    mydiv.insertAdjacentHTML(
        'beforeend',
        `<span style="background-color: ${color}">${txt}</code>`,
    );
}

export function getToken(){
    const localstorage_user = JSON.parse(localStorage.getItem('user'))
    return  localstorage_user.token
}