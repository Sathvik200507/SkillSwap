const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const User=require("./models/details.js");
const {DBMS,Java,Python,OS}=require("./models/skills.js");

const session = require("express-session");
const { Script } = require("vm");

app.use(session({
    secret: "SkillSafe", 
    resave: false,
    saveUninitialized: false
}));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

app.post("/login", async (req, res) => {
    let { username, password } = req.body;

    let user = await User.findOne({ Username: username });

    if (user) {
        if (password === user.Password) {
            req.session.userId = user._id;
            res.render("home", {error:null,profiles:[]});
        } else {
            return res.render("login", { error: "Invalid Password" });
        }
    } else {
        return res.render("login", { error: "User does not exist. Please register!" });
    }
});


main()
  .catch((err) => console.log(err))
  .then(() => console.log("connection successful"));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/SkillSwap");
}

app.get("/",async(req,res)=>{
    res.render("login",{error:null});
});

app.get("/profile", async (req, res) => {
    let user = await User.findById(req.session.userId);
    res.render("profile", { user});
});

app.get("/home",(req,res)=>{
    res.render("home", { profiles: [] });
});

app.get("/login",(req, res) => {
    res.render("login",{ error: null});
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.post("/evaluate", async (req, res) => {
    let data = req.body;
    let username=data.Username;
    if(await User.findOne({Username:username})){
        return res.send("<script>alert('Username already exists.Please choose another!'</script>");
    }
    let user = new User({
        Username: data.Username,
        Password: data.Password,
        DOB: data.DOB,
        Skill: data.skill,
        PreSkill: data.preskill,
        Linkedin: data.Linkedin,
        Phone: data.Phone,
    });
    await user.save();

    req.session.userId = user._id;

    if (user.Skill === "Java") {
        let uname = new Java({
            Username: data.Username,
        });
        await uname.save();
    } else if (user.Skill === "Python") {
        let uname = new Python({
            Username: data.Username,
        });
        await uname.save();
    } else if (user.Skill === "DBMS") {
        let uname = new DBMS({
            Username: data.Username,
        });
        await uname.save();
    } else {
        let uname = new OS({
            Username: data.Username,
        });
        await uname.save();
    }

    res.render("home", { profiles: [] });
});

app.post("/fetchSkillData", async (req, res) => {
    let { skill } = req.body;
    let profiles = [];
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    let curUser=await User.findById(req.session.userId);
    let user=curUser.Username;
    if (skill === "Java") {
        profiles = await Java.find({Username:{$ne:user}});
    } else if (skill === "Python") {
        profiles = await Python.find({Username:{$ne:user}});
    } else if (skill === "DBMS") {
        profiles = await DBMS.find({Username:{$ne:user}});
    } else if (skill === "OS") {
        profiles = await OS.find({Username:{$ne:user}});
    }

    res.render("home", {profiles,skill});
});

app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("server started");
});

app.get("/profile/:username",async(req,res)=>{
    let {username}=req.params;
    let user=await User.findOne({Username:username});
    res.render("userprofile",{user});
});

app.get("/loginabout",(req,res)=>{
    res.render("loginabout");
});