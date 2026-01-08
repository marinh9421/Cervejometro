import React, { useState } from 'react';
import { BeerContainerType, BeerOption, User } from '../types';
import { BEER_OPTIONS, SUCCESS_MESSAGES } from '../constants';
import { Plus, Minus, Send, Beer } from 'lucide-react';

interface BeerEntryFormProps {
  onAddLog: (type: BeerOption, quantity: number) => void;
  currentUser: User;
}

const BeerEntryForm: React.FC<BeerEntryFormProps> = ({ onAddLog, currentUser }) => {
  const [selectedType, setSelectedType] = useState<BeerContainerType>(BeerContainerType.LATA_350);
  const [quantity, setQuantity] = useState(1);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const selectedOption = BEER_OPTIONS.find(o => o.id === selectedType) || BEER_OPTIONS[0];
  const equivalent = (selectedOption.conversionFactor * quantity).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddLog(selectedOption, quantity);
    
    // Show Feedback
    const msg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
    setShowFeedback(msg);
    setTimeout(() => setShowFeedback(null), 3000);

    // Reset quantity
    setQuantity(1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500"></div>
        
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Beer className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Registrar Rodada</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase font-bold">Bebendo como</span>
              <p className="text-sm font-bold text-amber-600">{currentUser.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Beer Selection Grid */}
            <div>
               <label className="block text-sm font-medium text-slate-600 mb-3">O que você está bebendo?</label>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BEER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedType(option.id)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedType === option.id
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md transform scale-[1.02]'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-amber-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-3xl mb-2">{option.icon}</span>
                    <span className="font-bold text-sm">{option.label}</span>
                    <span className="text-xs opacity-75">{option.volumeLabel}</span>
                    {selectedType === option.id && (
                       <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full shadow-sm">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                         </svg>
                       </div>
                    )}
                  </button>
                ))}
               </div>
            </div>

            {/* Quantity and Conversion */}
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-600 mb-2">Quantidade</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl py-2">
                    <span className="text-2xl font-bold text-slate-800">{quantity}</span>
                    <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Unidades</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Conversion Display */}
              <div className="flex-1 bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-center justify-between">
                <div>
                   <span className="block text-xs text-amber-600 uppercase font-bold tracking-wide">Equivalente a</span>
                   <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-amber-800">{equivalent}</span>
                      <span className="text-sm font-medium text-amber-700">latas (269ml)</span>
                   </div>
                </div>
                <div className="opacity-20 text-amber-900">
                  <Beer className="w-10 h-10" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-amber-200"
            >
              <Send className="w-5 h-5" />
              Registrar Consumo
            </button>
          </form>

          {/* Feedback Overlay */}
          {showFeedback && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 z-10 rounded-2xl">
              <div className="text-center p-6 transform animate-bounce-short">
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                  <span className="text-4xl">🍻</span>
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">Registrado!</h3>
                <p className="text-slate-600 font-medium text-lg">{showFeedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeerEntryForm;
