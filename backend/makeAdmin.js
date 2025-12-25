// backend/makeAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // REPLACE this email with the one you just registered
    const email = "admin@college.edu"; 

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found!");
      process.exit();
    }

    user.isAdmin = true;
    await user.save();
    console.log(`Success! ${user.name} is now an Admin.`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

makeAdmin();    