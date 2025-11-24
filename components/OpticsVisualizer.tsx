import React, { useState, useMemo } from 'react';
import { Lightbulb } from 'lucide-react';

const OpticsVisualizer: React.FC = () => {
  // SVG Coordinate System: 500 x 300
  // Center (Lens) at (250, 150)
  const W = 500;
  const H = 300;
  const CX = 250;
  const CY = 150;

  // State in "Lens Units" (arbitrary pixels relative to canvas)
  const [f, setF] = useState(60); // Focal length
  const [doVal, setDoVal] = useState(120); // Object Distance

  // Fixed Object Height
  const ho = 40;

  // Calculate Image Distance (di) and Magnification (m)
  // 1/f = 1/do + 1/di  => di = (f * do) / (do - f)
  const di = useMemo(() => {
    if (doVal === f) return Infinity;
    return (f * doVal) / (doVal - f);
  }, [f, doVal]);

  const m = di === Infinity ? Infinity : -di / doVal;
  
  // Coordinates
  const objX = CX - doVal;
  const objY = CY - ho; // Top of object (arrow tip)

  const f1X = CX - f;
  const f2X = CX + f;

  // Image coordinates
  // If di is positive (Real), image is to right.
  // If di is negative (Virtual), image is to left.
  const imgX = CX + di;
  // Image Tip Y: CY - (m * ho). Note: if m is negative (inverted), term is positive, Y > CY (below axis).
  const imgTipY = CY - (m * ho);

  // Ray Tracing helpers
  // Ray 1: Parallel to axis from Object Tip -> Lens Plane -> F2
  // Path: (objX, objY) -> (CX, objY) -> ... extended through (f2X, CY)
  // Slope of refracted ray 1: (CY - objY) / (f2X - CX) = (CY - objY) / f
  const ray1EndX = W;
  const slope1 = (CY - objY) / f;
  const ray1EndY = CY + slope1 * (W - CX);

  // Ray 2: Through Optical Center (undeviated)
  // Path: (objX, objY) -> (CX, CY) -> ... extended
  // Slope: (CY - objY) / (CX - objX) = ho / doVal
  const ray2EndX = W; 
  // y - CY = slope * (x - CX)
  const slope2 = (CY - objY) / (CX - objX); // basically ho/do
  const ray2EndY = CY + slope2 * (W - CX);

  const isReal = di > 0;
  const isVirtual = di < 0 && di !== -Infinity;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-800">透鏡成像實驗室 (Lens Lab)</h3>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        調整物距 (p) 與焦距 (f)，觀察凸透鏡的成像變化 (實像/虛像)。
      </p>

      <div className="w-full bg-slate-900 rounded-lg mb-6 border border-slate-700 relative overflow-hidden shadow-inner" style={{ height: '300px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
           {/* Markers */}
           <defs>
             <marker id="head-obj" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
               <path d="M0,0 L6,3 L0,6 L1,3 Z" fill="#f87171" />
             </marker>
             <marker id="head-img" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
               <path d="M0,0 L6,3 L0,6 L1,3 Z" fill={isReal ? "#4ade80" : "#fbbf24"} />
             </marker>
           </defs>

           {/* Principal Axis */}
           <line x1="0" y1={CY} x2={W} y2={CY} stroke="#475569" strokeWidth="2" />
           {/* Lens Plane */}
           <line x1={CX} y1="20" x2={CX} y2={H-20} stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
           {/* Lens Shape (Stylized) */}
           <ellipse cx={CX} cy={CY} rx="6" ry="110" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" />

           {/* Foci */}
           <circle cx={f1X} cy={CY} r="3" fill="#fbbf24" />
           <text x={f1X-10} y={CY+20} fill="#fbbf24" fontSize="12" fontFamily="monospace">F1</text>
           <circle cx={f2X} cy={CY} r="3" fill="#fbbf24" />
           <text x={f2X-10} y={CY+20} fill="#fbbf24" fontSize="12" fontFamily="monospace">F2</text>
           <text x={CX-20} y={H-5} fill="#38bdf8" fontSize="10" opacity="0.6">凸透鏡</text>

           {/* Object */}
           <line x1={objX} y1={CY} x2={objX} y2={objY} stroke="#f87171" strokeWidth="4" markerEnd="url(#head-obj)" />
           <text x={objX-10} y={objY-10} fill="#f87171" fontSize="12">物</text>

           {/* Image */}
           {di !== Infinity && Math.abs(di) < 2000 && (
             <>
               <line 
                 x1={imgX} y1={CY} 
                 x2={imgX} y2={imgTipY} 
                 stroke={isReal ? "#4ade80" : "#fbbf24"} 
                 strokeWidth="4" 
                 markerEnd="url(#head-img)"
                 strokeDasharray={isReal ? "" : "4,4"}
                 opacity={Math.abs(imgX) > W + 500 ? 0 : 1} // Hide if way off screen
               />
               <text x={imgX} y={imgTipY > CY ? imgTipY + 20 : imgTipY - 10} fill={isReal ? "#4ade80" : "#fbbf24"} fontSize="12" textAnchor="middle">
                 {isReal ? '像' : '虛像'}
               </text>
             </>
           )}

           {/* Rays (Only Draw simplified forward rays for clarity) */}
           {/* Ray 1: Parallel -> F2 */}
           <polyline points={`${objX},${objY} ${CX},${objY} ${W},${ray1EndY}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
           
           {/* Ray 2: Center */}
           <line x1={objX} y1={objY} x2={W} y2={ray2EndY} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
           
           {/* Virtual Extension lines (if virtual) */}
           {isVirtual && (
              <>
                <line x1={CX} y1={objY} x2={imgX} y2={imgTipY} stroke="rgba(253, 224, 71, 0.3)" strokeDasharray="4,4" />
                <line x1={CX} y1={CY} x2={imgX} y2={imgTipY} stroke="rgba(253, 224, 71, 0.3)" strokeDasharray="4,4" />
              </>
           )}

        </svg>

        {/* Info Overlay */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded text-xs font-mono backdrop-blur-sm border border-slate-600">
           <div>p = {doVal.toFixed(0)}</div>
           <div>q = {di === Infinity ? '∞' : di.toFixed(0)}</div>
           <div>M = {m === Infinity ? '∞' : Math.abs(m).toFixed(2)}x</div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
            <span>物距 (Object Dist.)</span>
            <span className="text-indigo-600 font-bold">{doVal}</span>
          </label>
          <input 
            type="range" 
            min="10" 
            max="200" 
            step="1" 
            value={doVal} 
            onChange={(e) => setDoVal(parseFloat(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
            <span>焦距 (Focal Length)</span>
            <span className="text-amber-600 font-bold">{f}</span>
          </label>
          <input 
            type="range" 
            min="20" 
            max="100" 
            step="1" 
            value={f} 
            onChange={(e) => setF(parseFloat(e.target.value))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-500 border border-slate-200">
         <span className="font-bold">觀念提示：</span> 
         <ul className="list-disc list-inside mt-1 space-y-1">
            <li>當 p &gt; 2f：縮小倒立實像 (相機原理)</li>
            <li>當 2f &gt; p &gt; f：放大倒立實像 (投影機原理)</li>
            <li>當 p &lt; f：放大正立虛像 (放大鏡原理)</li>
         </ul>
      </div>
    </div>
  );
};

export default OpticsVisualizer;