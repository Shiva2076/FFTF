'use client';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CheckCircle, ChevronLeft, ChevronRight } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import React, { useState } from 'react';
import { api } from '@/constants';
import capitalize from 'lodash/capitalize';
import PaginationArrowButtons from '@/utils/PaginationArrowButtons';
import { formatUnderscoreString } from "@/utils/Capitalize";
import BlurWrapper from '@/components/common/BlurWrapper';

interface ParamsObject {
  stage_duration_min: number;
  stage_duration_max: number;
  ppfd_min: number;
  ppfd_max: number;
  photo_period_min: number;
  photo_period_max: number;
  temperature_min: number;
  temperature_max: number;
  humidity_min: number;
  humidity_max: number;
  co2_min: number;
  co2_max: number;
  ec_min: number;
  ec_max: number;
  do_min: number;
  do_max: number;
  ph_min: number;
  ph_max: number;
}

interface Task {
  cycle_id: number;
  crop_name: string;
  crop_variety: string;
  status: string;
  shelves_allocated: number;
  tasks: {
    task_id: number;
    description: string;
    notification_description: string;
    notification_frequency: string;
  }[];
  parameters: ParamsObject;
}

interface TaskListProps {
  taskListData: Task[];
  onCycleClick?: (cycleId: number) => void;
  ai?: boolean;
}

const TASKS_PER_PAGE = 5;

const buildParameterRows = (p: ParamsObject) => {
  const rows: { metric: string; value: string }[] = [];
  rows.push({
    metric: "Stage Duration",
    value: `${p.stage_duration_min}–${p.stage_duration_max} days`,
  });

  rows.push({
    metric: "PPFD Range",
    value: `${p.ppfd_min}–${p.ppfd_max} µmol/m²/s`,
  });

  rows.push({
    metric: "Photo Period Range",
    value: `${p.photo_period_min}–${p.photo_period_max} hrs/day`,
  });

  rows.push({
    metric: "Temperature Range",
    value: `${p.temperature_min}–${p.temperature_max} °C`,
  });

  rows.push({
    metric: "Humidity Range",
    value: `${p.humidity_min}–${p.humidity_max}%`,
  });

  rows.push({
    metric: "CO₂ Range",
    value: `${p.co2_min}–${p.co2_max} ppm`,
  });

  rows.push({
    metric: "EC Range",
    value: `${p.ec_min}–${p.ec_max} mS/cm`,
  });

  rows.push({
    metric: "pH Range",
    value: `${p.ph_min}–${p.ph_max}`,
  });

  rows.push({
    metric: "Dissolved O₂ Range",
    value: `${p.do_min}–${p.do_max} mg/L`,
  });

  return rows;
};
const statusMap: Record<string, string> = {
  TRANSPLANT: "Vegetative",
  INITIALIZED: "Seeding",
  COMPLETED: "Harvest",
};
const TaskList = ({ taskListData, onCycleClick, ai = true }: TaskListProps) => {
  const [tasks, setTasks] = useState(taskListData || []);
  const [page, setPage] = useState(0);
  const [selectedTask, setSelectedTask] = useState<{
    cycleId: number;
    taskId: number;
    notification_description: string;
  } | null>(null);
  const [actualYield, setActualYield] = useState<number>(0);
  const [harvestDate, setHarvestDate] = useState('');
  const [plantsharvestedquantity, setPlantsharvestedquantity] = useState<number>(0);
  const [seedGerminatedQty, setSeedGerminatedQty] = useState<number>(0);
  const handleCloseDialog = () => {
    setSelectedTask(null);
    setActualYield(0);
    setHarvestDate('');
    setPlantsharvestedquantity(0);
    setSeedGerminatedQty(0);
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [paramDialogOpen, setParamDialogOpen] = useState(false);
  const [paramRows, setParamRows] = useState<{ metric: string; value: string }[]>([]);
  const [paramTitle, setParamTitle] = useState<string>("");
  const handleShowParameter = (paramsObj: Task["parameters"], cropName: string, cropVariety: string, rawStatus: string) => {
  const anyNonEmpty = Object.values(paramsObj).some(
    (val) => val !== "" && val !== null && val !== undefined
  );
  const formattedCrop = formatUnderscoreString(cropName);
  const formattedVariety = formatUnderscoreString(cropVariety);
  const mappedStage = statusMap[rawStatus] || formatUnderscoreString(rawStatus.toLowerCase());
  if (!anyNonEmpty) {
    const emptyRows = buildParameterRows(paramsObj).map((row) => ({
      metric: row.metric,
      value: "No Parameter To Show",
    }));
    setParamRows(emptyRows);
    setParamTitle(`Parameters: ${formattedCrop} ${formattedVariety} – ${mappedStage}`);
    setParamDialogOpen(true);
    return;
    }

    const rows = buildParameterRows(paramsObj);
    setParamRows(rows);
    setParamTitle(`Parameters: ${formattedCrop} ${formattedVariety} – ${mappedStage}`);
    setParamDialogOpen(true);
  };

  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);

  const handleTaskDone = async (cycleId: number, taskId: number,
    extraData?: { actual_yield?: number; harvest_date?: string; seed_germinated_qty?: number; plants_harvested_quantity?:number }
  ) =>{
    try {
    await api.put(`/api/task/status/complete`, { cycle_id: cycleId, task_id: taskId,  ...(taskId === 5 && {
      actual_yield: extraData?.actual_yield,
      harvest_date: extraData?.harvest_date,
      plants_harvested_quantity: extraData?.plants_harvested_quantity,
    }),
    ...(taskId === 4 && {
      seed_germinated_qty: extraData?.seed_germinated_qty,
    }),
    });
    const updated = tasks
      .map(t =>
        t.cycle_id === cycleId
          ? { ...t, tasks: t.tasks.filter(task => task.task_id !== taskId) }
          : t
      )
      .filter(t => t.tasks.length > 0);
    setTasks(updated);
    if (page >= Math.ceil(updated.length / TASKS_PER_PAGE)) {
      setPage(prev => Math.max(0, prev - 1));
    }
  }catch(error) {
    setSnackbarMessage('Failed to mark task as done. Please try again.');
    setSnackbarOpen(true);
   }
  };

  const paginatedTasks = tasks.slice(
    page * TASKS_PER_PAGE,
    page * TASKS_PER_PAGE + TASKS_PER_PAGE
  );
  const headers = [
  { label: 'Cycle ID', width: '14%' },
  { label: 'Crop', width: '34%' },
  { label: 'Shelves Allocated', width: '18%' },
  { label: 'Current Task', width: '32%' },
  { label: 'Parameter', width: '32%' },
  { label: 'Action', width: '10%' },
];
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'white',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ position:'relative', top: '-24px',paddingTop: '16px' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 600}}>
            Task List
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontFamily: 'Poppins', color: 'rgba(0,18,25,0.60)' }}
          >
            Lists pending and ongoing farm tasks.
          </Typography>
        </Box>
        <Box sx ={{ marginBottom: '24px', marginTop: '-24px', paddingTop: '16px', display: 'flex', alignItems: 'center' }}>
        <PaginationArrowButtons
          page={page}
          totalPages={totalPages}
          handlePrev={() => setPage(p => Math.max(0, p - 1))}
          handleNext={() => setPage(p => Math.min(totalPages - 1, p + 1))}
        />
        </Box>
        </Box>
      {/* Divider */}
      <Box sx={{ height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.12)', width: 'calc(100%+ 48px)', marginLeft:"-24px", marginRight:"-24px",marginTop: '-18px'}} />
      {/* Column Headers */}
      <Box
        sx={{
        backgroundColor: 'rgba(0, 18, 25, 0.08)',
        borderRadius: '0 0 0 0',
        overflow: 'hidden',
        width: 'calc(100% + 48px)',
        ml: '-24px',
        mr: '-24px',
        py: 1, 
        }}
      >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 1,
          py: 2,
          fontWeight: 600,
          fontSize: 13,
          color: '#001219',
        }}
      >
      {headers.map((header, index) => (
      <Box
        key={index}
        sx={{
          width: header.width,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 13,
          color: '#001219',
        } }
      >
      {header.label}
      </Box>
      ))}
      </Box>
      </Box>
      <Box
        sx={{
          height: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          width: 'calc(100% + 48px)',
          marginLeft: '-24px',
          marginRight: '-24px',
        }}
      />
     {/* Table Rows */}
     <BlurWrapper isBlurred={!ai} messageType="ai">
