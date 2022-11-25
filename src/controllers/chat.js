const models = require('../models');

module.exports = {
    addNewMessage : async (req, res) => {
       
        const users = await models.users.findAll({
            where: {
                id:{[req.Op.notIn]:[req.userData.id]}
            }
        })
        res.json(users)
    },
    send
}

