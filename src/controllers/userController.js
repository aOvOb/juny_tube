import User from "../models/User";
import Video from "../models/Video"
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { render } from "pug";

export const getJoin = (req, res) => res.render("users/join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("users/Join", { pageTitle, errorMessage: "Password confirmation does not match." })
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("users/join", { pageTitle, errorMessage: "This Username/email is already taken." })
  }
  // $or 로 대체
  // const emailExists = await User.exists({ email });
  // if(emailExists) {
  //   return res.render("join", { pageTitle, errorMessage: "This email is already taken."})
  // }
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};
export const getLogin = (req, res) =>
  res.render("users/login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login"
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", { pageTitle, errorMessage: "An account with this username does not exists.", });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("users/login", { pageTitle, errorMessage: "Wrong Password.", });
  }
  console.log("Login Success!")
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`
        },
      })
    ).json();
    // check login user's information 
    // console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      // [TODO] set notification 
      return res.redirect("/users/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      const user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/users/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
}

export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl }
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file);
  const updatedUser = await User.findByIdAndUpdate(_id, { avatarUrl: file ? file.path : avatarUrl, name, email, username, location }, { new: true });
  // 수동적인 방법 (유저업데이트)
  // req.session.user = { ...req.session.user, name, email, username, location, };

  // [TODO] 중복 아이디 or 이메일 막기 done
  const findDupUser = await User.exists({ $or: [{ username }, { email }] });
  if (findDupUser.username === username || findDupUser.email === email) {
    return res.render("users/editProfile", { pageTitle: "Edit Profile", errorMessage: "This Username/email is already taken." });
  }


  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {

  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password"), { pageTItle: "Change Password" };
}

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password }
    },
    body: { oldPassword, newPassword, newPasswordConfimation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: " The current password is incorrect." });
  }
  if (newPassword !== newPasswordConfimation) {
    return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: " The new password doesn't match with the confirmation." })
  }
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  return res.redirect("/users/logout")
}



export const login = (req, res) => res.send("Login");


export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404) / render("404");
  }
  // check user's objects
  // console.log(user);
  // const videos = await Video.find({ owner: user._id });
  return res.render("users/profile", { pageTitle: user.name, user, })
};