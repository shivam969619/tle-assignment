import { useState, useEffect } from 'react';
import { Plus, Trash, Download, Eye, Edit2, Loader, Mail } from 'lucide-react';
import StudentModal from './StudentModal';
import StudentDetailModal from './StudentDetailModal';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    handle: '',
    currentRating: '',
    maxRating: ''
  });

  // Track per-student automatic reminder feature state and send counts
  const [reminderEnabled, setReminderEnabled] = useState({}); // { [id]: boolean }
  const [reminderCount, setReminderCount] = useState({});   // { [id]: number }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/students');
        const data = await res.json();

        // Initialize reminder flags and counts from backend or defaults
        const enabled = {};
        const counts = {};
        data.forEach(s => {
          enabled[s._id] = s.reminderEnabled !== undefined ? s.reminderEnabled : true;
          counts[s._id] = s.reminderCount || 0;
        });

        setStudents(data.map(s => ({ ...s, isActive: s.isActive ?? true })));
        setReminderEnabled(enabled);
        setReminderCount(counts);

        // After syncing, check reminders
        checkAndSendReminders(data, enabled);
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const checkAndSendReminders = async (data, enabledMap) => {
    const now = new Date();
    data.forEach(async (s) => {
      if (!enabledMap[s._id]) return;
      if (!s.lastSubmissionDate) return;
      const lastDate = new Date(s.lastSubmissionDate);
      const diffMs = now - lastDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays >= 7) {
        try {
          await fetch(`http://localhost:5000/api/students/${s._id}/send-reminder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'inactivity' })
          });
          setReminderCount(prev => ({ ...prev, [s._id]: (prev[s._id] || 0) + 1 }));
          // Optionally persist new count to backend
        } catch (err) {
          console.error(`Failed to send reminder to ${s._id}`, err);
        }
      }
    });
  };

  const openAddModal = () => {
    setNewStudent({ name: '', email: '', phone: '', handle: '', currentRating: '', maxRating: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setNewStudent({ ...student });
    setIsEditModalOpen(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const openDetailModal = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleAddOrUpdate = async (isUpdate = false) => {
    const { name, email, phone } = newStudent;
    if (!name || !email || !phone) return;
    setProcessing(true);
    try {
      const url = isUpdate ?
        `http://localhost:5000/api/students/${selectedStudent._id}` :
        'http://localhost:5000/api/students';
      const method = isUpdate ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      const result = await res.json();
      if (isUpdate) {
        setStudents(prev => prev.map(s => s._id === result._id ? result : s));
        // preserve existing reminder settings/counts
      } else {
        setStudents(prev => [...prev, result]);
        setReminderEnabled(prev => ({ ...prev, [result._id]: true }));
        setReminderCount(prev => ({ ...prev, [result._id]: 0 }));
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to save student', err);
    } finally {
      setProcessing(false);
    }
  };

  const deleteStudent = async (id) => {
    setProcessing(true);
    try {
      await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
      setStudents(prev => prev.filter(s => s._id !== id));
      setReminderEnabled(prev => { const upd = { ...prev }; delete upd[id]; return upd; });
      setReminderCount(prev => { const upd = { ...prev }; delete upd[id]; return upd; });
    } catch (err) {
      console.error('Failed to delete student', err);
    } finally {
      setProcessing(false);
    }
  };

  // Toggle automatic reminder feature on/off for a student
  const toggleReminder = async (id) => {
    const newValue = !reminderEnabled[id];
    setReminderEnabled(prev => ({ ...prev, [id]: newValue }));
    try {
      await fetch(`http://localhost:5000/api/students/${id}/reminder-enabled`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderEnabled: newValue })
      });
    } catch (err) {
      console.error(`Failed to update reminderEnabled for ${id}`, err);
    }
  };

  const downloadData = () => {
    const csvContent = [
      ['Name','Email','Phone','Handle','Current Rating','Max Rating','ReminderEnabled','RemindersSent'],
      ...students.map(s => [
        s.name, s.email, s.phone, s.handle, s.currentRating, s.maxRating,
        reminderEnabled[s._id] ? 'Yes' : 'No',
        reminderCount[s._id] || 0
      ])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'students_data.csv'; link.click(); window.URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader className="animate-spin" size={40} /></div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
      {processing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Loader className="animate-spin text-white" size={48} />
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Management</h2>
          <p className="text-gray-600">Manage and track competitive programming students</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
            <Plus size={20} /> Add Student
          </button>
          <button onClick={downloadData} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition">
            <Download size={20} /> Download Data
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-4">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name','Email','Phone','Handle','Current Rating','Max Rating','Auto Reminder','Reminders Sent','Actions'].map(header => (
                <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {students.map(student => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <button onClick={() => openDetailModal(student)} className="text-blue-600 hover:underline">
                    {student.name}
                  </button>
                </td>
                <td className="px-4 py-3">{student.email}</td>
                <td className="px-4 py-3">{student.phone}</td>
                <td className="px-4 py-3">{student.handle}</td>
                <td className="px-4 py-3">{student.currentRating}</td>
                <td className="px-4 py-3">{student.maxRating}</td>
                <td className="px-4 py-3 flex justify-center">
                  <Mail
                    size={18}
                    className={reminderEnabled[student._id] ? 'text-green-600' : 'text-gray-400'}
                    onClick={() => toggleReminder(student._id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td className="px-4 py-3 text-center">{reminderCount[student._id] || 0}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openViewModal(student)} className="p-1 bg-blue-100 rounded hover:bg-blue-200">
                    <Eye size={18} className="text-blue-600" />
                  </button>
                  <button onClick={() => openEditModal(student)} className="p-1 bg-yellow-100 rounded hover:bg-yellow-200">
                    <Edit2 size={18} className="text-yellow-600" />
                  </button>
                  <button onClick={() => deleteStudent(student._id)} className="p-1 bg-red-100 rounded hover:bg-red-200">
                    <Trash size={18} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">
              {isEditModalOpen ? 'Edit Student' : 'Add New Student'}
            </h3>
            {['name','email','phone','handle','currentRating','maxRating'].map(field => (
              <input
                key={field}
                type={field === 'email' ? 'email' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newStudent[field]}
                onChange={e => setNewStudent({ ...newStudent, [field]: e.target.value })}
                className={`w-full p-2 border rounded-lg ${isEditModalOpen && field === 'handle' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={isEditModalOpen && field === 'handle'}
              />
            ))}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleAddOrUpdate(isEditModalOpen)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {isEditModalOpen ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setNewStudent({ name:'',email:'',phone:'',handle:'',currentRating:'',maxRating:'' }); }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedStudent && (
        <StudentModal student={selectedStudent} onClose={() => setIsViewModalOpen(false)} />
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedStudent && (
        <StudentDetailModal student={selectedStudent} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  );
};

export default StudentTable;
