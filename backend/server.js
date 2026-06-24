require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 BFHL Backend running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/bfhl`);
});
