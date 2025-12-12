import React, { useState, useEffect, useMemo } from 'react';
import { REALMS, INITIAL_AGENTS } from './constants';
import { Agent, AgentStats, RealmId } from './types';
import { RealmCard } from './components/RealmCard';
import { AgentRadar } from './components/AgentRadar';
import { ExperimentConsole } from './components/ExperimentConsole';
import { simulateTraversal } from './services/geminiService';
import { 
  Map, 
  Activity, 
  Settings, 
  ShieldAlert, 
  User, 
  ArrowRight
} from 'lucide-react';

const App = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [traversalMode, setTraversalMode] = useState<boolean>(false);
  const [realmActivities, setRealmActivities] = useState<Record<RealmId, number>>({
    [RealmId.LANTING]: 45,
    [RealmId.SOLVAY]: 62,
    [RealmId.GOOSE_LAKE]: 78,
    [RealmId.DONGSHAN]: 30
  });

  // Derived state
  const selectedAgent = useMemo(() => 
    agents.find(a => a.id === selectedAgentId) || null
  , [agents, selectedAgentId]);

  const jingjieIndex = useMemo(() => {
    if (!selectedAgent) return 0;
    const s = selectedAgent.stats;
    return Math.round((s.philosophy + s.art + s.science + s.ethics) / 4);
  }, [selectedAgent]);

  // Simulate real-time activity fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealmActivities(prev => {
        const next = { ...prev };
        (Object.keys(next) as RealmId[]).forEach(key => {
            const change = Math.floor(Math.random() * 10) - 5;
            next[key] = Math.max(10, Math.min(100, next[key] + change));
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleAgentSelect = (id: string) => {
    if (traversalMode) {
        // Can't select new agent while in traversal target selection
        if (selectedAgentId !== id) {
             setTraversalMode(false);
             setSelectedAgentId(id);
        }
    } else {
        setSelectedAgentId(id);
    }
  };

  const initTraversal = () => {
    if (selectedAgent && selectedAgent.status !== 'traversing') {
        setTraversalMode(true);
    }
  };

  const handleRealmSelect = async (targetRealmId: RealmId) => {
    if (!traversalMode || !selectedAgent) return;
    if (selectedAgent.currentRealm === targetRealmId) {
        setTraversalMode(false); // Cancel if same realm
        return;
    }

    // Execute Traversal
    const agentName = selectedAgent.name;
    const oldRealm = selectedAgent.currentRealm;
    
    // Optimistic Update
    setAgents(prev => prev.map(a => a.id === selectedAgent.id ? { ...a, status: 'traversing' } : a));
    setTraversalMode(false);

    // Call AI Service for narrative (optional, not blocking UI much)
    await simulateTraversal(selectedAgent, oldRealm, targetRealmId);

    // Complete Move after "delay"
    setTimeout(() => {
        setAgents(prev => prev.map(a => a.id === selectedAgent.id ? { 
            ...a, 
            currentRealm: targetRealmId,
            status: 'idle' // Reset status
        } : a));
    }, 2000);
  };

  const handleUpdateStats = (agentId: string, changes: Partial<AgentStats>) => {
    setAgents(prev => prev.map(a => {
        if (a.id !== agentId) return a;
        const newStats = { ...a.stats };
        (Object.keys(changes) as Array<keyof AgentStats>).forEach(k => {
            if (changes[k]) {
                newStats[k] = Math.max(0, Math.min(100, newStats[k] + (changes[k] || 0)));
            }
        });
        return { ...a, stats: newStats };
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-8 h-8 rounded flex items-center justify-center">
                <Map className="text-white" size={20} />
            </div>
            <div>
                <h1 className="font-bold text-lg tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                    JINGJIE PLAN
                </h1>
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Four Realms Control Platform</p>
            </div>
        </div>
        
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>SYSTEM ONLINE</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Settings size={16} />
            </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        
        {/* Left: Four Realms Map (Grid) */}
        <section className="lg:col-span-8 flex flex-col">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-zinc-400 font-mono text-sm uppercase flex items-center">
                  <Activity size={16} className="mr-2" />
                  Real-time Surveillance
              </h2>
              {traversalMode && (
                  <div className="animate-pulse text-yellow-400 font-bold font-mono text-sm">
                      SELECT TARGET REALM FOR TRAVERSAL
                  </div>
              )}
           </div>

           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[500px]">
              {Object.values(REALMS).map(realm => (
                  <RealmCard 
                    key={realm.id}
                    config={realm}
                    agents={agents.filter(a => a.currentRealm === realm.id)}
                    isActive={selectedAgent?.currentRealm === realm.id}
                    onSelectAgent={handleAgentSelect}
                    onSelectRealm={() => handleRealmSelect(realm.id)}
                    isTargetMode={traversalMode}
                    activityLevel={realmActivities[realm.id]}
                  />
              ))}
           </div>
        </section>

        {/* Right: Agent Control & Experiment */}
        <section className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* 1. Agent Status Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col h-1/2">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-mono text-xs text-zinc-500 uppercase">Agent Telemetry</h3>
                    {selectedAgent && (
                         <div className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono text-white">
                            JJ-IDX: <span className="text-purple-400 font-bold">{jingjieIndex}</span>
                         </div>
                    )}
                </div>

                {selectedAgent ? (
                    <div className="flex flex-col h-full">
                        <div className="flex items-center space-x-4 mb-4">
                            <img src={selectedAgent.avatar} className="w-16 h-16 rounded-full border-2 border-zinc-700" alt="avatar" />
                            <div>
                                <h2 className="text-xl font-bold font-serif">{selectedAgent.name}</h2>
                                <p className="text-xs text-zinc-400">{selectedAgent.description}</p>
                                <div className="mt-2 flex space-x-2">
                                    <button 
                                        onClick={initTraversal}
                                        disabled={selectedAgent.status === 'traversing'}
                                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs px-3 py-1 rounded flex items-center transition-colors"
                                    >
                                        <ArrowRight size={12} className="mr-1" />
                                        Traverse
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Radar Chart */}
                        <div className="flex-1 min-h-[200px] relative">
                            <AgentRadar 
                                stats={selectedAgent.stats} 
                                color={REALMS[selectedAgent.currentRealm].accentColor.replace('text-', '').replace('-400', '-500')} // Simple rough mapping for demo
                            />
                            {/* Overlay Stat Text for quick reading */}
                            <div className="absolute top-0 right-0 text-[10px] text-zinc-500 font-mono space-y-1">
                                <div>PHI: {selectedAgent.stats.philosophy}</div>
                                <div>ART: {selectedAgent.stats.art}</div>
                                <div>SCI: {selectedAgent.stats.science}</div>
                                <div>ETH: {selectedAgent.stats.ethics}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                        <User size={48} className="mb-2 opacity-20" />
                        <p className="text-sm font-mono">SELECT AGENT FROM MAP</p>
                    </div>
                )}
            </div>

            {/* 2. Experiment Console */}
            <div className="flex-1 h-1/2 min-h-[300px]">
                 <ExperimentConsole 
                    selectedAgent={selectedAgent}
                    onUpdateStats={handleUpdateStats}
                 />
            </div>

        </section>
      </main>
    </div>
  );
};

export default App;