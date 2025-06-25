import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  incrementApplications,
  getActiveJobs,
  getJobsByDepartment,
  getJobStats,
  getDepartments,
  closeJob,
  reopenJob,
  duplicateJob
} from '../controllers/jobController.js';
import {
  validateJob,
  validateId,
  validateSearch
} from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with search and filtering
// @access  Public
router.get('/', validateSearch, getJobs);

// @route   GET /api/jobs/stats/overview
// @desc    Get job statistics
// @access  Public
router.get('/stats/overview', getJobStats);

// @route   GET /api/jobs/active
// @desc    Get active jobs
// @access  Public
router.get('/active', validateSearch, getActiveJobs);

// @route   GET /api/jobs/departments
// @desc    Get departments list
// @access  Public
router.get('/departments', getDepartments);

// @route   GET /api/jobs/department/:department
// @desc    Get jobs by department
// @access  Public
router.get('/department/:department', validateSearch, getJobsByDepartment);

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', validateId, getJobById);

// @route   POST /api/jobs
// @desc    Create new job
// @access  Public
router.post('/', validateJob, createJob);

// @route   POST /api/jobs/:id/duplicate
// @desc    Duplicate job
// @access  Public
router.post('/:id/duplicate', validateId, duplicateJob);

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Public
router.put('/:id', validateId, validateJob, updateJob);

// @route   PATCH /api/jobs/:id/status
// @desc    Update job status
// @access  Public
router.patch('/:id/status', validateId, updateJobStatus);

// @route   PATCH /api/jobs/:id/applications
// @desc    Increment applications count
// @access  Public
router.patch('/:id/applications', validateId, incrementApplications);

// @route   PATCH /api/jobs/:id/close
// @desc    Close job posting
// @access  Public
router.patch('/:id/close', validateId, closeJob);

// @route   PATCH /api/jobs/:id/reopen
// @desc    Reopen job posting
// @access  Public
router.patch('/:id/reopen', validateId, reopenJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Public
router.delete('/:id', validateId, deleteJob);

export default router; 