import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    required: [true, 'Job type is required']
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Paused', 'Closed', 'Archived'],
    default: 'Draft'
  },
  applications: {
    type: Number,
    default: 0,
    min: [0, 'Applications count cannot be negative']
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  // Additional fields for comprehensive job information
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [5000, 'Job description cannot exceed 5000 characters']
  },
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each requirement cannot exceed 200 characters']
  }],
  responsibilities: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each responsibility cannot exceed 200 characters']
  }],
  benefits: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each benefit cannot exceed 200 characters']
  }],
  salary: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  experience: {
    min: {
      type: Number,
      min: [0, 'Minimum experience cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum experience cannot be negative']
    },
    unit: {
      type: String,
      enum: ['years', 'months'],
      default: 'years'
    }
  },
  education: {
    type: String,
    enum: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Any'],
    default: 'Any'
  },
  skills: [{
    type: String,
    trim: true
  }],
  remote: {
    type: Boolean,
    default: false
  },
  travel: {
    type: String,
    enum: ['None', 'Occasional', 'Frequent', 'Extensive'],
    default: 'None'
  },
  contractDuration: {
    type: String,
    trim: true
  },
  applicationDeadline: {
    type: Date
  },
  hiringManager: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isUrgent: {
    type: Boolean,
    default: false
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Internal notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted salary range
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salary || !this.salary.min) return 'Not specified';
  
  const currency = this.salary.currency || 'USD';
  const period = this.salary.period || 'yearly';
  
  if (this.salary.max && this.salary.max > this.salary.min) {
    return `${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()} ${currency}/${period}`;
  }
  
  return `${this.salary.min.toLocaleString()} ${currency}/${period}`;
});

// Virtual for experience range
jobSchema.virtual('experienceRange').get(function() {
  if (!this.experience || !this.experience.min) return 'Not specified';
  
  const unit = this.experience.unit || 'years';
  
  if (this.experience.max && this.experience.max > this.experience.min) {
    return `${this.experience.min} - ${this.experience.max} ${unit}`;
  }
  
  return `${this.experience.min}+ ${unit}`;
});

// Index for better search performance
jobSchema.index({ title: 'text', description: 'text', requirements: 'text', skills: 'text' });

// Pre-save middleware to update posted date if status changes to Active
jobSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Active' && !this.postedDate) {
    this.postedDate = new Date();
  }
  next();
});

// Static method to get active jobs
jobSchema.statics.getActiveJobs = function() {
  return this.find({ status: 'Active' });
};

// Static method to get jobs by department
jobSchema.statics.getByDepartment = function(department) {
  return this.find({ department });
};

// Instance method to increment applications count
jobSchema.methods.incrementApplications = function() {
  this.applications += 1;
  return this.save();
};

// Instance method to update status
jobSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

const Job = mongoose.model('Job', jobSchema);

export default Job; 