const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = require('../middlewares/authMiddleware');



const getTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};


router.get('/overview',authenticate, async (req, res) => {
    try {
        // Check if user is an employer
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const companyId = req.user.id;
        const now = new Date();
        const last7Days = new Date(now);
        last7Days.setDate(now.getDate() - 7);
        const prev7Days = new Date(now);
        prev7Days.setDate(now.getDate() - 14);

        // === COUNTS ===
        // Total active jobs
        const totalActiveJobs = await prisma.job.count({
            where: {
                companyId: companyId,
                isClosed: false
            }
        });

        // Get all job IDs for this company
        const jobs = await prisma.job.findMany({
            where: { companyId: companyId },
            select: { id: true }
        });
        const jobIds = jobs.map(job => job.id);

        // Total applications for company's jobs
        const totalApplications = await prisma.application.count({
            where: {
                jobId: { in: jobIds }
            }
        });

        // Total hired applicants
        const totalHired = await prisma.application.count({
            where: {
                jobId: { in: jobIds },
                status: "Accepted"
            }
        });

        // === TRENDS ===
        // Active Job Posts trend
        const activeJobsLast7 = await prisma.job.count({
            where: {
                companyId: companyId,
                createdAt: {
                    gte: last7Days,
                    lte: now
                }
            }
        });

        const activeJobsPrev7 = await prisma.job.count({
            where: {
                companyId: companyId,
                createdAt: {
                    gte: prev7Days,
                    lt: last7Days
                }
            }
        });

        const activeJobTrend = getTrend(activeJobsLast7, activeJobsPrev7);

        // Applications trend
        const applicationsLast7 = await prisma.application.count({
            where: {
                jobId: { in: jobIds },
                createdAt: {
                    gte: last7Days,
                    lte: now
                }
            }
        });

        const applicationsPrev7 = await prisma.application.count({
            where: {
                jobId: { in: jobIds },
                createdAt: {
                    gte: prev7Days,
                    lt: last7Days
                }
            }
        });

        const applicantTrend = getTrend(applicationsLast7, applicationsPrev7);

        // Hired Applicants trend
        const hiredLast7 = await prisma.application.count({
            where: {
                jobId: { in: jobIds },
                status: "Accepted",
                createdAt: {
                    gte: last7Days,
                    lte: now
                }
            }
        });

        const hiredPrev7 = await prisma.application.count({
            where: {
                jobId: { in: jobIds },
                status: "Accepted",
                createdAt: {
                    gte: prev7Days,
                    lt: last7Days
                }
            }
        });

        const hiredTrend = getTrend(hiredLast7, hiredPrev7);

        // === DATA ===
        // Recent jobs
        const recentJobs = await prisma.job.findMany({
            where: { companyId: companyId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                location: true,
                type: true,
                isClosed: true,
                createdAt: true,
            }
        });

        // Recent applications
        

        const recentApplications = await prisma.application.findMany({
            where: { jobId: { in: jobIds } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                applicant: {
                    select: {
                        phoneNumber:true,
                        userName: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                job: {
                    select: {
                        title: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });

        res.json({
            counts: {
                totalActiveJobs,
                totalApplications,
                totalHired,
                trends: {
                    activeJobs: activeJobTrend,
                    totalApplicants: applicantTrend,
                    totalHired: hiredTrend
                }
            },
            data: {
                recentJobs,
                recentApplications,
            },
        });

    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ 
            message: "Failed to fetch analytics", 
            error: err.message 
        });
    }
});

module.exports = router;