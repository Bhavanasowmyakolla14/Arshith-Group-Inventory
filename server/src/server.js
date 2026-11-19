require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 Arshith Infotech - Project Management Backend Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💼 System: Project Inventory & Portfolio Management`);
  console.log(`=======================================================`);
});

