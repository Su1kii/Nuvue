import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Tailwind gradient classes
const colors = [
  "from-red-400 to-pink-500",
  "from-green-400 to-teal-500",
  "from-purple-400 to-indigo-500",
  "from-yellow-400 to-orange-500",
  "from-pink-400 to-red-500",
  "from-cyan-400 to-blue-500",
];

// Simple hash function to assign color based on username
function hashStringToIndex(str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

const Post = ({ post, authToken, currentUsername }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileColor, setProfileColor] = useState("");

  useEffect(() => {
    const isValidUrl = post.image_url?.startsWith("http");
    const img =
      post.image_url_type === "absoulute" && isValidUrl ? post.image_url : null;
    setImageUrl(img);
  }, [post.image_url, post.image_url_type]);

  useEffect(() => {
    const username = post.user?.username || "Unknown";
    const index = hashStringToIndex(username, colors.length);
    setProfileColor(colors[index]);
  }, [post.user?.username]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/comment/all/${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        toast.error("Failed to load comments.");
      }
    } catch (error) {
      toast.error("Failed to load comments.");
      console.error("Fetch comments error:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const getInitial = () => {
    const name = post.user?.username || "U";
    return name.charAt(0).toUpperCase();
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const payload = {
        text: commentText.trim(),
        username: currentUsername || "Anonymous",
        post_id: post.id,
      };

      const res = await fetch("http://localhost:8000/comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setCommentText("");
        toast.success("Comment posted!");
        fetchComments();
      } else {
        const errorText = await res.text();
        toast.error("Failed to post comment.");
        console.error("Post comment error:", errorText);
      }
    } catch (error) {
      toast.error("Failed to post comment.");
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="flex justify-center mt-8 px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl overflow-hidden transition hover:shadow-3xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-md bg-gradient-to-br ${profileColor}`}
              >
                {getInitial()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {post.user?.username || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">2h ago</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 text-xl transition">
              ⋯
            </button>
          </div>

          {/* Optional Image */}
          {imageUrl && (
            <div className="relative">
              <img
                onClick={() => setIsModalOpen(true)}
                src={imageUrl}
                alt="Post"
                className="w-full max-h-[500px] object-cover bg-gray-200 cursor-pointer transition hover:brightness-95"
              />
            </div>
          )}

          {/* Caption */}
          <div className="px-4 py-3">
            <p className="text-gray-800 text-sm">{post.caption}</p>
          </div>

          <div className="mx-4 border-t border-gray-200" />

          {/* Comments */}
          <div className="px-4 pb-2 space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {comments.length > 0 ? (
              comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-xl shadow-sm"
                >
                  <span className="font-semibold">{comment.username}</span>:{" "}
                  {comment.text}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No comments yet.</p>
            )}
          </div>

          {/* Comment input */}
          {authToken && currentUsername ? (
            <form
              onSubmit={handleSubmitComment}
              className="flex items-center gap-3 px-4 pb-4"
            >
              <input
                type="text"
                className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !commentText.trim()}
                className={`px-5 py-2 rounded-full text-white font-semibold transition
                  ${
                    loading || !commentText.trim()
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 hover:from-rose-500 hover:via-yellow-500 hover:to-orange-600"
                  }`}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </form>
          ) : (
            <p className="text-center text-gray-500 italic pb-4">
              Log in to add comments.
            </p>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isModalOpen && imageUrl && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <img
            src={imageUrl}
            alt="Full view"
            className="max-h-[90vh] w-auto object-contain rounded-lg shadow-2xl"
          />
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl font-light"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default Post;
