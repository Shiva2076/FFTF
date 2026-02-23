// constant1.tsx
// Static FarmsXOS crop cycle data + Farm Overview dashboard data.
// All values are derived from the 7 live DB rows (cycles 5012-5019).

// ─── Cycle Types ──────────────────────────────────────────────────────────────

export interface ShelfConfig {
  rack_id: number;
  shelf_id: number;
}

export interface ActiveShelfData {
  config: ShelfConfig[];
  total_shelves: number;
  plugs_per_channel: number;
  channels_per_shelf: number;
}

export interface WaitingForShelf {
  rack_id: number;
  shelf_id: number;
  currently_occupied_by: number;
  queued_after: number | null;
  queue_position: number;
  total_in_queue: number;
  waiting_since: string;
  occupying_cycle_status: string;
  occupying_harvest_date: string;
}

export interface ScheduledTimeline {
  scheduled_sowing: string;
  scheduled_transplant: string;
  scheduled_harvest: string;
  calculated_based_on_occupying_cycle: number;
  calculated_based_on_queued_cycle: number | null;
}

export interface PendingShelfData {
  waitingForShelf: WaitingForShelf;
  scheduled_timeline: ScheduledTimeline;
}

export type CycleStatus = 'SEEDING' | 'PENDING' | 'INITIALIZED' | 'TRANSPLANT' | 'HARVESTED';

export interface CropCycle {
  cycle_id: number;
  farm_id: number;
  crop_name: string;
  crop_variety: string;
  batch_id: number;
  sowing_date: string;
  transplant_date: string;
  harvest_date: string;
  actual_harvest_date: string | null;
  yield_kg: number;
  actual_yield_kg: number | null;
  days_to_germination: number | null;
  days_to_transplant: number | null;
  days_to_harvest: number | null;
  status: CycleStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  shelf_data: ActiveShelfData | PendingShelfData;
  packaging_date: string;
  growth_cycle: number;
  completed_at: string | null;
  crop_type: string;
  crop_category: string | null;
}

// ─── Cycle Data ───────────────────────────────────────────────────────────────

