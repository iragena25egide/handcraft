import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";
import { AppDataSource } from "./data-source";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import reportRoutes from "./routes/reportRoutes";
import { initSocket } from "./socket";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

initSocket(server);

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running!" });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully!");

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log("Database connection failed: ", error));
