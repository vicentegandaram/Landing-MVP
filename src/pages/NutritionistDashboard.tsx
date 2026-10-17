import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Users, X, Calendar, Plus, Trash2, 
  Scale, Ruler, Activity, Eye, Grid3X3, Clock, Save, Edit3
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
  const [activeNav, setActiveNav] = useState('patients');
  const [showModal, setShowModal] = useState(false);
  const [showPatientDetail, setShowPatientDetail] = useState<Patient | null>(null);
  const [showMetricsEdit, setShowMetricsEdit] = useState(false);
  const [modalType, setModalType] = useState<'addPatient' | 'editPatient' | 'calendar' | 'newAppointment'>('addPatient');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  
  // Form state for new/edit patient
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    weight: '',
    height: '',
  });

  // Form for new appointment
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    date: '',
    time: '',
    type: 'Consulta',
    notes: '',
  });

  // Editable metrics
  const [editableMetrics, setEditableMetrics] = useState({
    weight: '',
    height: '',
    fat: '',
    muscle: '',
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
    setNewPatient({ name: '', email: '', phone: '', weight: '', height: '' });
    setShowModal(false);
  };

  const handleAddAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.date || !newAppointment.time) return;
    alert('Cita creada exitosamente!');
    setNewAppointment({ patientId: '', date: '', time: '', type: 'Consulta', notes: '' });
    setModalType('calendar');
  };

  const handleSaveMetrics = () => {
    alert('Métricas guardadas exitosamente!');
    setShowMetricsEdit(false);
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter(p => p.id !== patientId));
  };

  // Mock data for patient metrics
  const patientMetrics = {
    current: { weight: 75.5, height: 175, imc: 24.7, fat: 18.5, muscle: 32.0 },
    history: [
      { date: '2026-04-08', weight: 75.5, imc: 24.7, fat: 18.5 },
      { date: '2026-04-01', weight: 76.0, imc: 24.8, fat: 19.0 },
      { date: '2026-03-25', weight: 76.2, imc: 24.9, fat: 19.2 },
    ],
    progress: { totalWeeks: 8, lostWeight: 2.0, adherence: 85 },
  };

  // Calendar data
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3;
    const appointments = [];
    if (day === 8) appointments.push({ time: '09:00', patient: 'Juan Pérez', type: 'Control' });
    if (day === 8) appointments.push({ time: '11:00', patient: 'María González', type: 'Evaluación' });
    if (day === 10) appointments.push({ time: '10:30', patient: 'Ana Silva', type: 'Seguimiento' });
    if (day === 15) appointments.push({ time: '09:00', patient: 'Carlos López', type: 'Primera vez' });
    return { day, appointments };
  });

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
                setActiveNav(item.id);
                if (item.id === 'calendar') { setModalType('calendar'); setShowModal(true); }
                if (item.id === 'dashboard') { setActiveNav('dashboard'); setShowModal(false); }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeNav === item.id 
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
        {activeNav === 'dashboard' && (
          <>
            <header className="bg-white border-b border-gray-200 px-8 py-4">
              <h2 className="text-xl font-bold text-navy">Dashboard</h2>
            </header>
            <div className="p-8">
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <Users className="text-mint mb-4" size={28} />
                  <p className="text-3xl font-bold text-navy">{patients.length}</p>
                  <p className="text-gray-500">Total Pacientes</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <Calendar className="text-blue-500 mb-4" size={28} />
                  <p className="text-3xl font-bold text-navy">4</p>
                  <p className="text-gray-500">Citas Hoy</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <Clock className="text-purple-500 mb-4" size={28} />
                  <p className="text-3xl font-bold text-navy">18</p>
                  <p className="text-gray-500">Esta Semana</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <Activity className="text-mint mb-4" size={28} />
                  <p className="text-3xl font-bold text-navy">85%</p>
                  <p className="text-gray-500">Adherencia Promedio</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeNav === 'patients' && (
          <>
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
                    onClick={() => { setModalType('addPatient'); setNewPatient({ name: '', email: '', phone: '', weight: '', height: '' }); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-mint text-white rounded-xl font-medium hover:bg-mint/90 transition"
                  >
                    <Plus size={18} />
                    Nuevo Paciente
                  </button>
                </div>
              </div>
            </header>

            <div className="px-8 py-6">
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
                      <motion.tr key={patient.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
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
                            <button onClick={() => setShowPatientDetail(patient)} className="p-2 hover:bg-mint/10 rounded-lg text-mint" title="Ver métricas">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleDeletePatient(patient.id)} className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
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
          </>
        )}
      </main>

      {/* Patient Metrics Modal */}
      <AnimatePresence>
        {showPatientDetail && !showMetricsEdit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowPatientDetail(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
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
                  <button onClick={() => setShowPatientDetail(null)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-navy">Métricas Actuales</h3>
                  <button onClick={() => {
                    setEditableMetrics({ 
                      weight: String(patientMetrics.current.weight),
                      height: String(patientMetrics.current.height),
                      fat: String(patientMetrics.current.fat),
                      muscle: String(patientMetrics.current.muscle)
                    });
                    setShowMetricsEdit(true);
                  }} className="flex items-center gap-1 text-mint text-sm font-medium">
                    <Edit3 size={16} /> Editar Métricas
                  </button>
                </div>
                
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

                <div className="bg-mint/10 border border-mint rounded-xl p-4 mb-6">
                  <p className="font-bold text-navy">Progreso: {patientMetrics.progress.lostWeight}kg perdidos</p>
                </div>

                <h3 className="font-bold text-navy mb-3">Historial</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  {patientMetrics.history.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <span className="text-gray-600">{new Date(m.date).toLocaleDateString('es-CL')}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-navy">{m.weight}kg</span>
                        <span className="text-mint">IMC {m.imc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Metrics Modal */}
        {showPatientDetail && showMetricsEdit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowMetricsEdit(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-navy mb-4">Editar Métricas</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input type="number" value={editableMetrics.weight} onChange={(e) => setEditableMetrics({...editableMetrics, weight: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                  <input type="number" value={editableMetrics.height} onChange={(e) => setEditableMetrics({...editableMetrics, height: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">% Grasa</label>
                  <input type="number" value={editableMetrics.fat} onChange={(e) => setEditableMetrics({...editableMetrics, fat: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Masa muscular (kg)</label>
                  <input type="number" value={editableMetrics.muscle} onChange={(e) => setEditableMetrics({...editableMetrics, muscle: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <button onClick={handleSaveMetrics} className="w-full bg-mint text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-mint/90">
                  <Save size={18} /> Guardar Métricas
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showModal && modalType === 'calendar' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-navy">Calendario de Citas</h3>
                <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-400" /></button>
              </div>

              <button onClick={() => setModalType('newAppointment')} className="mb-4 flex items-center gap-2 px-4 py-2 bg-mint text-white rounded-xl font-medium hover:bg-mint/90">
                <Plus size={18} /> Nueva Cita
              </button>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (<div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, idx) => (
                  <div key={idx} className={`min-h-[60px] p-2 rounded-lg border ${item.day < 1 || item.day > 30 ? 'bg-gray-50' : item.appointments.length > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                    {item.day > 0 && item.day <= 30 && (
                      <>
                        <p className="text-sm font-medium text-navy">{item.day}</p>
                        {item.appointments.slice(0, 2).map((apt, i) => (
                          <div key={i} className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded mt-1 truncate">{apt.time}</div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* New Appointment Modal */}
        {showModal && modalType === 'newAppointment' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-navy mb-4">Nueva Cita</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <select value={newAppointment.patientId} onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                    <option value="">Seleccionar paciente</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cita</label>
                  <select value={newAppointment.type} onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                    <option>Consulta</option>
                    <option>Control</option>
                    <option>Seguimiento</option>
                    <option>Evaluación</option>
                    <option>Primera vez</option>
                  </select>
                </div>
                <button onClick={handleAddAppointment} className="w-full bg-mint text-white font-semibold py-4 rounded-xl hover:bg-mint/90">
                  Crear Cita
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showModal && modalType === 'addPatient' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold text-navy mb-4">Nuevo Paciente</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Nombre completo" value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                <input type="email" placeholder="Email" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                <input type="tel" placeholder="Teléfono" value={newPatient.phone} onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Peso (kg)" value={newPatient.weight} onChange={(e) => setNewPatient({...newPatient, weight: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                  <input type="number" placeholder="Altura (cm)" value={newPatient.height} onChange={(e) => setNewPatient({...newPatient, height: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
                </div>
                <button onClick={handleAddPatient} disabled={!newPatient.name || !newPatient.email} className="w-full bg-mint text-white font-semibold py-4 rounded-xl hover:bg-mint/90 disabled:opacity-50">
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