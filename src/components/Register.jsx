import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles/PostRequest.css";

export default function Register() {

  const [registerPersona, setPersona] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (registerPersona.password !== registerPersona.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userToSave = {
      firstName: registerPersona.firstName,
      lastName: registerPersona.lastName,
      email: registerPersona.email,
      location: registerPersona.location,
      phoneNumber: registerPersona.phoneNumber,
      password: registerPersona.password
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userToSave)
        }
      );

      const data = await response.json();

      console.log("Saved User:", data);

      setPersona({
        firstName: "",
        lastName: "",
        email: "",
        location: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
      });

      navigate("/login");

    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="registerContainer">

          <label>First Name</label>
          <input
            type="text"
            placeholder="Enter first name"
            required
            value={registerPersona.firstName}
            onChange={(e) =>
              setPersona({
                ...registerPersona,
                firstName: e.target.value
              })
            }
          />

          <label>Last Name</label>
          <input
            type="text"
            placeholder="Enter last name"
            required
            value={registerPersona.lastName}
            onChange={(e) =>
              setPersona({
                ...registerPersona,
                lastName: e.target.value
              })
            }
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            
            value={registerPersona.email}
            onChange={(e) =>
              setPersona({
                ...registerPersona,
                email: e.target.value
              })
            }
          />

          <label>Location</label>
          <input
            type="text"
            placeholder="Enter location"
            required
            value={registerPersona.location}
            onChange={(e) =>
              setPersona({
                ...registerPersona,
                location: e.target.value
              })
            }
          />

          {/* ✅ NEW FIELD */}
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
            required
            value={registerPersona.phoneNumber}
            onChange={(e) =>
              setPersona({
                ...registerPersona,
                phoneNumber: e.target.value
              })
            }
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            required
            value={registerPersona.password}
            onChange={(e) =>
              setPersona({
                ...registerPersona,
                password: e.target.value
              })
            }
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            required
            value={registerPersona.confirmPassword}
            onChange={(e) =>
              setPersona({
                ...registerPersona,
                confirmPassword: e.target.value
              })
            }
          />

          <button type="submit">
            Create Account
          </button>

        </div>
      </form>
    </div>
  );
}