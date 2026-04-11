import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Users, X, Calendar, Plus, Trash2, 
  Scale, Ruler, Activity, ChevronRight, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { patients as initialPatients, nutritionist } from '../data/mockData';
import type { Patient } from '../data/mockData';

// Navigation items - only first 3 as requested
const navItems = [
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'home', label: 'Dashboard', icon: Users },
];

export function NutritionistDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [showModal, setShowModal] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState<Patient | null>(null);
  const [modalType, setModalType] = useState<'addPatient' | 'editPatient'>('addPatient');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  
  // Form state for new/edit patient
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    weight: '',
    height: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email) return;
    
    const patient: Patient = {
      id: `pat-${Date.now()}`,
      name: newPatient.name,
      email: newPatient.email,
      adherence: 100,
      lastVisit: new Date().toLocaleDateString('es-CL'),
      avatar: newPatient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    };
    
    setPatients([...patients, patient]);
    setNewPatient({ name: '', email: '', phone: '', address: '', birthDate: '', weight: '', height: '' });
    setShowModal(false);
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter(p => p.id !== patientId));
  };

  // Mock data for patient details (simulating real data)
  const patientMeasurements = {
    weight: 75.5,
    height: 175,
    imc: 24.7,
    history: [
      { date: '2026-04-08', weight: 75.5, imc: 24.7 },
      { date: '2026-03-25', weight: 76.2, imc: 24.9 },
      { date: '2026-03-10', weight: 77.0, imc: 25.1 },
    ]
  };

  const patientAppointments = [
    { id: 1, date: '2026-04-15', time: '10:00', type: 'Control', status: 'scheduled' },
    { id: 2, date: '2026-04-08', time: '11:00', type: 'Evaluación', status: 'completed' },
    { id: 3, date: '2026-03-25', time: '09:30', type: 'Seguimiento', status: 'completed' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">OptiMeal</h1>
          <p className="text-gray-400 text-sm">Nutricionista</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-gray-300 hover:bg-white/10"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-navy">Mis Pacientes</h2>
              <p className="text-gray-500 text-sm">{nutritionist.name} - {nutritionist.specialty}</p>
            </div>
            <button
              onClick={() => { setModalType('addPatient'); setNewPatient({ name: '', email: '', phone: '', address: '', birthDate: '', weight: '', height: '' }); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-mint text-white rounded-xl font-medium hover:bg-mint/90 transition"
            >
              <Plus size={18} />
              Nuevo Paciente
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Total Pacientes</p>
              <p className="text-2xl font-bold text-navy">{patients.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Citas Hoy</p>
              <p className="text-2xl font-bold text-navy">4</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Esta Semana</p>
              <p className="text-2xl font-bold text-navy">18</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Adherencia</p>
              <p className="text-2xl font-bold text-mint">85%</p>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adherencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Visita</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((patient) => (
                  <motion.tr 
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mint rounded-full flex items-center justify-center font-bold text-white">
                          {patient.avatar}
                        </div>
                        <span className="font-medium text-navy">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{patient.email}</td>
                    <td className="px-6 py-4 text-gray-600">+56 9 1234 5678</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.adherence >= 70 ? 'bg-green-100 text-green-700' : 
                        patient.adherence >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {patient.adherence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{patient.lastVisit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setShowPatientDetail(patient)}
                          className="flex items-center gap-1 text-sm text-mint font-medium hover:underline"
                        >
                          Ver <ChevronRight size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {showPatientDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPatientDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-navy text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-mint rounded-full flex items-center justify-center font-bold text-white text-2xl">
                      {showPatientDetail.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{showPatientDetail.name}</h2>
                      <p className="text-gray-300">{showPatientDetail.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPatientDetail(null)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Measurements */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Scale className="mx-auto mb-2 text-navy" size={24} />
                    <p className="text-2xl font-bold text-navy">{patientMeasurements.weight} kg</p>
                    <p className="text-gray-500 text-sm">Peso actual</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Ruler className="mx-auto mb-2 text-navy" size={24} />
                    <p className="text-2xl font-bold text-navy">{patientMeasurements.height} cm</p>
                    <p className="text-gray-500 text-sm">Altura</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Activity className="mx-auto mb-2 text-navy" size={24} />
                    <p className="text-2xl font-bold text-mint">{patientMeasurements.imc}</p>
                    <p className="text-gray-500 text-sm">IMC</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-mint/10 border border-mint rounded-xl p-4 mb-6">
                  <p className="font-bold text-navy">Estado Nutricional: <span className="text-mint">Peso Normal</span></p>
                </div>

                {/* Measurements History */}
                <div className="mb-6">
                  <h3 className="font-bold text-navy mb-3">Historial de Mediciones</h3>
                  <div className="space-y-2">
                    {patientMeasurements.history.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600">{new Date(m.date).toLocaleDateString('es-CL')}</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-navy">{m.weight}kg</span>
                          <span className="text-mint font-medium">IMC {m.imc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appointments */}
                <div>
                  <h3 className="font-bold text-navy mb-3">Citas</h3>
                  <div className="space-y-2">
                    {patientAppointments.map((apt) => (
                      <div 
                        key={apt.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          apt.status === 'scheduled' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock size={18} className={apt.status === 'scheduled' ? 'text-blue-500' : 'text-gray-400'} />
                          <div>
                            <p className="font-medium text-navy">{new Date(apt.date).toLocaleDateString('es-CL')}</p>
                            <p className="text-gray-500 text-sm">{apt.time} - {apt.type}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          apt.status === 'scheduled' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {apt.status === 'scheduled' ? 'Próxima' : 'Completada'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showModal && modalType === 'addPatient' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-navy">Nuevo Paciente</h3>
                <button onClick={() => setShowModal(false)}>
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="juan@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={newPatient.weight}
                      onChange={(e) => setNewPatient({...newPatient, weight: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      value={newPatient.height}
                      onChange={(e) => setNewPatient({...newPatient, height: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                      placeholder="175"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddPatient}
                  disabled={!newPatient.name || !newPatient.email}
                  className="w-full bg-mint text-white font-semibold py-4 rounded-xl hover:bg-mint/90 transition disabled:opacity-50"
                >
                  Crear Paciente
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}