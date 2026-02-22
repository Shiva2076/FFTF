"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  Button,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "@/constants";
import { formatUnderscoreString } from "@/utils/Capitalize";

const statusOptions = [
  "INITIALIZED",
  "SEEDING",
  "TRANSPLANT",
  "VEGETATIVE",
  "HARVEST",
  "COMPLETED",
];

export interface CropCycleData {
  cycle_id?: number;
  crop_name: string;
  crop_variety: string;
  treatment_id: string;
  status: string;
  sowing_date: string;
  transplant_date: string;
  vegetative_end_date: string;
  expected_harvest_date: string;
  actual_harvest_date: string;
  expected_yield: string;
  actual_yield: string;
  seed_sown_quantity: string;
  seed_germinated_quantity: string;
  plants_transplanted_quantity: string;
  plants_harvested_quantity: string;
  farm_id?: number;
  cycle_score?: number | null;
  shelf_occupancy?: string | null;
  growth_cycle?: number | null;
  created_date?: string;
  last_modified_date?: string;
}

const defaultForm: CropCycleData = {
  cycle_id: undefined,
  crop_name: "",
  crop_variety: "",
  treatment_id: "",
  status: "INITIALIZED",
  sowing_date: "",
  transplant_date: "",
  vegetative_end_date: "",
  expected_harvest_date: "",
  actual_harvest_date: "",
  expected_yield: "",
  actual_yield: "",
  seed_sown_quantity: "",
  seed_germinated_quantity: "",
  plants_transplanted_quantity: "",
  plants_harvested_quantity: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  cropData?: Partial<CropCycleData>;
  onUpdate: (data: CropCycleData) => void;
}

const dateFields = new Set([
  "sowing_date",
  "transplant_date",
  "vegetative_end_date",
  "expected_harvest_date",
  "actual_harvest_date",
]);

const excludedFields = new Set([
  "created_date",
  "last_modified_date",
  "farm_id",
  "growth_cycle",
  "shelf_occupancy",
  "cycle_score",
  "plants_harvested_quantity",
  "actual_yield",
  "expected_yield",
  "actual_harvest_date",
]);

