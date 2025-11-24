import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import Header from './components/Header';
import WaveVisualizer from './components/WaveVisualizer';
import OpticsVisualizer from './components/OpticsVisualizer';
import AITutor from './components/AITutor';
import FormulaTools from './components/FormulaTools';
import { Info, CheckCircle2, AlertTriangle, Waves, Lightbulb, FlaskConical, Mic2 } from 'lucide-react';

function App() {
  const [activeVisualizer, setActiveVisualizer] = useState<'wave' | 'optics'>('wave');

  const banners = [
    { 
      id: 'wave',
      title: '波的性質', 
      desc: '頻率、週期、波長、波速關係', 
      icon: <Waves className="w-5 h-5" />,
      target: 'wave' as const
    },
    { 
      id: 'sound',
      title: '聲音傳播', 
      desc: '聲速計算、回聲應用、三要素', 
      icon: <Mic2 className="w-5 h-5" />,
      target: 'wave' as const
    },
    { 
      id: 'optics',
      title: '光學成像', 
      desc: '反射定律、折射、透鏡成像', 
      icon: <Lightbulb className="w-5 h-5" />,
      target: 'optics' as const
    },
    { 
      id: 'exp',
      title: '實驗分析', 
      desc: '圖表判讀、數據推理', 
      icon: <FlaskConical className="w-5 h-5" />,
      target: 'wave' as const // Default to wave for general experimental
    },
  ];

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          
          {/* Hero / Intro Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">八年級理化段考重點總覽</h2>
            <p className="text-slate-500 mb-4 text-sm">點擊下方主題卡片，切換對應的互動實驗工具。</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {banners.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveVisualizer(item.target)}
                  className={`text-left p-4 rounded-lg border transition-all duration-200 group relative overflow-hidden ${
                    activeVisualizer === item.target && (item.id === 'optics' || item.id === 'wave')
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500 shadow-md' 
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    item.id === 'optics' ? 'bg-amber-400' : 'bg-indigo-500'
                  } opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-md ${
                        item.id === 'optics' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="font-bold text-slate-800">{item.title}</div>
                  </div>
                  <div className="text-sm text-slate-500 pl-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Interactive Tools (Visualizer + Calculator) */}
            <div className="lg:col-span-5 space-y-8">
               {/* Dynamic Visualizer Section */}
               <div className="transition-all duration-300 ease-in-out">
                 {activeVisualizer === 'wave' ? <WaveVisualizer /> : <OpticsVisualizer />}
               </div>
               
               {/* Calculators */}
               <FormulaTools />

               {/* Tips Card */}
               <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                 <div className="flex items-center gap-2 mb-3 text-orange-800 font-bold">
                    <AlertTriangle className="w-5 h-5" />
                    <span>常考陷阱題提示</span>
                 </div>
                 <ul className="space-y-2 text-sm text-orange-900">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-orange-600" />
                        <span>聲音在不同介質速率：固體 &gt; 液體 &gt; 氣體。</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-orange-600" />
                        <span>光的折射：由快入慢偏向法線 (角度變小)。</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-orange-600" />
                        <span>平面鏡成像是「正立虛像」，物距等於像距，左右相反。</span>
                    </li>
                 </ul>
               </div>
            </div>

            {/* Right Column: AI Quiz Module */}
            <div className="lg:col-span-7 h-full">
               <div className="h-full min-h-[600px]">
                 <AITutor />
               </div>
            </div>
            
          </div>
        </main>

        <footer className="bg-slate-900 text-slate-500 py-6 mt-12 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 理化戰神. Built with Google Gemini.</p>
          <p className="mt-1 text-xs">僅供教育輔助使用，請以學校教材為主。</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;