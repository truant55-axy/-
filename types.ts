export interface Layer {
  id: string;
  name: string;
  file?: File;
  url?: string;
  color: string;
  visible: boolean;
  opacity: number;
  volume: number; // in ml or cm3
}
