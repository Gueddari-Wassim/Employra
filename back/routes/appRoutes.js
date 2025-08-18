const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = require('../middlewares/authMiddleware');


//job applying
router.post("/:jobId",authenticate,async (req, res) => {
    try {
        // Check if user is a job seeker
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({ message: "Only jobseekers can apply" });
        }

        const jobId = parseInt(req.params.jobId);
        
        // Check if user already applied to this job
        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: jobId,
                applicantId: req.user.id, // assuming req.user.id contains the user ID
            }
        });

        if (existingApplication) {
            return res.status(400).json({ message: "Already applied to this job" });
        }

        // Verify that the job exists
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if job is still open
        if (job.isClosed) {
            return res.status(400).json({ message: "This job is no longer accepting applications" });
        }

        // Create the application
        const application = await prisma.application.create({
            data: {
                jobId: jobId,
                applicantId: req.user.id,
                status: "Applied" // default status from your enum
            },
            include: {
                job: {
                    select: {
                        title: true,
                        company: {
                            select: {
                                companyName: true
                            }
                        }
                    }
                },
                applicant: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application: application
        });

    } catch (err) {
        console.error('Error applying to job:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});







// Get logged-in user's applications
router.get("/my",authenticate, async (req, res) => {
    try {
        const apps = await prisma.application.findMany({
            where: {
                applicantId: req.user.id
            },
            include: {
                job: {
                    select: {
                        title: true,
                        location: true,
                        type: true,
                        company: {
                            select: {
                                companyName: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});











router.get("/job/:jobId", authenticate, async (req, res) => {
    try {
        // Check if user is an employer
        if (req.user.role !== 'employer') {
            return res.status(403).json({
                message: "Only employers can view job applicants"
            });
        }
        // First, check if the job exists and if the user owns it
        const job = await prisma.job.findUnique({
            where: {
                id: parseInt(req.params.jobId)
            },
            select: {
                id: true,
                companyId: true
            }
        });

        if (!job || job.companyId !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to view applicants"
            });
        }

        // Get all applications for this job with applicant and job details
        const applications = await prisma.application.findMany({
            where: {
                jobId: parseInt(req.params.jobId)
            },
            include: {
                job: {
                    select: {
                        title: true,
                        location: true,
                        category: true,
                        type: true
                    }
                },
                applicant: {
                    select: {
                        name: true,
                        email: true,
                        avatar: true,
                        resume: true
                    }
                }
            }
        });

        res.json(applications);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});



// Get application by ID (Jobseeker or Employer)
router.get('/:id', authenticate, async (req, res) => {
    try {
        const app = await prisma.application.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                job: {
                    select: {
                        title: true,
                        companyId: true
                    }
                },
                applicant: {
                    select: {
                        name: true,
                        email: true,
                        avatar: true,
                        resume: true
                    }
                }
            }
        });

        if (!app) {
            return res.status(404).json({
                message: "Application not found.",
                id: req.params.id
            });
        }

        // Check if user is either the applicant or the job owner (employer)
        const isOwner = 
            app.applicantId === req.user.id || 
            app.job.companyId === req.user.id;

        if (!isOwner) {
            return res.status(403).json({
                message: "Not authorized to view this application"
            });
        }

        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});








router.put("/:id/status", authenticate, async (req, res) => {
    try {
        const { status } = req.body;

        // First, find the application and check if user owns the job
        const app = await prisma.application.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                job: {
                    select: {
                        companyId: true
                    }
                }
            }
        });

        if (!app || app.job.companyId !== req.user.id) {
            return res.status(403).json({ 
                message: "Not authorized to update this application" 
            });
        }

        // Update the application status
        const updatedApp = await prisma.application.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                status: status
            }
        });

        res.json({ 
            message: "Application status updated", 
            status: updatedApp.status 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;