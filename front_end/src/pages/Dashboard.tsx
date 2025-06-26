import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar,
  Briefcase,
  UserCheck,
  CheckCircle,
  Clock,
  Plus,
  Info,
  TrendingUp,
  MapPin,
  DollarSign,
  Eye,
  UserPlus,
  FileText,
  XCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { candidatesAPI, jobsAPI } from '../services/api';
import CandidateModal from '../components/CandidateModal';
import JobModal from '../components/JobModal';
import { useToast } from '../contexts/ToastContext';
import interviewIm from '../image/nterview.png'
import FeedbackI from '../image/Feedback.png'
import ApprovalI from '../image/Approval.png'
import AcceptanceI from '../image/Acceptance.png'
import DocumentationsI from '../image/documentation.png'
import TrainingI from '../image/Training.png'
import SupervisorI from '../image/Illustrations.png'
import ProjectI from '../image/Project.png'

interface OverviewStat {
  icon: any;
  label: string;
  value: string;
  bgColor: string;
}

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
  location: {
    city: string;
    state: string;
    country: string;
  };
  skills: string[];
  score: number;
  appliedDate: string;
  source: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

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

interface JobData {
  _id: string;
  title: string;
  applications: number;
  interviewed: number;
  rejected: number;
  feedbackPending: number;
  offered: number;
  positionsLeft: number;
  postedDate: string;
}

interface UpcomingMeeting {
  id: string;
  title: string;
  candidate: string;
  date: string;
  time: string;
  type: string;
}

interface DashboardStats {
  totalCandidates: number;
  totalJobs: number;
  activeJobs: number;
  hiredThisMonth: number;
  applicationsThisMonth: number;
  interviewsScheduled: number;
  offersExtended: number;
  rejectedCandidates: number;
}

interface RecentJob {
  _id: string;
  title: string;
  department: string;
  applications: number;
  status: string;
  postedDate: string;
}

