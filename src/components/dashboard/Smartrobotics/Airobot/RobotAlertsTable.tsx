// src/components/smart-robotics/AlertsTable.tsx
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const RobotAlertsTable: React.FC = () => {
  const alerts = [
    { id: 'DRT001', alert: 'EC level dropped below threshold in zone 3' },
    { id: 'DRT002', alert: 'Humidity levels exceeding 80% in growing area' },
    { id: 'DRT003', alert: 'Pest infestation detected in crop section 5' },
    { id: 'DRT004', alert: 'Temperature fluctuation beyond ideal range' },
    { id: 'DRT005', alert: 'Nutrient solution pH out of optimal range' },
  ];
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '4px', mt: 2 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'rgba(0,18,25,0.08)' }}>
          <TableRow>
            <TableCell>Drone ID</TableCell>
            <TableCell>AI Alert</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.alert}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RobotAlertsTable;
