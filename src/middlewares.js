export const localsMiddlewares = (req, res, next) =>{
  // console log for checking session what i got
  // console.log(req.session)
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Juny Tube";
  // checking for loggedIn and siteName
  // console.log(res.locals)
  res.locals.loggedInUser = req.session.user;
  next();
}