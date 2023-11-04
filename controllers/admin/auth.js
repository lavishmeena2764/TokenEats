const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(
      async (user) => {
        if (user)
          return res.status(400).json({
            message: "User already registered",
          });


        const { name, roll, email, password, role} = req.body;
          var token
        if(role === "vendor") { token = 0;}
        else { token = 100;}

        console.log("working")
        const hash_password = await bcrypt.hash(password, 10);
        const _user = new User({
          name,
          roll,
          email,
          hash_password,
          role,
          token
        });

        _user.save()
          .then((data) => {
            return res.json({
              success: true,
              data: data
            });
          })
          .catch((error) => {
            return res.status(400).json({
              message: "Something  wrong",
              error: error
            });
          })
      });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(
      (user) => {
        if (user) {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
          );
          const { _id, name, roll, email } = user;
          res.cookie("token", token);
          res.status(200).json({
            token,
            user: { _id, name,roll, email },
            success:true
          });
        } else {
          return res.status(400).json({
            message: "Invalid Password",
          });
        }

      })
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};
