import { useEffect, useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, MapPin, Briefcase, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { candidatesAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import CandidateModal from '../components/CandidateModal';
import { Link } from 'react-router-dom';

interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone: string;
  currentPosition: string;
  currentCompany: string;
  yearsOfExperience: number;
  status: string;
  expectedSalary: number;
  currentSalary: number;
  skills: string[];
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
    zipCode: string;
  };
  availableStartDate: Date | null;
  noticePeriod: string;
  linkedinUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  score: number;
  appliedDate: string;
  source: string;
  tags: string[];
  willingToRelocate: boolean;
  requiresVisa: boolean;
  consentToDataProcessing: boolean;
  files?: { name: string }[];
}

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [candidateModalMode, setCandidateModalMode] = useState<'add' | 'edit'>('add');
  const { showToast } = useToast();

  const statusOptions = [
    'All',
    'New Application',
    'Under Review',
    'Interview Scheduled',
    'Offer Extended',
    'Hired',
    'Rejected'
  ];

  useEffect(() => {
    fetchCandidates();
  }, [searchTerm, statusFilter, currentPage]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: any = {
        page: currentPage,
        limit: 10
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (statusFilter && statusFilter !== 'All') {
        params.status = statusFilter;
      }
      
      const response = await candidatesAPI.getAll(params);
      const data = response.data || response;
      
      setCandidates(data.candidates || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCandidates(data.pagination?.totalCandidates || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidates');
      showToast('error', 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleAddCandidate = () => {
    setEditingCandidate(null);
    setCandidateModalMode('add');
    setShowCandidateModal(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setCandidateModalMode('edit');
    setShowCandidateModal(true);
  };

  const handleSaveCandidate = async (candidateData: any) => {
    try {
      // Transform frontend field names to match backend validation expectations
      const transformedData = {
        ...candidateData,
        position: candidateData.currentPosition, // Map currentPosition to position
        experience: candidateData.yearsOfExperience?.toString() || '0', // Map yearsOfExperience to experience as string
        location: candidateData.location?.city || '', // Map location object to location string for validation
        // Format dates properly for backend
        availableStartDate: candidateData.availableStartDate ? candidateData.availableStartDate.toISOString() : null,
        // Ensure work history dates are properly formatted if they exist
        workHistory: candidateData.workHistory?.map((job: any) => ({
          ...job,
          startDate: job.startDate ? new Date(job.startDate).toISOString() : job.startDate,
          endDate: job.endDate ? new Date(job.endDate).toISOString() : job.endDate
        })) || [],
        // Ensure education dates are properly formatted if they exist
        education: candidateData.education?.map((edu: any) => ({
          ...edu,
          startDate: edu.startDate ? new Date(edu.startDate).toISOString() : edu.startDate,
          endDate: edu.endDate ? new Date(edu.endDate).toISOString() : edu.endDate
        })) || []
      };

      if (candidateModalMode === 'add') {
        await candidatesAPI.create(transformedData);
        showToast('success', 'Candidate created successfully');
      } else if (editingCandidate) {
        await candidatesAPI.update(editingCandidate._id, transformedData);
        showToast('success', 'Candidate updated successfully');
      }
      setShowCandidateModal(false);
      fetchCandidates();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save candidate');
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidatesAPI.delete(candidateId);
        showToast('success', 'Candidate deleted successfully');
        fetchCandidates();
      } catch (err: any) {
        showToast('error', 'Failed to delete candidate');
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'New Application': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-yellow-100 text-yellow-800',
      'Interview Scheduled': 'bg-purple-100 text-purple-800',
      'Offer Extended': 'bg-orange-100 text-orange-800',
      'Hired': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  if (loading && candidates.length === 0) {
    return (
      <DashboardLayout activeItem="Candidates">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Candidates">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600">Manage and track all job candidates</p>
          </div>
          <button
            onClick={handleAddCandidate}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Candidate</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search candidates by name, email, position, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Status Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Candidates List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => {
                  // Inject mock files for design completeness if none exist
                  const files = candidate.files && candidate.files.length > 0 ? candidate.files : [
                    { name: 'Cover_letter.pdf' },
                    { name: 'My_resume.pdf' },
                    { name: 'Oct_payslip.pdf' },
                    { name: 'Oct_payslip.pdf' }
                  ];
                  return (
                    <tr key={candidate._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/candidates/${candidate._id}` }>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail size={14} className="mr-1" />
                              {candidate.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone size={14} className="mr-1" />
                              {candidate.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.currentPosition}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Briefcase size={14} className="mr-1" />
                          {candidate.currentCompany}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {candidate.location?.city || 'N/A'}{candidate.location?.state ? `, ${candidate.location.state}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.yearsOfExperience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatSalary(candidate.expectedSalary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(candidate.appliedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center">
                            <span className="text-xs font-bold text-green-600">{candidate.score}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCandidate(candidate);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCandidate(candidate._id);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {candidates.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg font-medium">No candidates found</div>
              <div className="text-gray-500 text-sm mt-2">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first candidate'
                }
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow px-6 py-3">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCandidates)} of {totalCandidates} candidates
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      <CandidateModal
        isOpen={showCandidateModal}
        onClose={() => setShowCandidateModal(false)}
        candidate={editingCandidate}
        onSave={handleSaveCandidate}
        mode={candidateModalMode}
      />
    </DashboardLayout>
  );
};

export default Candidates;
