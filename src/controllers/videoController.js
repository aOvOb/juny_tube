import Video from "../models/Video";

const handelSearch = (error, document) => {
  
};


// Video.find({}, (error, videos) => {});

export const home = async(req, res) => {
  Video.find({}, (error, videos) => {
    res.render("home", { pageTitle: "Home", videos:[] });
  });
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

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try{
    await Video.create({
      title, 
      description,
      createdAt: Date.now(),
      hashtags: hashtags.split(",").map(word => `#${word}`),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    return res.redirect("/");
  } catch (error){
    return res.render("upload", { pageTitle: "Upload Video", errorMessage: error._message, });
  }
};
