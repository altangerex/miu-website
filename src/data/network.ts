// Schematic (not geographic) layout for the "Global Network" diagram.
// Deliberately elbow-routed, P&ID/circuit-trace style rather than a literal
// map — see project notes: a textured-earth/globe treatment reads as a
// logistics brand, not an engineering-led technical distributor.

export type Tier = 'sensors' | 'electrical' | 'mechanical';

export interface NetworkOrigin {
  brand: string;
  tier: Tier;
  x: number;
  y: number;
}

export const VIEWBOX = { w: 1120, h: 520 };
export const BUS_Y = 170;
export const HUB = { x: 560, y: 270 };
export const DEST_BUS_Y = 360;

export const ORIGINS: NetworkOrigin[] = [
  { brand: 'Siemens', tier: 'electrical', x: 80, y: 56 },
  { brand: 'ABB', tier: 'electrical', x: 320, y: 56 },
  { brand: 'Schneider Electric', tier: 'electrical', x: 560, y: 56 },
  { brand: 'Yokogawa', tier: 'sensors', x: 800, y: 56 },
  { brand: 'Fluke', tier: 'sensors', x: 1040, y: 56 },
];

export interface NetworkDestination {
  key: 'client0' | 'target0' | 'target1';
  status: 'client' | 'target';
  x: number;
  y: number;
}

export const DESTINATIONS: NetworkDestination[] = [
  { key: 'client0', status: 'client', x: 360, y: 460 },
  { key: 'target0', status: 'target', x: 560, y: 460 },
  { key: 'target1', status: 'target', x: 760, y: 460 },
];

/** Single-elbow orthogonal path: drop to a shared bus row, then one diagonal leg. */
export function elbowPath(x1: number, y1: number, busY: number, x2: number, y2: number): string {
  return `M ${x1} ${y1} V ${busY} L ${x2} ${y2}`;
}
