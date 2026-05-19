// BuilderPilot — Brand Configuration

export const BRAND = {
  name: 'BuilderPilot',
  tagline: 'Run Your Sites. Not Just Your Day.',
  description: 'The AI Operating System for Residential Builders',
  colors: {
    ink: '#121212',
    gold: '#F5B400',
    charcoal: '#1E1E1E',
    concrete: '#8A8A8A',
  },
};

// Sample site for demo / onboarding template
export const SAMPLE_SITE = {
  name: 'Aurora Trails',
  type: 'Sample Community — 44 Townhomes',
  blocks: ['B5', 'B7', 'B11', 'B14', 'B16'],
  unitCount: 44,
};

// Generic construction stages (industry-standard, not builder-specific)
export const STAGES = [
  // === ROUGH ===
  { stage: 'Permit Issued', order: 1, group: 'rough', trade: 'Office' },
  { stage: 'Site Layout', order: 2, group: 'rough', trade: 'Surveyor' },
  { stage: 'Excavation', order: 3, group: 'rough', trade: 'Excavator' },
  { stage: 'Footings', order: 4, group: 'rough', trade: 'Forming' },
  { stage: 'Foundation Walls', order: 5, group: 'rough', trade: 'Forming' },
  { stage: 'Waterproofing', order: 6, group: 'rough', trade: 'Waterproofing' },
  { stage: 'Weeping Tile', order: 7, group: 'rough', trade: 'Excavator' },
  { stage: 'Backfill', order: 8, group: 'rough', trade: 'Excavator' },
  { stage: 'Underslab Plumbing', order: 9, group: 'rough', trade: 'Plumber' },
  { stage: 'Basement Slab', order: 10, group: 'rough', trade: 'Concrete' },
  { stage: 'Framing — 1st Floor', order: 11, group: 'rough', trade: 'Framer' },
  { stage: 'Framing — 2nd Floor', order: 12, group: 'rough', trade: 'Framer' },
  { stage: 'Framing — Roof', order: 13, group: 'rough', trade: 'Framer' },
  { stage: 'Roof Sheathing', order: 14, group: 'rough', trade: 'Framer' },
  { stage: 'Roof Shingles', order: 15, group: 'rough', trade: 'Roofer' },
  { stage: 'Windows & Doors', order: 16, group: 'rough', trade: 'Window' },
  { stage: 'Exterior Sheathing', order: 17, group: 'rough', trade: 'Framer' },
  { stage: 'Rough Plumbing', order: 18, group: 'rough', trade: 'Plumber' },
  { stage: 'Rough HVAC', order: 19, group: 'rough', trade: 'HVAC' },
  { stage: 'Rough Electrical', order: 20, group: 'rough', trade: 'Electrician' },
  { stage: 'Rough Gas', order: 21, group: 'rough', trade: 'Gas Fitter' },
  { stage: 'Insulation', order: 22, group: 'rough', trade: 'Insulator' },
  { stage: 'Vapour Barrier', order: 23, group: 'rough', trade: 'Insulator' },
  { stage: 'Pre-Drywall Inspection', order: 24, group: 'rough', trade: 'Inspector' },
  { stage: 'Drywall — Boarding', order: 25, group: 'rough', trade: 'Drywall' },
  { stage: 'Drywall — Taping', order: 26, group: 'rough', trade: 'Drywall' },
  { stage: 'Drywall — Sanding', order: 27, group: 'rough', trade: 'Drywall' },
  { stage: 'Primer', order: 28, group: 'rough', trade: 'Painter' },
  { stage: 'Exterior Brick/Stone', order: 29, group: 'rough', trade: 'Mason' },
  { stage: 'Exterior Siding', order: 30, group: 'rough', trade: 'Siding' },
  { stage: 'Soffit & Fascia', order: 31, group: 'rough', trade: 'Siding' },
  { stage: 'Eaves & Downspouts', order: 32, group: 'rough', trade: 'Siding' },
  { stage: 'Garage Slab', order: 33, group: 'rough', trade: 'Concrete' },
  { stage: 'Driveway Base', order: 34, group: 'rough', trade: 'Paving' },
  { stage: 'Front Steps', order: 35, group: 'rough', trade: 'Mason' },
  { stage: 'Lot Grading', order: 36, group: 'rough', trade: 'Excavator' },
  { stage: 'Rough Complete', order: 37, group: 'rough', trade: 'Office' },

  // === FINISHING ===
  { stage: 'Trim Carpentry', order: 38, group: 'finishing', trade: 'Trim' },
  { stage: 'Interior Doors', order: 39, group: 'finishing', trade: 'Trim' },
  { stage: 'Kitchen Cabinets', order: 40, group: 'finishing', trade: 'Cabinet' },
  { stage: 'Vanity Install', order: 41, group: 'finishing', trade: 'Cabinet' },
  { stage: 'Countertops Template', order: 42, group: 'finishing', trade: 'Counter' },
  { stage: 'Countertops Install', order: 43, group: 'finishing', trade: 'Counter' },
  { stage: 'Tile — Floors', order: 44, group: 'finishing', trade: 'Tile' },
  { stage: 'Tile — Backsplash', order: 45, group: 'finishing', trade: 'Tile' },
  { stage: 'Tile — Showers', order: 46, group: 'finishing', trade: 'Tile' },
  { stage: 'Hardwood/Laminate', order: 47, group: 'finishing', trade: 'Flooring' },
  { stage: 'Stairs & Railings', order: 48, group: 'finishing', trade: 'Stairs' },
  { stage: 'Paint — 1st Coat', order: 49, group: 'finishing', trade: 'Painter' },
  { stage: 'Paint — Final', order: 50, group: 'finishing', trade: 'Painter' },
  { stage: 'Finish Plumbing', order: 51, group: 'finishing', trade: 'Plumber' },
  { stage: 'Finish Electrical', order: 52, group: 'finishing', trade: 'Electrician' },
  { stage: 'Finish HVAC', order: 53, group: 'finishing', trade: 'HVAC' },
  { stage: 'Appliances', order: 54, group: 'finishing', trade: 'Appliance' },
  { stage: 'Mirrors & Glass', order: 55, group: 'finishing', trade: 'Glass' },
  { stage: 'Carpet', order: 56, group: 'finishing', trade: 'Flooring' },
  { stage: 'Closet Shelving', order: 57, group: 'finishing', trade: 'Trim' },
  { stage: 'Hardware', order: 58, group: 'finishing', trade: 'Trim' },
  { stage: 'Final Clean', order: 59, group: 'finishing', trade: 'Cleaner' },
  { stage: 'Touch Ups', order: 60, group: 'finishing', trade: 'Painter' },
  { stage: 'Driveway Paving', order: 61, group: 'finishing', trade: 'Paving' },
  { stage: 'Landscaping', order: 62, group: 'finishing', trade: 'Landscaper' },
  { stage: 'Sod', order: 63, group: 'finishing', trade: 'Landscaper' },
  { stage: 'Fencing', order: 64, group: 'finishing', trade: 'Fencer' },
  { stage: 'Deck/Porch', order: 65, group: 'finishing', trade: 'Deck' },
  { stage: 'Finish Complete', order: 66, group: 'finishing', trade: 'Office' },

  // === PDO / CLOSING ===
  { stage: 'PDO Scheduled', order: 67, group: 'pdo', trade: 'Office' },
  { stage: 'Pre-PDO Walkthrough', order: 68, group: 'pdo', trade: 'Supervisor' },
  { stage: 'Customer Care Items', order: 69, group: 'pdo', trade: 'Customer Care' },
  { stage: 'Service Pre-PDO', order: 70, group: 'pdo', trade: 'Customer Care' },
  { stage: 'Construction Pre-PDO', order: 71, group: 'pdo', trade: 'Supervisor' },
  { stage: 'PDO', order: 72, group: 'pdo', trade: 'Customer Care' },
  { stage: 'Deficiency List', order: 73, group: 'pdo', trade: 'Customer Care' },
  { stage: 'Closing', order: 74, group: 'pdo', trade: 'Office' },
];

