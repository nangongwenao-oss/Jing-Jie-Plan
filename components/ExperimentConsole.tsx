import React, { useState, useEffect, useRef } from 'react';
import { Agent, RealmId, ExperimentLog } from '../types';
import { simulateExperiment } from '../services/geminiService';
import { Terminal, Play, AlertTriangle, Save, RefreshCw } from 'lucide-react';

interface ExperimentConsoleProps {
  selectedAgent: Agent | null;
  onUpdateStats: (agentId: string, newStats: any) => void;
}

export const ExperimentConsole: React.FC<ExperimentConsoleProps> = ({ selectedAgent, onUpdateStats }) => {
  const [logs, setLogs] = useState<ExperimentLog[]>([]);
  const [customScenario, setCustomScenario] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (log: ExperimentLog) => {
    setLogs(prev => [...prev, log]);
  };

  const handleRunExperiment = async (scenario: string, isFoolish: boolean = false) => {
    if (!selectedAgent) return;
    
    setIsRunning(true);
    const tempId = Date.now().toString();
    
    addLog({
      id: tempId,
      timestamp: Date.now(),
      agentId: selectedAgent.id,
      scenario: isFoolish ? `[FOOLISHNESS PROTOCOL] ${scenario}` : scenario,
      outcome: 'Analyzing quantum coherence...',
      impact: 'Calculating...'
    });

    const result = await simulateExperiment(selectedAgent, scenario, selectedAgent.currentRealm);
    
    // Update the log with actual result
    setLogs(prev => prev.map(log => 
      log.id === tempId ? {
        ...log,
        outcome: result.narrative,
        impact: Object.entries(result.statChanges)
          .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} ${(v as number) > 0 ? '+' : ''}${v}`)
          .join(', ') || "No measurable change"
      } : log
    ));

    // Update actual agent stats
    if (result.statChanges) {
       onUpdateStats(selectedAgent.id, result.statChanges);
    }

    setIsRunning(false);
  };

  return (
    <div className="flex flex-col h-full bg-black border border-zinc-800 rounded-xl overflow-hidden font-mono text-sm">
      {/* Header */}
      <div className="bg-zinc-900 p-3 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Terminal size={16} />
          <span className="font-bold tracking-wider">EXP_CONSOLE_V3</span>
        </div>
        <div className="flex space-x-2">
           <div className={`h-2 w-2 rounded-full ${selectedAgent ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
           <span className="text-xs text-zinc-500">{selectedAgent ? `LINKED: ${selectedAgent.name.toUpperCase()}` : 'NO LINK'}</span>
        </div>
      </div>

      {/* Logs Output */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/80">
        {logs.length === 0 && (
          <div className="text-zinc-600 italic text-center mt-10">
            Wait for command input... <br/>
            System ready.
          </div>
        )}
        {logs.map(log => (
          <div key={log.id} className="border-l-2 border-zinc-700 pl-3 py-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="text-zinc-400">ID: {log.agentId}</span>
            </div>
            <div className="text-blue-400 font-bold mb-1">
              {'>'} {log.scenario}
            </div>
            <div className="text-zinc-300 mb-1 leading-relaxed">
              {log.outcome}
            </div>
            <div className={`text-xs font-bold ${log.impact.includes('+') ? 'text-green-500' : 'text-zinc-500'}`}>
              RESULT: {log.impact}
            </div>
          </div>
        ))}
        {isRunning && (
            <div className="text-green-500 animate-pulse">Processing neural simulation...</div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-zinc-900 p-4 border-t border-zinc-800">
        {!selectedAgent ? (
             <div className="text-center text-red-400 py-4">SELECT AN AGENT TO BEGIN EXPERIMENTS</div>
        ) : (
            <div className="space-y-3">
                {/* Presets */}
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        disabled={isRunning}
                        onClick={() => handleRunExperiment("Force a decision that provides no personal benefit but upholds moral integrity.", true)}
                        className="flex items-center justify-center space-x-2 bg-amber-900/30 hover:bg-amber-900/50 text-amber-500 border border-amber-800 p-2 rounded transition-colors"
                    >
                        <AlertTriangle size={14} />
                        <span>Inject "Foolishness"</span>
                    </button>
                    <button 
                        disabled={isRunning}
                        onClick={() => handleRunExperiment("Confront a logical paradox specific to this realm.", false)}
                        className="flex items-center justify-center space-x-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-800 p-2 rounded transition-colors"
                    >
                        <RefreshCw size={14} />
                        <span>Logical Paradox</span>
                    </button>
                </div>
                
                {/* Custom Input */}
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        value={customScenario}
                        onChange={(e) => setCustomScenario(e.target.value)}
                        placeholder="Enter custom scenario protocol..."
                        className="flex-1 bg-black border border-zinc-700 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-white transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && customScenario && handleRunExperiment(customScenario)}
                    />
                    <button 
                        disabled={!customScenario || isRunning}
                        onClick={() => handleRunExperiment(customScenario)}
                        className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                    >
                        <Play size={16} />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};