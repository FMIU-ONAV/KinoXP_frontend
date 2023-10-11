const pageTitle = "Kino XP";

document.addEventListener("DOMContentLoaded", function() {
    //document.getElementById("loader-container").style.display = "none";
  });

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
        template: "templates/404.html",
        title: "404 | " + pageTitle,
        description: "Page not found",
        script: "",
        scriptId: "" 
    },
    "/": {
        template: "/templates/index.html",
        title: pageTitle,
        description: "This is the home page that shows all running movies",
        script: "/js/main.js",
        scriptId: "mainScript" 
    },
    "/upcoming": {
        template: "templates/upcoming.html",
        title: "Upcoming Movies | " + pageTitle,
        description: "This is the upcoming page that shows all upcoming movies",
        script: "",
        scriptId: "" 
    },
    "/movie" : {
        template: "templates/movie.html",
        title: "Movie | " + pageTitle,
        description: "This is the movie page that shows all the details about the movie",
        script: "/js/movie.js",
        scriptId: "movieScript"
    },
    "/login": {
        template: "/templates/login.html",
        title: "Login | " + pageTitle, 
        description: "Login page",
        script: "/js/security.js",
        scriptId: "loginScript" 
    },
    "/movies-admin": {
        template: "/templates/movies-admin.html",
        title: "Employee Site | " + pageTitle, 
        description: "Employee site for managing movies",
        script: "/js/movies-admin.js",
        scriptId: "employeeScript" 
    },
    "/theater": {
        template: "/templates/theater.html",
        title: "Theater | " + pageTitle,
        description: "This is the theater page that shows all running movies",
        script: "/js/SeatJs.js",
        scriptId: "seatScript"
    },
    "/admin": {
        template: "/templates/admin.html",
        title: "Admin | " + pageTitle,
        description: "This is the admin page that shows all employees",
        script: "/js/admin.js",
        scriptId: "adminScript"
    }
}


const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();

    
}

const urlLocationHandler = async () => {
    let location = window.location.pathname;
    if (location.length === 0) {
      location = "/";
    }
  
    const route = urlRoutes[location] || urlRoutes[404];
    const html = await fetch(route.template).then((res) => res.text());
    document.getElementById("content").innerHTML = html;
    document.title = route.title;
    document
      .querySelector("meta[name='description']")
      .setAttribute("content", route.description);
      removeScripts();
  
      if (route.script) {
        reloadScript(route.script, route.scriptId); 
      }
  
    if (document.readyState === "loading") {
      // Loading hasn't finished yet
      document.addEventListener("DOMContentLoaded", function () {
        if (!document.getElementById(route.scriptId)) {
          reloadScript(route.script, route.scriptId);
        }
      });
    } else {
      // `DOMContentLoaded` has already fired
      if (!document.getElementById(route.scriptId)) {
        reloadScript(route.script, route.scriptId);
      }
    }
  };
  
  function reloadScript(scriptSrc, scriptId) {
    if (scriptId) {
      const oldScript = document.getElementById(scriptId);
      if (oldScript) {
        oldScript.remove();
      }
    }
  
    if (scriptSrc) {
      const timestamp = Date.now();
      const script = document.createElement("script");
      script.src = `${scriptSrc}?t=${timestamp}`;
      script.id = scriptId;
      script.type = "module";
      document.body.appendChild(script);
    }
  }

  function removeScripts() {
    const allScripts = document.querySelectorAll('script');

  allScripts.forEach(script => {
    if (script.id !== 'routerScript') {
      script.remove(); 
    }
  });
  }
  
  

const navigateTo = (url) => {
    window.history.pushState({}, "", url);
    urlLocationHandler();
}
window.navigateTo = navigateTo;

window.onpopstate = urlLocationHandler;
window.route = route;

urlLocationHandler();
