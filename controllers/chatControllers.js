const Messages = require("../models/message");

module.exports = {
    getMessages: async (req, res, next) => {
        try {
            const {from, to} = req.body;
            const messages = await Messages.find({
                users: {
                    $all: [from, to],
                },
            }).sort({ updatedAt: 1});

            const projectedMessages = messages.map((msg) => {
                return {
                 fromSelf: msg.sender.toString() === from,
                 message: msg.message.text,   
                }
            })
            res.json(projectedMessages)
        } catch (error) {
            next(error)
        }
    },
    addMessage: async(req, res, next) => {
        try {
            const {from, to, message} = req.body;
            const data = await Messages.create({
                message: {text: message},
                users: [from, to],
                sender: from
            })
            if(data) return res.json({msg: "Message Success Added"});
            else return res.json({msg: "Failed to add Message to db"})
        } catch (error) {
            next(error)
        }
    }
}