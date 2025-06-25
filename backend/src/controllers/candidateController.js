import Candidate from '../models/Candidate.js';

// @desc    Get all candidates with search and filtering
// @route   GET /api/candidates
// @access  Public
export const getCandidates = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    // Search functionality - search across multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'workHistory.position': { $regex: search, $options: 'i' } },
        { 'workHistory.company': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const candidates = await Candidate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Candidate.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Candidates retrieved successfully',
      data: {
        candidates,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCandidates: total,
          hasNextPage: skip + candidates.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates',
      error: error.message
    });
  }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Public
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    // Return candidate directly to match frontend expectations
    res.status(200).json({
      success: true,
      message: 'Candidate retrieved successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate',
      error: error.message
    });
  }
};

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Public
export const createCandidate = async (req, res) => {
  try {
    // Initialize default values to match frontend expectations
    const candidateData = {
      ...req.body,
      score: req.body.score || 75,
      status: req.body.status || 'New Application',
      files: req.body.files || [],
      workHistory: req.body.workHistory || [],
      education: req.body.education || [],
      evaluations: req.body.evaluations || [],
      events: req.body.events || [],
      messages: req.body.messages || []
    };
    
    // Handle notes field - if it's a string, convert it to proper format
    if (candidateData.notes && typeof candidateData.notes === 'string') {
      candidateData.notes = [{
        content: candidateData.notes,
        createdAt: new Date(),
        createdBy: 'system'
      }];
    }
    
    const candidate = new Candidate(candidateData);
    await candidate.save();
    
    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        success: false,
        message: 'A candidate with this email already exists'
      });
    }
    
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
      message: 'Failed to create candidate',
      error: error.message
    });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Public
export const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        success: false,
        message: 'A candidate with this email already exists'
      });
    }
    
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
      message: 'Failed to update candidate',
      error: error.message
    });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Public
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete candidate',
      error: error.message
    });
  }
};

// @desc    Update candidate status
// @route   PATCH /api/candidates/:id/status
// @access  Public
export const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['New Application', 'Under Review', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        validStatuses
      });
    }
    
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Candidate status updated successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate status',
      error: error.message
    });
  }
};

// @desc    Update candidate score
// @route   PATCH /api/candidates/:id/score
// @access  Public
export const updateCandidateScore = async (req, res) => {
  try {
    const { score } = req.body;
    
    if (score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        message: 'Score is required'
      });
    }
    
    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 0 and 100'
      });
    }
    
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { score, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Candidate score updated successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Error updating candidate score:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate score',
      error: error.message
    });
  }
};

// @desc    Get candidates by status
// @route   GET /api/candidates/status/:status
// @access  Public
export const getCandidatesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const validStatuses = ['New Application', 'Under Review', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        validStatuses
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const candidates = await Candidate.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Candidate.countDocuments({ status });
    
    res.status(200).json({
      success: true,
      message: `Candidates with status '${status}' retrieved successfully`,
      data: {
        candidates,
        status,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCandidates: total,
          hasNextPage: skip + candidates.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching candidates by status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates by status',
      error: error.message
    });
  }
};

// @desc    Get candidate statistics
// @route   GET /api/candidates/stats/overview
// @access  Public
export const getCandidateStats = async (req, res) => {
  try {
    const stats = await Candidate.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalCandidates = await Candidate.countDocuments();
    
    // Convert to object format
    const statsObject = {
      total: totalCandidates,
      'New Application': 0,
      'Under Review': 0,
      'Interview Scheduled': 0,
      'Offer Extended': 0,
      'Hired': 0,
      'Rejected': 0
    };
    
    stats.forEach(stat => {
      if (stat._id) {
        statsObject[stat._id] = stat.count;
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Candidate statistics retrieved successfully',
      data: statsObject
    });
  } catch (error) {
    console.error('Error fetching candidate statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate statistics',
      error: error.message
    });
  }
};

// @desc    Add note to candidate
// @route   POST /api/candidates/:id/notes
// @access  Public
export const addNote = async (req, res) => {
  try {
    const { note, content } = req.body;
    const noteContent = note || content;
    
    if (!noteContent) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }
    
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    // Initialize notes array if it doesn't exist
    if (!candidate.notes) {
      candidate.notes = [];
    }
    
    // Add new note
    const newNote = {
      content: noteContent,
      createdAt: new Date(),
      createdBy: req.user?.id || req.user?.name || 'system'
    };
    
    candidate.notes.push(newNote);
    candidate.updatedAt = new Date();
    
    await candidate.save();
    
    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: {
        candidate,
        note: newNote
      }
    });
  } catch (error) {
    console.error('Error adding note:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};

// @desc    Get candidate notes
// @route   GET /api/candidates/:id/notes
// @access  Public
export const getNotes = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select('notes');
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: candidate.notes || []
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: error.message
    });
  }
};

// @desc    Upload file for candidate
// @route   POST /api/candidates/:id/files
// @access  Public
export const uploadFile = async (req, res) => {
  try {
    const { fileName, fileUrl, fileType } = req.body;
    
    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'File name is required'
      });
    }
    
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    // Initialize files array if it doesn't exist
    if (!candidate.files) {
      candidate.files = [];
    }
    
    // Add new file
    const newFile = {
      name: fileName,
      url: fileUrl,
      type: fileType,
      uploadedAt: new Date(),
      uploadedBy: req.user?.id || req.user?.name || 'system'
    };
    
    candidate.files.push(newFile);
    candidate.updatedAt = new Date();
    
    await candidate.save();
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        candidate,
        file: newFile
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// @desc    Get candidate files
// @route   GET /api/candidates/:id/files
// @access  Public
export const getFiles = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select('files');
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Files retrieved successfully',
      data: candidate.files || []
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files',
      error: error.message
    });
  }
};