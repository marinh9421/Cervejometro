import { BeerContainerType, BeerOption, TimeFilter } from './types';

// URL do Google Apps Script
// Melhora de Segurança: Tenta ler da variável de ambiente primeiro.
// Se não existir (dev local), usa o fallback hardcoded.
export const INITIAL_API_URL = (import.meta as any).env?.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbwltYbKn03yq7EY7oGSv7Tr1qVRXRXBnPg3YTAH54HthWnY2IxkmImxsQWSYdy2PN8N/exec'; 

export const BEER_OPTIONS: BeerOption[] = [
  {
    id: BeerContainerType.LATA_269,
    label: 'Lata P',
    volumeLabel: '269ml',
    conversionFactor: 1.00,
    icon: '/lata-269.png', // Arquivo na pasta public
    gasKey: 'v269'
  },
  {
    id: BeerContainerType.LATA_350,
    label: 'Lata M',
    volumeLabel: '350ml',
    conversionFactor: 1.30,
    icon: '/lata-350.png', // Arquivo na pasta public
    gasKey: 'v350'
  },
  {
    id: BeerContainerType.GARRAFA_600,
    label: 'Garrafa',
    volumeLabel: '600ml',
    conversionFactor: 2.23,
    icon: '/garrafa-600.png', // Arquivo na pasta public
    gasKey: 'v600'
  },
  {
    id: BeerContainerType.GARRAFA_1L,
    label: 'Litrão',
    volumeLabel: '1 Litro',
    conversionFactor: 3.72,
    icon: '/garrafa-1l.png', // Arquivo na pasta public
    gasKey: 'v1l'
  }
];

export const SUCCESS_MESSAGES = [
  "Saúde! 🍻",
  "Mais uma pro ranking! 🚀",
  "Tá chegando no topo! 🏆",
  "Hidratação em dia! 💧😄",
  "O grupo agradece sua contribuição! 🙏",
  "Descceeee redonda! 📉",
  "A saideira? Duvido. 🤔"
];

export const FUN_TITLES = [
  { min: 0, title: "🍺 Iniciante do Chopp" },
  { min: 11, title: "🍻 Frequentador de Boteco" },
  { min: 31, title: "🏆 Sommelier de Latinha" },
  { min: 61, title: "👑 Mestre Cervejeiro" },
  { min: 101, title: "🔥 Lenda do Grupo" }
];

export const FILTER_OPTIONS: { id: TimeFilter; label: string }[] = [
  { id: 'TODAY', label: 'Hoje' },
  { id: 'WEEK', label: 'Esta Semana' },
  { id: 'MONTH', label: 'Este Mês' },
  { id: 'ALL', label: 'Tudo' },
];

export const getFunTitle = (totalUnits: number): string => {
  const match = [...FUN_TITLES].reverse().find(t => totalUnits >= t.min);
  return match ? match.title : FUN_TITLES[0].title;
};

// Dados vazios pois agora usamos a API real
export const DEMO_LOGS = [];