import React from 'react';
import { Agent, RealmConfig } from '../types';
import { Users, Activity } from 'lucide-react';

interface RealmCardProps {
  config: RealmConfig;
  agents: Agent[];
  isActive: boolean;
  onSelectAgent: (agentId: string) => void;
  onSelectRealm: () => void;
  isTargetMode: boolean;
  activityLevel: number;
}

export const RealmCard: React.FC<RealmCardProps> = ({
  config,
  agents,
  isActive,
  onSelectAgent,
  onSelectRealm,
  isTargetMode,
  activityLevel
}) => {
  return (
    <div 
      onClick={isTargetMode ? onSelectRealm : undefined}
      className={`
        relative h-full flex flex-col p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden
        ${config.themeColor}
        ${isTargetMode ? 'cursor-pointer hover:scale-[1.02] ring-2 ring-white/50 animate-pulse' : ''}
        ${isActive ? 'border-opacity-100 shadow-lg shadow-white/5' : 'border-opacity-30'}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
          <h2 className={`text-xl font-bold font-serif ${config.accentColor} mb-1`}>{config.name}</h2>
          <p className="text-xs text-zinc-400 font-mono leading-tight max-w-[200px]">{config.description}</p>
        </div>
        <div className="flex items-center space-x-2 bg-black/40 px-2 py-1 rounded text-xs font-mono">
          <Activity size={12} className={config.accentColor} />
          <span className="text-zinc-300">{activityLevel}% Act.</span>
        </div>
      </div>

      {/* Background Ambience */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-black/80 pointer-events-none`} />

      {/* Agents Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 z-10 content-start overflow-y-auto pr-1">
        {agents.map(agent => (
          <button
            key={agent.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAgent(agent.id);
            }}
            className={`
              group flex flex-col items-center p-2 rounded bg-black/40 border border-white/10
              hover:bg-white/10 transition-colors text-left
              ${agent.status === 'traversing' ? 'opacity-50 blur-[1px]' : 'opacity-100'}
            `}
          >
            <div className="relative">
               <img 
                src={agent.avatar} 
                alt={agent.name} 
                className="w-10 h-10 rounded-full border border-zinc-600 group-hover:border-white transition-colors"
              />
              <span className={`
                absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black
                ${agent.status === 'debating' ? 'bg-red-500 animate-pulse' : 
                  agent.status === 'traversing' ? 'bg-yellow-400' : 'bg-green-500'}
              `} />
            </div>
            <span className="mt-2 text-xs font-semibold text-zinc-300 truncate w-full text-center">
              {agent.name}
            </span>
            <div className="flex gap-1 mt-1">
                 {/* Mini Stats Indicator */}
                 <div className="h-1 w-1 rounded-full bg-blue-400" title="Philosophy" style={{opacity: agent.stats.philosophy/100}} />
                 <div className="h-1 w-1 rounded-full bg-purple-400" title="Art" style={{opacity: agent.stats.art/100}} />
                 <div className="h-1 w-1 rounded-full bg-cyan-400" title="Science" style={{opacity: agent.stats.science/100}} />
            </div>
          </button>
        ))}
        {agents.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center h-32 text-zinc-600 font-mono text-xs">
            <Users size={24} className="mb-2 opacity-50" />
            <span>NO PRESENCE DETECTED</span>
          </div>
        )}
      </div>
      
      {/* Footer / Traverse Hint */}
      {isTargetMode && (
         <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
            <span className="text-white font-bold tracking-widest border border-white px-4 py-2 rounded">
              CONFIRM TRAVERSAL
            </span>
         </div>
      )}
    </div>
  );
};