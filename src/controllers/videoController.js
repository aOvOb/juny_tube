let videos = [
  {
    title: "First Video !",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes age",
    views: 1,
    id: 1
  },
  {
    title: "Second Video !",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes age",
    views: 59,
    id: 2
  },
  {
    title: "Third Video !",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes age",
    views: 59,
    id: 3
  }
]; 

export const trending = (req, res) => {
   //1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  return res.render("home", { pageTitle: "Home", videos});
};
export const watch = (req, res) => {
  const { id } = req.params;  
  console.log("Show video",id);
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video});
};
export const getEdit = (req, res) => {
  const { id } = req.params;  
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: "Edit", video });
};
export const postEdit = (req, res) => {};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Vidoe");