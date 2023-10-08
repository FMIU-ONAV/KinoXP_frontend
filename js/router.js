const pageTitle = "Kino XP";

document.addEventListener("click", (e) => {
    const { target } = e;
    if (!target.matches("a")) {
        return;
    }
    e.preventDefault();
    route();
});

const urlRoutes = {
    404: {
        template: "templaes/404.html",
        title: "404 | " + pageTitle,
        description: "Page not found",
        script: ""
    },
    "/": {
        template: "/templates/index.html",
        title: pageTitle,
        description: "This is the home page that shows all running movies",
        script: "/js/main.js" 
    },
    "/upcoming": {
        template: "templates/upcoming.html",
        title: "Upcoming Movies | " + pageTitle,
        description: "This is the upcoming page that shows all upcoming movies",
        script: ""
    },
    "/movie" : {
        template: "templates/movie.html",
        title: "Movie | " + pageTitle,
        description: "This is the movie page that shows all the details about the movie",
        script: ""
    },
    "/login": {
        template: "/templates/login.html",
        title: "Login | " + pageTitle, 
        description: "Login page",
        script: "/js/security.js" 
    },
    "/movies-admin": {
        template: "/templates/movies-admin.html",
        title: "Employee Site | " + pageTitle, 
        description: "Employee site for managing movies",
        script: "/js/movies-admin.js"
    }
}


const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();

    
}

const urlLocationHandler = async () => {
    const location = window.location.pathname;
    if(location.length === 0){
        location = "/";
    }

    const route = urlRoutes[location] || urlRoutes[404];
    const html = await fetch(route.template).then(res => res.text());
    document.getElementById("content").innerHTML = html;
    document.title = route.title;
    document.querySelector("meta[name='description']").setAttribute("content", route.description);

    const oldScript = document.getElementById('pageScript');
    oldScript && oldScript.remove();  

    if (document.readyState === "loading") {  // Loading hasn't finished yet
        document.addEventListener("DOMContentLoaded", function() {
            const script = document.createElement('script');
            script.src = route.script;
            script.id = 'pageScript';
            script.type = 'module';
            document.body.appendChild(script);
        });
    } else {  // `DOMContentLoaded` has already fired
        const script = document.createElement('script');
        script.src = route.script;
        script.id = 'pageScript';
        script.type = 'module';
        document.body.appendChild(script);
    }
    
}

const navigateTo = (url) => {
    window.history.pushState({}, "", url);
    urlLocationHandler();
}
window.navigateTo = navigateTo;


window.onpopstate = urlLocationHandler;
window.route = route;

urlLocationHandler();