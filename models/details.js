const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  Skill: {
    type: String,
    required: true,
  },
  PreSkill:{
    type: String,
    required: true,
  },
  Linkedin: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  }
});

module.exports=mongoose.model("User",userSchema);
