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
    
    const msg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
    setShowFeedback(msg);
    setTimeout(() => setShowFeedback(null), 3000);

    setQuantity(1);
  };

  // Helper para tamanho do ícone (vetor)
  const getIconSizeClass = (id: string) => {
    switch (id) {
      case BeerContainerType.LATA_269: return 'w-6 h-6';
      case BeerContainerType.LATA_350: return 'w-8 h-8';
      case BeerContainerType.GARRAFA_600: return 'w-10 h-10';
      case BeerContainerType.GARRAFA_1L: return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
        <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500"></div>
        
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-1.5 rounded-lg">
                <Beer className="w-4 h-4 text-amber-700" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Registrar</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Bebendo como</span>
              <p className="text-xs font-bold text-amber-600">{currentUser.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Beer Selection Grid - Compact Mode */}
            <div>
               <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Opção</label>
               <div className="grid grid-cols-4 gap-2">
                {BEER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedType(option.id)}
                    className={`relative flex flex-col items-center justify-center py-3 px-1 rounded-lg border transition-all duration-200 ${
                      selectedType === option.id
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-amber-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mb-1 text-amber-500 flex items-center justify-center h-12">
                       <Beer className={`${getIconSizeClass(option.id)} transition-transform duration-200 ${selectedType === option.id ? 'scale-110 drop-shadow-sm' : ''}`} />
                    </div>
                    
                    <div className="text-center w-full">
                      <span className={`block font-bold leading-tight ${selectedType === option.id ? 'text-slate-800' : 'text-slate-500'} text-xs`}>
                        {option.label}
                      </span>
                      <span className="text-[10px] opacity-75">{option.volumeLabel}</span>
                    </div>

                    {selectedType === option.id && (
                       <div className="absolute top-1 right-1 text-amber-500">
                         <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                       </div>
                    )}
                  </button>
                ))}
               </div>
            </div>

            {/* Quantity and Conversion */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Qtd.</label>
                <div className="flex items-center gap-2 h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-full aspect-square flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 h-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-xl font-bold text-slate-800">{quantity}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-full aspect-square flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conversion Display & Submit */}
              <div className="flex-[1.5] flex gap-2">
                 <div className="flex-1 bg-amber-50 rounded-lg border border-amber-100 px-3 flex flex-col justify-center h-12">
                    <span className="text-[10px] text-amber-600 uppercase font-bold leading-none mb-0.5">Total (Lata P)</span>
                    <span className="text-lg font-black text-amber-800 leading-none">{equivalent}</span>
                 </div>
                 
                 <button
                  type="submit"
                  className="flex-[1.5] h-12 rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-amber-200"
                >
                  <Send className="w-4 h-4" />
                  Registrar
                </button>
              </div>
            </div>

          </form>

          {/* Feedback Overlay */}
          {showFeedback && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 z-10">
              <div className="text-center p-4 transform animate-bounce-short">
                <div className="inline-flex p-3 bg-green-100 rounded-full mb-2">
                  <span className="text-2xl">🍻</span>
                </div>
                <h3 className="text-lg font-bold text-green-700">{showFeedback}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeerEntryForm;