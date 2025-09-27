const login = (email: string, password: string): boolean => {
  if (email && password) {
    localStorage.setItem("authToken", "jw-token-1234");
    // setIsAuthenticated(true)
    return true;
  } else {
    return false;
  }
};
