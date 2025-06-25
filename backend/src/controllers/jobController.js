import Job from '../models/Job.js';

// @desc    Get all jobs with search and filtering
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { search, status, department, type, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    // Department filter
    if (department) {
      query.department = department;
    }
    
    // Type filter
    if (type) {
      query.type = type;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Job.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalJobs: total,
          hasNextPage: skip + jobs.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job retrieved successfully',
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Public
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Public
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// @desc    Update job status
// @route   PATCH /api/jobs/:id/status
// @access  Public
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['Draft', 'Active', 'Paused', 'Closed', 'Archived'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job status updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job status',
      error: error.message
    });
  }
};

// @desc    Increment applications count
// @route   PATCH /api/jobs/:id/applications
// @access  Public
export const incrementApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    job.applications += 1;
    await job.save();
    
    res.status(200).json({
      success: true,
      message: 'Applications count incremented successfully',
      data: job
    });
  } catch (error) {
    console.error('Error incrementing applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to increment applications count',
      error: error.message
    });
  }
};

// @desc    Get active jobs
// @route   GET /api/jobs/active
// @access  Public
export const getActiveJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find({ status: 'Active' })
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Job.countDocuments({ status: 'Active' });
    
    res.status(200).json({
      success: true,
      message: 'Active jobs retrieved successfully',
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalJobs: total,
          hasNextPage: skip + jobs.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active jobs',
      error: error.message
    });
  }
};

// @desc    Get jobs by department
// @route   GET /api/jobs/department/:department
// @access  Public
export const getJobsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find({ department })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Job.countDocuments({ department });
    
    res.status(200).json({
      success: true,
      message: `Jobs in department '${department}' retrieved successfully`,
      data: {
        jobs,
        department,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalJobs: total,
          hasNextPage: skip + jobs.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching jobs by department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs by department',
      error: error.message
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats/overview
// @access  Public
export const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalApplications: { $sum: '$applications' }
        }
      }
    ]);
    
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Job.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$applications' }
        }
      }
    ]);
    
    // Convert to object format
    const statsObject = {
      totalJobs,
      totalApplications: totalApplications[0]?.total || 0,
      'Draft': { count: 0, applications: 0 },
      'Active': { count: 0, applications: 0 },
      'Paused': { count: 0, applications: 0 },
      'Closed': { count: 0, applications: 0 },
      'Archived': { count: 0, applications: 0 }
    };
    
    stats.forEach(stat => {
      statsObject[stat._id] = {
        count: stat.count,
        applications: stat.totalApplications
      };
    });
    
    res.status(200).json({
      success: true,
      message: 'Job statistics retrieved successfully',
      data: statsObject
    });
  } catch (error) {
    console.error('Error fetching job statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job statistics',
      error: error.message
    });
  }
};

// @desc    Get departments list
// @route   GET /api/jobs/departments
// @access  Public
export const getDepartments = async (req, res) => {
  try {
    const departments = await Job.distinct('department');
    
    res.status(200).json({
      success: true,
      message: 'Departments retrieved successfully',
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

// @desc    Close job posting
// @route   PATCH /api/jobs/:id/close
// @access  Public
export const closeJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed' },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job closed successfully',
      data: job
    });
  } catch (error) {
    console.error('Error closing job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close job',
      error: error.message
    });
  }
};

// @desc    Reopen job posting
// @route   PATCH /api/jobs/:id/reopen
// @access  Public
export const reopenJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'Active' },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Job reopened successfully',
      data: job
    });
  } catch (error) {
    console.error('Error reopening job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reopen job',
      error: error.message
    });
  }
};

// @desc    Duplicate job
// @route   POST /api/jobs/:id/duplicate
// @access  Public
export const duplicateJob = async (req, res) => {
  try {
    const originalJob = await Job.findById(req.params.id);
    
    if (!originalJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Create a new job with the same data but reset some fields
    const jobData = originalJob.toObject();
    delete jobData._id;
    delete jobData.createdAt;
    delete jobData.updatedAt;
    delete jobData.applications;
    
    // Modify the title to indicate it's a copy
    jobData.title = `${jobData.title} (Copy)`;
    jobData.status = 'Draft';
    jobData.postedDate = new Date();
    
    const newJob = new Job(jobData);
    await newJob.save();
    
    res.status(201).json({
      success: true,
      message: 'Job duplicated successfully',
      data: newJob
    });
  } catch (error) {
    console.error('Error duplicating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate job',
      error: error.message
    });
  }
}; 