import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Upload, ShoppingCart, ChevronRight, ChefHat } from 'lucide-react';
import { Layout } from '../components/Layout';
import { MacroRing } from '../components/MacroRing';
import { Dropzone } from '../components/Dropzone';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { weeklyPlanTemplate, type DayPlan } from '../data/mockData';

export function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasPlan, setHasPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('optimeal_plan');
    if (stored) {
      setWeeklyPlan(weeklyPlanTemplate);
      setHasPlan(true);
    }
  }, []);

  const handleUpload = useCallback(async (_file: File) => {
    setIsLoading(true);
    
    const messages = [
      'Analizando tu pauta...',
      'Extrayendo nutrientes...',
      'Generando plan semanal...',
      'Optimizando lista de compras...',
    ];

    for (let i = 0; i < messages.length; i++) {
      setLoadingMessage(messages[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    
    setWeeklyPlan(weeklyPlanTemplate);
    setHasPlan(true);
    setIsLoading(false);
    setLoadingMessage('');
    localStorage.setItem('optimeal_plan', JSON.stringify({ uploaded: true }));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const macros = [
    { name: 'Proteína', current: 120, target: 150, color: '#2ECC71' },
    { name: 'Carbohidratos', current: 196, target: 280, color: '#3498DB' },
    { name: 'Grasas', current: 45, target: 60, color: '#E74C3C' },
  ];

  const totalMacros = weeklyPlan.length > 0 ? {
    protein: weeklyPlan.reduce((acc, day) => acc + day.meals.reduce((mAcc, meal) => mAcc + meal.recipe.protein, 0), 0),
    carbs: weeklyPlan.reduce((acc, day) => acc + day.meals.reduce((mAcc, meal) => mAcc + meal.recipe.carbs, 0), 0),
    fats: weeklyPlan.reduce((acc, day) => acc + day.meals.reduce((mAcc, meal) => mAcc + meal.recipe.fats, 0), 0),
  } : null;

  return (
    <Layout title={user?.name || 'Mi Plan'} showBack>
      <div className="p-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.avatar}
            </div>
            <div>
              <h2 className="font-bold text-navy text-lg">{user?.name}</h2>
              <p className="text-sm text-gray-500">Plan nutricional activo</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-600"
          >
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-navy to-gray-800 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-4">Resumen de Macros</h3>
          <div className="flex justify-around">
            {macros.map((macro) => (
              <MacroRing
                key={macro.name}
                name={macro.name}
                current={macro.current}
                target={macro.target}
                color={macro.color}
                size={80}
              />
            ))}
          </div>
          {totalMacros && (
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-around text-sm">
              <div className="text-center">
                <p className="text-gray-400">Proteínas semanales</p>
                <p className="text-white font-semibold">{totalMacros.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">Carbohidratos semanales</p>
                <p className="text-white font-semibold">{totalMacros.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400">Grasas semanales</p>
                <p className="text-white font-semibold">{totalMacros.fats}g</p>
              </div>
            </div>
          )}
        </div>

        {!hasPlan && !isLoading && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Upload size={20} className="text-mint" />
              Sube tu Pauta Nutricional
            </h3>
            <Dropzone onFileUpload={handleUpload} isLoading={isLoading} />
          </div>
        )}

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-gradient-to-br from-mint/10 to-mint/5 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4 border-4 border-mint border-t-transparent rounded-full"
              />
              <h3 className="text-lg font-semibold text-navy mb-2">
                {loadingMessage}
              </h3>
              <p className="text-gray-500 text-sm">Optimizando tu lista de compras...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {hasPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <ChefHat size={20} className="text-mint" />
              Planificación Semanal
            </h3>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {weeklyPlan.map((day, index) => (
                <motion.button
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedDay(day)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedDay?.day === day.day
                      ? 'bg-mint text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <p className={`text-xs font-medium ${selectedDay?.day === day.day ? 'text-white/80' : 'text-gray-500'}`}>
                    {day.day.slice(0, 3)}
                  </p>
                  <p className={`font-bold text-sm ${selectedDay?.day === day.day ? 'text-white' : 'text-navy'}`}>
                    {day.meals.length}
                  </p>
                  <p className={`text-xs ${selectedDay?.day === day.day ? 'text-white/70' : 'text-gray-400'}`}>
                    comidas
                  </p>
                </motion.button>
              ))}
            </div>

            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 mb-4"
              >
                <div className="bg-gradient-to-r from-mint/10 to-transparent rounded-xl p-4">
                  <h4 className="font-bold text-navy mb-3">{selectedDay.day}</h4>
                  <div className="space-y-3">
                    {selectedDay.meals.map((meal, idx) => (
                      <motion.div
                        key={meal.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {meal.recipe.image}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">{meal.name}</p>
                          <p className="font-semibold text-navy">{meal.recipe.name}</p>
                          <div className="flex gap-3 mt-1 text-xs text-gray-400">
                            <span>P: {meal.recipe.protein}g</span>
                            <span>C: {meal.recipe.carbs}g</span>
                            <span>G: {meal.recipe.fats}g</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-mint text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-mint/90 transition-colors shadow-lg"
                >
                  <ShoppingCart size={18} />
                  Ver en Supermercado
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {!selectedDay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-xl p-6 text-center"
              >
                <ChefHat size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500">Selecciona un día para ver las recetas</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {!hasPlan && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-mint/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat size={32} className="text-mint" />
            </div>
            <h3 className="font-bold text-navy mb-2">¿Aún no tienes tu pauta?</h3>
            <p className="text-gray-500 text-sm">
              Sube tu plan nutricional y comenzaremos a optimizar tus compras semanalmente
            </p>
          </motion.div>
        )}
      </div>

      {hasPlan && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-[450px] mx-auto">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-navy text-white font-semibold py-4 rounded-xl hover:bg-navy/90 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Ir al Supermercado
          </button>
        </div>
      )}
    </Layout>
  );
}
