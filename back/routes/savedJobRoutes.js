const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = require('../middlewares/authMiddleware');



router.post('/:jobId',authenticate, async (req, res) => {
    try {
        // Check if job is already saved by this user
        const exists = await prisma.savedJob.findFirst({
            where: {
                jobId: parseInt(req.params.jobId),
                jobseekerId: req.user.id 
            }
        });

        if (exists) {
            return res.status(400).json({ 
                message: "Job already saved" 
            });
        }

        // Create new saved job record
        const savedJob = await prisma.savedJob.create({
            data: {
                jobId: parseInt(req.params.jobId),
                jobseekerId: req.user.id
            },
        });

        res.status(201).json({
            message: "Job saved successfully",
            data: savedJob
        });

    } catch (err) {
        console.error('Error saving job:', err);
        res.status(500).json({ 
            message: "Failed to save job", 
            error: err.message 
        });
    }
});



router.delete('/:jobId',authenticate,async (req, res) => {
    try {
        // Find and delete the saved job record
        const deletedSavedJob = await prisma.savedJob.deleteMany({
            where: {
                jobId: parseInt(req.params.jobId),
                jobseekerId: req.user.id
            }
        });

        // Check if any record was actually deleted
        if (deletedSavedJob.count === 0) {
            return res.status(404).json({ 
                message: "Saved job not found" 
            });
        }

        res.json({ 
            message: "Job removed from saved list" 
        });

    } catch (err) {
        console.error('Error removing saved job:', err);
        res.status(500).json({ 
            message: "Failed to remove saved job", 
            error: err.message 
        });
    }
});

router.get('/my', authenticate, async (req, res) => {
    try {
        const savedJobs = await prisma.savedJob.findMany({
            where: {
                jobseekerId: req.user.id
            },
            include: {
                job: {
                    include: {
                        company: {
                            select: {
                                name: true,
                                companyName: true,
                                companyLogo: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(savedJobs);

    } catch (err) {
        console.error('Error fetching saved jobs:', err);
        res.status(500).json({ 
            message: "Failed to fetch saved jobs", 
            error: err.message 
        });
    }
});


module.exports = router;