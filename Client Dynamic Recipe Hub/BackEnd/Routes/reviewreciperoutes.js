const express = require("express");
const router = express.Router();
const recipeController = require("../Controllers/reviewrecipe");

router.put("/:id/like", recipeController.likeRecipe);
router.put("/:id/comment", recipeController.addComment);
router.put("/:id/report", recipeController.reportRecipe);
router.put("/:id/share", recipeController.shareRecipe);
module.exports = router;
