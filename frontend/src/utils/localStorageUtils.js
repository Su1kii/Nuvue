export const saveAuthData = ({
  authToken,
  authTokenType,
  userId,
  username,
}) => {
  localStorage.setItem("authToken", authToken);
  localStorage.setItem("authTokenType", authTokenType);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);
};

export const clearAuthData = () => localStorage.clear();
