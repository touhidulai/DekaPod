export type Language = 'en' | 'bm';
export type UserRole = 'farmer' | 'vet';
export type RiskLevel = 'normal' | 'mild' | 'moderate' | 'high' | 'critical';
export type ConsultationStatus = 'pending' | 'active' | 'completed';
export type ConsultationType = 'chat' | 'video';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  farmName?: string;
}

export interface TestColor {
  id: string;
  color: string;
  label: { en: string; bm: string };
  risk: RiskLevel;
  riskLabel: { en: string; bm: string };
  advice: { en: string; bm: string };
}

export interface WaterTest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  colorId: string;
  colorHex: string;
  colorLabel: { en: string; bm: string };
  riskLevel: RiskLevel;
  photoData?: string;
  notes: string;
  timestamp: number;
  consultationId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: number;
}

export interface Consultation {
  id: string;
  testId: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  colorLabel: { en: string; bm: string };
  riskLevel: RiskLevel;
  vetId?: string;
  vetName?: string;
  status: ConsultationStatus;
  type: ConsultationType;
  messages: Message[];
  transcript?: string;
  videoLink?: string;
  timestamp: number;
}
