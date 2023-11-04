const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
      type: "String",
      required: true,
  },
  email: {
      type: "String",
      required: true,
      unique: true
  },
  hash_password: {
      type: "String",
      required: true,
  },
  roll: {
      type: "String",
      required: true,
  },
  token: {
    type: "Number",
    required: true,
},
role: {
    type: "String",
    required: true,
},
}, { timestamps: true });


// userSchema.virtual('password')
// .set(function(password){
//     this.hash_password = bcrypt.hashSync(password, 10);
// });

/* userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
}; */

module.exports = mongoose.model("User", userSchema);