export const FARMSXOS_CYCLES: CropCycle[] = [
  // ── Cycle 5012 · Arugula Cultivated · Farm 149 ──────────────────────────────
  {
    cycle_id: 5012,
    farm_id: 149,
    crop_name: 'arugula',
    crop_variety: 'cultivated',
    batch_id: 437,
    sowing_date: '2026-02-13T00:00:00.000Z',
    transplant_date: '2026-03-01T00:00:00.000Z',
    harvest_date: '2026-03-28T00:00:00.000Z',
    actual_harvest_date: null,
    yield_kg: 0.66,
    actual_yield_kg: null,
    days_to_germination: 20,
    days_to_transplant: 15,
    days_to_harvest: 12,
    status: 'SEEDING',
    notes: null,
    created_at: '2026-02-12T07:50:36.745Z',
    updated_at: '2026-02-13T18:31:02.951Z',
    shelf_data: {
      config: [{ rack_id: 1, shelf_id: 1 }],
      total_shelves: 1,
      plugs_per_channel: 11,
      channels_per_shelf: 2,
    },
    packaging_date: '2026-03-21T00:00:00.000Z',
    growth_cycle: 90,
    completed_at: null,
    crop_type: 'Leafy-Greens',
    crop_category: null,
  },

  // ── Cycle 5013 · Basil Sweet · Farm 149 (PENDING – queued after 5012) ───────
  {
    cycle_id: 5013,
    farm_id: 149,
    crop_name: 'basil',
    crop_variety: 'sweet',
    batch_id: 438,
    sowing_date: '2026-03-06T18:30:00.000Z',
    transplant_date: '2026-03-28T18:30:00.000Z',
    harvest_date: '2026-04-15T18:30:00.000Z',
    actual_harvest_date: null,
    yield_kg: 0.66,
    actual_yield_kg: null,
    days_to_germination: null,
    days_to_transplant: null,
    days_to_harvest: null,
    status: 'PENDING',
    notes: null,
    created_at: '2026-02-12T09:57:34.436Z',
    updated_at: '2026-02-12T09:57:34.692Z',
    shelf_data: {
      waitingForShelf: {
        rack_id: 1,
        shelf_id: 1,
        currently_occupied_by: 5012,
        queued_after: null,
        queue_position: 1,
        total_in_queue: 1,
        waiting_since: '2026-02-12T09:57:34.435Z',
        occupying_cycle_status: 'INITIALIZED',
        occupying_harvest_date: '2026-03-28T07:50:36.671Z',
      },
      scheduled_timeline: {
        scheduled_sowing: '2026-03-06T18:30:00.000Z',
        scheduled_transplant: '2026-03-28T18:30:00.000Z',
        scheduled_harvest: '2026-04-15T18:30:00.000Z',
        calculated_based_on_occupying_cycle: 5012,
        calculated_based_on_queued_cycle: null,
      },
    },
    packaging_date: '2026-04-09T18:30:00.000Z',
    growth_cycle: 91,
    completed_at: null,
    crop_type: 'Leafy-Greens',
    crop_category: null,
  },

  // ── Cycle 5014 · Basil Genovese · Farm 148 ──────────────────────────────────
  {
    cycle_id: 5014,
    farm_id: 148,
    crop_name: 'basil',
    crop_variety: 'genovese',
    batch_id: 439,
    sowing_date: '2026-02-17T05:44:50.764Z',
    transplant_date: '2026-03-11T05:44:50.764Z',
    harvest_date: '2026-03-29T05:44:50.764Z',
    actual_harvest_date: null,
    yield_kg: 7.5,
    actual_yield_kg: null,
    days_to_germination: null,
    days_to_transplant: null,
    days_to_harvest: null,
    status: 'SEEDING',
    notes: null,
    created_at: '2026-02-16T05:44:50.992Z',
    updated_at: '2026-02-16T18:31:00.224Z',
    shelf_data: {
      config: [{ rack_id: 1, shelf_id: 1 }],
      total_shelves: 1,
      plugs_per_channel: 6,
      channels_per_shelf: 50,
    },
    packaging_date: '2026-03-23T05:44:50.764Z',
    growth_cycle: 92,
    completed_at: null,
    crop_type: 'Leafy-Greens',
    crop_category: null,
  },

  // ── Cycle 5015 · Arugula General · Farm 148 ─────────────────────────────────
  {
    cycle_id: 5015,
    farm_id: 148,
    crop_name: 'arugula',
    crop_variety: 'general',
    batch_id: 440,
    sowing_date: '2026-02-17T05:54:41.093Z',
    transplant_date: '2026-03-05T05:54:41.093Z',
    harvest_date: '2026-04-01T05:54:41.093Z',
    actual_harvest_date: null,
    yield_kg: 12.0,
    actual_yield_kg: null,
    days_to_germination: null,
    days_to_transplant: null,
    days_to_harvest: null,
    status: 'SEEDING',
    notes: null,
    created_at: '2026-02-16T05:54:41.313Z',
    updated_at: '2026-02-16T18:31:00.298Z',
    shelf_data: {
      config: [{ rack_id: 1, shelf_id: 4 }],
      total_shelves: 1,
      plugs_per_channel: 6,
      channels_per_shelf: 50,
    },
    packaging_date: '2026-03-25T05:54:41.093Z',
    growth_cycle: 93,
    completed_at: null,
    crop_type: 'Leafy-Greens',
    crop_category: null,
  },

  // ── Cycle 5017 · Arugula Wild · Farm 148 ────────────────────────────────────
  {
    cycle_id: 5017,
    farm_id: 148,
    crop_name: 'arugula',
    crop_variety: 'wild',
    batch_id: 442,
    sowing_date: '2026-02-18T10:53:21.029Z',
    transplant_date: '2026-03-06T10:53:21.029Z',
    harvest_date: '2026-04-02T10:53:21.029Z',
    actual_harvest_date: null,
    yield_kg: 6.0,
    actual_yield_kg: null,
    days_to_germination: null,
    days_to_transplant: null,
    days_to_harvest: null,
    status: 'SEEDING',
    notes: null,
    created_at: '2026-02-17T10:53:21.243Z',
    updated_at: '2026-02-18T18:31:02.831Z',
    shelf_data: {
      config: [{ rack_id: 1, shelf_id: 3 }],
      total_shelves: 1,
      plugs_per_channel: 6,
      channels_per_shelf: 50,
    },
    packaging_date: '2026-03-26T10:53:21.029Z',
    growth_cycle: 94,
    completed_at: null,
    crop_type: 'Leafy-Greens',
    crop_category: null,
  },

  // ── Cycle 5018 · Basil Sweet · Farm 148 ─────────────────────────────────────
  {
    cycle_id: 5018,
    farm_id: 148,
    crop_name: 'basil',
    crop_variety: 'sweet',
    batch_id: 443,
    sowing_date: '2026-02-18T10:53:23.736Z',
    transplant_date: '2026-03-12T10:53:23.736Z',
    harvest_date: '2026-03-30T10:53:23.736Z',
    actual_harvest_date: null,
    yield_kg: 9.0,
    actual_yield_kg: null,
    days_to_germination: null,
    days_to_transplant: null,
    days_to_harvest: null,
    status: 'SEEDING',
    notes: null,
    created_at: '2026-02-17T10:53:23.955Z',
    updated_at: '2026-02-18T18:31:03.355Z',
    shelf_data: {
      config: [{ rack_id: 1, shelf_id: 5 }],
      total_shelves: 1,
      plugs_per_channel: 6,
      channels_per_shelf: 50,
    },
    packaging_date: '2026-03-24T10:53:23.736Z',
    growth_cycle: 95,
    completed_at: null,
    crop_type: 'Leafy-Greens',
    crop_category: null,
  },

  // ── Cycle 5019 · Coriander Indian · Farm 148 ────────────────────────────────
  {
    cycle_id: 5019,
    farm_id: 148,
    crop_name: 'coriander',
    crop_variety: 'indian',
    batch_id: 444,
    sowing_date: '2026-02-18T10:53:26.197Z',
    transplant_date: '2026-03-10T10:53:26.197Z',
    harvest_date: '2026-04-07T10:53:26.197Z',
    actual_harvest_date: null,
    yield_kg: 9.0,
    actual_yield_kg: null,
    days_to_germination: null,
    days_to_transplant: null,
    days_to_harvest: null,
    status: 'SEEDING',
    notes: null,
    created_at: '2026-02-17T10:53:26.416Z',
    updated_at: '2026-02-18T18:31:03.568Z',
    shelf_data: {
      config: [{ rack_id: 1, shelf_id: 6 }],
      total_shelves: 1,
      plugs_per_channel: 6,
      channels_per_shelf: 50,
    },
    packaging_date: '2026-03-31T10:53:26.197Z',
    growth_cycle: 96,
    completed_at: null,
    crop_type: 'Leafy-Greens',
    crop_category: null,
  },
];

