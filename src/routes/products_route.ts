import express  from "express";

export const products_route = express.Router();

products_route.get("/", (req, res) => {
    res.status(200).json({message: "express is really express"});
});