import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Sliders } from 'lucide-react';

const WaveVisualizer: React.FC = () => {
  const [frequency, setFrequency] = useState(1);
  const [amplitude, setAmplitude] = useState(10);

  const data = useMemo(() => {
    const points = [];
    // Generate 2 cycles worth of points based on frequency 1
    const basePoints = 50; 
    for (let i = 0; i <= basePoints; i++) {
      const x = i;
      // y = A * sin(2 * PI * f * (x / total_width))
      const rad = (2 * Math.PI * frequency * i) / basePoints;
      const y = amplitude * Math.sin(rad);
      points.push({ x, y });
    }
    return points;
  }, [frequency, amplitude]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800">波形實驗室 (Wave Lab)</h3>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        調整頻率 (Frequency) 與振幅 (Amplitude)，觀察波形的變化。這有助於理解圖表題型。
      </p>

      <div className="h-64 w-full bg-slate-50 rounded-lg mb-6 border border-slate-100 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="x" type="number" domain={[0, 50]} hide />
            <YAxis domain={[-20, 20]} hide />
            <Tooltip 
              formatter={(value: number) => value.toFixed(2)}
              labelFormatter={() => ''}
            />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#6366f1" 
              strokeWidth={3} 
              dot={false} 
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs text-slate-500 font-mono">
           v = f × λ
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">頻率 (Hz): {frequency}</label>
          <input 
            type="range" 
            min="0.5" 
            max="5" 
            step="0.5" 
            value={frequency} 
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-slate-500 mt-1">頻率越高，波越密集 (波長變短)。</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">振幅 (cm): {amplitude}</label>
          <input 
            type="range" 
            min="2" 
            max="18" 
            step="1" 
            value={amplitude} 
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-slate-500 mt-1">振幅越大，聲音/光越強 (能量越大)。</p>
        </div>
      </div>
    </div>
  );
};

export default WaveVisualizer;
