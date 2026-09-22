import { useState } from "react";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!agree) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    // DEMO ADMIN ACCOUNT
    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {
      const adminUser = {
        name: "Admin",
        email: "admin@gmail.com",
        role: "Admin",
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(adminUser)
      );

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/role-selection";
      }, 800);

      return;
    }

    // REGISTERED USER
    const savedUser = localStorage.getItem("gymUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      if (
        email === user.email &&
        password === user.password
      ) {
        const currentUser = {
          name: user.name,
          email: user.email,
          role: user.role || "Member",
        };

        localStorage.setItem(
          "currentUser",
          JSON.stringify(currentUser)
        );

        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "/role-selection";
        }, 800);

        return;
      }
    }

    setError("Invalid email or password.");
  };

  return (
    <div className="auth-page">

      {/* Background decoration */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      {/* Left side */}
      <div className="auth-brand">

        <a href="/" className="auth-logo">
          <span className="logo-icon">🏋️</span>
          <span>
            GYM
            <strong> MANAGEMENT</strong>
          </span>
        </a>

        <div className="auth-brand-content">

          <div className="auth-badge">
            ⚡ SMART FITNESS MANAGEMENT
          </div>

          <h2>
            Welcome back.
            <br />
            <span>Let's get stronger.</span>
          </h2>

          <p>
            Manage your fitness journey, memberships,
            trainers and more — all in one powerful platform.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>✓</span>
              <div>
                <strong>Easy Management</strong>
                <small>Everything in one place</small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <div>
                <strong>Track Progress</strong>
                <small>Stay on top of your goals</small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <div>
                <strong>Smart Dashboard</strong>
                <small>Powerful gym analytics</small>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Login card */}
      <div className="auth-right">

        <div className="auth-card">

          <div className="mobile-logo">
            <span>🏋️</span>
          </div>

          <div className="auth-card-header">
            <h1>Welcome Back 👋</h1>

            <p>
              Login to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>Email / Login ID</label>

              <div className="input-wrapper">
                <span className="input-icon">✉️</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="terms-row">

              <input
                type="checkbox"
                checked={agree}
                onChange={(e) =>
                  setAgree(e.target.checked)
                }
              />

              <span>
                I agree to{" "}
                <a href="/terms">
                  Terms & Conditions
                </a>
              </span>

            </div>

            {error && (
              <div className="message error-message">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="message success-message">
                ✅ {success}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
            >
              Login to Dashboard
              <span>→</span>
            </button>

          </form>

          <div className="divider">
            <span>Demo Access</span>
          </div>

          <div className="demo-login">

            <div className="demo-title">
              🔐 Demo Admin Account
            </div>

            <div className="demo-details">
              <div>
                <span>Email</span>
                <strong>admin@gmail.com</strong>
              </div>

              <div>
                <span>Password</span>
                <strong>admin123</strong>
              </div>
            </div>

          </div>

          <p className="auth-link">
            Don't have an account?
            <a href="/register"> Create Account</a>
          </p>

          <a href="/" className="back-home">
            ← Back to Home
          </a>

        </div>

      </div>

    </div>
  );
}

export default Login;