const EditCropCycleModal: React.FC<Props> = ({
  open,
  onClose,
  cropData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<CropCycleData>(defaultForm);
  const [originalDates, setOriginalDates] = useState({
    sowing_date: "",
    transplant_date: "",
    vegetative_end_date: "",
    expected_harvest_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to compare status values
  const compareStatus = (status1: string, status2: string): number => {
    const statusOrder = ["INITIALIZED", "SEEDING", "TRANSPLANT", "VEGETATIVE", "HARVEST", "COMPLETED"];
    const index1 = statusOrder.indexOf(status1.toUpperCase());
    const index2 = statusOrder.indexOf(status2.toUpperCase());
    if (index1 === -1 || index2 === -1) return 0;
    return index1 - index2;
  };

  // Check if fields should be required (status >= 'TRANSPLANT' with empty fields OR status >= 'HARVEST')
  const shouldRequireFields = (): boolean => {
    const currentStatus = formData.status?.toUpperCase() || '';
    const harvestStatus = 'HARVEST';
    const transplantStatus = 'TRANSPLANT';
    
    // Always required when status >= HARVEST
    if (compareStatus(currentStatus, harvestStatus) >= 0) {
      return true;
    }
    
    // Required when status >= TRANSPLANT AND fields are empty
    if (compareStatus(currentStatus, transplantStatus) >= 0) {
      const seedSownQty = String(formData.seed_sown_quantity || '').trim();
      const plantsTransplantedQty = String(formData.plants_transplanted_quantity || '').trim();
      return seedSownQty === '' || plantsTransplantedQty === '';
    }
    
    return false;
  };

  useEffect(() => {
    if (cropData) {
      const updatedData: Record<string, any> = { ...cropData };

      dateFields.forEach((field) => {
        const dateValue = cropData[field as keyof CropCycleData];
        if (dateValue) {
          const localDate = new Date(dateValue);
          updatedData[field] = localDate.toISOString().split("T")[0];
        }
      });

      setFormData((prev) => ({ ...prev, ...updatedData }));
      
      // Store original dates for calculating offsets
      setOriginalDates({
        sowing_date: updatedData.sowing_date || "",
        transplant_date: updatedData.transplant_date || "",
        vegetative_end_date: updatedData.vegetative_end_date || "",
        expected_harvest_date: updatedData.expected_harvest_date || "",
      });
    }
  }, [cropData]);

  const calculateDaysDifference = (date1: string, date2: string): number => {
    if (!date1 || !date2) return 0;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  };

  const addDaysToDate = (dateStr: string, days: number): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (field: keyof CropCycleData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // If sowing_date is changed
      if (field === "sowing_date" && value) {
        const sowingOffset = calculateDaysDifference(
          originalDates.sowing_date,
          value
        );

        if (originalDates.transplant_date) {
          newData.transplant_date = addDaysToDate(
            originalDates.transplant_date,
            sowingOffset
          );
        }
        if (originalDates.vegetative_end_date) {
          newData.vegetative_end_date = addDaysToDate(
            originalDates.vegetative_end_date,
            sowingOffset
          );
        }
        if (originalDates.expected_harvest_date) {
          newData.expected_harvest_date = addDaysToDate(
            originalDates.expected_harvest_date,
            sowingOffset
          );
        }
      }

      // If transplant_date is changed
      if (field === "transplant_date" && value) {
        const transplantOffset = calculateDaysDifference(
          originalDates.transplant_date,
          value
        );

        if (originalDates.vegetative_end_date) {
          newData.vegetative_end_date = addDaysToDate(
            originalDates.vegetative_end_date,
            transplantOffset
          );
        }
        if (originalDates.expected_harvest_date) {
          newData.expected_harvest_date = addDaysToDate(
            originalDates.expected_harvest_date,
            transplantOffset
          );
        }
      }

      return newData;
    });
  };

  const handleChange = (field: keyof CropCycleData, value: string) => {
    if (field === "sowing_date" || field === "transplant_date") {
      handleDateChange(field, value);
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };
        
        // If status changes from >= HARVEST to < HARVEST, clear related errors
        if (field === "status") {
          const oldStatus = prev.status?.toUpperCase() || '';
          const newStatus = value.toUpperCase();
          const harvestStatus = 'HARVEST';
          const wasRequired = compareStatus(oldStatus, harvestStatus) >= 0;
          const isNowRequired = compareStatus(newStatus, harvestStatus) >= 0;
          
          if (wasRequired && !isNowRequired) {
            setErrors((prevErrors) => {
              const newErrors = { ...prevErrors };
              delete newErrors.seed_sown_quantity;
              delete newErrors.plants_transplanted_quantity;
              return newErrors;
            });
          }
        }
        
        return newData;
      });
    }
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.cycle_id) {
      console.error("Missing cycle_id");
      return;
    }

    // Validate required fields when status >= 'TRANSPLANT' with empty fields OR status >= 'HARVEST'
    const newErrors: Record<string, string> = {};
    const currentStatus = formData.status?.toUpperCase() || '';
    const harvestStatus = 'HARVEST';
    const transplantStatus = 'TRANSPLANT';
    
    // Always validate when status >= HARVEST
    const isHarvestOrAbove = compareStatus(currentStatus, harvestStatus) >= 0;
    
    // Validate when status >= TRANSPLANT AND fields are empty
    const isTransplantOrAbove = compareStatus(currentStatus, transplantStatus) >= 0;
    const seedSownQty = String(formData.seed_sown_quantity || '').trim();
    const plantsTransplantedQty = String(formData.plants_transplanted_quantity || '').trim();
    const hasEmptyFields = seedSownQty === '' || plantsTransplantedQty === '';
    
    if (isHarvestOrAbove || (isTransplantOrAbove && hasEmptyFields)) {
      if (!seedSownQty) {
        newErrors.seed_sown_quantity = 'Seed sown quantity is required';
      }
      if (!plantsTransplantedQty) {
        newErrors.plants_transplanted_quantity = 'Plants transplanted quantity is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload: CropCycleData = {
      ...formData,
      farm_id: cropData?.farm_id ?? 0,
      cycle_score: cropData?.cycle_score ?? null,
      growth_cycle: cropData?.growth_cycle ?? null,
      created_date: cropData?.created_date ?? new Date().toISOString(),
      last_modified_date: new Date().toISOString(),
    };

    dateFields.forEach((field) => {
      const value = payload[field as keyof CropCycleData];
      if (value) {
        const utc = new Date(value as string).toISOString();
        (payload as any)[field] = utc;
      }
    });

    try {
      delete (payload as any).shelf_occupancy;
      await api.put(`/api/cropcycle/${formData.cycle_id}`, payload);
      onUpdate(payload);
      onClose();
    } catch (error) {
      console.error("Failed to update crop cycle", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Fixed Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          pb: 2,
          mb: 2,
          borderBottom: "1px solid #ddd",
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "#fff",
        }}
      >
        <Typography fontWeight={600} fontSize="1.25rem" color="#008756">
          Edit Crop Cycle
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "#ff5e00" }} />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto", p: 3, pt: 2 }}>
        {(Object.keys(formData) as (keyof CropCycleData)[])
          .filter((key) => !excludedFields.has(key))
          .map((key) => {
            const label = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            const isReadOnly =
              key === "cycle_id" ||
              key === "crop_name" ||
              key === "crop_variety" ||
              key === "treatment_id" ||
              key === "vegetative_end_date" ||
              key === "expected_harvest_date";

            const displayValue =
             (key === "crop_name" || key === "crop_variety") && formData[key]
               ? formatUnderscoreString(formData[key] as string)
               : formData[key] || "";

            return (
              <Box key={key} mb={2}>
                {key === "status" ? (
                  <FormControl fullWidth disabled={isReadOnly}>
                    <InputLabel id={`${key}-label`} shrink>
                      Status
                    </InputLabel>
                    <Select
                      labelId={`${key}-label`}
                      id={`${key}-select`}
                      value={formData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      label="Status"
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : dateFields.has(key) ? (
                  <TextField
                    fullWidth
                    type="date"
                    label={label}
                    InputLabelProps={{ shrink: true }}
                    value={formData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    disabled={isReadOnly}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label={label}
                    value={displayValue}
                    onChange={(e) => handleChange(key, e.target.value)}
                    disabled={isReadOnly}
                    required={
                      shouldRequireFields() && 
                      (key === "seed_sown_quantity" || key === "plants_transplanted_quantity")
                    }
                    error={!!errors[key]}
                    helperText={errors[key]}
                  />
                )}
              </Box>
            );
          })}
        <Button
          fullWidth
          sx={{ backgroundColor: "#ff5e00", color: "white", mt: 2 }}
          onClick={handleSubmit}
        >
          Update Cycle
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditCropCycleModal;