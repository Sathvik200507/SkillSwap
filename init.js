import mongoose from "mongoose";
import User from "./models/details.js";
main()
  .catch((err) => console.log(err))
  .then(() => console.log("connection successful"));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/SkillSwap");
}

const user = new User({
    Username: "sathvik123",
    Password: "mySecretPass",
    DOB: new Date("2004-05-15"),
    Skill: "Java",
    Linkedin: "https://www.linkedin.com/in/sathvik123"
});
  
await user.save();
let data=await User.find({});
console.log(data);