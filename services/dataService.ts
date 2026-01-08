import { ConsumptionLog, UserStats, DashboardStats, BeerOption, User, BeerContainerType } from '../types';
import { getFunTitle, BEER_OPTIONS, INITIAL_API_URL } from '../constants';

const STORAGE_USER_KEY = 'beer-meter-user';

// --- Helper Functions ---

export const getApiUrl = (): string => {
  return INITIAL_API_URL;
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
};

// --- API Service ---

export const dataService = {
  fetchData: async (): Promise<{ logs: ConsumptionLog[], users: User[] }> => {
    try {
      // Adiciona timestamp para evitar cache do navegador e do Apps Script
      const cacheBuster = `?t=${Date.now()}`;
      const url = getApiUrl() + cacheBuster;

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store' // Força o navegador a não usar cache
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      
      // Parse Users
      // Sheet header: id, username, password, email, name, avatar
      const users: User[] = (data.users || []).slice(1).map((row: any[]) => ({
        id: String(row[0]),
        username: String(row[1]),
        password: String(row[2]),
        name: String(row[4]),
        avatar: String(row[5])
      }));

      // Parse Logs
      // Sheet header: id, v600, v1l, v269, v350, user, date, photo
      // Index mapping: 0:id, 1:v600, 2:v1l, 3:v269, 4:v350, 5:user, 6:date
      const logs: ConsumptionLog[] = (data.ranking || []).slice(1).map((row: any[]) => {
        let type = BeerContainerType.LATA_350; // default
        let qty = 0;

        // Determine which column has the quantity
        if (row[1] > 0) { type = BeerContainerType.GARRAFA_600; qty = Number(row[1]); }
        else if (row[2] > 0) { type = BeerContainerType.GARRAFA_1L; qty = Number(row[2]); }
        else if (row[3] > 0) { type = BeerContainerType.LATA_269; qty = Number(row[3]); }
        else if (row[4] > 0) { type = BeerContainerType.LATA_350; qty = Number(row[4]); }

        // Find conversion factor
        const option = BEER_OPTIONS.find(o => o.id === type);
        const factor = option ? option.conversionFactor : 1;

        return {
          id: String(row[0]),
          containerType: type,
          quantity: qty,
          userName: String(row[5]),
          timestamp: String(row[6]),
          equivalentUnits: parseFloat((qty * factor).toFixed(2))
        };
      });

      return { logs, users };

    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  submitLog: async (user: User, beerOption: BeerOption, quantity: number) => {
    const payload = {
      action: 'addRanking',
      id: Date.now().toString(),
      user: user.username,
      date: new Date().toISOString(),
      [beerOption.gasKey]: quantity
    };

    // Using POST with text/plain prevents CORS preflight issues in some GAS setups
    return fetch(getApiUrl(), {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  registerUser: async (user: User) => {
    const payload = {
      action: 'updateUser',
      id: user.id,
      username: user.username,
      password: user.password,
      name: user.name,
      avatar: user.avatar
    };

    return fetch(getApiUrl(), {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

// --- Stats Calculations ---

export const calculateUserStats = (logs: ConsumptionLog[]): UserStats[] => {
  const statsMap: Record<string, UserStats> = {};

  logs.forEach(log => {
    if (!statsMap[log.userName]) {
      statsMap[log.userName] = {
        userName: log.userName,
        totalEquivalent: 0,
        rank: 0,
        title: '',
        lastDrinkTime: ''
      };
    }
    statsMap[log.userName].totalEquivalent += log.equivalentUnits;
    if (log.timestamp > statsMap[log.userName].lastDrinkTime) {
      statsMap[log.userName].lastDrinkTime = log.timestamp;
    }
  });

  // Calculate Rank and Title
  const sortedUsers = Object.values(statsMap).sort((a, b) => b.totalEquivalent - a.totalEquivalent);
  
  return sortedUsers.map((stat, index) => ({
    ...stat,
    rank: index + 1,
    title: getFunTitle(stat.totalEquivalent)
  }));
};

export const calculateDashboardStats = (logs: ConsumptionLog[]): DashboardStats => {
  if (logs.length === 0) {
    return {
      totalGroupUnits: 0,
      averagePerPerson: 0,
      individualRecord: null,
      dailyRecord: null
    };
  }

  const totalGroupUnits = logs.reduce((acc, log) => acc + log.equivalentUnits, 0);
  const uniqueUsers = new Set(logs.map(l => l.userName)).size;
  const averagePerPerson = uniqueUsers > 0 ? totalGroupUnits / uniqueUsers : 0;

  const userTotals: Record<string, number> = {};
  logs.forEach(l => {
    userTotals[l.userName] = (userTotals[l.userName] || 0) + l.equivalentUnits;
  });
  
  let bestUser = '';
  let maxUserTotal = 0;
  Object.entries(userTotals).forEach(([user, total]) => {
    if (total > maxUserTotal) {
      maxUserTotal = total;
      bestUser = user;
    }
  });

  // Daily Record
  const dailyTotals: Record<string, number> = {};
  logs.forEach(l => {
    const dateKey = new Date(l.timestamp).toLocaleDateString(); 
    dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + l.equivalentUnits;
  });

  let bestDay = '';
  let maxDayTotal = 0;
  Object.entries(dailyTotals).forEach(([day, total]) => {
    if (total > maxDayTotal) {
      maxDayTotal = total;
      bestDay = day; 
    }
  });
  
  const sampleLogForBestDay = logs.find(l => new Date(l.timestamp).toLocaleDateString() === bestDay);
  const bestDayIso = sampleLogForBestDay ? sampleLogForBestDay.timestamp : new Date().toISOString();

  return {
    totalGroupUnits,
    averagePerPerson,
    individualRecord: bestUser ? { user: bestUser, amount: maxUserTotal } : null,
    dailyRecord: maxDayTotal > 0 ? { date: bestDayIso, amount: maxDayTotal } : null
  };
};