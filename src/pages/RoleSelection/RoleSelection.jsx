import "./RoleSelection.css";

function RoleSelection() {
  const roles = [
    {
      name: "Admin",
      icon: "👨‍💼",
      description: "Manage the complete gym system",
      path: "/admin",
    },
    {
      name: "Trainer",
      icon: "🏋️",
      description: "Manage members and workouts",
      path: "/trainer",
    },
    {
      name: "Member",
      icon: "💪",
      description: "View membership and fitness progress",
      path: "/member",
    },
    {
      name: "Doctor",
      icon: "👨‍⚕️",
      description: "Manage patients and medical records",
      path: "/doctor",
    },
    {
      name: "Patient",
      icon: "🧑‍⚕️",
      description: "View appointments and medical history",
      path: "/patient",
    },
  ];

  return (
    <div className="role-page">

      {/* Background */}
      <div className="role-bg"></div>
      <div className="role-overlay"></div>

      {/* Blue glow effects */}
      <div className="role-glow role-glow-one"></div>
      <div className="role-glow role-glow-two"></div>

      {/* Top Navigation */}
      <header className="role-navbar">

        <a href="/" className="role-logo">
          <span className="role-logo-icon">🏋️</span>

          <span>
            GYM
            <strong> MANAGEMENT</strong>
          </span>
        </a>

        <a href="/login" className="role-nav-back">
          ← Back to Login
        </a>

      </header>

      {/* Main Content */}
      <main className="role-main">

        <div className="role-header">

          <div className="role-badge">
            ⚡ SMART FITNESS MANAGEMENT
          </div>

          <div className="role-main-icon">
            🏋️
          </div>

          <h1>
            Select Your <span>Role</span>
          </h1>

          <p>
            Choose your role to access your personalized
            dashboard and manage your fitness journey.
          </p>

        </div>

        {/* Role Cards */}
        <div className="role-grid">

          {roles.map((role) => (
            <a
              key={role.name}
              href={role.path}
              className="role-card"
            >

              <div className="role-card-top">
                <span className="role-number">
                  0{roles.indexOf(role) + 1}
                </span>

                <span className="role-arrow">
                  →
                </span>
              </div>

              <div className="role-icon">
                {role.icon}
              </div>

              <div className="role-card-content">

                <h2>{role.name}</h2>

                <p>{role.description}</p>

              </div>

              <div className="role-card-footer">

                <span>
                  Continue
                </span>

                <span className="role-footer-arrow">
                  →
                </span>

              </div>

            </a>
          ))}

        </div>

        {/* Bottom information */}
        <div className="role-security">

          <div className="security-item">
            <span>🔒</span>
            <div>
              <strong>Secure Access</strong>
              <small>Your dashboard is protected</small>
            </div>
          </div>

          <div className="security-line"></div>

          <div className="security-item">
            <span>⚡</span>
            <div>
              <strong>Quick Access</strong>
              <small>Continue to your workspace</small>
            </div>
          </div>

        </div>

      </main>

      <footer className="role-footer">
        © 2026 GYM MANAGEMENT · Smart Fitness Management Platform
      </footer>

    </div>
  );
}

export default RoleSelection;