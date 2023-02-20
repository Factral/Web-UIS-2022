
class Config {
    todosUrl = "";
    registerUrl = "";
    loginUrl = "";
    
}


class DevelopmentConfig extends Config {
    todosUrl = "http://localhost:5000/todos/";
    registerUrl = "http://localhost:5000/signup";
    loginUrl = "http://localhost:5000/login";
}


class ProductionConfig extends Config {
    todosUrl = "https://shay-poc-flask.onrender.com/todos/";
    registerUrl = "https://shay-poc-flask.onrender.com/signup";
    loginUrl = "https://shay-poc-flask.onrender.com/login";
}


// let config = new DevelopmentConfig();
// let config = new ProductionConfig();
let config = new Config();


if(process.env.NODE_ENV === "production") { 
    config= new ProductionConfig();
}
else if(process.env.NODE_ENV === "development") {
    config= new DevelopmentConfig();
}

export default config;