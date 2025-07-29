import { useEffect, useState } from "react";
import { createPost } from "../services/api";

export default function CreatePost({ authToken, username, onPostCreated }) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(""); // for custom messages
  const [notificationType, setNotificationType] = useState("success"); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setLoading(true);
    try {
      const newPost = await createPost(authToken, {
        caption: caption.trim(),
        image_url: imageUrl.trim(),
        image_url_type: "absoulute",
      });
      onPostCreated(newPost);
      setCaption("");
      setImageUrl("");
      setNotificationType("success");
      setNotification("Post created!");
    } catch {
      setNotificationType("error");
      setNotification("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  // Clear notification after 3 seconds
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => setNotification(""), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!authToken || !username) {
    return (
      <div className="text-center text-gray-600">Log in to create posts.</div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4 max-w-xs mx-auto relative"
    >
      <h2 className="text-xl font-bold text-center">Create Post</h2>

      {/* Custom Notification */}
      {notification && (
        <div
          role="alert"
          className={`mb-4 px-4 py-2 rounded border text-center font-medium
            ${
              notificationType === "success"
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
        >
          {notification}
        </div>
      )}

      <textarea
        placeholder="Caption"
        rows={3}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-2 border rounded resize-none"
        required
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
