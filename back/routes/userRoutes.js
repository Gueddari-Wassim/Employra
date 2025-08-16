const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = require('../middlewares/authMiddleware');


//Update user profile (name, avatar, company details)
router.put('/update-profile',authenticate,async (req, res) => {
    try {
        const { name,userName,phoneNumber,avatar, resume, companyName, companyDescription, companyLogo } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = {
            name: name || user.name,
            avatar: avatar || user.avatar,
            userName: userName|| user.userName,
            phoneNumber: phoneNumber || user.phoneNumber
        };

        if (user.role === 'jobseeker'){
            updateData.resume = resume || user.resume;
        }

        if (user.role === "employer") {
            updateData.companyName = companyName || user.companyName;
            updateData.companyDescription = companyDescription || user.companyDescription;
            updateData.companyLogo = companyLogo || user.companyLogo;
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
        });

        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            avatar: updatedUser.avatar,
            role: updatedUser.role,
            companyName: updatedUser.companyName,
            companyDescription: updatedUser.companyDescription,
            companyLogo: updatedUser.companyLogo,
            resume: updatedUser.resume || '',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






// delete resume
router.put("/delete-resume",authenticate, async (req, res) => {
    try {
        const { resumeUrl } = req.body; 
        
        const fileName = resumeUrl?.split("/")?.pop();

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }, 
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "jobseeker") {
            return res.status(403).json({ message: "Only jobseekers can delete resume" });
        }

        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.user.update({
            where: { id: req.user.id },
            data: { resume: "" },
        });

        res.json({ message: "Resume deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




//get user public profile
router.get("/:id/public", async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);

        // Find user by ID and exclude password
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                userName: true,
                phoneNumber: true,
                role: true,
                avatar: true,
                resume: true,
                companyName: true,
                companyDescription: true,
                companyLogo: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
