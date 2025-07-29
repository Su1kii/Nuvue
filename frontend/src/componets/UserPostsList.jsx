import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { deletePost } from "../services/api";

export default function UserPostsList({
  posts,
  username,
  authToken,
  onPostDeleted,
}) {
  const [notification, setNotification] = useState("");

  // Filter posts belonging to the logged-in user
  const userPosts = posts.filter((post) => post.user?.username === username);

  const handleDelete = async (id) => {
    try {
      await deletePost(authToken, id);
      onPostDeleted(id);
      setNotification("Post deleted successfully");
    } catch (error) {
      setNotification("Failed to delete post. Please try again.");
      console.error("Delete post error:", error);
    }
  };

  // Clear notification after 3 seconds
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => setNotification(""), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <section
      aria-labelledby="user-posts-title"
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg overflow-auto"
      style={{ maxHeight: "80vh" }}
    >
      <h2
        id="user-posts-title"
        className="text-3xl font-bold text-center mb-6 text-gray-900"
      >
        Your Posts
      </h2>

      {/* Custom Notification */}
      {notification && (
        <div
          role="alert"
          className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded border border-green-300 text-center font-medium"
        >
          {notification}
        </div>
      )}

      {userPosts.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          You have no posts yet.
        </p>
      ) : (
        <ul className="space-y-5">
          {userPosts.map(({ id, caption }) => {
            const displayCaption = caption || "(No caption)";
            const snippet =
              displayCaption.length > 50
                ? displayCaption.slice(0, 50) + "..."
                : displayCaption;

            return (
              <li
                key={id}
                className="flex justify-between items-center border border-gray-300 p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="max-w-[75%]">
                  <p
                    className="font-semibold text-gray-800 truncate"
                    title={displayCaption}
                  >
                    {displayCaption}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{snippet}</p>
                </div>

                <button
                  onClick={() => handleDelete(id)}
                  className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  aria-label={`Delete post: ${displayCaption}`}
                >
                  <FaTrashAlt aria-hidden="true" />
                  <span className="sr-only">Delete</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
