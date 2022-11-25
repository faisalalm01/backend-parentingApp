
const { user, Sequelize } = require("../models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const op = Sequelize.Op;

module.exports = {
  signUp: (req, res) => {
    const { body } = req;
    const saltRounds = 10;

    body.password = bcrypt.hashSync(body.password, saltRounds);

    user
      .create(body)
      .then((data) => {
        res.status(200).send({
          msg: "Success Signup",
          status: 200,
          data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          msg: "Failed Signup",
          status: 500,
          err,
        });
      });
  },
  signIn: async (req, res) => {
    const { body } = req;
    let finduser = await user.findOne({
      where: {
        [op.or]: [{ username: body.username }, { email: body.username }],
      },
    });
    if (!finduser) {
      res.status(404).send({
        msg: "Sign-in error",
        status: 404,
        error: "User not found",
      });
    }
    const isValidPassword = bcrypt.compareSync(
      body.password,
      finduser.dataValues.password
    );

    if (!isValidPassword) {
      res.status(403).send({
        msg: "Sign-in error",
        status: 403,
        error: "Password is invalid",
      });
    }
    const payload = {
      id: finduser.dataValues.id,
      firstname: finduser.dataValues.firstname,
      lastname: finduser.dataValues.lastname,
      username: finduser.dataValues.username,
      email: finduser.dataValues.email,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });
    delete finduser.dataValues.password;
    res.status(200).send({
      msg: "Sign-in Success",
      status: 200,
      data: { ...finduser.dataValues, token },
    });
  },
  edituser: async (req, res) => {
    let { body } = req;
    let { id } = req.params;
    const saltRounds = 10;

    body.password = bcrypt.hashSync(body.password, saltRounds);

    let finduser = await user.findOne({ where: { id } });
    if (!finduser) {
      res.status(404).send({
        msg: "Edit data user error",
        status: 404,
        error: "Data not found",
      });
    }

    user
      .update(body, { where: { id } })
      .then((data) => {
        const resObject = { ...finduser.dataValues, ...body };
        res.status(200).send({
          msg: "Success edit data user",
          status: 200,
          data: resObject,
        });
      })
      .catch((err) => {
        res.status(500).send({
          msg: "Failed While edit data",
          status: 500,
          err,
        });
      });
  },
};