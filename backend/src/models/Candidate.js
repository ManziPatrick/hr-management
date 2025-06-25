import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'system'
  }
});

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  type: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: String,
    default: 'system'
  }
});

const workHistorySchema = new mongoose.Schema({
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  description: {
    type: String
  },
  responsibilities: [{
    type: String
  }],
  isCurrent: {
    type: Boolean,
    default: false
  }
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  gpa: {
    type: Number
  },
  fieldOfStudy: {
    type: String
  }
});

const evaluationSchema = new mongoose.Schema({
  evaluator: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  comments: {
    type: String
  },
  criteria: [{
    name: String,
    score: Number,
    weight: Number
  }],
  evaluatedAt: {
    type: Date,
    default: Date.now
  }
});

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Interview', 'Phone Call', 'Email', 'Meeting', 'Assessment', 'Other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number // in minutes
  },
  location: {
    type: String
  },
  attendees: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const messageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Email', 'SMS', 'Internal Note', 'Phone Call'],
    default: 'Internal Note'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['New Application', 'Under Review', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'],
    default: 'New Application'
  },
  
  // Professional Information
  currentPosition: {
    type: String,
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  expectedSalary: {
    type: Number,
    min: 0
  },
  currentSalary: {
    type: Number,
    min: 0
  },
  
  // Skills and Qualifications
  skills: [{
    type: String,
    trim: true
  }],
  certifications: [{
    name: String,
    issuer: String,
    dateIssued: String,
    expiryDate: String
  }],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
    }
  }],
  
  // Location Information
  location: {
    city: String,
    state: String,
    country: String,
    address: String,
    zipCode: String
  },
  
  // Availability
  availableStartDate: {
    type: Date
  },
  noticePeriod: {
    type: String // e.g., "2 weeks", "1 month"
  },
  
  // Social Links
  linkedinUrl: {
    type: String,
    trim: true
  },
  portfolioUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  
  // Assessment and Scoring
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 75
  },
  
  // Related Data
  workHistory: [workHistorySchema],
  education: [educationSchema],
  evaluations: [evaluationSchema],
  events: [eventSchema],
  messages: [messageSchema],
  files: [fileSchema],
  notes: [noteSchema],
  
  // Application Information
  appliedDate: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String, // e.g., "LinkedIn", "Job Board", "Referral", "Direct Application"
    trim: true
  },
  jobTitle: {
    type: String, // Position they applied for
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  
  // Interview Information
  interviewRounds: [{
    round: String,
    type: String, // "Phone", "Technical", "HR", "Final"
    scheduledDate: Date,
    completedDate: Date,
    interviewer: String,
    feedback: String,
    score: Number,
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
      default: 'Scheduled'
    }
  }],
  
  // References
  references: [{
    name: String,
    company: String,
    position: String,
    email: String,
    phone: String,
    relationship: String, // "Manager", "Colleague", "Client", etc.
    contacted: {
      type: Boolean,
      default: false
    },
    feedback: String
  }],
  
  // Additional Information
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  requiresVisa: {
    type: Boolean,
    default: false
  },
  backgroundCheckStatus: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Failed'],
    default: 'Not Started'
  },
  
  // Metadata
  createdBy: {
    type: String,
    default: 'system'
  },
  updatedBy: {
    type: String,
    default: 'system'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Privacy and Consent
  consentToDataProcessing: {
    type: Boolean,
    default: false
  },
  consentDate: {
    type: Date
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Clean up the returned object
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better query performance
candidateSchema.index({ email: 1 }, { unique: true });
candidateSchema.index({ name: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ appliedDate: -1 });
candidateSchema.index({ score: -1 });
candidateSchema.index({ 'workHistory.position': 1 });
candidateSchema.index({ 'workHistory.company': 1 });
candidateSchema.index({ skills: 1 });

// Text index for search functionality
candidateSchema.index({
  name: 'text',
  email: 'text',
  'workHistory.position': 'text',
  'workHistory.company': 'text',
  skills: 'text',
  currentPosition: 'text',
  currentCompany: 'text'
});

// Virtual for full name (if you want to split first/last name later)
candidateSchema.virtual('initials').get(function() {
  return this.name ? this.name.split(' ').map(n => n[0]).join('') : '?';
});

// Virtual for years of experience calculation
candidateSchema.virtual('calculatedExperience').get(function() {
  if (this.workHistory && this.workHistory.length > 0) {
    // Calculate total years from work history
    let totalMonths = 0;
    this.workHistory.forEach(job => {
      const startDate = new Date(job.startDate);
      const endDate = job.endDate ? new Date(job.endDate) : new Date();
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      totalMonths += months;
    });
    return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal
  }
  return this.yearsOfExperience || 0;
});

// Virtual for current work status
candidateSchema.virtual('isCurrentlyEmployed').get(function() {
  if (this.workHistory && this.workHistory.length > 0) {
    return this.workHistory.some(job => job.isCurrent || !job.endDate);
  }
  return false;
});

// Virtual for latest position
candidateSchema.virtual('latestPosition').get(function() {
  if (this.workHistory && this.workHistory.length > 0) {
    // Sort by start date and get the most recent
    const sorted = this.workHistory.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    return sorted[0];
  }
  return null;
});

// Pre-save middleware
candidateSchema.pre('save', function(next) {
  // Update the updatedAt timestamp
  this.updatedAt = new Date();
  
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Update yearsOfExperience based on work history if not provided
  if (!this.yearsOfExperience && this.workHistory && this.workHistory.length > 0) {
    this.yearsOfExperience = this.calculatedExperience;
  }
  
  next();
});

// Static methods
candidateSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

candidateSchema.statics.searchCandidates = function(searchTerm) {
  return this.find({
    $text: { $search: searchTerm }
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore' }
  });
};

candidateSchema.statics.getStatusCounts = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance methods
candidateSchema.methods.addNote = function(content, createdBy = 'system') {
  if (!this.notes) {
    this.notes = [];
  }
  this.notes.push({
    content,
    createdBy,
    createdAt: new Date()
  });
  return this.save();
};

candidateSchema.methods.updateScore = function(newScore) {
  this.score = newScore;
  return this.save();
};

candidateSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

candidateSchema.methods.addWorkExperience = function(experience) {
  if (!this.workHistory) {
    this.workHistory = [];
  }
  this.workHistory.push(experience);
  return this.save();
};

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;