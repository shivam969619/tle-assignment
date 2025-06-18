import React from 'react';
import { X } from 'lucide-react';

const StudentModal = ({ student, onClose }) => {
  const getRatingColor = (rating) => {
    if (rating >= 2100) return 'text-purple-700';
    if (rating >= 1900) return 'text-pink-600';
    if (rating >= 1600) return 'text-blue-600';
    if (rating >= 1400) return 'text-indigo-600';
    if (rating >= 1200) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getRatingLevel = (rating) => {
    if (rating >= 2100) return 'Master';
    if (rating >= 1900) return 'Candidate Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1400) return 'Specialist';
    if (rating >= 1200) return 'Pupil';
    return 'Newbie';
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Student Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl relative z-20"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Grid sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h3>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base font-medium text-gray-800 break-words">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-800 break-words">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium text-gray-800">{student.phone}</p>
              </div>
            </div>

            {/* Competitive Programming */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Competitive Programming
              </h3>
              <div>
                <p className="text-sm text-gray-500">Handle</p>
                <p className="text-base font-medium text-blue-600 break-words">
                  {student.codeforcesHandle}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Rating</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg sm:text-xl font-bold ${getRatingColor(student.currentRating)}`}>
                    {student.currentRating}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    ({getRatingLevel(student.currentRating)})
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Rating</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg sm:text-xl font-bold ${getRatingColor(student.maxRating)}`}>
                    {student.maxRating}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    ({getRatingLevel(student.maxRating)})
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${Math.min((student.currentRating / (student.maxRating || 1)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((student.currentRating / (student.maxRating || 1)) * 100).toFixed(1)}% of max
                </p>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Performance Insights
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.abs(student.maxRating - student.currentRating)}
                </p>
                <p className="text-xs text-gray-500">Points from Peak</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-2xl font-bold text-green-600">
                  {Math.floor((student.currentRating || 0) / 100)}
                </p>
                <p className="text-xs text-gray-500">Rating Level</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-2xl font-bold text-purple-600">
                  {student.maxRating > student.currentRating ? '↑' : '→'}
                </p>
                <p className="text-xs text-gray-500">Trend</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-2xl font-bold text-orange-600">
                  {student.contestsCount || 0}
                </p>
                <p className="text-xs text-gray-500">Contests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
