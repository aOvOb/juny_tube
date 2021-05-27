import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

//조금 더 큰 middleware
const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if(url == "/protected"){
        return res.send("Not Allowed");
    }
    console.log("Allowed. you may continue.");
    next();
}

const handleHome = (req, res, next) => {
    return res.send("i m middleware"); 
};
const handleProtected = (req, res) => {
    return res.send("<h1>Welcome to the private lounge.</h1>")
}

app.use(logger);
app.use(privateMiddleware);
app.get("/", handleHome);
app.get("/protected",handleProtected);

const handleListening = () => console.log(`Server listening on port ${PORT} ✔`);

app.listen(PORT, handleListening);