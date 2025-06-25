import { useState, useEffect } from 'react';
import { X, Save, Briefcase, MapPin, DollarSign, Calendar, Users, FileText } from 'lucide-react';

interface Job {
  _id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  applications: number;
  postedDate: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  experience: {
    min: number;
    max: number;
    unit: string;
  };
  education: string;
  skills: string[];
  remote: boolean;
  travel: string;
  contractDuration: string;
  applicationDeadline: string;
  hiringManager: {
    name: string;
    email: string;
  };
  tags: string[];
  isUrgent: boolean;
  internalNotes: string;
}

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job | null;
  onSave: (job: Job) => Promise<void>;
  mode: 'add' | 'edit';
}

const JobModal = ({ isOpen, onClose, job, onSave, mode }: JobModalProps) => {
  const [formData, setFormData] = useState<Job>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'Active',
    applications: 0,
    postedDate: new Date().toISOString().split('T')[0],
    description: '',
    requirements: [],
    responsibilities: [],
    benefits: [],
    salary: {
      min: 0,
      max: 0,
      currency: 'USD',
      period: 'yearly'
    },
    experience: {
      min: 0,
      max: 0,
      unit: 'years'
    },
    education: 'Bachelor',
    skills: [],
    remote: false,
    travel: 'None',
    contractDuration: '',
    applicationDeadline: '',
    hiringManager: {
      name: '',
      email: ''
    },
    tags: [],
    isUrgent: false,
    internalNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departmentOptions = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Analytics',
    'Operations',
    'Finance',
    'HR',
    'Legal'
  ];

  const typeOptions = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
  ];

  const statusOptions = [
    'Active',
    'Draft',
    'Closed',
    'On Hold'
  ];

  const educationOptions = [
    'High School',
    'Associate',
    'Bachelor',
    'Master',
    'PhD',
    'Other'
  ];

  const travelOptions = [
    'None',
    'Occasional',
    'Frequent',
    'Extensive'
  ];

  useEffect(() => {
    if (job && mode === 'edit') {
      setFormData(job);
    } else {
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        status: 'Active',
        applications: 0,
        postedDate: new Date().toISOString().split('T')[0],
        description: '',
        requirements: [],
        responsibilities: [],
        benefits: [],
        salary: {
          min: 0,
          max: 0,
          currency: 'USD',
          period: 'yearly'
        },
        experience: {
          min: 0,
          max: 0,
          unit: 'years'
        },
        education: 'Bachelor',
        skills: [],
        remote: false,
        travel: 'None',
        contractDuration: '',
        applicationDeadline: '',
        hiringManager: {
          name: '',
          email: ''
        },
        tags: [],
        isUrgent: false,
        internalNotes: ''
      });
    }
  }, [job, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSalaryChange = (field: 'min' | 'max', value: string) => {
    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleExperienceChange = (field: 'min' | 'max', value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleArrayFieldChange = (field: 'requirements' | 'responsibilities' | 'benefits' | 'skills' | 'tags', value: string) => {
    const array = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      // Handle backend validation errors
      if (error.message && error.message.includes('Validation failed')) {
        setError('Please check all required fields and ensure data is valid');
      } else {
        setError(error.message || 'Failed to save job');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Create New Job' : 'Edit Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase size={16} className="inline mr-2" />
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {typeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Required
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {educationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Salary and Experience */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary & Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Salary Range (Min)
                </label>
                <input
                  type="number"
                  value={formData.salary.min}
                  onChange={(e) => handleSalaryChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Salary Range (Max)
                </label>
                <input
                  type="number"
                  value={formData.salary.max}
                  onChange={(e) => handleSalaryChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users size={16} className="inline mr-2" />
                  Experience (Min Years)
                </label>
                <input
                  type="number"
                  value={formData.experience.min}
                  onChange={(e) => handleExperienceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users size={16} className="inline mr-2" />
                  Experience (Max Years)
                </label>
                <input
                  type="number"
                  value={formData.experience.max}
                  onChange={(e) => handleExperienceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Work Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="remote"
                    checked={formData.remote}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Remote Work Available</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isUrgent"
                    checked={formData.isUrgent}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Urgent Hire</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Requirements
                </label>
                <select
                  name="travel"
                  value={formData.travel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {travelOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Hiring Manager */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hiring Manager</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.hiringManager.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hiringManager: { ...prev.hiringManager, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.hiringManager.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hiringManager: { ...prev.hiringManager, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Requirements, Responsibilities, Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                value={formData.requirements.join('\n')}
                onChange={(e) => handleArrayFieldChange('requirements', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities (one per line)
              </label>
              <textarea
                value={formData.responsibilities.join('\n')}
                onChange={(e) => handleArrayFieldChange('responsibilities', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (one per line)
              </label>
              <textarea
                value={formData.benefits.join('\n')}
                onChange={(e) => handleArrayFieldChange('benefits', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Skills and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills (one per line)
              </label>
              <textarea
                value={formData.skills.join('\n')}
                onChange={(e) => handleArrayFieldChange('skills', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (one per line)
              </label>
              <textarea
                value={formData.tags.join('\n')}
                onChange={(e) => handleArrayFieldChange('tags', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internal Notes
            </label>
            <textarea
              name="internalNotes"
              value={formData.internalNotes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Internal notes for HR team..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : (mode === 'add' ? 'Create Job' : 'Update Job')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal; 