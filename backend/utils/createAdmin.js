import bcrypt from "bcryptjs";
import User from "../models/User.js";

const createAdmin = async () => {
  const admin = await User.findOne({ email: "admin@gmail.com" });
  if (admin) return;

  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: await bcrypt.hash("admin111", 10),
    role: "admin",
  });

  console.log("✅ Admin created");
};

export default createAdmin;
