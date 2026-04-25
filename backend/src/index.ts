import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Atlas sync API Running");
});

app.listen(5000,()=>{
    console.log("Running on 5000");
})