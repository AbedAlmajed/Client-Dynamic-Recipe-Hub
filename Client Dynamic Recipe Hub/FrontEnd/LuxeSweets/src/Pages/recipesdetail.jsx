import React, { useEffect, useState } from "react";
import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaFlag,
  FaReply,
} from "react-icons/fa";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Recipesdetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const storedRecipe = JSON.parse(sessionStorage.getItem("selectedRecipe"));
    if (storedRecipe) {
      setRecipe(storedRecipe);
      // استخدام طول المصفوفة ratings[0].likes إذا كانت موجودة، وإلا استخدام 0
      setLikes(storedRecipe.ratings[0]?.likes?.length || 0);
      // هنا يمكنك إضافة منطق لتحديد ما إذا كان المستخدم الحالي قد أعجب بالوصفة
      setIsLiked(false); // يجب تحديث هذا بناءً على حالة إعجاب المستخدم الحالي
      setComments(storedRecipe.ratings[0]?.comments || []);
    }
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const response = await axios.put(
          `http://localhost:1001/api/recipe/${recipe._id}/comment`,
          {
            text: newComment,
            parentId: replyTo,
          }
        );
        setComments(response.data);
        setNewComment("");
        setReplyTo(null);
      } catch (error) {
        console.error("Failed to post comment:", error);
      }
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  const handleLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:1001/api/recipe/${recipe._id}/like`
      );
      setLikes(response.data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  const handleShare = async () => {
    try {
      await axios.put(`http://localhost:1001/api/recipe/${recipe._id}/share`);

      if (navigator.share) {
        navigator
          .share({
            title: recipe.title,
            text: `Check out this recipe الحق على ابو عبد الرحمن: ${recipe.title} ${recipe.images[0]}`,
            url: window.location.href,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        console.log("Web Share API is not supported in your browser.");
      }
    } catch (error) {
      console.error("Failed to share recipe:", error);
    }
  };

  const handleReport = () => {
    MySwal.fire({
      title: "Report this dish",
      input: "select",
      inputOptions: {
        inappropriate: "Inappropriate",
        offensive: "Offensive",
        spam: "Spam",
        other: "Other",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
      confirmButtonText: "Submit Report",
      showLoaderOnConfirm: true,
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please select a reason for reporting");
        } else {
          return axios
            .put(`http://localhost:1001/api/recipe/${recipe._id}/report`, {
              reason,
            })
            .then((response) => {
              if (response.status !== 200) {
                throw new Error(response.statusText);
              }
              return response.data;
            })
            .catch((error) => {
              Swal.showValidationMessage(`Request failed: ${error}`);
            });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          icon: "success",
          title: "Thank you for your report!",
          text: "We will review this dish based on your feedback.",
        });
      }
    });
  };

  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        {recipe.title}
      </h1>
      {recipe.images && recipe.images.length > 0 && (
        <img
          src={recipe.images[0]}
          alt={recipe.title}
          className="w-full h-64 object-cover mb-4"
        />
      )}
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      <ul className="list-disc pl-5">
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient._id}>
            {ingredient.name} - {ingredient.quantity}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
      <p>{recipe.instructions}</p>
      <h2 className="text-2xl font-semibold mb-4">Cooking Time</h2>
      <p>{recipe.cookingTime} minutes</p>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button onClick={handleLike} className="flex items-center space-x-2">
          <FaThumbsUp color={isLiked ? "blue" : "gray"} />
          <span>{likes}</span>
        </button>
        <button
          onClick={handleCommentSubmit}
          className="flex items-center space-x-2"
        >
          <FaComment /> <span>Comment</span>
        </button>
        <button onClick={handleShare} className="flex items-center space-x-2">
          <FaShare /> <span>Share</span>
        </button>
        <button onClick={handleReport} className="flex items-center space-x-2">
          <FaFlag /> <span>Report</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded"
          ></textarea>
          {replyTo !== null && (
            <div>
              Replying to comment ID: {replyTo}
              <button onClick={() => setReplyTo(null)}>Cancel</button>
            </div>
          )}
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            {replyTo === null ? "Comment" : "Reply"}
          </button>
        </form>
        <div className="mt-4">
          {comments.map((comment) => (
            <div key={comment._id} className="mb-4 border p-2 rounded">
              <p>{comment.text}</p>
              <button
                onClick={() => handleReply(comment._id)}
                className="text-sm text-blue-500"
              >
                <FaReply /> Reply
              </button>
              {comment.replies &&
                comment.replies.map((reply) => (
                  <div key={reply._id} className="ml-4 mt-2 border-l-2 pl-2">
                    <p>{reply.text}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipesdetail;
