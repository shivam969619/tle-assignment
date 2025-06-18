
import { useState } from 'react';
import { Plus, Trash, Download, Eye } from 'lucide-react';
import StudentModal from './StudentModal';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
}

const StudentTable = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Shivam Dubey',
      email: 'shivam7214376@gmail.com',
      phone: '9696197104',
      codeforcesHandle: 'shivam_coder',
      currentRating: 1450,
      maxRating: 1620
    },
    {
      id: 2,
      name: 'Arjun Sharma',
      email: 'arjun.sharma@gmail.com',
      phone: '9876543210',
      codeforcesHandle: 'arjun_cf',
      currentRating: 1200,
      maxRating: 1350
    },
    {
      id: 3,
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      phone: '8765432109',
      codeforcesHandle: 'priya_codes',
      currentRating: 1600,
      maxRating: 1750
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
    currentRating: 0,
    maxRating: 0
  });

  const deleteStudent = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const viewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const addStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.phone) {
      const id = Math.max(...students.map(s => s.id), 0) + 1;
      setStudents([...students, { ...newStudent, id }]);
      setNewStudent({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: '',
        currentRating: 0,
        maxRating: 0
      });
      setIsAddModalOpen(false);
    }
  };

  const downloadData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating'],
      ...students.map(student => [
        student.name,
        student.email,
        student.phone,
        student.codeforcesHandle,
        student.currentRating.toString(),
        student.maxRating.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_data.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
            <p className="text-gray-600 mt-1">Manage and track competitive programming students</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Student
            </button>
            <button
              onClick={downloadData}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={20} />
              Download Data
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CF Handle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-600 font-medium">{student.codeforcesHandle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.currentRating >= 1500 ? 'bg-green-100 text-green-800' :
                    student.currentRating >= 1200 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {student.currentRating}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.maxRating >= 1500 ? 'bg-green-100 text-green-800' :
                    student.maxRating >= 1200 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {student.maxRating}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewDetails(student)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => deleteStudent(student.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Codeforces Handle"
                value={newStudent.codeforcesHandle}
                onChange={(e) => setNewStudent({...newStudent, codeforcesHandle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Current Rating"
                value={newStudent.currentRating || ''}
                onChange={(e) => setNewStudent({...newStudent, currentRating: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Rating"
                value={newStudent.maxRating || ''}
                onChange={(e) => setNewStudent({...newStudent, maxRating: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={addStudent}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Student
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isModalOpen && selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentTable;
