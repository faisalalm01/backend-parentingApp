const router = require('express').Router()
const {login, register, getAllUser, setAvatar, logout} = require("../controllers/userControllers")

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUser);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logout);

module.exports = router;