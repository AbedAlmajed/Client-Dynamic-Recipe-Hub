import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import useFetch from "../../hooks/useFetch";
import { storage } from "../../Config/config";
import usePut from "../../hooks/usePut"; // Assuming you have the custom hook for PUT requests
import { HiPencilAlt } from "react-icons/hi"; // For pencil icon
import { HiEye, HiEyeOff } from "react-icons/hi"; // For eye icons
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const ProfilePage = () => {
  // Fetch users data
  const { data, loading, error } = useFetch(
    "http://localhost:1001/api/auth/getAllUsers"
  );

  // Assuming we fetch the current user as the first user for demo purposes
  const users = data ? data.Users : [];
  const user = users.length > 0 ? users[0] : null;

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState("********");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  // States for new user data
  const [newName, setNewName] = useState(user ? user.name : "");
  const [newImage, setNewImage] = useState(user ? user.image : "");

  // PUT request hook
  const { putData } = usePut(
    user ? `http://localhost:1001/api/auth/updateProfile/${user._id}` : null
  );

  useEffect(() => {
    handlePasswordChange();
  }, [newPassword, confirmPassword]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  const handlePasswordChange = () => {
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordMismatch(true);
      } else {
        setPasswordMismatch(false);
      }
    } else {
      setPasswordMismatch(false);
    }
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMismatch(false);
  };

  const handleUpdateProfile = () => {
    if (!passwordMismatch) {
      setShowConfirmationDialog(true);
    }
  };

  const handleConfirmUpdate = () => {
    setShowConfirmationDialog(false);
    const payload = {
      name: newName,
      newPassword: newPassword,
      image: newImage,
    };
    putData(payload);
    setIsEditing(false); // Close editing mode
    setIsChangingPassword(false); // Close password change mode
  };

  const handleCancelUpdate = () => {
    setShowConfirmationDialog(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((downloadURL) => {
          setNewImage(downloadURL); // Update image URL state
          setSuccess("Image uploaded successfully!");
        })
        .catch((error) => {
          setError("Error uploading image. Please try again.");
        });
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-[#F5F3F0]">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded mb-4">
                <p>
                  Error loading user data: {error.message || "Unknown error"}
                </p>
              </div>
            ) : (
              user && (
                <div className="flex flex-col mb-6">
                  <div className="relative">
                    <img
                      src={user.image || "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-[#b0956e] shadow-md mb-4 cursor-pointer"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="fileInput"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="mb-4 relative">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border border-gray-300 rounded ${
                        isEditing
                          ? "bg-white"
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                      onChange={(e) => setNewName(e.target.value)}
                      readOnly={!isEditing}
                      defaultValue={user.name}
                    />
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="absolute right-2 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <HiPencilAlt className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                      defaultValue={user.email}
                      readOnly
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={isChangingPassword ? "text" : "password"}
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        value={password}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={handleChangePasswordClick}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <HiPencilAlt className="w-5 h-5" />
                      </button>
                    </div>
                    {isChangingPassword && (
                      <div className="mt-4">
                        <div className="relative mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Password
                          </label>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full p-2 border border-gray-300 rounded"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={toggleShowNewPassword}
                            className="absolute right-2 top-[3.1rem] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? (
                              <HiEyeOff className="w-5 h-5" />
                            ) : (
                              <HiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <div className="relative mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                          </label>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full p-2 border border-gray-300 rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={toggleShowConfirmPassword}
                            className="absolute right-2 top-[3.1rem] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <HiEyeOff className="w-5 h-5" />
                            ) : (
                              <HiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {passwordMismatch && (
                          <p className="text-red-500 text-sm mt-2">
                            Passwords do not match
                          </p>
                        )}
                      </div>
                    )}

                    {isChangingPassword && (
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="bg-[#ffc7a1] hover:bg-blue-600 text-white text-xs font-medium py-1 px-3 rounded-md shadow-sm transition ease-in-out duration-300 transform hover:scale-100"
                      >
                        Reset Changes
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleUpdateProfile}
                      className="bg-[#A0785D] text-white px-4 py-2 rounded shadow hover:bg-[#ac8368]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )
            )}
            {/* Last Order Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Last Order
              </h2>
              {false ? (
                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                  <p>
                    Order Name: <span className="font-bold">Order #1</span>
                  </p>
                  <p>
                    Date: <span className="font-bold">2024-09-01</span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-bold text-green-600">Completed</span>
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
                  <p className="text-gray-500">No orders yet</p>
                </div>
              )}
            </div>

            {/* Favorites Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Favorites
              </h2>
              {false ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Series 1</h3>
                    <p className="text-gray-700">Series description here</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
                  <p className="text-gray-500">No favorite items yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmationDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Changes</h3>
            <p className="mb-4">Are you sure you want to save the changes?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelUpdate}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="bg-[#1A318C] text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProfilePage;