// Inspection types — industry standard (Ontario residential, easily customizable per region)
export const INSPECTION_TYPES = [
  // Building
  { id: 'bldg-footing', name: 'Footing Inspection', category: 'Building', authority: 'Municipal' },
  { id: 'bldg-foundation', name: 'Foundation Inspection', category: 'Building', authority: 'Municipal' },
  { id: 'bldg-backfill', name: 'Backfill Inspection', category: 'Building', authority: 'Municipal' },
  { id: 'bldg-framing', name: 'Framing Inspection', category: 'Building', authority: 'Municipal' },
  { id: 'bldg-insulation', name: 'Insulation/Vapour Barrier', category: 'Building', authority: 'Municipal' },
  { id: 'bldg-occupancy', name: 'Occupancy Inspection', category: 'Building', authority: 'Municipal' },
  { id: 'bldg-final', name: 'Final Building Inspection', category: 'Building', authority: 'Municipal' },

  // Plumbing
  { id: 'plmb-underslab', name: 'Underslab Plumbing', category: 'Plumbing', authority: 'Municipal' },
  { id: 'plmb-rough', name: 'Rough Plumbing', category: 'Plumbing', authority: 'Municipal' },
  { id: 'plmb-final', name: 'Final Plumbing', category: 'Plumbing', authority: 'Municipal' },
  { id: 'plmb-bp', name: 'Backflow Preventer', category: 'Plumbing', authority: 'Municipal' },

  // HVAC
  { id: 'hvac-rough', name: 'Rough HVAC', category: 'HVAC / Mechanical', authority: 'TSSA' },
  { id: 'hvac-final', name: 'Final HVAC', category: 'HVAC / Mechanical', authority: 'TSSA' },
  { id: 'hvac-balance', name: 'Air Balancing', category: 'HVAC / Mechanical', authority: 'Builder' },

  // Electrical
  { id: 'esa-service', name: 'ESA Service', category: 'Electrical (ESA)', authority: 'ESA' },
  { id: 'esa-rough', name: 'ESA Rough Wire', category: 'Electrical (ESA)', authority: 'ESA' },
  { id: 'esa-underground', name: 'ESA Underground', category: 'Electrical (ESA)', authority: 'ESA' },
  { id: 'esa-final', name: 'ESA Final', category: 'Electrical (ESA)', authority: 'ESA' },
  { id: 'esa-bonding', name: 'ESA Bonding', category: 'Electrical (ESA)', authority: 'ESA' },

  // Gas
  { id: 'gas-rough', name: 'Rough Gas', category: 'Gas (TSSA)', authority: 'TSSA' },
  { id: 'gas-final', name: 'Final Gas', category: 'Gas (TSSA)', authority: 'TSSA' },
  { id: 'gas-meter', name: 'Gas Meter Set', category: 'Gas (TSSA)', authority: 'Utility' },

  // Additional
  { id: 'add-water', name: 'Water Meter Install', category: 'Additional / Municipal', authority: 'Municipal' },
  { id: 'add-grading', name: 'Lot Grading Certificate', category: 'Additional / Municipal', authority: 'Municipal' },
  { id: 'add-driveway', name: 'Driveway Inspection', category: 'Additional / Municipal', authority: 'Municipal' },
  { id: 'add-final-grade', name: 'Final Grading', category: 'Additional / Municipal', authority: 'Municipal' },
];

export const INSPECTION_CATEGORIES = [
  'Building',
  'Plumbing',
  'HVAC / Mechanical',
  'Electrical (ESA)',
  'Gas (TSSA)',
  'Additional / Municipal',
];

export const INSPECTION_STATUSES = ['Not Scheduled', 'Called', 'Passed', 'Failed', 'N/A'];

export const ROLES = ['admin', 'supervisor', 'foreman', 'viewer'] as const;
