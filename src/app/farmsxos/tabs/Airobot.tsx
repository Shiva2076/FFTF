import React from "react";
import RobotStats from "@/components/dashboard/Smartrobotics/Airobot/RobotStats";
import RobotDetailsTable from "@/components/dashboard/Smartrobotics/Airobot/RobotDetailsTable";
import RobotScanStatus from "@/components/dashboard/Smartrobotics/Airobot/RobotScanStatus";
import RobotAnomaliesTable from "@/components/dashboard/Smartrobotics/Airobot/RobotAnomaliesTable";
import RobotInternalGUI from "@/components/dashboard/Smartrobotics/Airobot/RobotInternalGUI";
import RobotAlertsTable from "@/components/dashboard/Smartrobotics/Airobot/RobotAlertsTable";
import RobotMapSection from "@/components/dashboard/Smartrobotics/Airobot/RobotMapSection";
import RobotFarmBlueprint from "@/components/dashboard/Smartrobotics/Airobot/RobotFarmBlueprint";

const SmartRoboticsDashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <RobotStats />
        <RobotScanStatus />
      </div>

      <div style={{ marginBottom: 20 }}>
        <RobotDetailsTable />
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <RobotAnomaliesTable />
        <RobotInternalGUI />
      </div>

      <div style={{ marginBottom: 20 }}>
        <RobotAlertsTable />
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <RobotMapSection />
        <RobotFarmBlueprint />
      </div>
    </div>
  );
};

export default SmartRoboticsDashboard;
