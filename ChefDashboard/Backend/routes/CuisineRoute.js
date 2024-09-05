const express = require("express");
const { setCuisine, getAllCuisines } = require("../controllers/CuisineController");


const router = express.Router();
router.get("/getCuisine", getCuisine);
router.post("/setCuisine", setCuisine);
router.get('/getAllCuisines', getAllCuisines);

module.exports = router;