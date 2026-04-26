import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import itemRoutes from "./routes/item.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.listen(
    5000,
    () => {
        console.log("API Running");
    }
);