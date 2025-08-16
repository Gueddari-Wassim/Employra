require("dotenv").config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload=require('../middlewares/uploadMiddleware')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, userName, phoneNumber, password, role, avatar } = req.body;

    if (!fullName || !email || !userName || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { userName }] }
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already exists" });
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        userName,
        phoneNumber,
        password: hashedPassword,
        role,
        avatar: avatar || null
      }
    });

    return res.status(201).json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    console.error("Sign-Up Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userName: user.userName,
        role: user.role,
        avatar: user.avatar || null
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/upload-image",upload.single('image'),(req,res)=>{
  if(!req.file){
    return res.status(400).json({message:"no file uploaded"});
  }
  const imgurl=`${req.protocol}://${req.get("host")}/uploads/${
  req.file.filename
  }`;
  res.status(200).json({imgurl});
});

module.exports = router;