const Dashboard = () => {
  const [overviewStats, setOverviewStats] = useState<OverviewStat[]>([]);
  const [jobsData, setJobsData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  
  // Modal states
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [candidateModalMode, setCandidateModalMode] = useState<'add' | 'edit'>('add');
  const [jobModalMode, setJobModalMode] = useState<'add' | 'edit'>('add');
  const { showToast } = useToast();

  // Mock upcoming meetings data (since we don't have this in the backend yet)
  const upcomingMeetings: UpcomingMeeting[] = [
    {
      id: '1',
      title: 'Frontend Developer Interview',
      candidate: 'Sarah Johnson',
      date: 'Today',
      time: '10:00 AM',
      type: 'Technical Interview'
    },
    {
      id: '2',
      title: 'Product Manager Final Round',
      candidate: 'Michael Chen',
      date: 'Today',
      time: '2:00 PM',
      type: 'Final Interview'
    },
    {
      id: '3',
      title: 'UX Designer Portfolio Review',
      candidate: 'Emily Rodriguez',
      date: 'Tomorrow',
      time: '11:30 AM',
      type: 'Portfolio Review'
    }
  ];

  // Array of images corresponding to each overview stat
  const overviewImages = [
    interviewIm,      // Interview Scheduled
    FeedbackI,        // Interview Feedback Pending
    ApprovalI,        // Approval Pending
    AcceptanceI,      // Offer Acceptance Pending
    DocumentationsI,  // Documentations Pending
    TrainingI,        // Training Pending
    SupervisorI,      // Supervisor Allocation Pending
    ProjectI          // Project Allocation Pending
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch candidates stats
      const candidatesResponse = await candidatesAPI.getStats();
      const candidatesStats = candidatesResponse.data || candidatesResponse;
      
      // Fetch jobs data
      const jobsResponse = await jobsAPI.getAll();
      const jobs = jobsResponse.data?.jobs || jobsResponse.jobs || jobsResponse || [];
      
      // Fetch job stats
      const jobStatsResponse = await jobsAPI.getStats();
      const jobStats = jobStatsResponse.data || jobStatsResponse;
      
      // Calculate overview stats
      const stats: OverviewStat[] = [
        { icon: Users, label: 'Interview Scheduled', value: candidatesStats['Interview Scheduled']?.toString() || '0', bgColor: 'bg-blue-500' },
        { icon: Clock, label: 'Interview Feedback Pending', value: '2', bgColor: 'bg-orange-500' }, // This would come from a separate API
        { icon: CheckCircle, label: 'Approval Pending', value: '44', bgColor: 'bg-blue-500' }, // This would come from a separate API
        { icon: UserCheck, label: 'Offer Acceptance Pending', value: candidatesStats['Offer Extended']?.toString() || '0', bgColor: 'bg-gray-500' },
        { icon: Calendar, label: 'Documentations Pending', value: '17', bgColor: 'bg-blue-500' }, // This would come from a separate API
        { icon: Users, label: 'Training Pending', value: '3', bgColor: 'bg-purple-500' }, // This would come from a separate API
        { icon: Users, label: 'Supervisor Allocation Pending', value: '5', bgColor: 'bg-blue-500' }, // This would come from a separate API
        { icon: Briefcase, label: 'Project Allocation Pending', value: '56', bgColor: 'bg-blue-500' }, // This would come from a separate API
      ];
      
      setOverviewStats(stats);
      
      // Process jobs data for the table
      const processedJobs: JobData[] = jobs.slice(0, 5).map((job: any) => ({
        _id: job._id,
        title: job.title,
        applications: job.applications || 0,
        interviewed: Math.floor((job.applications || 0) * 0.3), // Mock calculation
        rejected: Math.floor((job.applications || 0) * 0.2), // Mock calculation
        feedbackPending: Math.floor((job.applications || 0) * 0.1), // Mock calculation
        offered: Math.floor((job.applications || 0) * 0.05), // Mock calculation
        positionsLeft: Math.floor(Math.random() * 10) + 1, // Mock calculation
        postedDate: job.postedDate || job.createdAt || new Date().toISOString()
      }));
      
      setJobsData(processedJobs);
      
      // Combine stats
      const combinedStats: DashboardStats = {
        totalCandidates: candidatesStats.total || 0,
        totalJobs: jobStats.totalJobs || 0,
        activeJobs: jobStats.Active?.count || 0,
        hiredThisMonth: candidatesStats.Hired || 0,
        applicationsThisMonth: jobStats.totalApplications || 0,
        interviewsScheduled: candidatesStats['Interview Scheduled'] || 0,
        offersExtended: candidatesStats['Offer Extended'] || 0,
        rejectedCandidates: candidatesStats.Rejected || 0
      };
      
      setStats(combinedStats);
      
      // Fetch recent jobs
      const recentJobsResponse = await jobsAPI.getAll({ limit: 5 });
      const recentJobsData = recentJobsResponse.data?.jobs || recentJobsResponse.jobs || recentJobsResponse || [];
      
      setRecentJobs(recentJobsData);
      
    } catch (error: any) {
      setError(error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCandidate = async (candidateData: any) => {
    try {
      if (candidateModalMode === 'add') {
        const response = await candidatesAPI.create(candidateData);
        const newCandidate = response.data || response;
        setRecentCandidates([newCandidate, ...recentCandidates.slice(0, 4)]);
        showToast('success', 'Candidate created successfully');
      } else if (editingCandidate) {
        const response = await candidatesAPI.update(editingCandidate._id, candidateData);
        const updatedCandidate = response.data || response;
        setRecentCandidates(recentCandidates.map(c => c._id === editingCandidate._id ? updatedCandidate : c));
        showToast('success', 'Candidate updated successfully');
      }
      setShowCandidateModal(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save candidate');
    }
  };

  const handleSaveJob = async (jobData: any) => {
    try {
      if (jobModalMode === 'add') {
        const response = await jobsAPI.create(jobData);
        const newJob = response.data || response;
        setRecentJobs([newJob, ...recentJobs.slice(0, 4)]);
        showToast('success', 'Job created successfully');
      } else if (editingJob) {
        const response = await jobsAPI.update(editingJob._id, jobData);
        const updatedJob = response.data || response;
        setRecentJobs(recentJobs.map(j => j._id === editingJob._id ? updatedJob : j));
        showToast('success', 'Job updated successfully');
      }
      setShowJobModal(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to save job');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  if (loading) {
    return (
      <DashboardLayout activeItem="Home">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="Home">
      <div className="flex space-x-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Overview Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowCandidateModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus size={16} />
                  <span>Add Candidate</span>
                </button>
                <button 
                  onClick={() => setShowJobModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Job</span>
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-4 gap-6 mb-6">
              {overviewStats.map((stat, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl shadow-sm border border-blue-100 flex flex-col items-center justify-between py-8 px-4"
                  style={{ minHeight: 200 }}
                >
                  {/* Number in rounded rectangle, slightly outside top-left */}
                  <div className="absolute -top-4 -left-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-white rounded-2xl border-2 border-blue-200 text-blue-900 text-2xl font-bold shadow">
                      {stat.value}
                    </div>
                  </div>
                  {/* Image on top */}
                  <img
                    src={overviewImages[index]}
                    alt={stat.label}
                    className="w-20 h-20 object-contain mb-4"
                  />
                  {/* Label below image */}
                  <div className="text-center text-base font-medium text-gray-800 leading-tight mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Require Attention Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Require Attention</h3>
              
              {/* Tabs */}
              <div className="flex space-x-8 mb-6">
                <button className="pb-2 border-b-2 border-orange-500 text-gray-900 font-medium">
                  Jobs
                </button>
                <button className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  Candidates
                </button>
                <button className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  Onboardings
                </button>
              </div>

              {/* Jobs Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-6 font-medium text-gray-500 text-sm w-1/4"></th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Positions Left</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Applications</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Interviewed</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Rejected</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Feedback Pending</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Offered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobsData.map((job: JobData) => (
                      <tr key={job._id} className="border-b border-gray-100">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Briefcase size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-500">
                                {Math.floor((Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-gray-700">{job.positionsLeft}</td>
                        <td className="py-4 px-4 text-center text-gray-700">{job.applications}</td>
                        <td className="py-4 px-4 text-center text-gray-700">{job.interviewed}</td>
                        <td className="py-4 px-4 text-center text-gray-700">{job.rejected}</td>
                        <td className="py-4 px-4 text-center text-gray-700">{job.feedbackPending}</td>
                        <td className="py-4 px-4 text-center font-bold text-gray-900">{job.offered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Upcoming Meetings */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
                <Info size={16} className="text-blue-500" />
              </div>
            </div>
            <div className="max-h-[800px] overflow-y-auto">
              {/* Group meetings by date */}
              {['Today', 'Tomorrow', 'This Week'].map((dateGroup) => (
                <div key={dateGroup}>
                  {/* Date header */}
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-700">{dateGroup}</div>
                  </div>
                  
                  {/* Meetings for this date */}
                  <div className="px-6 py-2">
                    {upcomingMeetings
                      .filter(meeting => meeting.date === dateGroup)
                      .map((meeting) => (
                        <div key={meeting.id} className={`flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0 ${
                          meeting.type === 'Final Interview' ? 'bg-green-50' : ''
                        }`}>
                          {/* Time */}
                          <div className="text-sm font-medium text-gray-900 w-12">
                            {meeting.time}
                          </div>
                          
                          {/* Profile circle */}
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                              {meeting.candidate.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          
                          {/* Meeting details */}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{meeting.title}</div>
                            <div className="text-gray-500 text-xs truncate">{meeting.type}</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CandidateModal
        isOpen={showCandidateModal}
        onClose={() => setShowCandidateModal(false)}
        candidate={null}
        onSave={handleSaveCandidate}
        mode="add"
      />

      <JobModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        job={null}
        onSave={handleSaveJob}
        mode="add"
      />
    </DashboardLayout>
  );
};

export default Dashboard;
