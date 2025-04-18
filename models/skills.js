const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  Username: String,
});

const DBMS = mongoose.model("DBMS", skillSchema);
const Java = mongoose.model("Java", skillSchema);
const Python = mongoose.model("Python", skillSchema);
const OS = mongoose.model("OS", skillSchema);

module.exports = { DBMS, Java, Python, OS };