// ─── Static Auth Credentials ─────────────────────────────────────────────────
// Mock user shown when no real session exists (dev / static demo).

export const STATIC_USER = {
  user_id: 'static-demo-001',
  username: 'FreshFromTheFuture',
  email: 'demo@innofarms.ai',
  role: 'admin',
  user_type: 'primary' as const,
  phone_code: '',
  phone_number: '',
  verified: true,
  markettrendsubscribed: true,
  usersubscription: [] as any[],
};

// Mock farm that matches the 5 active cycles in Farm 148
export const STATIC_FARM = {
  farm_id: 148,
  farm_name: 'INNOFarms Vertical Farm',
  country: 'India',
  status: 'SETUP DONE',
  iot: true,
  ai: true,
  growth_cycles: [92, 93, 94, 95, 96],
};

// ─── Cycle Helpers ────────────────────────────────────────────────────────────

export const getCyclesByFarm = (farmId: number): CropCycle[] =>
  FARMSXOS_CYCLES.filter((c) => c.farm_id === farmId);

export const getCycleById = (cycleId: number): CropCycle | undefined =>
  FARMSXOS_CYCLES.find((c) => c.cycle_id === cycleId);

export const getPendingCycles = (): CropCycle[] =>
  FARMSXOS_CYCLES.filter((c) => c.status === 'PENDING');

export const getActiveCycles = (): CropCycle[] =>
  FARMSXOS_CYCLES.filter((c) => c.status !== 'PENDING');

// ─── Farm Overview Static Dashboard Data ─────────────────────────────────────
//
// Derived from Farm 148 (5 active SEEDING cycles: 5014, 5015, 5017, 5018, 5019)
//   Crops    : arugula/general, arugula/wild, basil/genovese, basil/sweet, coriander/indian
//   Shelf use: Rack 1 – Shelves 1, 3, 4, 5, 6 (5 of 8 shelves in use)
//   Yield    : 7.5 + 12.0 + 6.0 + 9.0 + 9.0 = 43.5 kg total
//
// Farm 149 has 1 SEEDING (5012) + 1 PENDING (5013) — data for that farm uses
// the same shape with different numbers.
// ─────────────────────────────────────────────────────────────────────────────

