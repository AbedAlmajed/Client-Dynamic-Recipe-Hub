import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import Swal
import withReactContent from "sweetalert2-react-content";
import {
  FaThumbsUp,
  FaComment,
  FaShare,
  FaFlag,
  FaReply,
} from "react-icons/fa";
import axios from "axios";

const DishDetail = () => {
  const [dessert, setDessert] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    const storedDish = JSON.parse(sessionStorage.getItem("selectedDessert"));
    if (storedDish) {
      setDessert(storedDish);
      // استخدام طول المصفوفة ratings[0].likes إذا كانت موجودة، وإلا استخدام 0
      setLikes(storedDish.ratings[0]?.likes?.length || 0);
      // هنا يمكنك إضافة منطق لتحديد ما إذا كان المستخدم الحالي قد أعجب بالوصفة
      setIsLiked(false); // يجب تحديث هذا بناءً على حالة إعجاب المستخدم الحالي
      setComments(storedDish.ratings[0]?.comments || []);
    }
  }, []);
  const handleLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:1001/api/dish/${dessert._id}/like`
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
            .put(`http://localhost:1001/api/dish/${dessert._id}/report`, {
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
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const response = await axios.put(
          `http://localhost:1001/api/dish/${dessert._id}/comment`,
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

  if (!dessert) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        {dessert.name}
      </h1>
      <img
        src={dessert.images[0]}
        alt={dessert.name}
        className="w-full h-64 object-cover mb-4"
      />
      <h2 className="text-2xl font-semibold mb-4">Description</h2>
      <p className="mb-4">{dessert.description}</p>
      <h2 className="text-2xl font-semibold mb-4">Price</h2>
      <p className="mb-4">${dessert.price.toFixed(2)}</p>
      <h2 className="text-2xl font-semibold mb-4">Available Quantity</h2>
      <p className="mb-4">{dessert.availableQuantity}</p>
      <h2 className="text-2xl font-semibold mb-4">Size</h2>
      <p className="mb-4">{dessert.size}</p>
      <h2 className="text-2xl font-semibold mb-4">Cuisine</h2>
      <p className="mb-4">{dessert.cuisine}</p>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button onClick={handleLike} className="flex items-center space-x-2">
          <FaThumbsUp color={isLiked ? "blue" : "gray"} />
          <span>{likes}</span>
        </button>
        <button
          onClick={() => console.log("Comment functionality to be implemented")}
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
            <div key={comment.id} className="mb-4 border p-2 rounded">
              <p>{comment.text}</p>
              <button
                onClick={() => handleReply(comment.id)}
                className="text-sm text-blue-500"
              >
                <FaReply /> Reply
              </button>
              {comment.replies.map((reply) => (
                <div key={reply.id} className="ml-4 mt-2 border-l-2 pl-2">
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

export default DishDetail;
