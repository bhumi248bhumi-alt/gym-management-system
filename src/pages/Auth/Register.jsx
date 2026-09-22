import { useState } from "react";
import "./Auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Required fields
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Email validation
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password length
    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Terms
    if (!form.agree) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    // Save user
    const user = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: "Member",
    };

    localStorage.setItem(
      "gymUser",
      JSON.stringify(user)
    );

    setSuccess(
      "Registration successful! You can now login."
    );

    // Clear form
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    });
  };

  return (
    <div className="auth-page">

      {/* Background effects */}
      <div className="auth-bg-image"></div>
      <div className="auth-overlay"></div>

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      {/* =====================================
          LEFT BRAND SECTION
      ===================================== */}

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
            Build your body.
            <br />
            <span>Build your future.</span>
          </h2>

          <p>
            Create your account and take control of
            your fitness journey with our complete
            gym management platform.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Manage Everything</strong>
                <small>
                  Members, trainers and memberships
                </small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Track Your Progress</strong>
                <small>
                  Stay focused on your fitness goals
                </small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Powerful Dashboard</strong>
                <small>
                  Smart insights and gym analytics
                </small>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          REGISTER SECTION
      ===================================== */}

      <div className="auth-right">

        <div className="auth-card register-card">

          {/* Mobile logo */}
          <div className="mobile-logo">
            🏋️
          </div>

          <div className="auth-card-header">

            <div className="form-step">
              <span>01</span>
              <div></div>
              <span>Account</span>
            </div>

            <h1>Create Your Account</h1>

            <p>
              Join us and start your fitness journey today.
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* Name */}
            <div className="input-group">

              <label>Full Name</label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Email */}
            <div className="input-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Password row */}
            <div className="register-input-row">

              <div className="input-group">

                <label>Password</label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    type="password"
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="input-group">

                <label>Confirm Password</label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔐
                  </span>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {/* Terms */}
            <div className="terms-row">

              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />

              <span>
                I agree to{" "}
                <a href="/terms">
                  Terms & Conditions
                </a>
              </span>

            </div>

            {/* Error */}
            {error && (
              <div className="message error-message">
                ❌ {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="message success-message">
                ✅ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
            >
              Create My Account
              <span>→</span>
            </button>

          </form>

          {/* Login */}
          <p className="auth-link">
            Already have an account?
            <a href="/login"> Login here</a>
          </p>

          {/* Home */}
          <a href="/" className="back-home">
            ← Back to Home
          </a>

        </div>

      </div>

    </div>
  );
}

export default Register;