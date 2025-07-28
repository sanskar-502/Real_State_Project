import express from "express";
import { geocodeCity } from "../controllers/geocode.controller.js";

const router = express.Router();

router.get("/:city", geocodeCity);

export default router;