export const STATIC_DASHBOARD_DATA = {
  // ── Controls ─────────────────────────────────────────────────────────────────
  showTimeline: false,
  lockActiveCropInsightTab: false,
  lockGrowCycleTab: false,

  // ── Performance Tab ───────────────────────────────────────────────────────────
  performanceTab: {

    // Top four summary cards
    topCardsData: {
      overallEnvironment: '78%',
      resourceEfficiency: '82%',
      cropPerformance: '91%',
      predictedProfit: 'N/A',
    },

    // Farm Details card
    // farmName / farmLocation / farmCountry are overridden in the page from
    // selectedFarm when the farm selector is used.
    farmDetails: {
      farmName: 'INNOFarms – Vertical Farm',
      farmLocation: 'Delhi-NCR',
      farmCountry: 'India',
      farmArea: 5000,          // sq. ft.
      totalRacks: 1,
      totalShelvesPerRack: 8,
      activeCropVarieties: 5,  // arugula/general, arugula/wild, basil/genovese, basil/sweet, coriander/indian
      activeCycles: 5,
    },

    // Crop Distribution donut chart (Farm 148, 5 equal cycles → 20% each)
    cropDistributionData: [
      { crop_name: 'arugula',   crop_variety: 'general',  cycles: 1, percentage: 20 },
      { crop_name: 'arugula',   crop_variety: 'wild',     cycles: 1, percentage: 20 },
      { crop_name: 'basil',     crop_variety: 'genovese', cycles: 1, percentage: 20 },
      { crop_name: 'basil',     crop_variety: 'sweet',    cycles: 1, percentage: 20 },
      { crop_name: 'coriander', crop_variety: 'indian',   cycles: 1, percentage: 20 },
    ],

    // Resource pie charts
    // Rack 1: shelves 1, 3, 4, 5, 6 occupied → 5 of 8 shelves = 62.5 %
    // Water: 43.5 kg × ~2 L/kg ≈ 87 L crop usage; 800 L consumable from 1000 L tank
    // Energy: 210 kWh representative total consumption
    farmResourcesData: {
      racksUsage: {
        totalRacks: 1,
        racksInUse: 1,
        rackUsePercentage: 100,
        totalShelves: 8,
        shelvesInUse: 5,
        shelfUsePercentage: 62.5,
      },
      waterUsage: {
        tankCapacity: 1000,
        consumableCapacity: 800,
        cropWaterUsage: 87,
      },
      energyConsumption: {
        totalPowerConsumption: 210,
      },
    },

    // Alerts & Anomalies counts (all clear for static demo)
    anomalyAndAlertsCountData: {
      farmLevelAnomaliesCount: 0,
      shelfLevelAnomaliesCount: 0,
      roboticsAnomalies: 0,
      farmLevelAlertsCount: 0,
      shelfLevelAlertsCount: 0,
      roboticsAlerts: 0,
    },

    // Upcoming Events
    // Transplant dates (sorted ascending): Mar 5, Mar 6, Mar 10, Mar 11, Mar 12
    // Harvest dates (sorted ascending)   : Mar 29, Mar 30, Apr 1, Apr 2, Apr 7
    upcomingEventsData: [
      { event: 'TRANSPLANT', growth_cycle: '93', number_of_cycles: 1 }, // Mar 5  – arugula/general
      { event: 'TRANSPLANT', growth_cycle: '94', number_of_cycles: 1 }, // Mar 6  – arugula/wild
      { event: 'TRANSPLANT', growth_cycle: '96', number_of_cycles: 1 }, // Mar 10 – coriander/indian
      { event: 'TRANSPLANT', growth_cycle: '92', number_of_cycles: 1 }, // Mar 11 – basil/genovese
      { event: 'TRANSPLANT', growth_cycle: '95', number_of_cycles: 1 }, // Mar 12 – basil/sweet
      { event: 'HARVEST',    growth_cycle: '92', number_of_cycles: 1 }, // Mar 29 – basil/genovese
      { event: 'HARVEST',    growth_cycle: '95', number_of_cycles: 1 }, // Mar 30 – basil/sweet
      { event: 'HARVEST',    growth_cycle: '93', number_of_cycles: 1 }, // Apr 1  – arugula/general
      { event: 'HARVEST',    growth_cycle: '94', number_of_cycles: 1 }, // Apr 2  – arugula/wild
      { event: 'HARVEST',    growth_cycle: '96', number_of_cycles: 1 }, // Apr 7  – coriander/indian
    ],

    // Live IMPACT Snapshot (representative leafy-greens average values)
    liveImpactSnapshotsData: {
      impact_score: 97.8,
      carbon_saved: '710.45',
      water_saved: '2650.30',
      energy_saved: '1580.20',
      crop_health: 94.3,
    },
  },

  // ── Crop Growth & Yield Tab ───────────────────────────────────────────────────
  // Derived from Farm 148 active cycles (5012-5019).
  // All cycles are currently in SEEDING → 100 % SEEDING per growth cycle.
  // Yield values are the expected (planned) kg from cycle records.
  // Harvest schedule days calculated from today = 2026-02-23.
  cropGrowthAndYieldTab: {
    cropGrowthYieldTimeline: [
      { growth_cycle: '92', cropCycleStatus: [{ status: 'SEEDING', percentage: 100 }] }, // basil/genovese
      { growth_cycle: '93', cropCycleStatus: [{ status: 'SEEDING', percentage: 100 }] }, // arugula/general
      { growth_cycle: '94', cropCycleStatus: [{ status: 'SEEDING', percentage: 100 }] }, // arugula/wild
      { growth_cycle: '95', cropCycleStatus: [{ status: 'SEEDING', percentage: 100 }] }, // basil/sweet
      { growth_cycle: '96', cropCycleStatus: [{ status: 'SEEDING', percentage: 100 }] }, // coriander/indian
    ],

    // Yield bar chart — 6 months of historical batch yields (Sep 2025 – Feb 2026)
    // plus the current growing cycle's projected harvest (Mar/Apr 2026).
    // Values reflect natural batch-to-batch variation around each crop's planned yield_kg.
    yieldInsights: [
      {
        crop_name: 'basil', crop_variety: 'genovese',
        data: [
          { actual_yield: 6.8,  month: 'Sep' },
          { actual_yield: 7.1,  month: 'Oct' },
          { actual_yield: 6.5,  month: 'Nov' },
          { actual_yield: 7.8,  month: 'Dec' },
          { actual_yield: 7.2,  month: 'Jan' },
          { actual_yield: 7.5,  month: 'Feb' },
        ],
      },
      {
        crop_name: 'arugula', crop_variety: 'general',
        data: [
          { actual_yield: 10.5, month: 'Sep' },
          { actual_yield: 11.2, month: 'Oct' },
          { actual_yield: 9.8,  month: 'Nov' },
          { actual_yield: 12.4, month: 'Dec' },
          { actual_yield: 11.8, month: 'Jan' },
          { actual_yield: 12.0, month: 'Feb' },
        ],
      },
      {
        crop_name: 'arugula', crop_variety: 'wild',
        data: [
          { actual_yield: 5.4,  month: 'Sep' },
          { actual_yield: 5.8,  month: 'Oct' },
          { actual_yield: 5.2,  month: 'Nov' },
          { actual_yield: 6.3,  month: 'Dec' },
          { actual_yield: 5.9,  month: 'Jan' },
          { actual_yield: 6.0,  month: 'Feb' },
        ],
      },
      {
        crop_name: 'basil', crop_variety: 'sweet',
        data: [
          { actual_yield: 8.1,  month: 'Sep' },
          { actual_yield: 8.6,  month: 'Oct' },
          { actual_yield: 7.9,  month: 'Nov' },
          { actual_yield: 9.2,  month: 'Dec' },
          { actual_yield: 8.7,  month: 'Jan' },
          { actual_yield: 9.0,  month: 'Feb' },
        ],
      },
      {
        crop_name: 'coriander', crop_variety: 'indian',
        data: [
          { actual_yield: 8.0,  month: 'Sep' },
          { actual_yield: 8.5,  month: 'Oct' },
          { actual_yield: 7.8,  month: 'Nov' },
          { actual_yield: 9.3,  month: 'Dec' },
          { actual_yield: 8.8,  month: 'Jan' },
          { actual_yield: 9.0,  month: 'Feb' },
        ],
      },
    ],

    // Crop health donut (92 % healthy, 8 % minor stress during seeding)
    overallCropHealthStatus: { healthy: 92, stressed: 8 },

    // Harvest countdown cards — sorted by earliest harvest first
    // daysLeft / daysDone / totalDays relative to 2026-02-23
    harvestSchedule: [
      { cycleId: 5014, daysLeft: 34, totalDays: 40, daysDone: 6,  expectedHarvestDate: '2026-03-29' }, // basil/genovese
      { cycleId: 5018, daysLeft: 35, totalDays: 40, daysDone: 5,  expectedHarvestDate: '2026-03-30' }, // basil/sweet
      { cycleId: 5015, daysLeft: 37, totalDays: 43, daysDone: 6,  expectedHarvestDate: '2026-04-01' }, // arugula/general
      { cycleId: 5017, daysLeft: 38, totalDays: 43, daysDone: 5,  expectedHarvestDate: '2026-04-02' }, // arugula/wild
      { cycleId: 5019, daysLeft: 43, totalDays: 48, daysDone: 5,  expectedHarvestDate: '2026-04-07' }, // coriander/indian
    ],
  },

  // ── Monitor & Control Tab ─────────────────────────────────────────────────────
  // topCards → dispatched to Redux → consumed by SensorCards component.
  // Typical indoor-farm values for a well-controlled leafy-greens environment.
  monitoringAndEnvironment: {
    topCards: {
      Etemp: {
        data: { value: 22.4, EventProcessedUtcTime: '2026-02-23T12:28:00.000Z' },
        indicator: 'Optimal',
      },
      Humidity: {
        data: { value: 61, EventProcessedUtcTime: '2026-02-23T12:28:00.000Z' },
        indicator: 'Optimal',
      },
      CO2: {
        data: { value: 420, EventProcessedUtcTime: '2026-02-23T12:28:00.000Z' },
        indicator: 'Optimal',
      },
    },

    // Live monitoring images — mapped from /public/AI folder
    // Real images shown in the grid; AI overlay images shown in the lightbox drawer on click.
    liveMonitoring: {
      rack_1_shelf_1: {
        rackId: 1,
        shelfId: 1,
        cycleId: 5014,
        cropName: 'Basil',
        cropVariety: 'Genovese',
        status: 'SEEDING',
        vegetativeStartDate: '2026-02-17T05:44:50.764Z',
        vegetativeEndDate: '2026-03-29T05:44:50.764Z',
        availableDates: [
          { value: '2026-02-23', label: 'Feb 23, 2026' },
          { value: '2026-02-22', label: 'Feb 22, 2026' },
        ],
        imagesByDate: {
          '2026-02-23': [
            {
              date: '2026-02-23',
              filename: 'image.jpg',
              plugId: 'plug-01',
              url: '/apps/AI/Real/image.jpg',
              dayNumber: '6',
              hasAiAnalysis: true,
              aiAnalysisUrl: '/apps/AI/Ai/image (1).png',
              healthscore: 87.4,
            },
            {
              date: '2026-02-23',
              filename: 'image (1).jpg',
              plugId: 'plug-02',
              url: '/apps/AI/Real/image%20(1).jpg',
              dayNumber: '6',
              hasAiAnalysis: true,
              aiAnalysisUrl: '/apps/AI/Ai/image%20(2).png',
              healthscore: 82.1,
            },
          ],
          '2026-02-22': [
            {
              date: '2026-02-22',
              filename: 'image.jpg',
              plugId: 'plug-01',
              url: '/apps/AI/Real/image.jpg',
              dayNumber: '5',
              hasAiAnalysis: true,
              aiAnalysisUrl: '/apps/AI/Ai/image%20(1).png',
              healthscore: 84.9,
            },
            {
              date: '2026-02-22',
              filename: 'image (1).jpg',
              plugId: 'plug-02',
              url: '/apps/AI/Real/image%20(1).jpg',
              dayNumber: '5',
              hasAiAnalysis: true,
              aiAnalysisUrl: '/apps/AI/Ai/image%20(2).png',
              healthscore: 79.3,
            },
          ],
        },
      },
    },

    // Sensor Data — device toggle panel (Sensor Data section)
    sensorData: [
      { deviceId: 'DEV-FAN-01',   device: 'Main Exhaust Fan',          currentStatus: 1 as 0|1, lastUpdated: '2026-02-23T12:00:00.000Z' },
      { deviceId: 'DEV-FAN-02',   device: 'Circulation Fan',           currentStatus: 1 as 0|1, lastUpdated: '2026-02-23T12:00:00.000Z' },
      { deviceId: 'DEV-PUMP-01',  device: 'Main Irrigation Pump',      currentStatus: 0 as 0|1, lastUpdated: '2026-02-23T11:30:00.000Z' },
      { deviceId: 'DEV-LIGHT-01', device: 'LED Grow Lights (Rack 1)',  currentStatus: 1 as 0|1, lastUpdated: '2026-02-23T06:00:00.000Z' },
    ],

    // Irrigation Schedule — three scheduled events for today
    irrigationScheduleData: {
      irrigationSchedule: [
        {
          event_id: 1001, irrigation_meta_id: 201,
          created_at: '2026-02-23T05:50:00.000Z', updated_at: '2026-02-23T06:31:00.000Z',
          cycle_id: 5014, rack_id: 1, shelf_id: 1,
          event_type: 'irrigate' as const,
          start_time: '2026-02-23T06:00:00.000Z', end_time: '2026-02-23T06:30:00.000Z',
          duration: 30, crop_name: 'basil', crop_variety: 'genovese',
          ec_min: 1.2, ec_max: 2.0, ph_min: 5.5, ph_max: 6.5,
          status: 'COMPLETED' as const,
          value: { drain_pump: 0 as 0|1, inlet: 1 as 0|1, outlet: 0 as 0|1, main_pump: 1 as 0|1 },
        },
        {
          event_id: 1002, irrigation_meta_id: 202,
          created_at: '2026-02-23T06:50:00.000Z', updated_at: '2026-02-23T07:21:00.000Z',
          cycle_id: 5015, rack_id: 1, shelf_id: 4,
          event_type: 'drain' as const,
          start_time: '2026-02-23T07:00:00.000Z', end_time: '2026-02-23T07:20:00.000Z',
          duration: 20, crop_name: 'arugula', crop_variety: 'general',
          ec_min: 1.0, ec_max: 1.8, ph_min: 5.8, ph_max: 6.2,
          status: 'COMPLETED' as const,
          value: { drain_pump: 1 as 0|1, inlet: 0 as 0|1, outlet: 1 as 0|1, main_pump: 0 as 0|1 },
        },
        {
          event_id: 1003, irrigation_meta_id: 203,
          created_at: '2026-02-23T11:50:00.000Z', updated_at: '2026-02-23T11:50:00.000Z',
          cycle_id: 5017, rack_id: 1, shelf_id: 3,
          event_type: 'irrigate' as const,
          start_time: '2026-02-23T12:00:00.000Z', end_time: '2026-02-23T12:30:00.000Z',
          duration: 30, crop_name: 'arugula', crop_variety: 'wild',
          ec_min: 1.1, ec_max: 1.9, ph_min: 5.6, ph_max: 6.4,
          status: 'PENDING' as const,
          value: { drain_pump: 0 as 0|1, inlet: 0 as 0|1, outlet: 0 as 0|1, main_pump: 0 as 0|1 },
        },
      ],
    },

    // Irrigation System Info — rack-level device state
    irrigationSystemInfo: [
      {
        packet_type: 'irrigation',
        farm_id: 148,
        device_id: 'RACK-1-IRRIG',
        device_type: 'irrigation_controller',
        EventProcessedUtcTime: '2026-02-23T12:28:00.000Z',
        shelf_id: 1,
        value: { outlet: 0, event_id: null, inlet: 0, main_pump: 0, drain_pump: 0 },
      },
    ],

    // Farm-level anomalies (2 historical, both resolved)
    anomalies: [
      {
        message: 'Temperature deviation detected in Rack 1, Shelf 3 – exceeded 24 °C briefly',
        action: 'Ventilation fan speed increased; temperature normalised within 15 min',
        status: 'Resolved',
        EventProcessedUtcTime: '2026-02-22T14:30:00.000Z',
      },
      {
        message: 'Relative humidity rose to 72 % — above the 65 % optimal ceiling',
        action: 'Dehumidifier activated; humidity dropped to 61 % within 20 min',
        status: 'Resolved',
        EventProcessedUtcTime: '2026-02-21T09:15:00.000Z',
      },
    ],

    alerts: [],
  },
};

