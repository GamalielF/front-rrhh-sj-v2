export interface TestRow {
  id: string;
  name: string;
  category?: string;
  status?: string;
}

export const DEMO_DATA: TestRow[] = [
  { id: '#001', name: 'A' },
  { id: '#002', name: 'B' },
];

export const DEMO_DATA_TABLE_ROWS: TestRow[] = [
  { id: '#001', name: 'A', category: 'Cat 1', status: 'Activo' },
  { id: '#002', name: 'B', category: 'Cat 2', status: 'Pendiente' },
  { id: '#003', name: 'C', category: 'Cat 1', status: 'Activo' },
  { id: '#004', name: 'D', category: 'Cat 3', status: 'Inactivo' },
  { id: '#005', name: 'E', category: 'Cat 2', status: 'Activo' },
  { id: '#006', name: 'F', category: 'Cat 1', status: 'Pendiente' },
  { id: '#007', name: 'G', category: 'Cat 3', status: 'Activo' },
  { id: '#008', name: 'H', category: 'Cat 2', status: 'Inactivo' },
  { id: '#009', name: 'I', category: 'Cat 1', status: 'Activo' },
  { id: '#010', name: 'J', category: 'Cat 2', status: 'Pendiente' },
];
