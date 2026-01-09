import React, { useEffect, useState, useMemo } from 'react';
import Header from './components/Header';
import BeerEntryForm from './components/BeerEntryForm';
import StatsCards from './components/StatsCards';
import Leaderboard from './components/Leaderboard';
import ConsumptionChart from './components/ConsumptionChart';
import LoginScreen from './components/LoginScreen';
import { ConsumptionLog, BeerOption, User } from './types';
import { dataService, calculateUserStats, calculateDashboardStats, getCurrentUser, setCurrentUser, getApiUrl } from './services/dataService';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setLocalUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<ConsumptionLog[]>([]);
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      // 1. Check local login state
      const savedUser = getCurrentUser();

      // 2. Check configuration before fetching
      const apiUrl = getApiUrl();
      if (!apiUrl) {
        setLoading(false);
        return;
      }
      
      // 3. Fetch remote data (logs and user list for validation)
      try {
        const { logs: fetchedLogs, users: fetchedUsers } = await dataService.fetchData();
        setLogs(fetchedLogs);
        setExistingUsers(fetchedUsers);
        
        // Validate saved session against fetched users
        if (savedUser) {
           const validUser = fetchedUsers.find(u => u.username === savedUser.username);
           if (validUser) {
             setLocalUser(validUser);
           } else {
             // If user is saved locally but not in the fresh fetch (maybe deleted?), log them out
             // OR keep them if we suspect cache issues, but safer to sync with source of truth.
             // However, for offline support/optimistic UI, one might keep them, but here we validate.
             setCurrentUser(null);
           }
        }
      } catch (e) {
        console.error("Initialization error", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLogin = (user: User) => {
    setLocalUser(user);
    setCurrentUser(user);
    
    // Crucial: Update the list of existing users if this is a new registration
    // This ensures that if the user logs out without refreshing the page, 
    // the app knows this user exists.
    setExistingUsers(prev => {
      if (!prev.find(u => u.username === user.username)) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const handleLogout = () => {
    setLocalUser(null);
    setCurrentUser(null);
  };

  const handleAddLog = async (type: BeerOption, quantity: number) => {
    if (!currentUser) return;

    // Optimistic Update for UI responsiveness
    const optimisticLog: ConsumptionLog = {
      id: 'temp-' + Date.now(),
      timestamp: new Date().toISOString(),
      userName: currentUser.username, // Important: mapping by username now
      containerType: type.id,
      quantity,
      equivalentUnits: parseFloat((quantity * type.conversionFactor).toFixed(2))
    };
    
    setLogs(prev => [...prev, optimisticLog]);

    // Send to Backend
    try {
      await dataService.submitLog(currentUser, type, quantity);
      // In a real scenario, we might want to re-fetch here to get the real ID, 
      // but purely optimistic is fine for this UX.
    } catch (e) {
      alert("Erro ao salvar. Verifique sua conexão.");
      setLogs(prev => prev.filter(l => l.id !== optimisticLog.id));
    }
  };

  // Derived state (Filter logs based on usernames to ensure consistency)
  // Mapping logs.userName (which comes from the sheet column 'user') to current user context
  const userStats = useMemo(() => calculateUserStats(logs), [logs]);
  const dashboardStats = useMemo(() => calculateDashboardStats(logs), [logs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Carregando barril...</p>
        </div>
      </div>
    );
  }

  // Show Login Screen if not authenticated
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} existingUsers={existingUsers} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      {/* User Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center max-w-5xl mx-auto">
         <span className="text-xs text-slate-500">Logado como <strong className="text-amber-600">{currentUser.name}</strong></span>
         <button 
           onClick={handleLogout}
           className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
         >
           <LogOut className="w-3 h-3" /> Sair
         </button>
      </div>
      
      <main className="pt-6">
        <BeerEntryForm 
          onAddLog={handleAddLog} 
          currentUser={currentUser}
        />
        
        <StatsCards stats={dashboardStats} />
        
        <Leaderboard data={userStats} />
        
        <ConsumptionChart logs={logs} />
      </main>

      <footer className="w-full text-center py-6 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Quantas Foi Mesmo?. Beba com moderação.</p>
      </footer>
    </div>
  );
};

export default App;