import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Bell, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Announcements() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['all-notifications'],
    queryFn: async () => {
      const res = await api.get('/api/notifications/notifications/');
      return res.data;
    },
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Stay updated with campus notifications</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <Bell className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${getBgColor(
                notification.type
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(notification.created_at), 'MMMM dd, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No announcements yet
            </h3>
            <p className="text-gray-600">
              Check back later for campus updates and notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
