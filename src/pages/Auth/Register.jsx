import { useState } from "react";
import "./Auth.css";
import { supabase } from "../../lib/supabase";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      console.log("Creating Supabase account...");

      // -----------------------------
      // CREATE AUTH USER
      // -----------------------------

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              name: name.trim(),
              phone: phone.trim(),
            },
          },
        });

      if (signUpError) {
        console.error("Registration error:", signUpError);
        setError(signUpError.message);
        return;
      }

      if (!data.user) {
        setError("Unable to create your account.");
        return;
      }

      console.log("Auth user created:", data.user);

      // -----------------------------
      // PROFILE
      // -----------------------------

      // Because email confirmation is OFF,
      // the user should have an active session.
      //
      // The trigger should already create
      // the profile automatically.
      //
      // We update the profile with the
      // latest name/phone information.

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .update({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
        })
        .eq("id", data.user.id)
        .select()
        .single();

      if (profileError) {
        console.error("Profile update error:", profileError);

        // Don't fail registration completely.
        // The Auth account was already created.
        console.warn(
          "Auth account created, but profile update failed."
        );
      } else {
        console.log("Profile created/updated:", profile);
      }

      // -----------------------------
      // SUCCESS
      // -----------------------------

      setSuccess(
        "Account created successfully! You can now login."
      );

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setAgree(false);

    } catch (err) {
      console.error("Unexpected registration error:", err);

      setError(
        err.message ||
          "Something went wrong during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background decoration */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      {/* LEFT SIDE */}
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
            Start your journey.
            <br />
            <span>Build your best self.</span>
          </h2>

          <p>
            Create your account and manage your
            fitness journey, membership and progress
            in one powerful platform.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Easy Management</strong>
                <small>
                  Everything in one place
                </small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Track Progress</strong>
                <small>
                  Stay on top of your goals
                </small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Smart Dashboard</strong>
                <small>
                  Powerful gym management
                </small>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">

        <div className="auth-card">

          <div className="mobile-logo">
            <span>🏋️</span>
          </div>

          <div className="auth-card-header">

            <h1>
              Create Account 🚀
            </h1>

            <p>
              Register to start using the gym management system
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}
            <div className="input-group">

              <label>
                Full Name
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            {/* PHONE */}
            <div className="input-group">

              <label>
                Phone Number
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  📱
                </span>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">

              <label>
                Confirm Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔐
                </span>

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

              </div>

            </div>

            {/* TERMS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >

              <input
                type="checkbox"
                checked={agree}
                onChange={(e) =>
                  setAgree(e.target.checked)
                }
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#cbd5e1",
                }}
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  style={{
                    color: "#60a5fa",
                  }}
                >
                  Terms & Conditions
                </a>
              </span>

            </div>

            {/* ERROR */}
            {error && (
              <div className="message error-message">
                ❌ {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="message success-message">
                ✅ {success}
              </div>
            )}

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <span>→</span>
              )}

            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="auth-link">

            Already have an account?

            <a href="/login">
              {" "}Login
            </a>

          </p>

          {/* HOME */}
          <a
            href="/"
            className="back-home"
          >
            ← Back to Home
          </a>

        </div>
      </div>

    </div>
  );
}

export default Register;