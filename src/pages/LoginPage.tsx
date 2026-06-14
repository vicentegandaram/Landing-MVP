import { motion } from 'framer-motion';
import { Stethoscope, User, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleNutriLogin = () => {
    login('nutritionist');
    navigate('/nutri');
  };

  const handlePatientLogin = () => {
    login('patient');
    navigate('/paciente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-gray-900 to-navy flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-mint rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-mint/30"
        >
          <ChefHat size={48} className="text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-white mb-3 tracking-tight"
        >
          OptiMeal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg mb-12 text-center"
        >
          Tu plan nutricional inteligente
        </motion.p>

        <div className="w-full max-w-sm space-y-4">
          <motion.button
            onClick={handleNutriLogin}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03, x: 10 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white p-5 rounded-2xl flex items-center gap-4 hover:bg-white/15 transition-all"
          >
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <Stethoscope size={28} className="text-mint" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-xl font-bold">Portal Nutricionista</h2>
              <p className="text-gray-400 text-sm">Gestiona a tus pacientes</p>
            </div>
            <div className="w-8 h-8 bg-mint/20 rounded-full flex items-center justify-center">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-mint">
                <path d="M6 4l6 6 6-6" />
              </svg>
            </div>
          </motion.button>

          <motion.button
            onClick={handlePatientLogin}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.03, x: -10 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-mint text-white p-5 rounded-2xl flex items-center gap-4 hover:bg-mint/90 transition-all shadow-lg shadow-mint/30"
          >
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <h2 className="text-xl font-bold">Portal Paciente</h2>
              <p className="text-white/80 text-sm">Mi plan y compras</p>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M6 4l6 6 6-6" />
              </svg>
            </div>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-6 text-center"
      >
        <p className="text-gray-500 text-sm">
          Optimiza tus compras en Jumbo y Líder
        </p>
      </motion.div>
    </div>
  );
}
