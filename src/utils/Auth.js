export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Returns true if token exists
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");

  window.location.href = '/login';
};