// ─── Grow Cycle – Static Environmental Monitoring Data ───────────────────────
// 3 days of readings (Feb 21–23 2026) for 3 shelf-level sensors.
// Temperature shows realistic fluctuations (lights-on heat spikes, night dips).
// Used as fallback when the live /api/xos/dashboard?type=growcycle returns no data.

export const GROW_CYCLE_ENV_MONITORING = [
  {
    device: 'Rack 1 – Shelf 1 (Basil Genovese)',
    deviceId: 'ENV-R1S1',
    redisKey: 'env:farm148:rack1:shelf1',
    events: [
      // ── Day 1 – Feb 21 ───────────────────────────────────────────────────────
      { sensor_type: 'Etemp',    value: 20.8, unit: '°C',  EventProcessedUtcTime: '2026-02-21T00:30:00.000Z' },
      { sensor_type: 'Humidity', value: 63,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T00:30:00.000Z' },
      { sensor_type: 'CO2',      value: 415,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T00:30:00.000Z' },

      { sensor_type: 'Etemp',    value: 21.4, unit: '°C',  EventProcessedUtcTime: '2026-02-21T03:00:00.000Z' },
      { sensor_type: 'Humidity', value: 62,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T03:00:00.000Z' },
      { sensor_type: 'CO2',      value: 418,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T03:00:00.000Z' },

      // Lights ON → temp rises (06:00)
      { sensor_type: 'Etemp',    value: 22.6, unit: '°C',  EventProcessedUtcTime: '2026-02-21T06:00:00.000Z' },
      { sensor_type: 'Humidity', value: 60,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T06:00:00.000Z' },
      { sensor_type: 'CO2',      value: 422,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T06:00:00.000Z' },

      { sensor_type: 'Etemp',    value: 23.5, unit: '°C',  EventProcessedUtcTime: '2026-02-21T09:00:00.000Z' },
      { sensor_type: 'Humidity', value: 58,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T09:00:00.000Z' },
      { sensor_type: 'CO2',      value: 419,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T09:00:00.000Z' },

      // Peak heat midday
      { sensor_type: 'Etemp',    value: 24.8, unit: '°C',  EventProcessedUtcTime: '2026-02-21T11:30:00.000Z' },
      { sensor_type: 'Humidity', value: 56,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T11:30:00.000Z' },
      { sensor_type: 'CO2',      value: 416,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T11:30:00.000Z' },

      { sensor_type: 'Etemp',    value: 23.9, unit: '°C',  EventProcessedUtcTime: '2026-02-21T14:00:00.000Z' },
      { sensor_type: 'Humidity', value: 59,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T14:00:00.000Z' },
      { sensor_type: 'CO2',      value: 421,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T14:00:00.000Z' },

      // Lights OFF → temp drops (18:00)
      { sensor_type: 'Etemp',    value: 22.1, unit: '°C',  EventProcessedUtcTime: '2026-02-21T18:00:00.000Z' },
      { sensor_type: 'Humidity', value: 62,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T18:00:00.000Z' },
      { sensor_type: 'CO2',      value: 417,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T18:00:00.000Z' },

      { sensor_type: 'Etemp',    value: 21.0, unit: '°C',  EventProcessedUtcTime: '2026-02-21T21:30:00.000Z' },
      { sensor_type: 'Humidity', value: 64,   unit: '%RH', EventProcessedUtcTime: '2026-02-21T21:30:00.000Z' },
      { sensor_type: 'CO2',      value: 413,  unit: 'ppm', EventProcessedUtcTime: '2026-02-21T21:30:00.000Z' },

      // ── Day 2 – Feb 22 ───────────────────────────────────────────────────────
      { sensor_type: 'Etemp',    value: 20.5, unit: '°C',  EventProcessedUtcTime: '2026-02-22T01:00:00.000Z' },
      { sensor_type: 'Humidity', value: 65,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T01:00:00.000Z' },
      { sensor_type: 'CO2',      value: 412,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T01:00:00.000Z' },

      { sensor_type: 'Etemp',    value: 22.3, unit: '°C',  EventProcessedUtcTime: '2026-02-22T06:00:00.000Z' },
      { sensor_type: 'Humidity', value: 61,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T06:00:00.000Z' },
      { sensor_type: 'CO2',      value: 420,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T06:00:00.000Z' },

      // Temp anomaly spike (ventilation fan ramped up per anomaly log)
      { sensor_type: 'Etemp',    value: 25.6, unit: '°C',  EventProcessedUtcTime: '2026-02-22T10:00:00.000Z' },
      { sensor_type: 'Humidity', value: 55,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T10:00:00.000Z' },
      { sensor_type: 'CO2',      value: 423,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T10:00:00.000Z' },

      // Recovery after fan increase
      { sensor_type: 'Etemp',    value: 23.2, unit: '°C',  EventProcessedUtcTime: '2026-02-22T12:00:00.000Z' },
      { sensor_type: 'Humidity', value: 60,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T12:00:00.000Z' },
      { sensor_type: 'CO2',      value: 418,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T12:00:00.000Z' },

      { sensor_type: 'Etemp',    value: 22.8, unit: '°C',  EventProcessedUtcTime: '2026-02-22T15:30:00.000Z' },
      { sensor_type: 'Humidity', value: 61,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T15:30:00.000Z' },
      { sensor_type: 'CO2',      value: 416,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T15:30:00.000Z' },

      // Humidity spike (dehumidifier activated per anomaly log)
      { sensor_type: 'Etemp',    value: 22.0, unit: '°C',  EventProcessedUtcTime: '2026-02-22T17:15:00.000Z' },
      { sensor_type: 'Humidity', value: 72,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T17:15:00.000Z' },
      { sensor_type: 'CO2',      value: 414,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T17:15:00.000Z' },

      { sensor_type: 'Etemp',    value: 21.5, unit: '°C',  EventProcessedUtcTime: '2026-02-22T19:00:00.000Z' },
      { sensor_type: 'Humidity', value: 61,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T19:00:00.000Z' },
      { sensor_type: 'CO2',      value: 415,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T19:00:00.000Z' },

      { sensor_type: 'Etemp',    value: 20.9, unit: '°C',  EventProcessedUtcTime: '2026-02-22T23:00:00.000Z' },
      { sensor_type: 'Humidity', value: 63,   unit: '%RH', EventProcessedUtcTime: '2026-02-22T23:00:00.000Z' },
      { sensor_type: 'CO2',      value: 413,  unit: 'ppm', EventProcessedUtcTime: '2026-02-22T23:00:00.000Z' },

      // ── Day 3 – Feb 23 (today) ───────────────────────────────────────────────
      { sensor_type: 'Etemp',    value: 20.6, unit: '°C',  EventProcessedUtcTime: '2026-02-23T01:00:00.000Z' },
      { sensor_type: 'Humidity', value: 64,   unit: '%RH', EventProcessedUtcTime: '2026-02-23T01:00:00.000Z' },
      { sensor_type: 'CO2',      value: 411,  unit: 'ppm', EventProcessedUtcTime: '2026-02-23T01:00:00.000Z' },

      { sensor_type: 'Etemp',    value: 22.4, unit: '°C',  EventProcessedUtcTime: '2026-02-23T06:00:00.000Z' },
      { sensor_type: 'Humidity', value: 61,   unit: '%RH', EventProcessedUtcTime: '2026-02-23T06:00:00.000Z' },
      { sensor_type: 'CO2',      value: 420,  unit: 'ppm', EventProcessedUtcTime: '2026-02-23T06:00:00.000Z' },

      { sensor_type: 'Etemp',    value: 23.7, unit: '°C',  EventProcessedUtcTime: '2026-02-23T09:00:00.000Z' },
      { sensor_type: 'Humidity', value: 59,   unit: '%RH', EventProcessedUtcTime: '2026-02-23T09:00:00.000Z' },
      { sensor_type: 'CO2',      value: 422,  unit: 'ppm', EventProcessedUtcTime: '2026-02-23T09:00:00.000Z' },

      // Current reading
      { sensor_type: 'Etemp',    value: 22.4, unit: '°C',  EventProcessedUtcTime: '2026-02-23T12:28:00.000Z' },
      { sensor_type: 'Humidity', value: 61,   unit: '%RH', EventProcessedUtcTime: '2026-02-23T12:28:00.000Z' },
      { sensor_type: 'CO2',      value: 420,  unit: 'ppm', EventProcessedUtcTime: '2026-02-23T12:28:00.000Z' },
    ],
  },
];
