import { body, param, query, validationResult } from 'express-validator';

// Helper function to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Candidate validation rules
export const validateCandidate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[0-9\s\-\(\)]{7,15}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('currentPosition')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ max: 100 })
    .withMessage('Position cannot exceed 100 characters'),
  
  body('currentCompany')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ max: 100 })
    .withMessage('Company cannot exceed 100 characters'),
  
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),
  
  body('yearsOfExperience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Experience must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['New Application', 'Under Review', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'])
    .withMessage('Invalid status value'),
  
  body('avatar')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Avatar initials cannot exceed 10 characters'),
  
  body('resume')
    .optional()
    .isURL()
    .withMessage('Resume must be a valid URL'),
  
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter cannot exceed 2000 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill cannot be empty'),
  
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  
  body('education.*.degree')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Degree is required'),
  
  body('education.*.institution')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Institution is required'),
  
  body('education.*.year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year must be a valid year'),
  
  body('workHistory')
    .optional()
    .isArray()
    .withMessage('Work history must be an array'),
  
  body('workHistory.*.company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company is required'),
  
  body('workHistory.*.position')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Position is required'),
  
  body('workHistory.*.startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('workHistory.*.endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary cannot be negative'),
  
  body('availability')
    .optional()
    .isIn(['Immediate', '2 weeks', '1 month', '3 months', 'Flexible'])
    .withMessage('Invalid availability value'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tag cannot be empty'),
  
  body('source')
    .optional()
    .isIn(['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Other'])
    .withMessage('Invalid source value'),
  
  handleValidationErrors
];

// Job validation rules
export const validateJob = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),
  
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ max: 50 })
    .withMessage('Department cannot exceed 50 characters'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  
  body('type')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'])
    .withMessage('Invalid job type'),
  
  body('status')
    .optional()
    .isIn(['Draft', 'Active', 'Paused', 'Closed', 'Archived'])
    .withMessage('Invalid status value'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ max: 5000 })
    .withMessage('Job description cannot exceed 5000 characters'),
  
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),
  
  body('requirements.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Requirement cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Each requirement cannot exceed 200 characters'),
  
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array'),
  
  body('responsibilities.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Responsibility cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Each responsibility cannot exceed 200 characters'),
  
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array'),
  
  body('benefits.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Benefit cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Each benefit cannot exceed 200 characters'),
  
  body('salary.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary cannot be negative'),
  
  body('salary.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary cannot be negative'),
  
  body('salary.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Invalid currency'),
  
  body('salary.period')
    .optional()
    .isIn(['hourly', 'monthly', 'yearly'])
    .withMessage('Invalid salary period'),
  
  body('experience.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum experience cannot be negative'),
  
  body('experience.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum experience cannot be negative'),
  
  body('experience.unit')
    .optional()
    .isIn(['years', 'months'])
    .withMessage('Invalid experience unit'),
  
  body('education')
    .optional()
    .isIn(['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Any'])
    .withMessage('Invalid education level'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill cannot be empty'),
  
  body('remote')
    .optional()
    .isBoolean()
    .withMessage('Remote must be a boolean'),
  
  body('travel')
    .optional()
    .isIn(['None', 'Occasional', 'Frequent', 'Extensive'])
    .withMessage('Invalid travel requirement'),
  
  body('contractDuration')
    .optional()
    .trim()
    .custom((value) => {
      // Allow empty string or valid contract duration
      if (value === '' || value === null || value === undefined) {
        return true;
      }
      return value.length > 0;
    })
    .withMessage('Contract duration cannot be empty'),
  
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Application deadline must be a valid date'),
  
  body('hiringManager.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Hiring manager name cannot be empty'),
  
  body('hiringManager.email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Hiring manager email must be valid')
    .normalizeEmail(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tag cannot be empty'),
  
  body('isUrgent')
    .optional()
    .isBoolean()
    .withMessage('Is urgent must be a boolean'),
  
  body('internalNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Internal notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

// ID validation for both candidates and jobs
export const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

// Search and filter validation
export const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term cannot be empty'),
  
  query('status')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Status cannot be empty'),
  
  query('department')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Department cannot be empty'),
  
  query('type')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Type cannot be empty'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
]; 