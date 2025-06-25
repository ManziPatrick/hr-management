import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, Edit, Linkedin, FileText, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { candidatesAPI } from '../services/api';

const tabs = [
  'General',
  'Evaluations',
  'Experience',
  'Education',
  'Events',
  'Documents',
  'Messages'
];

const checklist = [
  { label: 'Qualifications and skills match', checked: true },
  { label: 'Experience Relevance', checked: true },
  { label: 'Education', checked: true },
  { label: 'Keywords Match', checked: false },
  { label: 'Years of Experience', checked: true },
  { label: 'Job Hopping', checked: false },
  { label: 'Cultural Fit', checked: true },
  { label: 'Interview Performance', checked: true },
  { label: 'References', checked: true },
  { label: 'Additional Factors', checked: true },
];

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('General');

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await candidatesAPI.getById(id as string);
      setCandidate(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidate');
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="Candidates">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !candidate) {
    return (
      <DashboardLayout activeItem="Candidates">
        <div className="flex items-center justify-center h-64 text-red-500">{error || 'Candidate not found.'}</div>
      </DashboardLayout>
    );
  }

  const avatar = candidate.name?.split(' ').map((n: string) => n[0]).join('') || '?';
  let files = Array.isArray(candidate.files) ? candidate.files : [];
  if (!files || files.length === 0) {
    files = [
      { name: 'Cover_letter.pdf', type: 'pdf' },
      { name: 'My_resume.pdf', type: 'pdf' },
      { name: 'Oct_payslip.pdf', type: 'pdf' },
      { name: 'Oct_payslip.pdf', type: 'pdf' },
      { name: 'Portfolio.docx', type: 'doc' },
      { name: 'Transcript.pdf', type: 'pdf' }
    ];
  }

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return <FileText size={14} className="text-red-500" />;
    if (type === 'doc' || type === 'docx') return <FileText size={14} className="text-blue-500" />;
    return <FileText size={14} className="text-gray-500" />;
  };

  const workHistory = Array.isArray(candidate.workHistory) ? candidate.workHistory : [];
  const lastExperience = workHistory.length > 0 ? workHistory[0] : null;
  const score = candidate.score || 75;

  return (
    <DashboardLayout activeItem="Candidates">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-blue-600 hover:underline">
          <ArrowLeft size={18} /> Go Back
        </button>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">Candidates</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-900">{candidate.name}</span>
      </div>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
            {avatar}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl font-semibold text-gray-900">{candidate.name}</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                {candidate.status || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span><Mail size={16} className="inline mr-1" />{candidate.email}</span>
              <span><Phone size={16} className="inline mr-1" />{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
              {candidate.linkedinUrl && (
                <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800"><Linkedin size={18} /></a>
              )}
              <button className="text-blue-600 hover:text-blue-800"><FileText size={18} /></button>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-4">
          <button className="text-blue-600 hover:underline">Edit</button>
          <button className="text-blue-600 hover:underline">Invite</button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex gap-6">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          {/* Tab Content */}
          <div>
            {activeTab === 'General' && (
              <div>
                {/* Candidate Files */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">Candidate Files</span>
                    <button className="text-blue-600 text-xs hover:underline">Edit</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {files.length > 0 ? files.map((file: any, idx: number) => (
                      <span key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                        {getFileIcon(file.type || (file.name?.endsWith('.pdf') ? 'pdf' : file.name?.endsWith('.doc') || file.name?.endsWith('.docx') ? 'doc' : 'other'))}
                        {file.name || file}
                        <span className="text-xs text-gray-400">2d ago</span>
                      </span>
                    )) : <span className="text-gray-400 text-sm">No files uploaded.</span>}
                  </div>
                </div>
                {/* Last Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">Last Experience</span>
                    <button className="text-blue-600 text-xs hover:underline">Edit</button>
                  </div>
                  {lastExperience ? (
                    <div className="mb-4">
                      <div className="font-medium text-gray-800">{lastExperience.position}</div>
                      <div className="text-gray-600 text-sm mb-1">{lastExperience.company} <span className="text-gray-400">({lastExperience.startDate} - {lastExperience.endDate || 'Present'})</span></div>
                      <div className="text-gray-700 text-sm font-semibold mt-1">Responsible for;</div>
                      <ol className="list-decimal ml-6 text-gray-700 text-sm">
                        {lastExperience.responsibilities && lastExperience.responsibilities.length > 0 ? (
                          lastExperience.responsibilities.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))
                        ) : lastExperience.description ? (
                          <li>{lastExperience.description}</li>
                        ) : null}
                      </ol>
                    </div>
                  ) : <span className="text-gray-400 text-sm">No experience data.</span>}
                  {/* Show previous experiences */}
                  {workHistory.length > 1 && workHistory.slice(1).map((exp: any, idx: number) => (
                    <div key={idx} className="mb-4">
                      <div className="font-medium text-gray-800">{exp.position}</div>
                      <div className="text-gray-600 text-sm mb-1">{exp.company} <span className="text-gray-400">({exp.startDate} - {exp.endDate || 'Present'})</span></div>
                      <div className="text-gray-700 text-sm font-semibold mt-1">Responsible for;</div>
                      <ol className="list-decimal ml-6 text-gray-700 text-sm">
                        {exp.responsibilities && exp.responsibilities.length > 0 ? (
                          exp.responsibilities.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))
                        ) : exp.description ? (
                          <li>{exp.description}</li>
                        ) : null}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Other tabs can be filled in similarly */}
            {activeTab !== 'General' && (
              <div className="text-gray-500 text-center py-12">No data for this tab yet.</div>
            )}
          </div>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="mb-4">
              <div className="text-sm text-gray-500 font-medium">Current Status</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">Round</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">Technical</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Assigned to</span>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">{candidate.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Interview Date</span>
                <span className="text-xs text-gray-700 font-medium">Jul 30, 2024</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center my-6">
              <div className="w-20 h-20 rounded-full border-2 border-green-400 flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">{score}</span>
              </div>
              <div className="mt-2 text-green-700 font-semibold">Potential Fit</div>
              <button className="text-blue-600 text-xs hover:underline mt-1">Edit</button>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Score:</div>
              <ul className="space-y-2">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    {item.checked ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                    <span className={item.checked ? 'text-gray-800' : 'text-gray-400 line-through'}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfile; 