import express from "express";
import {watch, edit} from "../controllers/videoController";

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");
const handleEditVideo = (req, res) => res.send("Edit Video");

videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);

export default videoRouter;