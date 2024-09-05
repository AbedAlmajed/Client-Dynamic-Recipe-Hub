const resipe = require("../Models/recipemodel");

exports.getrecipe = async (req, res) => {
  try {
    const records = await resipe.find({ isDeleted: false, show: true });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
