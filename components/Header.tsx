import React from 'react';
import { FlaskConical, Waves, GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">理化戰神</h1>
            <p className="text-xs text-slate-400">國二段考衝刺系統</p>
          </div>
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
          <span className="flex items-center gap-1 hover:text-white cursor-pointer transition"><Waves className="w-4 h-4" /> 波與聲音</span>
          <span className="flex items-center gap-1 hover:text-white cursor-pointer transition"><FlaskConical className="w-4 h-4" /> 實驗分析</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
