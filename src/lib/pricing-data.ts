export interface PricingItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  includes?: string[];
}

// All prices are in Tanzanian Shillings (TZS)

export const pricingData: PricingItem[] = [
  // Breast Procedures
  {
    id: "breast-reduction",
    name: "Breast Reduction",
    price: 6930000,
    category: "Breast Procedures",
    description: "Reduction of breast size to alleviate physical discomfort and improve body proportions",
    includes: [
      "Pre-operative consultation",
      "Surgical procedure",
      "Post-operative care",
      "Compression garments",
      "Follow-up appointments"
    ]
  },
  {
    id: "breast-augmentation-implants",
    name: "Breast Augmentation (Implants)",
    price: 10890000,
    category: "Breast Procedures",
    description: "Enhancement of breast size and shape using silicone or saline implants",
    includes: [
      "Implant selection consultation",
      "Surgical procedure",
      "Post-operative care",
      "Compression garments",
      "6-month follow-up"
    ]
  },
  {
    id: "breast-augmentation-fat-transfer",
    name: "Breast Augmentation (Fat Transfer)",
    price: 7920000,
    category: "Breast Procedures",
    description: "Natural breast enhancement using fat harvested from other body areas",
    includes: [
      "Liposuction procedure",
      "Fat processing and transfer",
      "Post-operative care",
      "Compression garments",
      "Follow-up appointments"
    ]
  },
  {
    id: "mastopexy",
    name: "Mastopexy (Breast Lift)",
    price: 9900000,
    category: "Breast Procedures",
    description: "Lifting and reshaping of sagging breasts to a more youthful position",
    includes: [
      "Pre-operative consultation",
      "Surgical procedure",
      "Post-operative care",
      "Compression garments",
      "Follow-up care"
    ]
  },
  {
    id: "nipple-revision",
    name: "Nipple Revision",
    price: 2376000,
    category: "Breast Procedures",
    description: "Correction of nipple shape, size, or position issues",
    includes: [
      "Consultation",
      "Surgical procedure",
      "Post-operative care",
      "Follow-up appointment"
    ]
  },
  {
    id: "breast-reconstruction-pedicled",
    name: "Breast Reconstruction (Pedicled Flap)",
    price: 11880000,
    category: "Breast Procedures",
    description: "Reconstruction using tissue from nearby areas while maintaining blood supply",
    includes: [
      "Comprehensive consultation",
      "Surgical procedure",
      "Extended post-operative care",
      "Compression garments",
      "Long-term follow-up"
    ]
  },
  {
    id: "breast-reconstruction-free",
    name: "Breast Reconstruction (Free Flap)",
    price: 15840000,
    category: "Breast Procedures",
    description: "Advanced reconstruction using tissue from distant body parts with microsurgery",
    includes: [
      "Extensive pre-operative planning",
      "Complex surgical procedure",
      "Intensive post-operative care",
      "Specialized garments",
      "Extended monitoring"
    ]
  },
  {
    id: "breast-asymmetry",
    name: "Breast Asymmetry Correction",
    price: 5940000,
    category: "Breast Procedures",
    description: "Correction of uneven breast size or shape for better symmetry",
    includes: [
      "Detailed consultation",
      "Surgical correction",
      "Post-operative care",
      "Follow-up appointments"
    ]
  },
  {
    id: "breast-fat-transfer",
    name: "Breast Fat Transfer",
    price: 7920000,
    category: "Breast Procedures",
    description: "Enhancement using patient's own fat for natural results",
    includes: [
      "Liposuction procedure",
      "Fat processing",
      "Transfer procedure",
      "Post-operative care"
    ]
  },

  // Gynecomastia
  {
    id: "gynecomastia-lipo-excision",
    name: "Gynecomastia (Lipo + Excision)",
    price: 5940000,
    category: "Gynecomastia",
    description: "Complete removal of excess breast tissue in men using both liposuction and excision",
    includes: [
      "Consultation",
      "Combined procedure",
      "Post-operative care",
      "Compression garment",
      "Follow-up"
    ]
  },
  {
    id: "gynecomastia-lipo-only",
    name: "Gynecomastia (Lipo Only)",
    price: 4356000,
    category: "Gynecomastia",
    description: "Removal of excess fat tissue using liposuction technique",
    includes: [
      "Consultation",
      "Liposuction procedure",
      "Post-operative care",
      "Compression garment"
    ]
  },
  {
    id: "gynecomastia-excision-only",
    name: "Gynecomastia (Excision Only)",
    price: 5940000,
    category: "Gynecomastia",
    description: "Surgical removal of excess glandular tissue",
    includes: [
      "Consultation",
      "Surgical excision",
      "Post-operative care",
      "Follow-up appointment"
    ]
  },

  // Liposuction
  {
    id: "liposuction-360-full",
    name: "360° Liposuction (Full)",
    price: 12870000,
    category: "Liposuction",
    description: "Comprehensive body contouring around the entire midsection",
    includes: [
      "Pre-operative consultation",
      "Full 360° procedure",
      "Post-operative care",
      "Compression garment",
      "Follow-up appointments"
    ]
  },
  {
    id: "liposuction-360-redo",
    name: "Redo 360° Liposuction",
    price: 13860000,
    category: "Liposuction",
    description: "Revision procedure for previous liposuction results",
    includes: [
      "Detailed consultation",
      "Revision procedure",
      "Extended post-operative care",
      "Specialized garments"
    ]
  },
  {
    id: "liposuction-abdomen",
    name: "Anterior Abdomen",
    price: 6930000,
    category: "Liposuction",
    description: "Targeted fat removal from the front abdominal area",
    includes: [
      "Consultation",
      "Liposuction procedure",
      "Post-operative care",
      "Compression garment"
    ]
  },
  {
    id: "liposuction-thighs",
    name: "Inner Thighs",
    price: 4950000,
    category: "Liposuction",
    description: "Contouring of inner thigh area for smoother silhouette",
    includes: [
      "Procedure",
      "Post-operative care",
      "Compression garment"
    ]
  },
  {
    id: "liposuction-back",
    name: "Back (Upper + Lower)",
    price: 6930000,
    category: "Liposuction",
    description: "Comprehensive back fat removal for improved body shape",
    includes: [
      "Full back treatment",
      "Post-operative care",
      "Compression garment",
      "Follow-up"
    ]
  },
  {
    id: "liposuction-arms",
    name: "Arms (Brachioplasty)",
    price: 5940000,
    category: "Liposuction",
    description: "Arm contouring to eliminate loose skin and excess fat",
    includes: [
      "Surgical procedure",
      "Post-operative care",
      "Compression garment",
      "Follow-up care"
    ]
  },
  {
    id: "liposuction-chin",
    name: "Double Chin",
    price: 2970000,
    category: "Liposuction",
    description: "Removal of submental fat for defined jawline",
    includes: [
      "Procedure",
      "Post-operative care",
      "Follow-up"
    ]
  },
  {
    id: "liposuction-legs",
    name: "Legs",
    price: 3960000,
    category: "Liposuction",
    description: "Leg contouring for improved proportions",
    includes: [
      "Liposuction procedure",
      "Post-operative care",
      "Compression garments"
    ]
  },
  {
    id: "liposuction-general",
    name: "General Liposuction",
    price: 6930000,
    category: "Liposuction",
    description: "Standard liposuction procedure for various body areas",
    includes: [
      "Consultation",
      "Liposuction procedure",
      "Post-operative care",
      "Compression garment"
    ]
  },

  // Abdominal Procedures
  {
    id: "abdominoplasty",
    name: "Abdominoplasty",
    price: 11880000,
    category: "Abdominal Procedures",
    description: "Complete tummy tuck to remove excess skin and tighten muscles",
    includes: [
      "Comprehensive consultation",
      "Full tummy tuck procedure",
      "Post-operative care",
      "Compression garment",
      "Extended follow-up"
    ]
  },
  {
    id: "mini-abdominoplasty",
    name: "Mini Abdominoplasty",
    price: 6930000,
    category: "Abdominal Procedures",
    description: "Limited tummy tuck for minor corrections",
    includes: [
      "Procedure",
      "Post-operative care",
      "Compression garment",
      "Follow-up"
    ]
  },
  {
    id: "lipoabdominoplasty",
    name: "Lipoabdominoplasty",
    price: 12870000,
    category: "Abdominal Procedures",
    description: "Combination of liposuction and tummy tuck for optimal results",
    includes: [
      "Combined procedure",
      "Extended post-operative care",
      "Specialized garments",
      "Multiple follow-ups"
    ]
  },
  {
    id: "redo-lipoabdominoplasty",
    name: "Redo Lipoabdominoplasty",
    price: 14850000,
    category: "Abdominal Procedures",
    description: "Revision of previous tummy tuck and liposuction procedures",
    includes: [
      "Extensive revision surgery",
      "Intensive post-operative care",
      "Specialized monitoring",
      "Long-term follow-up"
    ]
  },
  {
    id: "panniculectomy",
    name: "Panniculectomy",
    price: 8910000,
    category: "Abdominal Procedures",
    description: "Removal of excess skin and fat hanging over the pubic area",
    includes: [
      "Surgical procedure",
      "Post-operative care",
      "Specialized garments",
      "Follow-up care"
    ]
  },
  {
    id: "fleur-de-lis",
    name: "Fleur-de-Lis Abdominoplasty",
    price: 13860000,
    category: "Abdominal Procedures",
    description: "Advanced tummy tuck with vertical and horizontal incisions",
    includes: [
      "Complex surgical procedure",
      "Extended post-operative care",
      "Specialized garments",
      "Multiple follow-ups"
    ]
  },

  // Body Contouring
  {
    id: "bbl",
    name: "BBL / Gluteal Augmentation",
    price: 12870000,
    category: "Body Contouring",
    description: "Brazilian Butt Lift using fat transfer for enhanced curves",
    includes: [
      "Liposuction procedure",
      "Fat processing and transfer",
      "Post-operative care",
      "Specialized garments",
      "Follow-up appointments"
    ]
  },
  {
    id: "hip-fat-transfer",
    name: "Hip Fat Transfer",
    price: 6930000,
    category: "Body Contouring",
    description: "Hip enhancement using patient's own fat for natural curves",
    includes: [
      "Liposuction",
      "Fat transfer procedure",
      "Post-operative care",
      "Compression garment"
    ]
  },
  {
    id: "calf-augmentation",
    name: "Calf Augmentation",
    price: 4356000,
    category: "Body Contouring",
    description: "Enhancement of calf muscles for improved leg proportions",
    includes: [
      "Procedure",
      "Post-operative care",
      "Follow-up"
    ]
  },
  {
    id: "thigh-lift",
    name: "Thigh Lift",
    price: 6930000,
    category: "Body Contouring",
    description: "Removal of excess skin and fat from thigh area",
    includes: [
      "Surgical procedure",
      "Post-operative care",
      "Compression garments",
      "Follow-up care"
    ]
  },
  {
    id: "body-lift",
    name: "Body Lift",
    price: 15840000,
    category: "Body Contouring",
    description: "Comprehensive lower body lift for multiple areas",
    includes: [
      "Extensive surgical procedure",
      "Intensive post-operative care",
      "Specialized garments",
      "Extended monitoring"
    ]
  },
  {
    id: "dog-ear-removal",
    name: "Dog Ear Removal",
    price: 1980000,
    category: "Body Contouring",
    description: "Correction of excess skin folds after body contouring procedures",
    includes: [
      "Minor surgical procedure",
      "Post-operative care"
    ]
  },

  // Face & Head
  {
    id: "face-lift",
    name: "Face Lift",
    price: 16830000,
    category: "Face & Head",
    description: "Comprehensive facial rejuvenation to reduce signs of aging",
    includes: [
      "Extensive consultation",
      "Full face lift procedure",
      "Post-operative care",
      "Specialized garments",
      "Extended follow-up"
    ]
  },
  {
    id: "mini-face-lift",
    name: "Mini Face Lift",
    price: 11880000,
    category: "Face & Head",
    description: "Limited facelift for targeted rejuvenation",
    includes: [
      "Procedure",
      "Post-operative care",
      "Follow-up appointments"
    ]
  },
  {
    id: "brow-lift",
    name: "Brow / Ponytail Lift",
    price: 8910000,
    category: "Face & Head",
    description: "Elevation of brow area to reduce forehead wrinkles",
    includes: [
      "Surgical procedure",
      "Post-operative care",
      "Follow-up care"
    ]
  },
  {
    id: "rhinoplasty",
    name: "Rhinoplasty",
    price: 15840000,
    category: "Face & Head",
    description: "Nose reshaping for improved appearance and function",
    includes: [
      "Detailed consultation",
      "Surgical procedure",
      "Post-operative care",
      "Splint and packing",
      "Extended follow-up"
    ]
  },
  {
    id: "alarplasty",
    name: "Alarplasty",
    price: 6930000,
    category: "Face & Head",
    description: "Narrowing of nostrils for better nasal proportions",
    includes: [
      "Procedure",
      "Post-operative care",
      "Follow-up"
    ]
  },
  {
    id: "septoplasty",
    name: "Septoplasty",
    price: 6930000,
    category: "Face & Head",
    description: "Correction of deviated septum to improve breathing",
    includes: [
      "Surgical procedure",
      "Post-operative care",
      "Follow-up appointments"
    ]
  },
  {
    id: "eyelid-upper",
    name: "Eyelid Surgery (Upper)",
    price: 3564000,
    category: "Face & Head",
    description: "Upper eyelid correction to remove excess skin",
    includes: [
      "Procedure",
      "Post-operative care",
      "Follow-up"
    ]
  },
  {
    id: "eyelid-lower",
    name: "Eyelid Surgery (Lower)",
    price: 5940000,
    category: "Face & Head",
    description: "Lower eyelid treatment for bags and dark circles",
    includes: [
      "Surgical procedure",
      "Post-operative care",
      "Follow-up care"
    ]
  },
  {
    id: "lip-surgery",
    name: "Lip Surgeries",
    price: 3564000,
    category: "Face & Head",
    description: "Various lip enhancement and correction procedures",
    includes: [
      "Consultation",
      "Surgical procedure",
      "Post-operative care"
    ]
  },

  // Hair & Skin
  {
    id: "hair-transplant",
    name: "Hair Transplant",
    price: 7920000,
    category: "Hair & Skin",
    description: "Follicular Unit Extraction (FUE) for natural hair restoration",
    includes: [
      "Comprehensive consultation",
      "Hair transplant procedure",
      "Post-operative care",
      "Medication",
      "Follow-up appointments"
    ]
  },
  {
    id: "beard-transplant",
    name: "Beard Hair Transplant",
    price: 5940000,
    category: "Hair & Skin",
    description: "Beard enhancement using hair transplant techniques",
    includes: [
      "Consultation",
      "Transplant procedure",
      "Post-operative care",
      "Follow-up"
    ]
  },
  {
    id: "laser-hair-removal",
    name: "Hair Laser Removal (per session)",
    price: 1584000,
    category: "Hair & Skin",
    description: "Laser treatment for permanent hair reduction",
    includes: [
      "Session treatment",
      "Post-treatment care instructions"
    ]
  },
  {
    id: "prp-stem-cell",
    name: "PRP Stem Cell",
    price: 792000,
    category: "Hair & Skin",
    description: "Platelet-rich plasma treatment for skin rejuvenation",
    includes: [
      "Blood processing",
      "Injection treatment",
      "Post-treatment care"
    ]
  },
  {
    id: "nanofat-facial",
    name: "Nanofat Facial Rejuvenation",
    price: 6930000,
    category: "Hair & Skin",
    description: "Facial rejuvenation using processed fat cells",
    includes: [
      "Liposuction procedure",
      "Fat processing",
      "Facial injection",
      "Post-operative care"
    ]
  },
  {
    id: "nanofat-small",
    name: "Nanofat Small Areas",
    price: 3564000,
    category: "Hair & Skin",
    description: "Targeted nanofat treatment for specific areas",
    includes: [
      "Fat harvesting",
      "Processing and injection",
      "Post-treatment care"
    ]
  },
  {
    id: "morpheus8",
    name: "Morpheus 8 (2 sessions)",
    price: 3564000,
    category: "Hair & Skin",
    description: "Radiofrequency microneedling for skin tightening",
    includes: [
      "Two treatment sessions",
      "Post-treatment care",
      "Follow-up consultation"
    ]
  },

  // Intimate Procedures
  {
    id: "penile-enlargement",
    name: "Penile Enlargement (Surgery)",
    price: 6930000,
    category: "Intimate Procedures",
    description: "Surgical enhancement for improved size and confidence",
    includes: [
      "Comprehensive consultation",
      "Surgical procedure",
      "Post-operative care",
      "Extended follow-up"
    ]
  },
  {
    id: "penile-prp",
    name: "Penile PRP",
    price: 1584000,
    category: "Intimate Procedures",
    description: "Platelet-rich plasma treatment for enhanced function",
    includes: [
      "Blood processing",
      "Injection treatment",
      "Post-treatment care"
    ]
  },
  {
    id: "vaginoplasty",
    name: "Vaginoplasty",
    price: 5940000,
    category: "Intimate Procedures",
    description: "Vaginal tightening and rejuvenation procedure",
    includes: [
      "Detailed consultation",
      "Surgical procedure",
      "Post-operative care",
      "Follow-up appointments"
    ]
  }
];

// Group pricing by category for display
export const pricingCategories = [
  "Breast Procedures",
  "Gynecomastia",
  "Liposuction",
  "Abdominal Procedures",
  "Body Contouring",
  "Face & Head",
  "Hair & Skin",
  "Intimate Procedures"
];

export const getPricingByCategory = (category: string) => {
  return pricingData.filter(item => item.category === category);
};

export const formatPrice = (amount: number) => {
  // Return contact message instead of actual price
  return "Contact for Price";
};
