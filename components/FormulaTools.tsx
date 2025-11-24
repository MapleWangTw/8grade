import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

const FormulaTools: React.FC = () => {
  const [mode, setMode] = useState<'sound' | 'lens'>('sound');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Calculator className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800">計算題小幫手</h3>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setMode('sound')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'sound' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          聲速與回聲
        </button>
        <button
          onClick={() => setMode('lens')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'lens' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          透鏡成像公式
        </button>
      </div>

      {mode === 'sound' ? <SoundCalculator /> : <LensCalculator />}
    </div>
  );
};

const SoundCalculator: React.FC = () => {
  const [temp, setTemp] = useState<string>('15');
  const [distance, setDistance] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const T = parseFloat(temp);
    const D = parseFloat(distance);
    
    if (isNaN(T)) return;
    
    // V = 331 + 0.6T
    const V = 331 + 0.6 * T;
    
    let output = `聲速 V ≈ ${V.toFixed(1)} m/s`;
    
    if (!isNaN(D)) {
        // Time for echo: 2D / V
        const timeEcho = (2 * D) / V;
        output += `\n回聲接收時間 t ≈ ${timeEcho.toFixed(2)} 秒 (距離 ${D}m)`;
    }

    setResult(output);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">氣溫 (°C)</label>
        <input 
          type="number" 
          value={temp} 
          onChange={(e) => setTemp(e.target.value)}
          className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-slate-400 mt-1">公式: V = 331 + 0.6T</p>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">單向距離 (m) - 選填</label>
        <input 
          type="number" 
          value={distance} 
          onChange={(e) => setDistance(e.target.value)}
          placeholder="計算回聲時間用"
          className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button 
        onClick={calculate}
        className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition"
      >
        計算
      </button>
      {result && (
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-900 whitespace-pre-wrap font-mono text-sm">
          {result}
        </div>
      )}
    </div>
  );
};

const LensCalculator: React.FC = () => {
  const [f, setF] = useState<string>('10'); // Focal length
  const [p, setP] = useState<string>('20'); // Object distance
  const [result, setResult] = useState<React.ReactNode | null>(null);

  const calculate = () => {
    const focal = parseFloat(f);
    const objDist = parseFloat(p);

    if (isNaN(focal) || isNaN(objDist) || objDist === focal) {
       setResult("請輸入有效數值 (物距不可等於焦距以免成像於無限遠)");
       return;
    }

    // 1/f = 1/p + 1/q  => 1/q = 1/f - 1/p => q = (f*p) / (p-f)
    const q = (focal * objDist) / (objDist - focal);
    const m = -q / objDist; // Magnification

    let type = "";
    let orientation = "";
    let size = "";

    if (q > 0) {
        type = "實像 (Real Image)";
        orientation = "倒立 (Inverted)";
    } else {
        type = "虛像 (Virtual Image)";
        orientation = "正立 (Upright)";
    }

    if (Math.abs(m) > 1) size = "放大";
    else if (Math.abs(m) < 1) size = "縮小";
    else size = "相等";

    setResult(
        <div className="space-y-1">
            <div className="font-bold">像距 (q): {q.toFixed(2)} cm</div>
            <div>性質: {type}</div>
            <div>方向: {orientation}</div>
            <div>大小: {size} (放大倍率: {Math.abs(m).toFixed(2)}x)</div>
        </div>
    );
  };

  return (
    <div className="space-y-4">
       <div className="bg-blue-50 text-blue-800 p-2 text-xs rounded">
          凸透鏡 f 為正，凹透鏡 f 為負。實物 p 恆正。
       </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">焦距 f (cm)</label>
            <input 
            type="number" 
            value={f} 
            onChange={(e) => setF(e.target.value)}
            className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">物距 p (do)</label>
            <input 
            type="number" 
            value={p} 
            onChange={(e) => setP(e.target.value)}
            className="w-full p-2 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
        </div>
      </div>
      <button 
        onClick={calculate}
        className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition"
      >
        分析成像
      </button>
      {result && (
        <div className="bg-green-50 p-3 rounded border border-green-200 text-green-900 text-sm">
          {result}
        </div>
      )}
    </div>
  );
};

export default FormulaTools;
