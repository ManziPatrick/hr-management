import { 
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const Reports = () => {
  const reportsData = [
    {
      id: 1,
      title: 'Monthly Hiring Report',
      description: 'Overview of hiring activities and metrics for the current month',
      lastUpdated: '2 days ago',
      type: 'Hiring',
      format: 'PDF'
    },
    {
      id: 2,
      title: 'Employee Performance Analysis',
      description: 'Quarterly performance review and analysis across all departments',
      lastUpdated: '1 week ago',
      type: 'Performance',
      format: 'Excel'
    },
    {
      id: 3,
      title: 'Recruitment Pipeline Report',
      description: 'Current status of all active job postings and candidate pipeline',
      lastUpdated: '3 days ago',
      type: 'Recruitment',
      format: 'PDF'
    },
    {
      id: 4,
      title: 'Department Headcount Summary',
      description: 'Employee distribution and headcount across all departments',
      lastUpdated: '5 days ago',
      type: 'Analytics',
      format: 'Excel'
    }
  ];

  return (
    <DashboardLayout activeItem="Reports">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            <p className="text-gray-600">Generate and view HR analytics and reports</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {reportsData.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">Updated {report.lastUpdated}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{report.type}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{report.format}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
