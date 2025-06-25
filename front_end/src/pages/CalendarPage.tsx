import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const Calendar = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Interview - Sarah Johnson',
      time: '10:00 AM',
      date: '2025-06-23',
      type: 'interview',
      attendees: ['John Smith', 'Sarah Johnson']
    },
    {
      id: 2,
      title: 'Team Meeting',
      time: '2:00 PM',
      date: '2025-06-23',
      type: 'meeting',
      attendees: ['HR Team']
    },
    {
      id: 3,
      title: 'Interview - Michael Chen',
      time: '11:00 AM',
      date: '2025-06-24',
      type: 'interview',
      attendees: ['John Smith', 'Michael Chen']
    },
    {
      id: 4,
      title: 'Performance Review - Alice Wilson',
      time: '3:00 PM',
      date: '2025-06-25',
      type: 'review',
      attendees: ['John Smith', 'Alice Wilson']
    }
  ];

  const todayEvents = events.filter(event => event.date === '2025-06-23');
  const upcomingEvents = events.filter(event => event.date > '2025-06-23');

  return (
    <DashboardLayout activeItem="Calendar">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
            <p className="text-gray-600">Manage interviews, meetings, and events</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today)}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days - Simple grid for demo */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2; // Start from -2 to show previous month days
                  const isToday = day === today.getDate();
                  const isCurrentMonth = day > 0 && day <= 30;
                  const hasEvents = day === 23 || day === 24 || day === 25;
                  
                  return (
                    <div
                      key={i}
                      className={`aspect-square p-2 text-center text-sm border border-gray-100 ${
                        isToday 
                          ? 'bg-blue-600 text-white font-semibold rounded-lg' 
                          : isCurrentMonth 
                            ? 'hover:bg-gray-50 cursor-pointer' 
                            : 'text-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span>{day > 0 && day <= 30 ? day : ''}</span>
                        {hasEvents && isCurrentMonth && (
                          <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Events & Upcoming */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Today's Events</h3>
            </div>
            <div className="p-6">
              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <Clock className="w-4 h-4 text-blue-600 mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-blue-600">{event.time}</p>
                        <div className="flex items-center mt-1">
                          <Users className="w-3 h-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">{event.attendees.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No events scheduled for today</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            </div>
            <div className="p-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="w-4 h-4 text-gray-600 mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interviews</span>
                <span className="text-sm font-semibold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Meetings</span>
                <span className="text-sm font-semibold text-gray-900">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="text-sm font-semibold text-gray-900">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
