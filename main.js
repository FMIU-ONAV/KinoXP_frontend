let div = ''  // let: can be changed, but not re-declared. Hoisting behavior is Reference error
// var: can be changed AND re-declared. Hoisting behavior is 'undefined'
// const: can not be changed or re-declared. Hoisting behavior is Reference error
document.addEventListener("DOMContentLoaded", function() { // wait for DOM to load
    document.getElementById('signupForm').addEventListener('submit', signup);
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('getSecretForm').addEventListener('submit', getSecret)
    document.getElementById('deleteUserForm').addEventListener('submit', deleteUser)
    document.getElementById('logoutForm').addEventListener('submit', logout)
    div = document.getElementById('container')
});

function myFetch(endpoint, method, payload=null, token){
    return fetch(`http://localhost:3333/${endpoint}`,  // important to start this line with 'return'
        {
            method: method,
            body: payload,
            headers:{'content-type': 'application/json',
                'Authorization': 'Bearer ' + token }
        })
        .then(function (res) {
            return res.json(); // wait for .json() to complete
        })
        .then(function (data) { // the data, provided by server response
            return data
        })
}

function getToken(){
    const localstorage_user = JSON.parse(localStorage.getItem('user'))
    return  localstorage_user.token
}

function printThis(mydiv, txt, color){
    mydiv.insertAdjacentHTML(
        'beforeend',
        `<span style="background-color: ${color}">${txt}</code>`,
    );
}

function signup(event) {
    event.preventDefault()
    const nameField = document.getElementById("nameField").value;
    const passwordFieldSignup = document.getElementById("passwordFieldSignup").value;
    let payload = {
        username: nameField,
        password: passwordFieldSignup
    };
    payload = JSON.stringify(payload)
    fetch("http://localhost:3333/signup",
        {
            method: "POST",
            body: payload,
            headers:{'content-type': 'application/json'}
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            printThis(div, JSON.stringify(data), "green")
        })
}


function login(event) {
    event.preventDefault()
    const usernameField = document.getElementById("usernameField").value;
    const passwordField = document.getElementById("passwordField").value;
    let payload = {
        username: usernameField,
        password: passwordField
    };
    payload = JSON.stringify(payload)
    fetch("http://localhost:3333/login",
        {
            method: "POST",
            body: payload,
            headers:{'content-type': 'application/json'}
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (res) {
            localStorage.setItem('user', JSON.stringify(res));
            printThis(div,JSON.stringify(res), "green" )
        })
}

function getSecret(event) {
    event.preventDefault()
    if(localStorage.getItem('user') == undefined){
        printThis(div, "No token. Login first", "red")
        return
    }
    const paramField = document.getElementById("paramField").value;
    const payload = {
        paramField: paramField
    };
    myFetch("getSecret", "POST", payload, getToken())
        .then((data) => {
            printThis(div, JSON.stringify(data), "green")
        })
}

function logout(event) {
    event.preventDefault()
    localStorage.removeItem('user')
    printThis(div, "You have logged out.", "green")
}
