import { useState, useEffect } from 'react';
import { 
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Copy,
  Archive,
  Play
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { jobsAPI } from '../services/api';
import JobModal from '../components/JobModal';
import { useToast } from '../contexts/ToastContext';

interface Job {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Get unique values for filters
  const departments = [...new Set(jobs.map(j => j.department))];
  const types = [...new Set(jobs.map(j => j.type))];
  const locations = [...new Set(jobs.map(j => j.location))];
  const statuses = ['Active', 'Draft', 'Closed', 'On Hold'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter, departmentFilter, typeFilter, locationFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAll();
      // Backend returns { success: true, data: { jobs: [...] } }
      const jobsData = response.data?.jobs || response.jobs || response || [];
      setJobs(jobsData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(job => job.department === departmentFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(job => job.location === locationFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      setDeletingId(id);
      await jobsAPI.delete(id);
      setJobs(jobs.filter(j => j._id !== id));
      showToast('success', 'Job deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete job');
      showToast('error', err.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveJob = async (jobData: any) => {
    try {
      if (modalMode === 'add') {
        const response = await jobsAPI.create(jobData);
        const newJob = response.data || response;
        setJobs([newJob, ...jobs]);
        showToast('success', 'Job created successfully');
      } else if (editingJob) {
        const response = await jobsAPI.update(editingJob._id, jobData);
        const updatedJob = response.data || response;
        setJobs(jobs.map(j => j._id === editingJob._id ? updatedJob : j));
        showToast('success', 'Job updated successfully');
      }
      setShowModal(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save job');
    }
  };

  const handleDuplicateJob = async (id: string) => {
    try {
      const duplicatedJob = await jobsAPI.duplicate(id);
      setJobs([duplicatedJob, ...jobs]);
      showToast('success', 'Job duplicated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to duplicate job');
      showToast('error', err.message || 'Failed to duplicate job');
    }
  };

  const handleCloseJob = async (id: string) => {
    try {
      await jobsAPI.closeJob(id);
      setJobs(jobs.map(j => j._id === id ? { ...j, status: 'Closed' } : j));
      showToast('success', 'Job closed successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to close job');
      showToast('error', err.message || 'Failed to close job');
    }
  };

  const handleReopenJob = async (id: string) => {
    try {
      await jobsAPI.reopenJob(id);
      setJobs(jobs.map(j => j._id === id ? { ...j, status: 'Active' } : j));
      showToast('success', 'Job reopened successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to reopen job');
      showToast('error', err.message || 'Failed to reopen job');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Draft': 'bg-gray-100 text-gray-800',
      'Closed': 'bg-red-100 text-red-800',
      'On Hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary: { min: number; max: number; currency: string; period: string }) => {
    if (salary.min === 0 && salary.max === 0) return 'Not specified';
    const min = salary.min.toLocaleString();
    const max = salary.max.toLocaleString();
    return `$${min} - $${max} ${salary.period}`;
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="Jobs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Jobs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
            <p className="text-gray-600 mt-1">Manage your job openings and applications</p>
          </div>
          <button
            onClick={handleAddJob}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Create Job</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Jobs ({filteredJobs.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm">Job Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Type</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Applications</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{job.department}</td>
                    <td className="py-4 px-4 text-gray-700">{job.location}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700 font-medium">{job.applications}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleEditJob(job)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit Job"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job._id)}
                          disabled={deletingId === job._id}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Job Modal */}
      <JobModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        job={editingJob}
        onSave={handleSaveJob}
        mode={modalMode}
      />
    </DashboardLayout>
  );
};

export default Jobs;
