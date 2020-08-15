import express from "express";
import views from "./views";
import converter from "./converter";

const app = express();
const PORT = 8000;

// TODO: add request logging

views(app);
converter(app);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
