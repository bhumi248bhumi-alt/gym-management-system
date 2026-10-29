import { useState } from "react";
import "./Auth.css";
import { supabase } from "../../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      name: "Admin",
      icon: "👑",
      description: "Manage complete gym system",
    },
    {
      name: "Trainer",
      icon: "🏋️",
      description: "Manage members and workouts",
    },
    {
      name: "Member",
      icon: "💪",
      description: "View membership and progress",
    },
    {
      name: "Doctor",
      icon: "🩺",
      description: "Manage patients and records",
    },
    {
      name: "Patient",
      icon: "🧑‍⚕️",
      description: "View appointments and history",
    },
  ];

  const getDashboardPath = (role) => {
    switch (role) {
      case "Admin":
        return "/admin";

      case "Trainer":
        return "/trainer";

      case "Member":
        return "/member";

      case "Doctor":
        return "/doctor";

      case "Patient":
        return "/patient";

      default:
        return "/";
    }
  };

  const saveUserAndRedirect = async (user, role) => {
    // Get profile
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id, name, email, phone, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError);

      await supabase.auth.signOut();

      throw new Error(
        "Your account profile could not be found. Please register again."
      );
    }

    // If account does not have a role yet,
    // assign the selected role.
    if (!profile.role) {
      const {
        data: updatedProfile,
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          role: role,
        })
        .eq("id", user.id)
        .select("id, name, email, phone, role")
        .single();

      if (updateError) {
        console.error("Role assignment error:", updateError);

        await supabase.auth.signOut();

        throw new Error(
          "Unable to assign your selected role."
        );
      }

      Object.assign(profile, updatedProfile);
    }

    // Existing account has a different role
    if (profile.role !== role) {
      await supabase.auth.signOut();

      throw new Error(
        `This account is registered as ${profile.role}. You cannot login as ${role}.`
      );
    }

    // Save current user
    const currentUser = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser)
    );

    return profile;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!selectedRole) {
      setError("Please select your login role.");
      return;
    }

    try {
      setLoading(true);

      const cleanEmail = email.trim().toLowerCase();

      console.log("Logging in...");

      // =====================================================
      // STEP 1: TRY NORMAL LOGIN
      // =====================================================

      const {
        data: loginData,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      // =====================================================
      // STEP 2: EXISTING USER LOGIN SUCCESS
      // =====================================================

      if (!loginError && loginData?.user) {
        console.log(
          "Existing user authenticated:",
          loginData.user
        );

        const profile = await saveUserAndRedirect(
          loginData.user,
          selectedRole
        );

        setSuccess(
          `Login successful! Welcome ${profile.name}.`
        );

        const dashboardPath =
          getDashboardPath(profile.role);

        setTimeout(() => {
          window.location.href = dashboardPath;
        }, 500);

        return;
      }

      // =====================================================
      // STEP 3: IF LOGIN FAILED, TRY CREATING ACCOUNT
      // =====================================================

      if (
        loginError?.message ===
        "Invalid login credentials"
      ) {
        console.log(
          "Login failed. Checking whether this is a new account..."
        );

        const {
          data: signUpData,
          error: signUpError,
        } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              name: cleanEmail.split("@")[0],
              phone: "",
            },
          },
        });

        // =================================================
        // NEW ACCOUNT CREATED
        // =================================================

        if (!signUpError && signUpData?.user) {
          console.log(
            "New account created:",
            signUpData.user
          );

          // If Supabase returned a session,
          // continue immediately.
          if (signUpData.session) {
            const profile =
              await saveUserAndRedirect(
                signUpData.user,
                selectedRole
              );

            setSuccess(
              `Account created successfully! Welcome ${profile.name}.`
            );

            const dashboardPath =
              getDashboardPath(profile.role);

            setTimeout(() => {
              window.location.href =
                dashboardPath;
            }, 500);

            return;
          }

          // If confirmation is enabled accidentally
          setError(
            "Account was created, but Supabase is asking for email confirmation. Please turn off Confirm Email in Supabase Authentication settings."
          );

          return;
        }

        // =================================================
        // USER ALREADY EXISTS
        // =================================================

        if (
          signUpError?.message?.toLowerCase().includes(
            "already registered"
          ) ||
          signUpError?.message?.toLowerCase().includes(
            "already exists"
          )
        ) {
          setError(
            "This email already has an account, but the password is incorrect. Please use the correct password or reset the password in Supabase."
          );

          return;
        }

        // Other signup error
        console.error(
          "Automatic account creation error:",
          signUpError
        );

        setError(
          signUpError?.message ||
            "Unable to create the account."
        );

        return;
      }

      // =====================================================
      // OTHER LOGIN ERROR
      // =====================================================

      console.error(
        "Login error:",
        loginError
      );

      setError(
        loginError?.message ||
          "Unable to login. Please try again."
      );
    } catch (err) {
      console.error(
        "Unexpected login error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      {/* LEFT SIDE */}
      <div className="auth-brand">

        <a
          href="/"
          className="auth-logo"
        >
          <span className="logo-icon">
            🏋️
          </span>

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
            <span>
              Let's get stronger.
            </span>
          </h2>

          <p>
            Manage your fitness journey,
            memberships, trainers and more —
            all in one powerful platform.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>
                  Easy Management
                </strong>

                <small>
                  Everything in one place
                </small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>
                  Track Progress
                </strong>

                <small>
                  Stay on top of your goals
                </small>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>
                  Smart Dashboard
                </strong>

                <small>
                  Powerful gym analytics
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
              Welcome Back 👋
            </h1>

            <p>
              Login to continue to your dashboard
            </p>

          </div>

          {/* ROLE SELECTION */}
          <div
            style={{
              marginBottom: "22px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
              }}
            >
              Select Your Role
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: "10px",
              }}
            >

              {roles.map((role) => (

                <button
                  key={role.name}
                  type="button"
                  onClick={() =>
                    setSelectedRole(
                      role.name
                    )
                  }
                  style={{
                    padding: "12px",
                    borderRadius: "10px",

                    border:
                      selectedRole ===
                      role.name
                        ? "2px solid #2563eb"
                        : "1px solid rgba(255,255,255,0.15)",

                    background:
                      selectedRole ===
                      role.name
                        ? "rgba(37,99,235,0.20)"
                        : "rgba(255,255,255,0.05)",

                    color: "white",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >

                  <div
                    style={{
                      fontSize: "20px",
                      marginBottom: "4px",
                    }}
                  >
                    {role.icon}{" "}
                    <strong>
                      {role.name}
                    </strong>
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                    }}
                  >
                    {role.description}
                  </div>

                </button>

              ))}

            </div>

            {selectedRole && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  color: "#60a5fa",
                }}
              >
                Selected role:{" "}
                <strong>
                  {selectedRole}
                </strong>
              </div>
            )}

          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="input-group">

              <label>
                Email / Login ID
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
                    setEmail(
                      e.target.value
                    )
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                      
                    )
                  }
              />
                  <div style={{ textAlign: "right", marginTop: "8px" }}>
                  <a
                  href="/forgot-password"
                  style={{
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                Forgot Password?
            </a>
</div>

              </div>

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

            {/* LOGIN */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Checking account..."
                : "Login to Dashboard"}

              {!loading && (
                <span>→</span>
              )}

            </button>

          </form>

          {/* REGISTER */}
          <p className="auth-link">

            Don't have an account?

            <a href="/register">
              {" "}Create Account
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

export default Login;