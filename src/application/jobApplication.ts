import { NextFunction, Request, Response } from "express";
import JobApplication from "../infrastructure/schemas/jobApplication";
import { generateRating } from "./rating";

export const createJobApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobApplication = req.body;
    console.log(jobApplication);

    const createdJobApplication = await JobApplication.create(jobApplication);
    // Call the method that updates the created job application with the rating
    generateRating(createdJobApplication._id);
    
    return res.status(201).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error creating job application:", error.message);
      return res.status(500).json({ message: error.message });
    } else {
      console.log("Unexpected error:", error);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getJobApplications = async (
  req: Request,
  res: Response,
) => {
  try {
    const { jobid } = req.query;

    let jobApplications;
    if (jobid) {
      jobApplications = await JobApplication.find({ job: jobid }).populate('job').exec();
    } else {
      jobApplications = await JobApplication.find().populate('job').exec();
    }

    console.log("Job Applications:", jobApplications);
    return res.status(200).json(jobApplications);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error fetching job applications:", error.message);
      return res.status(500).json({ message: error.message });
    } else {
      console.log("Unexpected error:", error);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getJobApplicationById = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const jobApplication = await JobApplication.findById(id).populate('job');
    
    if (jobApplication === null) {
      return res.status(404).send();
    }
    return res.status(200).json(jobApplication);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error fetching job application by ID:", error.message);
      return res.status(500).json({ message: error.message });
    } else {
      console.log("Unexpected error:", error);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteJobApplication = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const jobApplication = await JobApplication.findByIdAndDelete(id);

    if (!jobApplication) {
      return res.status(404).json({ message: "Job application not found" });
    }

    return res.status(200).json({ message: "Job application deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting job application:", error.message);
      return res.status(500).json({ message: error.message });
    } else {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};