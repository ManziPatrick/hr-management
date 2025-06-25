import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
  updateCandidateScore,
  getCandidatesByStatus,
  getCandidateStats,
  addNote,
  getNotes,
  uploadFile,
  getFiles
} from '../controllers/candidateController.js';
import {
  validateCandidate,
  validateId,
  validateSearch
} from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/candidates/stats/overview
// @desc    Get candidate statistics
// @access  Public
// Note: This route must come before /:id to avoid conflicts
router.get('/stats/overview', getCandidateStats);

// @route   GET /api/candidates/status/:status
// @desc    Get candidates by status
// @access  Public
// Note: This route must come before /:id to avoid conflicts
router.get('/status/:status', validateSearch, getCandidatesByStatus);

// @route   GET /api/candidates
// @desc    Get all candidates with search and filtering
// @access  Public
router.get('/', validateSearch, getCandidates);

// @route   GET /api/candidates/:id
// @desc    Get candidate by ID
// @access  Public
router.get('/:id', validateId, getCandidateById);

// @route   GET /api/candidates/:id/notes
// @desc    Get candidate notes
// @access  Public
router.get('/:id/notes', validateId, getNotes);

// @route   GET /api/candidates/:id/files
// @desc    Get candidate files
// @access  Public
router.get('/:id/files', validateId, getFiles);

// @route   POST /api/candidates
// @desc    Create new candidate
// @access  Public
router.post('/', validateCandidate, createCandidate);

// @route   POST /api/candidates/:id/notes
// @desc    Add note to candidate
// @access  Public
router.post('/:id/notes', validateId, addNote);

// @route   POST /api/candidates/:id/files
// @desc    Upload file for candidate
// @access  Public
router.post('/:id/files', validateId, uploadFile);

// @route   PUT /api/candidates/:id
// @desc    Update candidate (full update)
// @access  Public
router.put('/:id', validateId, validateCandidate, updateCandidate);

// @route   PATCH /api/candidates/:id/status
// @desc    Update candidate status
// @access  Public
router.patch('/:id/status', validateId, updateCandidateStatus);

// @route   PATCH /api/candidates/:id/score
// @desc    Update candidate score
// @access  Public
router.patch('/:id/score', validateId, updateCandidateScore);

// @route   DELETE /api/candidates/:id
// @desc    Delete candidate
// @access  Public
router.delete('/:id', validateId, deleteCandidate);

export default router;