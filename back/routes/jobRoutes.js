const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = require('../middlewares/authMiddleware');



//create user
router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const {title,description,requirements,location,category,type,salaryMin,salaryMax,} = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        location,
        category,
        type,
        salaryMin,
        salaryMax,
        companyId: req.user.id,
      },
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




//get all jobs
router.get("/", async (req, res) => {
  const {keyword,location,category,type,minSalary,maxSalary,userId,} = req.query;

  try {
    // Build filters
    const filters = {
      isClosed: false,
      ...(category && { category }),
      ...(type && { type }),
      ...(location && {
        location: { contains: location, mode: "insensitive" },
      }),
      ...(keyword && {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }),
    };

    if (minSalary || maxSalary) {
      filters.AND = [];
      if (minSalary) {
        filters.AND.push({ salaryMax: { gte: Number(minSalary) } });
      }
      if (maxSalary) {
        filters.AND.push({ salaryMin: { lte: Number(maxSalary) } });
      }
    }

    // Get jobs with company info
    const jobs = await prisma.job.findMany({
      where: filters,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            companyLogo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let savedJobIds = [];
    let appliedJobStatusMap = {};

    if (userId) {
      // Saved jobs for user
      const savedJobs = await prisma.savedJob.findMany({
        where: { jobseekerId: Number(userId) },
        select: { jobId: true },
      });
      savedJobIds = savedJobs.map((s) => s.jobId);

      // Applications for user
      const applications = await prisma.application.findMany({
        where: { applicantId: Number(userId) },
        select: { jobId: true, status: true },
      });
      applications.forEach((app) => {
        appliedJobStatusMap[app.jobId] = app.status;
      });
    }

    // Add isSaved & applicationStatus
    const jobsWithExtras = jobs.map((job) => ({
      ...job,
      isSaved: savedJobIds.includes(job.id),
      applicationStatus: appliedJobStatusMap[job.id] || null,
    }));

    res.json(jobsWithExtras);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




//Get jobs for logged in employer
router.get("/get-jobs-employer", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;

    if (role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get jobs posted by this employer
    const jobs = await prisma.job.findMany({
      where: { companyId: userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            companyLogo: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format jobs with applicationCount (tnajem ttna7a 5tr _count ml prisma deja t3ml somme)
    const jobsWithApplicationCounts = jobs.map((job) => ({
      ...job,
      applicationCount: job._count.applications,
    }));

    res.json(jobsWithApplicationCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




//Get single job by ID
router.get("/:id", async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const { userId } = req.query;

    // Fetch job with company info
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            companyName: true,
            companyLogo: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let applicationStatus = null;

    if (userId) {
      const application = await prisma.application.findFirst({
        where: {
          jobId: jobId,
          applicantId: Number(userId),
        },
        select: { status: true },
      });

      if (application) {
        applicationStatus = application.status;
      }
    }

    res.json({
      ...job,
      applicationStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;