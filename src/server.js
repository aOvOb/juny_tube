import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
    next();
}

const routerLogger = (req, res, next) => {
    console.log("PATH", req.path);
    next();
};

const methodLogger = (req, res, next) => {
    console.log("METHOD", req.method);
    next();
};

const home = (req, res, next) => {
    console.log("im the last one")
    res.send("hello"); 
    next();
};

const login = (req, res, next) => {
    return res.send("Login");
};

app.use(methodLogger, routerLogger);
app.get("/", home);
app.get("/login", login);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} ✔`);

app.listen(PORT, handleListening);