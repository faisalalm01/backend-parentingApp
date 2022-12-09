const router = require('express').Router();
const { addMessage, getMessages } = require("../controllers/chatControllers")

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

module.exports = router