import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";

import CreatePost from "./componets/CreatePost";
import Navbar from "./componets/Navbar";
import Post from "./componets/Post";
import UserPostsList from "./componets/UserPostsList";

import { getAllPosts, login, signUp } from "./services/api";
import { clearAuthData, saveAuthData } from "./utils/localStorageUtils";

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [authTokenType, setAuthTokenType] = useState(
    localStorage.getItem("authTokenType")
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      saveAuthData({ authToken, authTokenType, userId, username });
    } else {
      clearAuthData();
    }
  }, [authToken, authTokenType, userId, username]);

  useEffect(() => {
    getAllPosts()
      .then((data) => {
        setPosts(
          data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      })
      .catch(() => toast.error("Failed to load posts"));
  }, []);

  const handlePostCreated = (post) => setPosts((prev) => [post, ...prev]);
  const handlePostDeleted = (id) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  const handleSignIn = async (username, password) => {
    try {
      const data = await login(username, password);
      setAuthToken(data.access_token);
      setAuthTokenType(data.token_type);
      setUserId(data.user_id);
      setUsername(data.username);
      toast.success("Logged in!");
      navigate("/");
      return { success: true };
    } catch (error) {
      toast.error("Login failed");
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const handleSignUp = async (username, email, password) => {
    try {
      await signUp(username, email, password); // your API call
      toast.success("Account created!");
      return { success: true };
    } catch (error) {
      toast.error("Signup failed");
      return { success: false, message: error.message || "Signup failed" };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId(null);
    setUsername(null);
    clearAuthData();
    toast("Logged out", { icon: "👋" });
    navigate("/");
  };

  return (
    <>
      <Toaster position="top-center" />
      <Navbar
        authToken={authToken}
        username={username}
        signIn={handleSignIn}
        signUp={handleSignUp}
        logout={logout}
      />
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col md:flex-row gap-8 px-4 md:px-16 py-8 max-w-screen-xl mx-auto min-h-screen">
              <div className="md:w-1/4">
                <CreatePost
                  authToken={authToken}
                  username={username}
                  onPostCreated={handlePostCreated}
                />
              </div>
              <main className="md:w-1/2 space-y-8">
                {posts.length === 0 ? (
                  <p className="text-center text-gray-500">No posts yet.</p>
                ) : (
                  posts.map((post) => (
                    <Post
                      key={post.id}
                      post={post}
                      authToken={authToken}
                      currentUsername={username}
                    />
                  ))
                )}
              </main>
              <div className="md:w-1/4">
                <UserPostsList
                  posts={posts}
                  username={username}
                  authToken={authToken}
                  onPostDeleted={handlePostDeleted}
                />
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}
