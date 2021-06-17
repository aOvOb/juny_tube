import Video from "../models/Video";


export const home = (req, res) => {
   //1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  return res.render("home", { pageTitle: "Home"});
};
export const watch = (req, res) => {
  const { id } = req.params;  
  return res.render("watch", { pageTitle: `Watching`});
};
export const getEdit = (req, res) => {
  return res.render("edit", { pageTitle: "Edit" });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.redirect("/");
};


export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Vidoe");
