import React, { useState, useRef, useCallback } from 'react';
import { Upload, Sun, RotateCcw, Plus, Activity } from 'lucide-react';
import Scene from './components/Scene';
import LayerControl from './components/LayerControl';
import { Layer } from './types';

const DEFAULT_LAYERS: Layer[] = [
  { id: '1', name: '上颌导板', color: '#f472b6', visible: true, opacity: 0.9, volume: 68.37 },
  { id: '2', name: '下颌导板', color: '#94a3b8', visible: true, opacity: 0.8, volume: 63.05 },
  { id: '3', name: '骨骼结构', color: '#34d399', visible: true, opacity: 1.0, volume: 72.49 },
];

export default function App() {
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);
  // brightness: 1.0 = Pure White, 0.0 = Pure Black
  const [brightness, setBrightness] = useState<number>(1.0); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: file.name.replace('.stl', '').substring(0, 15),
      file: file,
      url: objectUrl,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      visible: true,
      opacity: 1.0,
      volume: 0
    };

    setLayers(prev => [...prev, newLayer]);
    event.target.value = '';
  };

  const handleVolumeUpdate = useCallback((id: string, volume: number) => {
      setLayers(prev => prev.map(l => l.id === id ? { ...l, volume } : l));
  }, []);

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const updateLayerOpacity = (id: string, opacity: number) => {
    setLayers(layers.map(l => l.id === id ? { ...l, opacity } : l));
  };

  const deleteLayer = (id: string) => {
      setLayers(prev => prev.filter(l => l.id !== id));
  };

  const handleReset = () => {
      setLayers(DEFAULT_LAYERS);
      setBrightness(1.0);
  };

  return (
    <div className="relative w-full h-screen bg-white text-slate-100 overflow-hidden">
      
      {/* 3D Scene - Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <Scene 
            layers={layers} 
            brightness={brightness} 
            onVolumeCalculated={handleVolumeUpdate}
            canvasRef={canvasRef}
        />
      </div>

      {/* Floating Panel - Minimalist Glass Effect */}
      <div className="absolute top-4 left-4 z-10 w-64 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Activity className="text-blue-500" size={16} />
                <h1 className="font-bold text-sm tracking-wide text-white">医学影像 3D 视图</h1>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
                {layers.length} 对象
            </div>
        </div>

        {/* Layer List (Scrollable) */}
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
             <LayerControl 
                layers={layers} 
                toggleVisibility={toggleLayerVisibility}
                updateLayerOpacity={updateLayerOpacity}
                deleteLayer={deleteLayer}
            />
        </div>

        {/* Action Footer */}
        <div className="p-3 border-t border-white/10 space-y-3 bg-black/20 rounded-b-xl">
            {/* Main Actions */}
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded text-xs font-medium transition-colors"
                >
                    <Upload size={12} /> 导入 STL
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".stl" className="hidden" />
                
                <button 
                    onClick={handleReset}
                    className="flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-slate-200 py-1.5 rounded text-xs transition-colors"
                >
                    <RotateCcw size={12}/> 重置
                </button>
            </div>

            {/* Brightness Control */}
            <div className="pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1"><Sun size={10} /> 背景亮度</span>
                    <span>{Math.round(brightness * 100)}%</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={brightness}
                    onChange={(e) => setBrightness(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[8px] text-slate-500 mt-1 px-1">
                    <span>黑</span>
                    <span>白</span>
                </div>
            </div>
        </div>
      </div>

      {/* Info Overlay (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
         <div className="bg-slate-900/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5 text-[10px] text-slate-600 font-medium">
             <span className="text-slate-400">左键：</span>旋转 · <span className="text-slate-400">右键：</span>平移 · <span className="text-slate-400">滚轮：</span>缩放
         </div>
      </div>

    </div>
  );
}