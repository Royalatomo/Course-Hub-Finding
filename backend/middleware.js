const User = require("./schema/user");
const Session = require("./schema/session");

const restrictAccess = (req, res, next) => {
  console.log(req.socket.remoteAddress);
  next();
};

const checkAdmin = async (req, res, next) => {
  const session = req.query.token;
  
  try {
    const userId = (await Session.findOne({token: session}))?.userId;
    
    if(!userId) {
      return res.status(401).json({ success: false, err: "Unauthorized Request"});
    }

    const userDB = await User.findById(userId);
    if(!userDB.admin) {
      return res.status(401).json({ success: false, err: "Unauthorized Request"});
    }
  } catch (err) {
    console.log(err);
  }
  next();
};

module.exports = { restrictAccess, checkAdmin };
