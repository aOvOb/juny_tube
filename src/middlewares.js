import multer from "multer";

export const localsMiddlewares = (req, res, next) => {

  // =============================================
  // console log for checking session what i got
  // =============================================
  // console.log(req.session)

  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Juny Tube";

  // =============================================
  // checking for loggedIn and siteName
  // =============================================
  // console.log(res.locals)

  res.locals.loggedInUser = req.session.user || {};
  // console.log(req.session.user);
  next();
};


export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/", 
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos/", 
  limits: {
    fileSize: 10000000,
  },
});