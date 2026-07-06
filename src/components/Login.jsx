import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";

import "./styles/PostRequest.css";

function Login() {
  const [loginDetails, setDetails] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

 async function handleLogin(e) {
  e.preventDefault();

  try {

    // STEP 1: Login
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginDetails)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // STEP 2: Store token
    localStorage.setItem("token", data.token);

    // STEP 3: Get current user
    const meResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      }
    );

    const currentUser = await meResponse.json();

    console.log("CURRENT USER:", currentUser);

    // STEP 4: Save user in AuthContext
   login({
  ...currentUser,
  token: data.token
});

    // STEP 5: Redirect home
      if (data.role === "ROLE_PROVIDER") {
      navigate("/provider/dashboard");
    } else {
      navigate("/");
    }
  
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

return (
  <div className="login-page">
    <form onSubmit={handleLogin}>
      <div className="loginContainer">
        <h2>Welcome Back</h2>

        <label>Enter email address</label>
        <input
          type="text"
          value={loginDetails.email}
          onChange={(e) =>
            setDetails({ ...loginDetails, email: e.target.value })
          }
        />

        <label>Enter password</label>
        <input
          type="password"
          value={loginDetails.password}
          onChange={(e) =>
            setDetails({ ...loginDetails, password: e.target.value })
          }
        />

        <button type="submit">Login</button>

        <Link to="/register">
          Don't have an account? Register
        </Link>
      </div>
    </form>
  </div>
);
}

export default Login;