import React from 'react';
import { Eye, EyeOff, Trash2, Box } from 'lucide-react';
import { Layer } from '../types';

interface LayerControlProps {
  layers: Layer[];
  toggleVisibility: (id: string) => void;
  updateLayerOpacity: (id: string, opacity: number) => void;
  deleteLayer?: (id: string) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({ layers, toggleVisibility, updateLayerOpacity, deleteLayer }) => {
  if (layers.length === 0) {
    return (
      <div className="py-8 text-center text-white/30">
        <p className="text-xs">暂无模型</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {layers.map((layer) => (
        <div 
          key={layer.id} 
          className="bg-white/5 hover:bg-white/10 rounded-md p-2 transition-colors group"
        >
          {/* Row 1: Name and Toggles */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <div 
                className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" 
                style={{ backgroundColor: layer.color, color: layer.color }}
              />
              <span className="font-medium text-xs text-slate-200 truncate" title={layer.name}>
                {layer.name}
              </span>
            </div>
            
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => toggleVisibility(layer.id)}
                className="p-1 hover:text-white text-slate-400 transition-colors"
                title={layer.visible ? "隐藏" : "显示"}
              >
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              {deleteLayer && (
                  <button 
                    onClick={() => deleteLayer(layer.id)}
                    className="p-1 hover:text-red-400 text-slate-400 transition-colors"
                    title="删除"
                  >
                    <Trash2 size={12} />
                  </button>
              )}
            </div>
          </div>

          {/* Row 2: Opacity Slider (Mini) */}
          <div className="flex items-center gap-2" title="透明度">
             <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={layer.opacity}
                onChange={(e) => updateLayerOpacity(layer.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
             />
          </div>
          
           <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500">
               <span>体积: {layer.volume > 0 ? layer.volume.toFixed(1) : '--'} ml</span>
               <span>{Math.round(layer.opacity * 100)}%</span>
           </div>
        </div>
      ))}
    </div>
  );
};

export default LayerControl;