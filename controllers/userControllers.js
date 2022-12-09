const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = {

  login: async(req, res, next) => {
    try {
      const {username, password} = req.body;
      const user = await User.findOne({ username });
      if (!user) 
        return res.json({msg: "Incorrect username or password", status: false});
      const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid)
     return res.json({
      msg: "Incorrect Username or Password", status: false
    })
    delete user.password;
    return res.json({status: true, user})
    } catch (error) {
      next(error)
    }
  },

  register: async(req, res, next) => {
    try {
      const { username, email, password , nohp} = req.body;
      const saltround = 10
      const usernameCheck = await User.findOne({ username });
      if(usernameCheck)
      return res.json({msg: "Username sudah terpakai", status: false})
      const emailCheck = await User.findOne({ email })
      if(emailCheck) 
      return res.json({msg: "Email sudah terpakai", status: false})
      const hashedPassword = bcrypt.hashSync(password, saltround);
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
        nohp
      })
      delete user.password;
      return res.json({status: true, user})
    } catch (error) {
      next(error)
    }
  },

  getAllUser : async (req, res, next) => {
    try {
      const users = await User.find({
        _id: { $ne: req.params.id }
      }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ])
      return res.json(users)
    }catch(error) {
      next(error)
    }
  },

  setAvatar : async(req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,{
          isAvatarImageSet: true,
          avatarImage,
        },{ new:true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage
      })
    } catch (error) {
      next(error)
    }
  },

  logout: (req, res, next ) => {
    try {
      if(!req.params.id) return res.json({msg: "User id is required"})
      onlineUsers.delete(req.params.id)
      return res.status(200).send()
    } catch (error) {
      next(error)
    }
  }
}