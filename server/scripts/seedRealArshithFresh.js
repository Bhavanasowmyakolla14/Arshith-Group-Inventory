const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../data/arshith_fresh_store.json');
const csvPath = 'C:\\Users\\KRANTI\\Downloads\\Arshith Ecosystem\\arshithfresh\\Arshith_Fresh-main\\backend\\shopify_export.csv';

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i+1] === '\n') i++;
      row.push(current.trim());
      if (row.length > 1) lines.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (row.length > 1) lines.push(row);
  return lines;
}

const csvContent = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(csvContent);
const headers = rows[0];

const handleIdx = headers.indexOf('Handle');
const titleIdx = headers.indexOf('Title');
const vendorIdx = headers.indexOf('Vendor');
const typeIdx = headers.indexOf('Type');
const tagsIdx = headers.indexOf('Tags');
const priceIdx = headers.indexOf('Variant Price');
const comparePriceIdx = headers.indexOf('Variant Compare At Price');
const skuIdx = headers.indexOf('Variant SKU');
const qtyIdx = headers.indexOf('Variant Inventory Qty');
const imageIdx = headers.indexOf('Image Src');
const bodyIdx = headers.indexOf('Body (HTML)');

const productMap = new Map();
for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const handle = r[handleIdx];
  const title = r[titleIdx];
  if (!handle && !title) continue;
  const key = handle || title;
  if (!productMap.has(key)) {
    productMap.set(key, {
      handle,
      title: title || handle,
      vendor: r[vendorIdx] || 'Arshith Fresh India Pvt Ltd',
      type: r[typeIdx] || 'Cooking Essentials',
      tags: r[tagsIdx] || '',
      price: parseFloat(r[priceIdx]) || 99,
      comparePrice: parseFloat(r[comparePriceIdx]) || 120,
      sku: r[skuIdx] || `AF-SKU-${productMap.size + 1}`,
      qty: parseInt(r[qtyIdx], 10) || 50,
      image: r[imageIdx] || '',
      description: r[bodyIdx] ? r[bodyIdx].replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) : ''
    });
  }
}

// 1. Real Suppliers (Arshith Fresh entities)
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

// 2. Real Categories
const categories = [
  { id: 1, name: 'Cooking Ingredients', parentId: null, isActive: true },
  { id: 2, name: 'Dry Fruits & Nuts', parentId: null, isActive: true },
  { id: 3, name: 'Dry Seeds', parentId: null, isActive: true },
  { id: 4, name: 'Veg Pickles & Podulu', parentId: null, isActive: true },
  { id: 5, name: 'Spices & Seasonings', parentId: null, isActive: true },
  { id: 6, name: 'Flours & Grains', parentId: null, isActive: true },
  { id: 7, name: 'Dry Fish', parentId: null, isActive: true },
  { id: 8, name: 'Daily Essentials & Combos', parentId: null, isActive: true },

  // Subcategories
  { id: 10, name: 'Chilli & Pepper Powders', parentId: 1, isActive: true },
  { id: 11, name: 'Raisins', parentId: 2, isActive: true },
  { id: 12, name: 'Almonds & Cashews', parentId: 2, isActive: true },
  { id: 13, name: 'Walnuts & Pistachios', parentId: 2, isActive: true },
  { id: 14, name: 'Mixed Seeds & Combos', parentId: 3, isActive: true },
  { id: 15, name: 'Traditional Pickles', parentId: 4, isActive: true },
  { id: 16, name: 'Spice Podulu', parentId: 4, isActive: true },
  { id: 17, name: 'Whole Red Chillies', parentId: 5, isActive: true },
  { id: 18, name: 'Whole Spices', parentId: 5, isActive: true },
  { id: 19, name: 'Wheat & Besan Flours', parentId: 6, isActive: true },
  { id: 20, name: 'Rava & Dals', parentId: 6, isActive: true },
  { id: 21, name: 'Dried Prawns & Fish', parentId: 7, isActive: true },
  { id: 22, name: 'Monthly Grocery Combos', parentId: 8, isActive: true },
  { id: 23, name: 'Beverages & Essentials', parentId: 1, isActive: true }
];

// Map 50 products
const products = [];
const batches = [];
let prodId = 1;

