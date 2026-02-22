import React from "react";
import DroneStats from "@/components/dashboard/Smartrobotics/Drone/DroneStats";
import DroneDetailsTable from "@/components/dashboard/Smartrobotics/Drone/DroneDetailsTable";
import DroneScanStatus from "@/components/dashboard/Smartrobotics/Drone/DroneScanStatus";
import DroneAnomaliesTable from "@/components/dashboard/Smartrobotics/Drone/DroneAnomaliesTable";
import DroneInternalGUI from "@/components/dashboard/Smartrobotics/Drone/DroneInternalGUI";
import DroneAlertsTable from "@/components/dashboard/Smartrobotics/Drone/DroneAlertsTable";
import DroneMapSection from "@/components/dashboard/Smartrobotics/Drone/DroneMapSection";
import DroneFarmBlueprint from "@/components/dashboard/Smartrobotics/Drone/DroneFarmBlueprint";

const SmartDroneDashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <DroneStats />
        <DroneScanStatus />
      </div>

      <div style={{ marginBottom: 20 }}>
        <DroneDetailsTable />
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <DroneAnomaliesTable />
        <DroneInternalGUI />
      </div>

      <div style={{ marginBottom: 20 }}>
        <DroneAlertsTable />
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <DroneMapSection />
        <DroneFarmBlueprint />
      </div>
    </div>
  );
};

export default SmartDroneDashboard;