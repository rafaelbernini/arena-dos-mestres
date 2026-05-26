export { PHASES_CONFIG } from './phases.config.js';

export const DIFFICULTY = {
  timePerPhase: 60,
  maxAttempts: 3,
  freezeOnError: 2000,
  penaltyPerError: 100,
  speedBonusWindow: 20,
  speedBonusMax: 300,
  hintCost: 0,
  showAnswerAfterAttempts: 3,
  numberRange: { easy: [1,30], medium: [1,100], hard: [1,500] }
};

export const HERO_CLASSES = [
  { id:'explorador', label:'Explorador Curioso', emoji:'🧭', color:'#059669',
    perk:'Pistas extras gratuitas', description:'Para quem ama descobrir!' },
  { id:'inventor',   label:'Inventor Maluco',    emoji:'🔧', color:'#0891b2',
    perk:'Timer começa com +10 segundos', description:'Para quem ama criar soluções!' },
  { id:'artista',    label:'Artista dos Números',emoji:'🎨', color:'#7c3aed',
    perk:'Erros custam −50pts em vez de −100', description:'Para quem ama a beleza da matemática!' },
];

export const ROOMS = [
  { id:1, key:'floresta', name:'Floresta dos Números',   emoji:'🌳', theme:'multiplos',
    color:'#059669', bgColor:'#042b1a', phases:10, multiplier:1.0 },
  { id:2, key:'caverna',  name:'Caverna de Cristais',    emoji:'💎', theme:'fracoes',
    color:'#7c3aed', bgColor:'#0e082a', phases:10, multiplier:1.3 },
  { id:3, key:'porto',    name:'Porto dos Mercadores',   emoji:'⚓', theme:'decimais',
    color:'#0891b2', bgColor:'#06182b', phases:10, multiplier:1.6 },
  { id:4, key:'castelo',  name:'Castelo dos Segredos',   emoji:'🏰', theme:'inteiros',
    color:'#dc2626', bgColor:'#1a0808', phases:10, multiplier:2.0 },
];

export const SCORING = {
  BASE_POINTS: 1000,
  speedBonus(timeRemaining, maxTime) {
    const ratio = Math.max(0, timeRemaining / maxTime);
    return ratio > (1 - 20/maxTime) ? Math.floor(300 * ratio) : 0;
  },
  calculate(base, timeRemaining, maxTime, errors, multiplier=1.0) {
    const speed = this.speedBonus(timeRemaining, maxTime);
    const penalty = errors * 100;
    return Math.max(0, Math.round((base + speed - penalty) * multiplier));
  }
};
