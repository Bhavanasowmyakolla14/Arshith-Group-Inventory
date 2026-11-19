const fs = require('fs');
const path = require('path');

// Read fix_all_catalog_images.js to get the rich image URLs
const fixPath = 'C:\\Users\\KRANTI\\Downloads\\Arshith Ecosystem\\arshithfresh\\Arshith_Fresh-main\\backend\\fix_all_catalog_images.js';
const fixContent = fs.readFileSync(fixPath, 'utf8');
const startIdx = fixContent.indexOf('const CATALOG_DATA = [');
const endIdx = fixContent.indexOf('];', startIdx);
const catalogStr = fixContent.slice(startIdx + 'const CATALOG_DATA = ['.length, endIdx);
const catalogItems = eval('[' + catalogStr + ']');

const imageMap = {};
catalogItems.forEach(it => {
  if (it.handle) imageMap[it.handle] = it.image;
  if (it.name) imageMap[it.name.toLowerCase().trim()] = it.image;
});

// The EXACT 31 verified products from the user's images and apply_25pct_discount_pricing.js
const EXACT_PRODUCTS = [
  // Row 1
  {
    handle: 'garam-masala-powder-premium',
    name: 'Garam Masala Powder (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Masala Powders',
    price: 39,
    mrp: 50,
    discount: 22,
    unit: '100 g',
    rating: 4.9,
    reviews: 71,
    image: imageMap['garam-masala-powder-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'coriander-powder-premium',
    name: 'Coriander Powder (Dhania) (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Masala Powders',
    price: 59,
    mrp: 76,
    discount: 22,
    unit: '100 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['coriander-powder-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'chana-dal-spice-powder-pappula-podi-premium',
    name: 'Chana Dal Spice Powder / Pappula Podi (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Spice Podulu',
    price: 79,
    mrp: 101,
    discount: 22,
    unit: '100 g',
    rating: 4.9,
    reviews: 84,
    image: imageMap['chana-dal-spice-powder-pappula-podi-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'garlic-powder-velluli-karam-podi-premium',
    name: 'Garlic Powder / Vellulli Karam Podi (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Spice Podulu',
    price: 79,
    mrp: 101,
    discount: 22,
    unit: '100 g',
    rating: 4.9,
    reviews: 84,
    image: imageMap['garlic-powder-velluli-karam-podi-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },

  // Row 2
  {
    handle: 'kobbari-karam-podi-premium',
    name: 'Kobbari Karam Podi (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Spice Podulu',
    price: 79,
    mrp: 101,
    discount: 22,
    unit: '100 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['kobbari-karam-podi-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'nalla-karam-podi-premium',
    name: 'Nalla Karam Podi (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Spice Podulu',
    price: 79,
    mrp: 101,
    discount: 22,
    unit: '100 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['nalla-karam-podi-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'karivepaku-karam-podi-premium',
    name: 'Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Spice Podulu',
    price: 79,
    mrp: 101,
    discount: 22,
    unit: '100 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['karivepaku-karam-podi-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'besan-flour-soft-grinding-premium',
    name: 'Besan Flour Soft Grinding (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Flours',
    price: 109,
    mrp: 146,
    discount: 25,
    unit: '500 g',
    rating: 4.9,
    reviews: 84,
    image: imageMap['besan-flour-soft-grinding-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },

  // Row 3
  {
    handle: 'castor-oil-premium',
    name: 'Castor Oil (Premium Quality)',
    category: 'Oils',
    subCategory: 'Cold-Pressed Oils',
    price: 112,
    mrp: 147,
    discount: 24,
    unit: '250 ml',
    rating: 4.9,
    reviews: 85,
    image: imageMap['castor-oil-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533'
  },
  {
    handle: 'sesame-oil-premium',
    name: 'Sesame Oil (Premium Quality)',
    category: 'Oils',
    subCategory: 'Cold-Pressed Oils',
    price: 115,
    mrp: 147,
    discount: 22,
    unit: '250 ml',
    rating: 4.9,
    reviews: 75,
    image: imageMap['sesame-oil-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533'
  },
  {
    handle: 'flax-seeds-premium',
    name: 'Flax Seeds (Premium Quality)',
    category: 'Seeds',
    subCategory: 'Nutritional Seeds',
    price: 149,
    mrp: 191,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['flax-seeds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'natural-honey-premium',
    name: 'Pure Natural Honey (Raw Wild Honey) (Premium Quality)',
    category: 'Ghee & Honey',
    subCategory: 'Raw Honey',
    price: 162.50,
    mrp: 208.50,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 73,
    image: imageMap['natural-honey-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533'
  },

  // Row 4
  {
    handle: 'coconut-oil-premium',
    name: 'Coconut Oil (Premium Quality)',
    category: 'Oils',
    subCategory: 'Cold-Pressed Oils',
    price: 174,
    mrp: 223,
    discount: 22,
    unit: '500 ml',
    rating: 4.9,
    reviews: 86,
    image: imageMap['coconut-oil-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533'
  },
  {
    handle: 'sesame-seeds-premium',
    name: 'Sesame Seeds (Til) (Premium Quality)',
    category: 'Seeds',
    subCategory: 'Nutritional Seeds',
    price: 179,
    mrp: 230,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['sesame-seeds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'raisins-premium',
    name: 'Raisins (Kishmish) (Premium Quality)',
    category: 'Dry Fruits & Nuts',
    subCategory: 'Raisins',
    price: 188,
    mrp: 241,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 74,
    image: imageMap['raisins-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_717030b8.jpg?v=1757334045&width=533'
  },
  {
    handle: 'chia-seeds-premium',
    name: 'Chia Seeds (Premium Quality)',
    category: 'Seeds',
    subCategory: 'Nutritional Seeds',
    price: 189,
    mrp: 242,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 74,
    image: imageMap['chia-seeds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },

  // Row 5
  {
    handle: 'sabja-seeds-premium',
    name: 'Sabja Seeds (Basil Seeds) (Premium Quality)',
    category: 'Seeds',
    subCategory: 'Nutritional Seeds',
    price: 189,
    mrp: 242,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['sabja-seeds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'sunflower-seeds-premium',
    name: 'Sunflower Seeds (Premium Quality)',
    category: 'Seeds',
    subCategory: 'Nutritional Seeds',
    price: 195,
    mrp: 250,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['sunflower-seeds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'pumpkin-seeds-premium',
    name: 'Pumpkin Seeds (Premium Quality)',
    category: 'Seeds',
    subCategory: 'Nutritional Seeds',
    price: 224,
    mrp: 287,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['pumpkin-seeds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'watermelon-seeds-premium',
    name: 'Watermelon Seeds (Premium Quality)',
    category: 'Seeds',
    subCategory: 'Nutritional Seeds',
    price: 225,
    mrp: 288,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 75,
    image: imageMap['watermelon-seeds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },

  // Row 6 (Image 2)
  {
    handle: 'dates-khajoor-premium',
    name: 'Dates (Khajoor) (Premium Quality)',
    category: 'Dry Fruits & Nuts',
    subCategory: 'Dates & Figs',
    price: 256,
    mrp: 328,
    discount: 22,
    unit: '500 g',
    rating: 4.9,
    reviews: 71,
    image: imageMap['dates-khajoor-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_717030b8.jpg?v=1757334045&width=533'
  },
  {
    handle: 'almonds-premium',
    name: 'Almonds (Badam) (Premium Quality)',
    category: 'Dry Fruits & Nuts',
    subCategory: 'Almonds & Cashews',
    price: 285,
    mrp: 365,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 85,
    image: imageMap['almonds-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/9_4034b7a6-21de-420a-888c-cdfee56cece7.png?v=1757333952'
  },
  {
    handle: 'cashew-nuts-premium',
    name: 'Cashew Nuts (Kaju) (Premium Quality)',
    category: 'Dry Fruits & Nuts',
    subCategory: 'Almonds & Cashews',
    price: 329,
    mrp: 422,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 78,
    image: imageMap['cashew-nuts-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533'
  },
  {
    handle: 'walnuts-akhrot-premium',
    name: 'Walnuts (Akhrot) (Premium Quality)',
    category: 'Dry Fruits & Nuts',
    subCategory: 'Walnuts & Pistachios',
    price: 389,
    mrp: 499,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 80,
    image: imageMap['walnuts-akhrot-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },

  // Row 7 (Image 2)
  {
    handle: 'pistachio-with-shell-premium-quality',
    name: 'Pistachio (With Shell) (Premium Quality)',
    category: 'Dry Fruits & Nuts',
    subCategory: 'Walnuts & Pistachios',
    price: 394,
    mrp: 505,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 76,
    image: imageMap['pistachio-with-shell-premium-quality'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'groundnut-oil-premium',
    name: 'Groundnut Oil (Premium Quality)',
    category: 'Oils',
    subCategory: 'Cold-Pressed Oils',
    price: 399,
    mrp: 512,
    discount: 22,
    unit: '1 L',
    rating: 4.9,
    reviews: 90,
    image: imageMap['groundnut-oil-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533'
  },
  {
    handle: 'figsdry-anjeer-premium',
    name: 'Figs (Dry Anjeer) (Premium Quality)',
    category: 'Dry Fruits & Nuts',
    subCategory: 'Dates & Figs',
    price: 475,
    mrp: 609,
    discount: 22,
    unit: '250 g',
    rating: 4.9,
    reviews: 72,
    image: imageMap['figsdry-anjeer-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  },
  {
    handle: 'sunflower-oil-premium',
    name: 'Sunflower Oil (Premium Quality)',
    category: 'Oils',
    subCategory: 'Cold-Pressed Oils',
    price: 559,
    mrp: 699,
    discount: 20,
    unit: '1 L',
    rating: 4.9,
    reviews: 80,
    image: imageMap['sunflower-oil-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533'
  },

  // Row 8 (Image 2)
  {
    handle: 'pure-cow-ghee-premium',
    name: 'Pure Cow Ghee (Premium Quality)',
    category: 'Ghee & Honey',
    subCategory: 'Desi Ghee',
    price: 562,
    mrp: 721,
    discount: 22,
    unit: '500 ml',
    rating: 4.9,
    reviews: 77,
    image: imageMap['pure-cow-ghee-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533'
  },
  {
    handle: 'pure-buffalo-ghee-premium',
    name: 'Pure Buffalo Ghee (Premium Quality)',
    category: 'Ghee & Honey',
    subCategory: 'Desi Ghee',
    price: 612,
    mrp: 785,
    discount: 22,
    unit: '500 ml',
    rating: 4.9,
    reviews: 82,
    image: imageMap['pure-buffalo-ghee-premium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533'
  },
  {
    handle: 'chilli-powder-softgrindingpremium',
    name: 'Chilli Powder (Soft Grinding) (Premium Quality)',
    category: 'Powders & Masalas',
    subCategory: 'Chilli Powders',
    price: 699,
    mrp: 896,
    discount: 22,
    unit: '1 kg',
    rating: 4.9,
    reviews: 84,
    image: imageMap['chilli-powder-softgrindingpremium'] || 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965'
  }
];

// 5 Main Categories exactly matching the image tabs:
// 1: Oils
// 2: Dry Fruits & Nuts
// 3: Seeds
// 4: Ghee & Honey
// 5: Powders & Masalas
const categories = [
  { id: 1, name: 'Oils', parentId: null, isActive: true },
  { id: 2, name: 'Dry Fruits & Nuts', parentId: null, isActive: true },
  { id: 3, name: 'Seeds', parentId: null, isActive: true },
  { id: 4, name: 'Ghee & Honey', parentId: null, isActive: true },
  { id: 5, name: 'Powders & Masalas', parentId: null, isActive: true },

  // Subcategories
  { id: 10, name: 'Cold-Pressed Oils', parentId: 1, isActive: true },
  { id: 11, name: 'Raisins', parentId: 2, isActive: true },
  { id: 12, name: 'Almonds & Cashews', parentId: 2, isActive: true },
  { id: 13, name: 'Walnuts & Pistachios', parentId: 2, isActive: true },
  { id: 14, name: 'Dates & Figs', parentId: 2, isActive: true },
  { id: 15, name: 'Nutritional Seeds', parentId: 3, isActive: true },
  { id: 16, name: 'Desi Ghee', parentId: 4, isActive: true },
  { id: 17, name: 'Raw Honey', parentId: 4, isActive: true },
  { id: 18, name: 'Chilli Powders', parentId: 5, isActive: true },
  { id: 19, name: 'Masala Powders', parentId: 5, isActive: true },
  { id: 20, name: 'Spice Podulu', parentId: 5, isActive: true },
  { id: 21, name: 'Flours', parentId: 5, isActive: true }
];

const catNameToId = {
  'Oils': 1,
  'Dry Fruits & Nuts': 2,
  'Seeds': 3,
  'Ghee & Honey': 4,
  'Powders & Masalas': 5
};

const subNameToId = {
  'Cold-Pressed Oils': 10,
  'Raisins': 11,
  'Almonds & Cashews': 12,
  'Walnuts & Pistachios': 13,
  'Dates & Figs': 14,
  'Nutritional Seeds': 15,
  'Desi Ghee': 16,
  'Raw Honey': 17,
  'Chilli Powders': 18,
  'Masala Powders': 19,
  'Spice Podulu': 20,
  'Flours': 21
};

const suppliers = [
  {
    id: 1,
    supplierCode: 'AFS-001',
    name: 'Arshith Fresh India Pvt Ltd',
    companyName: 'Arshith Fresh Central Sourcing & Processing Unit',
    contactPerson: 'Sourcing & Supply Chain Operations',
    phone: '+91 91212 34567',
    email: 'sourcing@arshithfresh.com',
    address: 'Plot No. 18, Sourcing & Processing Unit, IDA Cherlapally',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500051',
    gstin: '36AAHCA1234F1Z1',
    pan: 'AAHCA1234F',
    bankName: 'HDFC Bank',
    accountNumber: '50200088991122',
    ifsc: 'HDFC0000456',
    paymentTerms: 'NET30',
    isActive: true,
    status: 'ACTIVE'
  },
  {
    id: 2,
    supplierCode: 'AFS-002',
    name: 'Arshith Fresh Direct Sourcing',
    companyName: 'Arshith Fresh Consumer & Retail Essentials Division',
    contactPerson: 'Retail Operations Head',
    phone: '+91 91212 34568',
    email: 'orders@arshithfresh.com',
    address: 'Arshith Fresh HQ, Corporate Sourcing Hub, HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560076',
    gstin: '29AAHCA1234F1Z2',
    pan: 'AAHCA1234F',
    bankName: 'State Bank of India',
    accountNumber: '20199887711',
    ifsc: 'SBIN0001234',
    paymentTerms: 'NET15',
    isActive: true,
    status: 'ACTIVE'
  }
];

const products = [];
const batches = [];

EXACT_PRODUCTS.forEach((p, idx) => {
  const prodId = idx + 1;
  const cId = catNameToId[p.category] || 1;
  const sId = subNameToId[p.subCategory] || 10;

  const cost = Math.round(p.price * 0.76);

  products.push({
    id: prodId,
    productCode: `AF-PRD-${String(prodId).padStart(3, '0')}`,
    name: p.name,
    sku: `AF-${p.handle.toUpperCase()}`,
    barcode: `8901234567${String(prodId).padStart(3, '0')}`,
    categoryId: cId,
    subcategoryId: sId,
    unit: p.unit.includes('ml') || p.unit.includes('L') ? 'litre' : 'pack',
    packSize: p.unit,
    purchasePrice: cost,
    sellingPrice: p.price,
    mrp: p.mrp,
    gstPercent: 5,
    hsnCode: '0910',
    minStockLevel: 20,
    reorderQty: 50,
    preferredSupplierId: 1,
    status: 'ACTIVE',
    storageLocation: `A-0${(prodId % 6) + 1}-0${(prodId % 4) + 1}`,
    description: `100% Traditional, certified ${p.name}. Sourced and packaged directly by Arshith Fresh.`,
    imageUrl: p.image,
    rating: p.rating,
    numReviews: p.reviews,
    discountPercent: p.discount
  });

  batches.push({
    id: prodId,
    batchCode: `AFB-2026-${String(prodId).padStart(3, '0')}`,
    productId: prodId,
    warehouseId: 1,
    supplierId: 1,
    initialQty: 100,
    availableQty: 65,
    reservedQty: 5,
    damagedQty: 0,
    purchasePrice: cost,
    mfgDate: '2026-10-15T00:00:00.000Z',
    expiryDate: '2027-10-15T00:00:00.000Z',
    qualityStatus: 'APPROVED'
  });
});

suppliers[0].products = products;
suppliers[1].products = [];

const storePath = path.join(__dirname, '../data/arshith_fresh_store.json');
let existing = {};
if (fs.existsSync(storePath)) {
  existing = JSON.parse(fs.readFileSync(storePath, 'utf8'));
}

existing.categories = categories;
existing.suppliers = suppliers;
existing.products = products;
existing.batches = batches;

fs.writeFileSync(storePath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`Successfully configured ${products.length} EXACT verified products and ${categories.length} categories matching the user screenshots!`);

