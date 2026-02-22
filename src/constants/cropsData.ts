// src/constants/cropsData.ts

// 1. Define the Shape of your Data (TypeScript Interface)
export interface CropData {
  id: string;
  name: string;
  heroImage: string;
  productDescription: {
    type: string;
    weight: string;
    shelfLife: string;
    bestBefore: string;
    description: string;
    features: string[];
    nutritionalInfo: Array<{ nutrient: string; value: string; per: string }>;
    storageTips: string[];
    image: string;
  };
  liveImpact: {
    score: string;
    carbon: string;
    water: string;
    energy: string;
    health: string;
    image: string;
  };
  milestones: {
    sowing: {
      defaultDate: string;
      seedType: string;
      image: string;
    };
    transplant: {
      defaultDate: string;
      image: string;
    };
    harvest: {
      defaultDate: string;
      duration: string;
      batchId: string;
      method: string;
      yieldBoxes: string;
      headSize?: string;
      pesticide: string;
    };
  };
  environment: {
    temp: string;
    humidity: string;
    lighting: string;
    nutrients: string;
  };
}

// 2. The Database Object
export const CROPS_DATA: Record<string, CropData> = {
  // --- 1. BASIL ITALIAN (NO headSize - will show 2 columns) ---
  'basil-italian': {
    id: 'basil-italian',
    name: 'Basil Italian',
    heroImage: '/apps/fresh2/Italian-Basil (1).png',
    productDescription: {
      type: 'Microgreens - Basil Italian',
      weight: '5-10 g per box',
      shelfLife: '3-4 days (refrigerated)',
      bestBefore: '5 days from the date of harvest',
      description: `Basil is one of the most popular CEA crops due to its continuous harvest potential and high market demand. It responds well to hydroponics with optimal yields under consistent light and warm temperatures, supplying fresh herbs to culinary and medicinal markets. \n\nFrom a buyer's perspective, basil is valued for its vibrant aroma and shelf-ready quality. The assurance of pesticide-free production and reliable year-round harvests makes it a top choice for restaurants, retail chains, and health-conscious consumers.`,
      features: ['100% Pesticide-Free', 'Hydroponically Grown', 'AI-Monitored Growth', 'Climate Controlled', 'Non-GMO', 'Crisp & Fresh'],
      nutritionalInfo: [
        { nutrient: 'Calories', value: '17 kcal', per: '100g' },
        { nutrient: 'Protein', value: '1.2g', per: '100g' },
        { nutrient: 'Fiber', value: '2.1g', per: '100g' },
        { nutrient: 'Vitamin A', value: '174% DV', per: '100g' },
        { nutrient: 'Vitamin K', value: '85% DV', per: '100g' },
        { nutrient: 'Folate', value: '34% DV', per: '100g' },
      ],
      storageTips: [
        'Store in refrigerator at 2-4°C',
        'Keep in original packaging or wrap in damp paper towel',
        'Wash just before consumption',
        'Best consumed within 7-10 days of purchase'
      ],
      image: '/apps/fresh2/Italian-Basil (11).png'
    },
    liveImpact: {
      score: '98.14',
      carbon: '773.17',
      water: '2752.68',
      energy: '1610.76',
      health: '92.6',
      image: '/apps/fresh2/Basil-italaina.png'
    },
    milestones: {
      sowing: {
        defaultDate: 'November 14, 2025',
        seedType: 'Non GMO Seeds',
        image: '/apps/fresh2/Rectangle 46 (1).png'
      },
      transplant: {
        defaultDate: 'November 17, 2025',
        image: '/apps/fresh2/undefined.png'
      },
      harvest: {
        defaultDate: 'November 29, 2025',
        duration: '15 days from germination to harvest',
        batchId: '740',
        method: 'Hand-picked and quality-checked under AI-guided lighting',
        yieldBoxes: '3',
        // NO headSize - this triggers 2-column layout
        pesticide: 'None'
      }
    },
    environment: {
      temp: '20–22°C (maintained 24/7)',
      humidity: '55–65% RH',
      lighting: 'Full-spectrum LED, 14 hours/day',
      nutrients: 'Automated hydroponic flow with AI-adjusted EC and pH levels'
    }
  },

  // --- 2. LOLLO BIONDA (HAS headSize - will show 4 columns) ---
  'lollo-bionda': {
    id: 'lollo-bionda',
    name: 'Lollo Bionda',
    heroImage: '/apps/fresh2/lollobionda1.png',
    productDescription: {
      type: 'Lettuce - Lollo Bionda',
      weight: '80-100g per head',
      shelfLife: '7-10 days (refrigerated)',
      bestBefore: '10 days from the date of harvest',
      description: `Lollo Bionda, with its light-green curly leaves, is well-suited to indoor farms aiming for visual diversity in salad mixes. It grows compactly and delivers premium aesthetics for high-end markets. \n\nFor buyers, Lollo Bionda adds vibrancy and texture to salad assortments. Its premium appeal makes it a reliable option for gourmet food retailers and restaurants.`,
      features: ['100% Pesticide-Free', 'Hydroponically Grown', 'AI-Monitored Growth', 'Climate Controlled', 'Non-GMO', 'Crisp & Fresh'],
      nutritionalInfo: [
        { nutrient: 'Calories', value: '17 kcal', per: '100g' },
        { nutrient: 'Protein', value: '1.2g', per: '100g' },
        { nutrient: 'Fiber', value: '2.1g', per: '100g' },
        { nutrient: 'Vitamin A', value: '174% DV', per: '100g' },
        { nutrient: 'Vitamin K', value: '85% DV', per: '100g' },
        { nutrient: 'Folate', value: '34% DV', per: '100g' },
      ],
      storageTips: [
        'Store in refrigerator at 2-4°C',
        'Keep in original packaging or wrap in damp paper towel',
        'Wash just before consumption',
        'Best consumed within 7-10 days of purchase'
      ],
      image: '/apps/fresh2/image (2).png'
    },
    liveImpact: {
      score: '98.14',
      carbon: '773.17',
      water: '2752.68',
      energy: '1610.76',
      health: '92.6',
      image: '/apps/fresh2/shared image (4).jpeg'
    },
    milestones: {
      sowing: {
        defaultDate: 'October 07, 2025',
        seedType: 'Non GMO Seeds',
        image: '/apps/fresh2/Rectangle 46 (1).png'
      },
      transplant: {
        defaultDate: 'October 23, 2025',
        image: '/apps/fresh2/shared image (3).jpeg'
      },
      harvest: {
        defaultDate: 'November 21, 2025',
        duration: '60 days from germination to harvest',
        batchId: '704',
        method: 'Hand-picked and quality-checked under AI-guided lighting',
        yieldBoxes: '120 kg',
        headSize: '150–180g per head',
        pesticide: 'None'
      }
    },
    environment: {
      temp: '20–22°C (maintained 24/7)',
      humidity: '55–65% RH',
      lighting: 'Full-spectrum LED, 14 hours/day',
      nutrients: 'Automated hydroponic flow with AI-adjusted EC and pH levels'
    }
  },

  // --- 3. LOLLO ROSSO (HAS headSize - will show 4 columns) ---
  'lollo-rosso': {
    id: 'lollo-rosso',
    name: 'Lollo Rosso',
    heroImage: '/apps/fresh2/3rdlollo.png',
    productDescription: {
      type: 'Lettuce - Lollo Rosso',
      weight: '80-100g per head',
      shelfLife: '7-10 days (refrigerated)',
      bestBefore: '10 days from the date of harvest',
      description: `Our Lollo Rosso, with its frilly, red-tinted leaves, grows efficiently in controlled systems and offers visual appeal for high-end retail and salad mixes. Its compact structure allows dense planting for optimized yield. \n\nChefs and retailers value Lollo Rosso for its unique color and texture, elevating salad presentations. Its consistent appearance and pesticide-free growth make it highly attractive in premium markets.`,
      features: ['100% Pesticide-Free', 'Hydroponically Grown', 'AI-Monitored Growth', 'Climate Controlled', 'Non-GMO', 'Crisp & Fresh'],
      nutritionalInfo: [
        { nutrient: 'Calories', value: '17 kcal', per: '100g' },
        { nutrient: 'Protein', value: '1.2g', per: '100g' },
        { nutrient: 'Fiber', value: '2.1g', per: '100g' },
        { nutrient: 'Vitamin A', value: '174% DV', per: '100g' },
        { nutrient: 'Vitamin K', value: '85% DV', per: '100g' },
        { nutrient: 'Folate', value: '34% DV', per: '100g' },
      ],
      storageTips: [
        'Store in refrigerator at 2-4°C',
        'Keep in original packaging or wrap in damp paper towel',
        'Wash just before consumption',
        'Best consumed within 7-10 days of purchase'
      ],
      image: '/apps/fresh2/des4.png'
    },
    liveImpact: {
      score: '98.14',
      carbon: '773.17',
      water: '2752.68',
      energy: '1610.76',
      health: '92.6',
      image: '/apps/fresh2/impactlollo.png'
    },
    milestones: {
      sowing: {
        defaultDate: 'October 07, 2025',
        seedType: 'Non GMO Seeds',
        image: '/apps/fresh2/Rectangle 46 (1).png'
      },
      transplant: {
        defaultDate: 'October 23, 2025',
        image: '/apps/fresh2/impactlollo.png'
      },
      harvest: {
        defaultDate: 'November 21, 2025',
        duration: '45 days from germination to harvest',
        batchId: '744',
        method: 'Hand-picked and quality-checked under AI-guided lighting',
        yieldBoxes: '120 kg',
        headSize: '150–180g per head',
        pesticide: 'None'
      }
    },
    environment: {
      temp: '20–22°C (maintained 24/7)',
      humidity: '55–65% RH',
      lighting: 'Full-spectrum LED, 14 hours/day',
      nutrients: 'Automated hydroponic flow with AI-adjusted EC and pH levels'
    }
  },

  // --- 4. LEAFY GREENS ---
  'leafygreens': {
    id: 'leafygreens',
    name: 'Leafy Greens',
    heroImage: '/apps/fresh2/logo.png',
    productDescription: {
      type: 'Premium Hydroponic Greens',
      weight: 'Var. Box Sizes',
      shelfLife: '7+ Days',
      bestBefore: 'See Label',
      description: 'Our mixed leafy greens are grown in a pristine, climate-controlled environment. Harvested at the peak of freshness, they offer superior crunch, flavor, and nutrition compared to traditional field-grown produce.',
      features: ['Pesticide-Free', 'Hydroponic', 'Non-GMO', 'Ultra-Fresh', 'Sustainable'],
      nutritionalInfo: [
         { nutrient: 'Vitamin A', value: 'High', per: '100g' },
         { nutrient: 'Vitamin K', value: 'High', per: '100g' },
         { nutrient: 'Antioxidants', value: 'Rich', per: '100g' }
      ],
      storageTips: ['Keep Refrigerated at 2-4°C', 'Wash before use', 'Seal bag tightly'],
      image: '/apps/fresh2/logo.png'
    },
    liveImpact: {
      score: '96.5',
      carbon: '600.0',
      water: '2500.0',
      energy: '1500.0',
      health: '95.0',
      image: '/apps/fresh2/logo.png'
    },
    milestones: {
      sowing: { 
        defaultDate: 'Continuous Cycle', 
        seedType: 'Premium Mix', 
        image: '/apps/fresh2/logo.png' 
      },
      transplant: { 
        defaultDate: 'Week 2-3', 
        image: '/apps/fresh2/logo.png' 
      },
      harvest: { 
        defaultDate: 'Daily Harvest', 
        duration: '35-45 days', 
        batchId: 'MIX-STD', 
        method: 'Hand-picked', 
        yieldBoxes: 'Standard',
        headSize: 'Mixed sizes',
        pesticide: 'None' 
      }
    },
    environment: {
      temp: '20-22°C',
      humidity: '60%',
      lighting: 'Full Spectrum LED',
      nutrients: 'Standard Hydroponic'
    }
  },

  // --- 5. ROMAINE LETTUCE (HAS headSize - will show 4 columns) ---
  'romaine-lettuce': {
    id: 'romaine-lettuce',
    name: 'Romaine Lettuce',
    heroImage: '/apps/fresh/Rectangle_leafy.png',
    productDescription: {
      type: 'Fresh Romaine Lettuce',
      weight: '150-180g per head',
      shelfLife: '7-10 days (refrigerated)',
      bestBefore: '10 days from the date of harvest',
      description: 'Our Romaine Lettuce is grown in a state-of-the-art AI-powered vertical farm, ensuring optimal growing conditions 24/7. Each head is carefully monitored from seed to harvest, resulting in crisp, fresh lettuce with superior taste and nutritional value. Perfect for salads, sandwiches, and wraps.',
      features: [
        '100% Pesticide-Free',
        'Hydroponically Grown',
        'AI-Monitored Growth',
        'Climate Controlled',
        'Non-GMO',
        'Crisp & Fresh'
      ],
      nutritionalInfo: [
        { nutrient: 'Calories', value: '17 kcal', per: '100g' },
        { nutrient: 'Protein', value: '1.2g', per: '100g' },
        { nutrient: 'Fiber', value: '2.1g', per: '100g' },
        { nutrient: 'Vitamin A', value: '174% DV', per: '100g' },
        { nutrient: 'Vitamin K', value: '85% DV', per: '100g' },
        { nutrient: 'Folate', value: '34% DV', per: '100g' },
      ],
      storageTips: [
        'Store in refrigerator at 2-4°C',
        'Keep in original packaging or wrap in damp paper towel',
        'Wash just before consumption',
        'Best consumed within 7-10 days of purchase'
      ],
      image: '/apps/fresh2/Rectangle 46.png'
    },
    liveImpact: {
      score: '98.14',
      carbon: '773.17',
      water: '2752.68',
      energy: '1610.76',
      health: '92.6',
      image: '/apps/fresh2/Rectangle 46 (3).png'
    },
    milestones: {
      sowing: {
        defaultDate: 'October 07, 2025',
        seedType: 'Non GMO Seeds',
        image: '/apps/fresh2/Rectangle 46 (1).png'
      },
      transplant: {
        defaultDate: 'October 22, 2025',
        image: '/apps/fresh2/Gemini_Generated_Image_pzp2d4pzp2d4pzp2.png'
      },
      harvest: {
        defaultDate: 'December 06, 2025',
        duration: '60 days from germination to harvest',
        batchId: '701',
        method: 'Hand-picked and quality-checked under AI-guided lighting',
        yieldBoxes: '120 kg',
        headSize: '150–180g per head',
        pesticide: 'None'
      }
    },
    environment: {
      temp: '20–22°C (maintained 24/7)',
      humidity: '55–65% RH',
      lighting: 'Full-spectrum LED, 14 hours/day',
      nutrients: 'Automated hydroponic flow with AI-adjusted EC and pH levels'
    }
  },

  // --- 6. BABY SPINACH (GENERAL) ---
'baby-spinach': {
  id: 'baby-spinach',
  name: 'Baby Spinach',
  heroImage: '/apps/fresh2/Spinach.png',

  productDescription: {
    type: 'Spinach - General (Baby)',
    weight: '80–100g per box',
    shelfLife: '7–10 days (refrigerated)',
    bestBefore: '10 days from the date of harvest',
    description: `Our hydroponic baby spinach is grown in a controlled-environment vertical farm with precise control of light, temperature, humidity, and nutrients. Harvested young, the leaves are tender, vibrant, and mildly sweet—perfect for salads, smoothies, and everyday cooking.

Naturally low in calories, it is rich in iron, fiber, and essential vitamins A, C, K, and folate. Clean, pesticide-free, and sustainably grown with higher nutrient retention and reduced water use.`,
    features: [
      '100% Pesticide-Free',
      'Hydroponically Grown',
      'AI-Monitored Growth',
      'Climate Controlled',
      'Non-GMO',
      'Tender & Fresh'
    ],
    nutritionalInfo: [
      { nutrient: 'Calories', value: '23 kcal', per: '100g' },
      { nutrient: 'Protein', value: '2.9g', per: '100g' },
      { nutrient: 'Fiber', value: '2.2g', per: '100g' },
      { nutrient: 'Vitamin A', value: '188% DV', per: '100g' },
      { nutrient: 'Vitamin K', value: '~460% DV', per: '100g' },
      { nutrient: 'Folate', value: '~49% DV', per: '100g' }
    ],
    storageTips: [
      'Store in refrigerator at 2–4°C',
      'Keep in original packaging',
      'Wash just before use',
      'Consume within 7–10 days'
    ],

    // ✅ Description image (WEBP)
    image: '/apps/fresh2/Babyspinach1.webp'
  },

  liveImpact: {
    score: '97.8',
    carbon: '710.45',
    water: '2650.30',
    energy: '1580.20',
    health: '94.3',

    // ✅ Live impact image (WEBP)
    image: '/apps/fresh2/babyspinachliveimpact.webp'
  },

  milestones: {
    sowing: {
      defaultDate: 'October 10, 2025',
      seedType: 'Non GMO Seeds',
      image: '/apps/fresh2/Rectangle 46 (1).png'
    },
    transplant: {
      defaultDate: 'October 20, 2025',
      image: '/apps/fresh2/Gemini_Generated_Image_pzp2d4pzp2d4pzp2.png'
    },
    harvest: {
      defaultDate: 'November 15, 2025',
      duration: '30–35 days from germination to harvest',
      batchId: 'SPN-701',
      method: 'Hand-harvested and quality-checked under AI-guided lighting',
      yieldBoxes: '100 kg',
      headSize: 'Baby leaf size',
      pesticide: 'None'
    }
  },

  environment: {
    temp: '18–22°C (maintained 24/7)',
    humidity: '55–65% RH',
    lighting: 'Full-spectrum LED, 14 hours/day',
    nutrients: 'Automated hydroponic flow with AI-adjusted EC and pH levels'
  }
},



  // --- DEFAULT FALLBACK ---
  'default': {
    id: 'default',
    name: 'Fresh From The Future',
    heroImage: '/apps/fresh2/logo.png',
    productDescription: {
      type: 'Premium Vertical Farm Produce',
      weight: 'Varies by Pack',
      shelfLife: '5-7 Days (Refrigerated)',
      bestBefore: 'See Packaging Date',
      description: 'Experience the future of farming with our precision-grown produce. Cultivated in a controlled, pesticide-free environment using advanced hydroponics and AI monitoring to ensure peak nutrition and flavor in every bite.',
      features: ['100% Pesticide-Free', 'Hyper-Local', 'Sustainable', 'Smart-Farmed', 'Clean Greens'],
      nutritionalInfo: [
        { nutrient: 'Quality', value: 'Premium', per: 'Serving' },
        { nutrient: 'Pesticides', value: '0%', per: 'Batch' },
        { nutrient: 'Freshness', value: '100%', per: 'Harvest' }
      ],
      storageTips: ['Refrigerate immediately', 'Wash before consumption', 'Keep container closed'],
      image: '/apps/fresh2/logo.png'
    },
    liveImpact: {
      score: '96.00',
      carbon: '550.00',
      water: '2600.00',
      energy: '1550.00',
      health: '95.0',
      image: '/apps/fresh2/logo.png'
    },
    milestones: {
      sowing: { 
        defaultDate: 'Weekly Cycle', 
        seedType: 'Premium Non-GMO', 
        image: '/apps/fresh2/logo.png'
      },
      transplant: { 
        defaultDate: 'Growth Stage', 
        image: '/apps/fresh2/logo.png'
      },
      harvest: { 
        defaultDate: 'Daily', 
        duration: 'Variable', 
        batchId: 'GENERIC-BATCH', 
        method: 'AI-Guided Selection', 
        yieldBoxes: 'Standard',
        headSize: 'Varies by crop',
        pesticide: 'None' 
      }
    },
    environment: {
      temp: '20-24°C',
      humidity: '55-65%',
      lighting: 'Full Spectrum LED',
      nutrients: 'Precision Hydroponics'
    }
  },
};