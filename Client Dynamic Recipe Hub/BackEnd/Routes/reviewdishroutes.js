const express = require("express");
const router = express.Router();
const dishController = require("../Controllers/reviewdish");

router.put("/:id/like", dishController.likeDish);
router.put("/:id/comment", dishController.addComment);
router.put("/:id/report", dishController.reportdish);

module.exports = router;