for (const p of productMap.values()) {
  const isCombo = p.title.toLowerCase().includes('combo') || p.title.toLowerCase().includes('monthly');
  const isRaisin = p.title.toLowerCase().includes('raisin') || p.title.toLowerCase().includes('kishmish') || p.title.toLowerCase().includes('dry-fruits');
  const isNut = p.title.toLowerCase().includes('almond') || p.title.toLowerCase().includes('cashew') || p.title.toLowerCase().includes('badam') || p.title.toLowerCase().includes('kaju');
  const isPista = p.title.toLowerCase().includes('pistachio') || p.title.toLowerCase().includes('walnut');
  const isSeed = p.title.toLowerCase().includes('seed');
  const isPickle = p.title.toLowerCase().includes('pickle');
  const isPodulu = p.title.toLowerCase().includes('podulu') || p.title.toLowerCase().includes('powder');
  const isFlour = p.title.toLowerCase().includes('flour') || p.title.toLowerCase().includes('wheat') || p.title.toLowerCase().includes('besan');
  const isDal = p.title.toLowerCase().includes('dal') || p.title.toLowerCase().includes('rava');
  const isFish = p.title.toLowerCase().includes('fish') || p.title.toLowerCase().includes('prawn');

  let catId = 1;
  let subId = 10;
  if (isCombo) { catId = 8; subId = 22; }
  else if (isRaisin) { catId = 2; subId = 11; }
  else if (isNut) { catId = 2; subId = 12; }
  else if (isPista) { catId = 2; subId = 13; }
  else if (isSeed) { catId = 3; subId = 14; }
  else if (isPickle) { catId = 4; subId = 15; }
  else if (isPodulu) { catId = 4; subId = 16; }
  else if (isFlour) { catId = 6; subId = 19; }
  else if (isDal) { catId = 6; subId = 20; }
  else if (isFish) { catId = 7; subId = 21; }

  const supplierId = p.vendor.includes('India Pvt Ltd') ? 1 : 2;

  const product = {
    id: prodId,
    productCode: `AF-PRD-${String(prodId).padStart(3, '0')}`,
    name: p.title,
    sku: p.sku,
    barcode: `8901234567${String(prodId).padStart(3, '0')}`,
    categoryId: catId,
    subcategoryId: subId,
    unit: p.title.includes('Combo') ? 'Combo Pack' : 'Pack',
    packSize: p.sku.split('-').pop() || 'Pack',
    purchasePrice: Math.round(p.price * 0.75),
    sellingPrice: p.price,
    mrp: p.comparePrice,
    gstPercent: 5,
    hsnCode: '0910',
    minStockLevel: 15,
    reorderQty: 40,
    preferredSupplierId: supplierId,
    status: 'ACTIVE',
    storageLocation: `W1-R${(prodId % 8) + 1}-S${(prodId % 4) + 1}`,
    description: p.description || `Pure authentic ${p.title} sourced directly by Arshith Fresh.`,
    imageUrl: p.image
  };

  products.push(product);

  batches.push({
    id: prodId,
    batchCode: `AFB-2026-${String(prodId).padStart(3, '0')}`,
    productId: prodId,
    warehouseId: 1,
    supplierId: supplierId,
    initialQty: p.qty,
    availableQty: p.qty,
    reservedQty: 0,
    damagedQty: 0,
    purchasePrice: Math.round(p.price * 0.75),
    mfgDate: '2026-10-15T00:00:00.000Z',
    expiryDate: '2027-10-15T00:00:00.000Z',
    qualityStatus: 'APPROVED'
  });

  prodId++;
}

// Read existing store
let storeData = {};
if (fs.existsSync(storePath)) {
  storeData = JSON.parse(fs.readFileSync(storePath, 'utf8'));
}

storeData.suppliers = suppliers;
storeData.categories = categories;
storeData.products = products;
storeData.batches = batches;

// Link products to suppliers for detail views
suppliers[0].products = products.filter(p => p.preferredSupplierId === 1);
suppliers[1].products = products.filter(p => p.preferredSupplierId === 2);

fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2), 'utf8');
console.log(`Successfully seeded ${products.length} REAL products and ${suppliers.length} REAL suppliers from shopify_export.csv!`);
