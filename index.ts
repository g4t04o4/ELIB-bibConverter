import express from 'express';
import views from './views';

const app = express();
const PORT = 8000;

views(app);
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
