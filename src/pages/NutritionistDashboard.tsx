import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Users, X, Calendar, Plus, Trash2, 
  Scale, Ruler, Activity, Eye, Grid3X3, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { patients as initialPatients, nutritionist } from '../data/mockData';
import type { Patient } from '../data/mockData';

// Navigation items
const navItems = [
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'dashboard', label: 'Dashboard', icon: Grid3X3 },
];

export function NutritionistDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [showModal, setShowModal] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState<Patient | null>(null);
  const [modalType, setModalType] = useState<'addPatient' | 'editPatient' | 'calendar'>('addPatient');
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

  // Mock data for patient metrics (detailed view with KPIs)
  const patientMetrics = {
    current: { weight: 75.5, height: 175, imc: 24.7, fat: 18.5, muscle: 32.0 },
    goal: { weight: 72, imc: 23.5 },
    history: [
      { date: '2026-04-08', weight: 75.5, imc: 24.7, fat: 18.5 },
      { date: '2026-04-01', weight: 76.0, imc: 24.8, fat: 19.0 },
      { date: '2026-03-25', weight: 76.2, imc: 24.9, fat: 19.2 },
      { date: '2026-03-18', weight: 76.8, imc: 25.1, fat: 19.5 },
      { date: '2026-03-11', weight: 77.5, imc: 25.3, fat: 20.0 },
    ],
    progress: { totalWeeks: 8, lostWeight: 2.0, adherence: 85 },
  };

  // Calendar mock data
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3; // Start from day -3 to make month start properly
    const date = new Date(2026, 3, day); // April 2026
    const appointments = [];
    
    if (day === 8) appointments.push({ time: '09:00', patient: 'Juan Pérez', type: 'Control' });
    if (day === 8) appointments.push({ time: '11:00', patient: 'María González', type: 'Evaluación' });
    if (day === 10) appointments.push({ time: '10:30', patient: 'Ana Silva', type: 'Seguimiento' });
    if (day === 15) appointments.push({ time: '09:00', patient: 'Carlos López', type: 'Primera vez' });
    
    return { day, date, appointments };
  });

  const monthName = 'Abril 2026';
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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
              onClick={() => {
                if (item.id === 'calendar') { setModalType('calendar'); setShowModal(true); }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                modalType === 'calendar' && item.id === 'calendar'
                  ? 'bg-mint text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
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
              <p className="text-gray-500 text-sm">{nutritionist.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setModalType('calendar'); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-navy rounded-xl font-medium hover:bg-gray-50 transition"
              >
                <Calendar size={18} />
                Calendario
              </button>
              <button
                onClick={() => { setModalType('addPatient'); setNewPatient({ name: '', email: '', phone: '', address: '', birthDate: '', weight: '', height: '' }); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-mint text-white rounded-xl font-medium hover:bg-mint/90 transition"
              >
                <Plus size={18} />
                Nuevo Paciente
              </button>
            </div>
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
                          className="p-2 hover:bg-mint/10 rounded-lg text-mint"
                          title="Ver métricas"
                        >
                          <Eye size={18} />
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

      {/* Patient Metrics Modal (Eye icon) */}
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
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
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
                {/* Current Metrics */}
                <h3 className="font-bold text-navy mb-4">Métricas Actuales</h3>
                <div className="grid grid-cols-5 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Scale className="mx-auto mb-1 text-navy" size={20} />
                    <p className="text-xl font-bold text-navy">{patientMetrics.current.weight}</p>
                    <p className="text-gray-500 text-xs">kg</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Ruler className="mx-auto mb-1 text-navy" size={20} />
                    <p className="text-xl font-bold text-navy">{patientMetrics.current.height}</p>
                    <p className="text-gray-500 text-xs">cm</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Activity className="mx-auto mb-1 text-mint" size={20} />
                    <p className="text-xl font-bold text-mint">{patientMetrics.current.imc}</p>
                    <p className="text-gray-500 text-xs">IMC</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-navy">{patientMetrics.current.fat}%</p>
                    <p className="text-gray-500 text-xs">Grasa</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-navy">{patientMetrics.current.muscle}kg</p>
                    <p className="text-gray-500 text-xs">Músculo</p>
                  </div>
                </div>

                {/* Goal Progress */}
                <div className="bg-mint/10 border border-mint rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-navy">Progreso hacia meta</span>
                    <span className="text-mint font-bold">{patientMetrics.progress.lostWeight}kg perdidos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-mint h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Meta: {patientMetrics.goal.weight}kg • Actual: {patientMetrics.current.weight}kg</p>
                </div>

                {/* History Chart */}
                <h3 className="font-bold text-navy mb-3">Historial de Evolución</h3>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="space-y-3">
                    {patientMetrics.history.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">{new Date(m.date).toLocaleDateString('es-CL')}</span>
                        <div className="flex gap-6 text-sm">
                          <span className="text-navy font-medium">{m.weight}kg</span>
                          <span className="text-mint font-medium">IMC {m.imc}</span>
                          <span className="text-gray-500">{m.fat}% grasa</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Semanas en programa</p>
                    <p className="text-2xl font-bold text-navy">{patientMetrics.progress.totalWeeks}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Adherencia</p>
                    <p className="text-2xl font-bold text-mint">{patientMetrics.progress.adherence}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showModal && modalType === 'calendar' && (
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
              className="bg-white rounded-2xl p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-navy">Calendario de Citas</h3>
                <button onClick={() => setShowModal(false)}>
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-navy">{monthName}</h4>
              </div>

              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`min-h-[80px] p-2 rounded-lg border ${
                      item.day < 1 || item.day > 30 
                        ? 'bg-gray-50 border-gray-100' 
                        : item.appointments.length > 0 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-white border-gray-200'
                    }`}
                  >
                    {item.day > 0 && item.day <= 30 && (
                      <>
                        <p className={`text-sm font-medium ${
                          new Date().getDate() === item.day ? 'text-mint' : 'text-navy'
                        }`}>
                          {item.day}
                        </p>
                        {item.appointments.slice(0, 2).map((apt, i) => (
                          <div key={i} className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded mt-1 truncate">
                            {apt.time} {apt.patient.split(' ')[0]}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Today's appointments */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-bold text-navy mb-3">Citas de Hoy</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-mint" />
                      <div>
                        <p className="font-medium text-navy">09:00 - Juan Pérez</p>
                        <p className="text-gray-500 text-sm">Control</p>
                      </div>
                    </div>
                    <span className="bg-mint text-white text-xs px-2 py-1 rounded-full">Confirmada</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-mint" />
                      <div>
                        <p className="font-medium text-navy">11:00 - María González</p>
                        <p className="text-gray-500 text-sm">Evaluación</p>
                      </div>
                    </div>
                    <span className="bg-mint text-white text-xs px-2 py-1 rounded-full">Confirmada</span>
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