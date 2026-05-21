import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGO_URI = "mongodb+srv://ramdinesh2709_db_user:lbxJOPfaBjwW3W0O@cluster0.aviennq.mongodb.net/cloned";

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

async function hashPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const users = await User.find();

    for (const user of users) {

      // Skip if already hashed
      if (user.password.startsWith("$2b$")) {
        console.log(`Skipping ${user.email} (already hashed)`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      user.password = hashedPassword;
      await user.save();

      console.log(`Updated password for ${user.email}`);
    }

    console.log("All passwords updated");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

hashPasswords();