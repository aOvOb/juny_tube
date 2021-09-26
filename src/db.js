import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false,  useCreateIndex: true, });


const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DataBase 🏔")
const handelError = (error) => console.log("DB Error", error);

db.on("error", handelError);
db.once("open", handleOpen);
