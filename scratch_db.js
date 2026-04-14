const mongoose = require('mongoose');
const uri = "mongodb+srv://yamlaknegash96_db_user:M4M6WPuiRv5BS89S@cluster0.5mkhbwo.mongodb.net/impactdonations?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}
run();