<Box sx={{ minHeight: `${TASKS_PER_PAGE * 52}px`, overflow: 'visible' }}>
  {paginatedTasks.length > 0 ? (
    paginatedTasks.map((task, index) => (
      <React.Fragment key={task.cycle_id}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 1,
            py: 1,
          }}
        >
          <Box sx={{ width: '14%', display: 'flex', alignItems: 'center', fontSize: 12 }}>
            {task.status != 'COMPLETED' ? (
            <Typography
              sx={{
                color: '#ff5e00',
                fontWeight: 600,
                mr: 0.5,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => onCycleClick?.(task.cycle_id)}
            >
              {task.cycle_id}
            </Typography>
          ) : (
            <Typography
              sx={{
                color: '#ff5e00',
                fontWeight: 600,
                mr: 0.5,
              }}
            >
              {task.cycle_id}
            </Typography>
          )}
            </Box>
            <Box sx={{ width: '34%', display: 'flex', alignItems: 'center', fontSize: 12 }}>
            <Typography sx={{ color: '#001219' }}>
              {`${formatUnderscoreString(task.crop_name)} ${formatUnderscoreString(task.crop_variety)}`}
            </Typography>
          </Box>
          <Box sx={{ width: '18%', display: 'flex', alignItems: 'center', fontSize: 12  }}>{task.shelves_allocated}</Box>
          <Box sx={{ width: '32%', fontSize: 12 }}>
            {task.tasks[0]?.description || '—'}
          </Box>
          <Box sx={{ width: '24%',display: 'flex', alignItems: 'center', fontSize: 12  }}>
            <Button variant="outlined" size="small" sx={{ fontSize: 10 }}
            onClick={() =>
              handleShowParameter(task.parameters, task.crop_name,task.crop_variety, task.status)}
            >
              Show Parameter
            </Button>
          </Box>
          <Box sx={{ width: '8%',display: 'flex', alignItems: 'center', fontSize: 12  }}>
            <IconButton
              size="small"
              onClick={() => {
                const { task_id, notification_description } = task.tasks[0];
                setSelectedTask({
                  cycleId: task.cycle_id,
                  taskId: task_id,
                  notification_description,
                });
              }}
            >
              <Box
                sx={{
                  ml:2.5,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1.5px solid #707070',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon sx={{ fontSize: 14, color: '#4a4a4a' }} />
              </Box>
            </IconButton>
          </Box>
        </Box>
        {/* Custom divider between rows */}
        {index < paginatedTasks.length - 1 && (
          <Box sx={{ overflowX: 'visible' }}>
        <Box
          sx={{
            height: '1px',
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
            width: 'calc(100% + 48px)',
            marginLeft: '-24px',
            marginRight: '-24px',     
            }}
        />
      </Box>
      )}
      </React.Fragment>
    ))
  ) : (
    <Box
      sx={{
        height: `${TASKS_PER_PAGE * 48}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)',
        fontFamily: 'Poppins',
      }}
    >
      No pending tasks.
    </Box>
  )}
</Box>
      </BlurWrapper>
      {/* Confirmation Dialog */}
      <Dialog open={!!selectedTask} onClose={() => setSelectedTask(null)}>
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
          Confirm Task Completion
        </DialogTitle>
        <DialogContent sx={{ fontFamily: 'Poppins', fontSize: 14, color: '#001219' }}>
          {selectedTask?.notification_description}
          {selectedTask?.taskId === 4 && (
              <Box mt={2}>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Seed Germinated Quantity
                </Typography>
                <input
                  type="number"
                  value={seedGerminatedQty}
                  onChange={(e) => setSeedGerminatedQty(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    marginTop: '4px',
                  }}
                />
              </Box>
          )}
          {selectedTask?.taskId === 5 && (
          <>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Actual Yield (kg)
              </Typography>
              <input
                type="number"
                value={actualYield}
                onChange={e => setActualYield(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Actual Harvest Date
              </Typography>
              <input
                type="date"
                value={harvestDate}
                onChange={e => setHarvestDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Harvested Plants Quantity
              </Typography>
              <input
                type="number"
                value={plantsharvestedquantity}
                onChange={(e) => setPlantsharvestedquantity(Number(e.target.value))}
               style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
              />
            </Box>
          </>
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={async () => {
              if (selectedTask) {
                if (selectedTask.taskId === 5) {
                  if (!actualYield || !harvestDate || plantsharvestedquantity <= 0) {
                    setSnackbarMessage('Please fill Actual Yield, Harvest Date and Harvested Plants Quantity.');
                    setSnackbarOpen(true);
                    return;
                  }
                  await handleTaskDone(selectedTask.cycleId, selectedTask.taskId, {
                    actual_yield: actualYield,
                    harvest_date: harvestDate,
                    plants_harvested_quantity:plantsharvestedquantity,
                  });
                } else if (selectedTask.taskId === 4) {
                  if (!seedGerminatedQty) {
                    setSnackbarMessage('Please enter Seed Germinated Quantity.');
                    setSnackbarOpen(true);
                    return;
                  }
                  await handleTaskDone(selectedTask.cycleId, selectedTask.taskId, {
                    seed_germinated_qty: seedGerminatedQty,
                  });
                } else {
                  await handleTaskDone(selectedTask.cycleId, selectedTask.taskId);
                }
            
                setSelectedTask(null);
                setActualYield(0);
                setHarvestDate('');
                setPlantsharvestedquantity(0);
                setSeedGerminatedQty(0);
              }
            }}            
            variant="contained"
            sx={{ bgcolor: '#FF5E00', fontSize: 12 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={paramDialogOpen}
        onClose={() => setParamDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "#008756", 
            position: "relative",
            px: 3,
            py: 2,
          }}
        >
         {paramTitle}
         <IconButton
            aria-label="close"
            onClick={() => setParamDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]}}
              size="small"
            >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Table sx={{ minWidth: 400 }} size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(0,18,25,0.08)" }}>
                <TableCell
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: 12,
                    color: "rgba(0,18,25,0.87)",
                  }}
                >
                  Metric
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: 12,
                    color: "rgba(0,18,25,0.87)",
                  }}
                >
                  Parameters
                </TableCell>
              </TableRow>
            </TableHead>  
            <TableBody>
              {paramRows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: 12,
                      color: "rgba(0,18,25,0.87)",
                    }}
                  >
                    {row.metric}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: 12,
                      color: "rgba(0,18,25,0.87)",
                    }}
                  >
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskList;