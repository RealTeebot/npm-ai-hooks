import express from "express";
import summarizeRoute from "./routes/summarize";
const PORT= 3000;
const app = express();
app.use(express.json());

app.get("/", (_, res) => res.send("AI Hooks API is running..."));
app.use("/summarize", summarizeRoute);

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);