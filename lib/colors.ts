import { TestColor } from './types';

export const TEST_COLORS: TestColor[] = [
  {
    id: 'clear',
    color: '#c8f7c5',
    label: { en: 'Clear / Normal', bm: 'Jernih / Normal' },
    risk: 'normal',
    riskLabel: { en: 'No Virus Detected', bm: 'Tiada Virus Dikesan' },
    advice: {
      en: 'Pond water is healthy. Continue regular monitoring.',
      bm: 'Air kolam sihat. Teruskan pemantauan berkala.',
    },
  },
  {
    id: 'pale_yellow',
    color: '#fff9c4',
    label: { en: 'Pale Yellow', bm: 'Kuning Pucat' },
    risk: 'mild',
    riskLabel: { en: 'Low Risk', bm: 'Risiko Rendah' },
    advice: {
      en: 'Low bacterial activity detected. Monitor closely for 24–48 hours.',
      bm: 'Aktiviti bakteria rendah dikesan. Pantau selama 24–48 jam.',
    },
  },
  {
    id: 'yellow',
    color: '#f9e547',
    label: { en: 'Yellow', bm: 'Kuning' },
    risk: 'moderate',
    riskLabel: { en: 'Moderate Risk', bm: 'Risiko Sederhana' },
    advice: {
      en: 'Moderate infection risk. Consult a vet soon.',
      bm: 'Risiko jangkitan sederhana. Dapatkan konsultasi vet segera.',
    },
  },
  {
    id: 'orange',
    color: '#ff9800',
    label: { en: 'Orange', bm: 'Oren' },
    risk: 'high',
    riskLabel: { en: 'High Risk – WSSV Suspected', bm: 'Risiko Tinggi – WSSV Disyaki' },
    advice: {
      en: 'White Spot Syndrome Virus (WSSV) suspected. Immediate vet consultation required.',
      bm: 'Virus Bintik Putih (WSSV) disyaki. Konsultasi vet segera diperlukan.',
    },
  },
  {
    id: 'red',
    color: '#f44336',
    label: { en: 'Red', bm: 'Merah' },
    risk: 'critical',
    riskLabel: { en: 'Critical – WSSV Confirmed', bm: 'Kritikal – WSSV Disahkan' },
    advice: {
      en: 'Critical virus load detected. Emergency action required. Isolate affected ponds immediately.',
      bm: 'Beban virus kritikal dikesan. Tindakan kecemasan diperlukan. Asingkan kolam yang terjejas segera.',
    },
  },
  {
    id: 'brown',
    color: '#795548',
    label: { en: 'Dark Brown', bm: 'Perang Gelap' },
    risk: 'critical',
    riskLabel: { en: 'Severe Contamination', bm: 'Pencemaran Teruk' },
    advice: {
      en: 'Severe contamination detected. Pond must be quarantined. Emergency vet consultation mandatory.',
      bm: 'Pencemaran teruk dikesan. Kolam mesti dikuarantin. Konsultasi vet kecemasan wajib.',
    },
  },
];

export const RISK_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  normal:   { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200' },
  mild:     { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  moderate: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  high:     { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200' },
  critical: { bg: 'bg-red-100',   text: 'text-red-900',    border: 'border-red-400' },
};
