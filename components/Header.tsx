import React from 'react';
import { Beer } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-amber-500/90 border-b border-amber-600 shadow-sm text-white transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Beer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Quantas Foi Mesmo?</h1>
            <p className="text-xs text-amber-100 font-medium">Não julgamos. Só registramos.</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;