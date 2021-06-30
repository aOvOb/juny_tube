import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/juny_tube", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,  useCreateIndex: true, });


const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DataBase 🏔")
const handelError = (error) => console.log("DB Error", error);

db.on("error", handelError);
db.once("open", handleOpen);
