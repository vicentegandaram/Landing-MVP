import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Calendar, Store, Check, ShoppingBag } from 'lucide-react';
import { Layout } from '../components/Layout';
import { MacroRing } from '../components/MacroRing';
import { Dropzone } from '../components/Dropzone';
import { EmptyState } from '../components/EmptyState';
import { ShoppingCard } from '../components/ShoppingCard';
import { parseNutritionPlan } from '../services/nutritionParser';
import type { ExtractedData, ShoppingItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const sampleShoppingItems: ShoppingItem[] = [
  { id: '1', name: 'Pechuga de Pollo', quantity: '500g', price: 4590, store: 'Jumbo' },
  { id: '2', name: 'Salmón Fresco', quantity: '400g', price: 8990, store: 'Jumbo' },
  { id: '3', name: 'Arroz Integral', quantity: '1kg', price: 2490, store: 'Jumbo' },
  { id: '4', name: 'Quinoa', quantity: '500g', price: 3290, store: 'Jumbo' },
  { id: '5', name: 'Palta', quantity: '3 unidades', price: 1990, store: 'Lider' },
  { id: '6', name: 'Huevos', quantity: '12 unidades', price: 2890, store: 'Lider' },
  { id: '7', name: 'Vegetales Frescos', quantity: '1 pack', price: 3490, store: 'Lider' },
  { id: '8', name: 'Almendras', quantity: '200g', price: 4990, store: 'Lider' },
];

export function PatientExperience() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasPlan, setHasPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('optimeal_plan');
    if (stored) {
      setExtractedData(JSON.parse(stored));
      setHasPlan(true);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await parseNutritionPlan(file);
      setExtractedData(data);
      localStorage.setItem('optimeal_plan', JSON.stringify(data));
      setHasPlan(true);
    } catch (error) {
      console.error('Error parsing nutrition plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (item: ShoppingItem) => {
    setCartItems(prev => [...prev, item.id]);
  };

  const macros = extractedData ? [
    { name: 'Proteína', current: extractedData.protein * 0.8, target: extractedData.protein, color: '#2ECC71' },
    { name: 'Carbohidratos', current: extractedData.carbs * 0.7, target: extractedData.carbs, color: '#3498DB' },
    { name: 'Grasas', current: extractedData.fats * 0.75, target: extractedData.fats, color: '#E74C3C' },
  ] : [
    { name: 'Proteína', current: 120, target: 150, color: '#2ECC71' },
    { name: 'Carbohidratos', current: 140, target: 200, color: '#3498DB' },
    { name: 'Grasas', current: 45, target: 60, color: '#E74C3C' },
  ];

  const totalCartPrice = sampleShoppingItems
    .filter(i => cartItems.includes(i.id))
    .reduce((acc, i) => acc + i.price, 0);

  return (
    <Layout title={user?.name || 'Mi Plan'} showBack>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-white font-bold">
              {user?.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-navy">{user?.name}</h2>
              <p className="text-sm text-gray-500">Plan activo</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-600"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
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
                size={85}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Sube tu Pauta Nutricional</h3>
          <Dropzone onFileUpload={handleFileUpload} isLoading={isLoading} />
        </div>

        {hasPlan && extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy">Plan Semanal</h3>
              <button
                onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
                className="flex items-center gap-1 text-mint text-sm font-medium"
              >
                <Calendar size={16} />
                {showWeeklyPlan ? 'Ocultar' : 'Ver plan'}
              </button>
            </div>

            <AnimatePresence>
              {showWeeklyPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-gray-50 rounded-xl p-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {extractedData.weeklyPlan.slice(0, 4).map((day) => (
                      <div key={day.day} className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="font-medium text-navy text-sm">{day.day}</p>
                        {day.meals.slice(0, 2).map((meal) => (
                          <p key={meal.name} className="text-xs text-gray-500 truncate">
                            {meal.name}: {meal.recipes[0]}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-4 mt-6">
          <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
            <ShoppingBag size={20} className="text-mint" />
            Lista de Compras
          </h3>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Check size={16} className="text-mint" />
            {cartItems.length}/{sampleShoppingItems.length} seleccionados
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-32">
          {sampleShoppingItems.map((item) => (
            <ShoppingCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              isInCart={cartItems.includes(item.id)}
            />
          ))}
        </div>

        {!hasPlan && <EmptyState />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-[450px] mx-auto">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-navy text-white font-semibold py-4 rounded-xl hover:bg-navy/90 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Store size={20} />
          Ir al Supermercado
          {totalCartPrice > 0 && (
            <span className="bg-mint px-2 py-0.5 rounded-full text-sm">
              ${totalCartPrice.toLocaleString('es-CL')}
            </span>
          )}
        </button>
      </div>
    </Layout>
  );
}
