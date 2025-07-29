const BASE_URL = "https://0a3dae40-435b-4a55-bd32-2ba507a2a1fb.e1-us-east-azure.choreoapps.dev/choreo-apis/nuvue/backend/v1";

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const signUp = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};

export const getAllPosts = async () => {
  const res = await fetch(`${BASE_URL}/post/all`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

export const createPost = async (token, payload) => {
  const res = await fetch(`${BASE_URL}/post/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
};

export const deletePost = async (token, postId) => {
  const res = await fetch(`${BASE_URL}/post/delete/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
};
