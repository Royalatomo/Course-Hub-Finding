const User = require("./schema/user");
const Session = require("./schema/session");

const express = require("express");
const session = require("./schema/session");
const Router = express.Router();
const sha512 = require("js-sha512").sha512;

async function generateToken(id) {
  try {
    await Session.findOneAndRemove({ userId: id });
  } catch (err) {
    console.log(err);
  }

  const token = sha512(id + Date.now());
  const newSession = new Session({
    token,
    userId: id
  })

  await newSession.save();
  return token;
}

Router.get("/", async (req, res) => {
  const token = req.query.token;

  try {
    const sessionDB = await Session.findOne({token});
    if(!sessionDB) {
      return res.status(401).json({ success: false, err: "Invalid Session Token"});
    }

    const userDB = await User.findById(sessionDB.userId);
    return res.json({ success: true, user: userDB });
  } catch (error) {
    return res.status(400).json({ success: false, err: "Bad Request" });
  }
});

Router.post("/register", async (req, res) => {
  const userName = req.body.username || "user";
  const email = req.body.email;
  const pass = req.body.password;
  const secretKey = req.body.secret;

  if (!email || !pass) {
    return res.status(401).json({ success: false, err: "Missing Fields" });
  }

  if (secretKey !== process.env.SECRET) {
    return res.status(401).json({ success: false, err: "Invalid Secret Key" });
  }

  const hashedPass = sha512(pass);

  try {
    const userDB = await User.findOne({ email });
    if (userDB) {
      return res.status(401).json({ success: false, err: "Email already exists" });
    }

    const newUser = new User({
      name: userName,
      email,
      password: hashedPass
    })
    const savedUser = await newUser.save();
    return res.json({
      success: true,
      token: await generateToken(savedUser._id)
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, err: "Internal Server Error" });
  }
})

Router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ success: false, err: "Missing Fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, err: "Email not found" });
    }

    if (user.password !== sha512(password)) {
      return res.status(401).json({ success: false, err: "Invalid Password" });
    }

    return res.json({
      success: true,
      token: await generateToken(user._id)
    });
  } catch (err) {
    console.log(err);
  }
})

Router.post("/logout", async (req, res) => {
  try {
    await session.findOneAndRemove({token: req.query.token});
    return res.json({ success: true, token: "user logged out" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, token: "Some Error Occured" });
  }
})

module.exports = Router;