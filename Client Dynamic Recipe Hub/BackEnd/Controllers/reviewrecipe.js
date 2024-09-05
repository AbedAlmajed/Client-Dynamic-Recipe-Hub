const Recipe = require("../Models/recipemodel");

const testUserId = "66d6b172915efaec939b6973";
exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const userId = testUserId;
    if (recipe.ratings.length === 0) {
      recipe.ratings.push({});
    }

    const likeIndex = recipe.ratings[0].likes.indexOf(userId);

    if (likeIndex > -1) {
      recipe.ratings[0].likes.splice(likeIndex, 1);
    } else {
      recipe.ratings[0].likes.push(userId);
    }

    await recipe.save();
    res.json({ likes: recipe.ratings[0].likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const { text, parentId } = req.body;
    const userId = testUserId;

    if (recipe.ratings.length === 0) {
      recipe.ratings.push({});
    }

    if (parentId) {
      const parentComment = recipe.ratings[0].comments.id(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      parentComment.replies.push({ text, user: userId });
    } else {
      recipe.ratings[0].comments.push({ text, user: userId });
    }

    await recipe.save();
    res.json(recipe.ratings[0].comments);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.shareRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Here you can implement custom logic like generating a unique share link,
    // tracking the number of shares, or sending a notification.

    return res.status(200).json({ message: "Recipe shared successfully" });
  } catch (error) {
    console.error("Error sharing recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.reportRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const { reason } = req.body;
    const userId = testUserId; // Using the hardcoded user ID for testing

    recipe.ratings[0].reportFlag.isReported = true;
    recipe.ratings[0].reportFlag.reports.push({ reason, user: userId });

    await recipe.save();
    res.json({ message: "Recipe reported successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
