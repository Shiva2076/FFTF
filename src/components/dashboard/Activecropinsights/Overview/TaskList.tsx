"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import { api } from "@/constants";
import PaginationArrowButtons from "@/utils/PaginationArrowButtons";

interface Task {
  task_id: number;
  description: string;
  notification_description: string;
  notification_frequency: string;
  completed_at?: string | null;
  done: boolean;
  cycle_id?: number;
  growth_cycle?: number;
  shelves_allocated?: number;
  crop_name?: string;
  crop_variety?: string;
  status?: string;
}

interface TaskListProps {
  taskListData: {
    pendingActionableTasks: Task[];
    completedActionableTasks: Task[];
    nonactionableTasks: Task[];
  };
  onGrowCycleClick?: (growthCycleId: number) => void;
}

const ESTIMATED_TASK_HEIGHT = 60;
const ITEMS_PER_PAGE = 5;
const FIXED_COMPONENT_HEIGHT = 719;

const TaskList: React.FC<TaskListProps> = ({ taskListData, onGrowCycleClick }) => {
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "reminder">("pending");
  const [page, setPage] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const [selectedTask, setSelectedTask] = useState<{ cycleId: number; taskId: number; notification_description: string } | null>(null);
  const [actualYield, setActualYield] = useState<number>(0);
  const [harvestDate, setHarvestDate] = useState('');
  const [plantsharvestedquantity, setPlantsharvestedquantity] = useState<number>(0);
  const [seedGerminatedQty, setSeedGerminatedQty] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [pendingTasks, setPendingTasks] = useState<Task[]>(taskListData.pendingActionableTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(taskListData.completedActionableTasks);

  useEffect(() => {
    setPendingTasks(taskListData.pendingActionableTasks);
    setCompletedTasks(taskListData.completedActionableTasks);
    setPage(0);
  }, [taskListData]);

  const handleTaskDone = async (cycleId: number, taskId: number, extraData?: any) => {
    setIsCompleting(true);
    try {
      await api.put(`/api/task/status/complete`, {
        cycle_id: cycleId,
        task_id: taskId,
        ...(taskId === 5 && {
          actual_yield: extraData?.actual_yield,
          harvest_date: extraData?.harvest_date,
          plants_harvested_quantity: extraData?.plants_harvested_quantity,
        }),
        ...(taskId === 4 && {
          seed_germinated_qty: extraData?.seed_germinated_qty,
        }),
      });

      const updatedTaskIndex = pendingTasks.findIndex(
        (t) => t.cycle_id === cycleId && t.task_id === taskId
      );

      if (updatedTaskIndex !== -1) {
        const completedTask = {
          ...pendingTasks[updatedTaskIndex],
          done: true,
          completed_at: new Date().toISOString(),
        };

        setCompletedTasks((prev) => [...prev, completedTask]);
        setPendingTasks((prev) => prev.filter(t => !(t.cycle_id === cycleId && t.task_id === taskId)));
      }

      setSnackbarMessage("Task marked as done.");
      setSnackbarOpen(true);
      setSelectedTask(null);
    } catch {
      setSnackbarMessage("Failed to mark task as done. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setIsCompleting(false);
    }
  };

  const getDisplayTasks = () => {
    if (activeTab === "pending") return pendingTasks;
    if (activeTab === "completed") return completedTasks;
    return taskListData.nonactionableTasks;
  };

  const displayTasks = getDisplayTasks();
  //const ITEMS_PER_PAGE = Math.floor((FIXED_COMPONENT_HEIGHT - 150) / ESTIMATED_TASK_HEIGHT);
  const totalPages = Math.ceil(displayTasks.length / ITEMS_PER_PAGE);
  const currentTasks = displayTasks.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  return (
    <Paper variant="outlined" sx={{ width: "100%", height: `${FIXED_COMPONENT_HEIGHT}px`, borderRadius: 1, overflow: "hidden", border: "1px solid rgba(0, 0, 0, 0.12)", fontFamily: "Poppins", bgcolor: "#fff", display: "flex", flexDirection: "column" }}>
      <Box display="flex" justifyContent="space-between" p={3} alignItems="center">
        <Box>
          <Typography fontWeight={600}>Task List</Typography>
          <Typography variant="body2" color="text.secondary">Lists pending, completed and reminder farm tasks.</Typography>
        </Box>
        <PaginationArrowButtons page={page} totalPages={totalPages} handlePrev={() => setPage(Math.max(page - 1, 0))} handleNext={() => setPage(Math.min(page + 1, totalPages - 1))} />
      </Box>

      <Divider sx={{ my: 0.5 }} />

      <Box display="flex" borderBottom="1px solid rgba(0,0,0,0.12)">
        {["pending", "completed", "reminder"].map((tab) => (
          <Box key={tab} flex={1} textAlign="center" sx={{ py: 1, borderBottom: activeTab === tab ? "2px solid #ff5e00" : "none", color: activeTab === tab ? "#001219" : "rgba(0, 18, 25, 0.6)", cursor: "pointer" }} onClick={() => { setActiveTab(tab as typeof activeTab); setPage(0); }}>
            <Typography fontWeight={500} fontSize="0.875rem" textTransform="uppercase">{tab === "pending" ? "Pending" : tab === "completed" ? "Completed" : "Reminder"}</Typography>
          </Box>
        ))}
      </Box>

      <Box p={3} display="flex" flexDirection="column" gap={1} flex={1} overflow="hidden" justifyContent={currentTasks.length < ITEMS_PER_PAGE ? "flex-start" : "space-between"}>
        {currentTasks.length === 0 ? (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: "0.875rem", color: "rgba(0, 18, 25, 0.87)" }}>No Pending Task</Box>
        ) : (
          currentTasks.map((task) => (
          <Box
            key={task.task_id}
            sx={{
              alignSelf: "stretch",
              borderRadius: "4px",
              backgroundColor: "rgba(0, 18, 25, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "1rem 1.5rem 1rem 1rem",
              gap: "1rem",
            }}
          >
            {/* Text block */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "0.75rem",
              }}
            >
              <Typography
                sx={{
                  alignSelf: "stretch",
                  letterSpacing: "0.1px",
                  lineHeight: "157%",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#001219",
                }}
              >
                {task.description}
              </Typography>
              <Typography
                sx={{
                  alignSelf: "stretch",
                  fontSize: "0.725rem",
                  letterSpacing: "0.4px",
                  lineHeight: "166%",
                  color: "rgba(0, 18, 25, 0.6)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {activeTab === "pending" ? (
                    <span
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => task.growth_cycle && onGrowCycleClick?.(task.growth_cycle)}
                    >
                      Grow Cycle {task.growth_cycle ?? "-"}
                    </span>
                  ) : (
                    <>Grow Cycle {task.growth_cycle ?? "-"}</>
                  )}
                  {" | "} {task.cycle_id ?? "-"} | Shelves: {task.shelves_allocated ?? "-"}
              </Typography>
            </Box>
        
            {/* Icon block */}
            <Box sx={{ pr: 0 }}>
              {activeTab === "pending" && (
                <IconButton
                  onClick={() =>
                    setSelectedTask({
                      cycleId: task.cycle_id ?? 0,
                      taskId: task.task_id,
                      notification_description: task.notification_description,
                    })
                  }
                >
                  <Box
                    sx={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "100px",
                      border: "1.5px solid #707070",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 14, color: "#4a4a4a" }} />
                  </Box>
                </IconButton>
              )}
            </Box>
          </Box>
        ))
        )}
      </Box>

      <Dialog open={!!selectedTask} onClose={() => setSelectedTask(null)}>
        <DialogTitle>Confirm Task Completion</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{selectedTask?.notification_description}</Typography>
          {selectedTask?.taskId === 4 && (
            <Box mt={2}>
              <Typography variant="caption">Seed Germinated Quantity</Typography>
              <input type="number" value={seedGerminatedQty} onChange={(e) => setSeedGerminatedQty(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
            </Box>
          )}
          {selectedTask?.taskId === 5 && (
            <>
              <Box>
                <Typography variant="caption">Actual Yield (kg)</Typography>
                <input type="number" value={actualYield} onChange={(e) => setActualYield(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </Box>
              <Box>
                <Typography variant="caption">Harvest Date</Typography>
                <input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </Box>
              <Box>
                <Typography variant="caption">Harvested Plants Quantity</Typography>
                <input type="number" value={plantsharvestedquantity} onChange={(e) => setPlantsharvestedquantity(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTask(null)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!selectedTask) return;
              const { cycleId, taskId } = selectedTask;
              if (taskId === 5 && (!actualYield || !harvestDate || !plantsharvestedquantity)) {
                setSnackbarMessage("Please fill all fields for yield task.");
                setSnackbarOpen(true);
                return;
              }
              if (taskId === 4 && !seedGerminatedQty) {
                setSnackbarMessage("Please enter seed germinated quantity.");
                setSnackbarOpen(true);
                return;
              }
              await handleTaskDone(cycleId, taskId, {
                actual_yield: actualYield,
                harvest_date: harvestDate,
                plants_harvested_quantity: plantsharvestedquantity,
                seed_germinated_qty: seedGerminatedQty,
              });
            }}
            variant="contained"
            sx={{ bgcolor: "#FF5E00" }}
            disabled={isCompleting}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TaskList;
