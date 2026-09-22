import "./Auth.css";

function Terms() {
  return (
    <div className="auth-page">

      <div className="auth-card terms-card">

        <div className="auth-icon">
          📜
        </div>

        <h1>Terms & Conditions</h1>

        <p className="auth-subtitle">
          Gym & Membership Management System
        </p>

        <div className="terms-content">

          <h3>1. Account Usage</h3>
          <p>
            Users must provide accurate information while
            creating an account and using the system.
          </p>

          <h3>2. Membership</h3>
          <p>
            Membership plans, payments and subscriptions
            are managed through the gym management system.
          </p>

          <h3>3. User Responsibilities</h3>
          <p>
            Users are responsible for keeping their login
            credentials private and secure.
          </p>

          <h3>4. Personal Information</h3>
          <p>
            Personal information should only be used for
            gym management and related services.
          </p>

          <h3>5. System Usage</h3>
          <p>
            Users should use the system responsibly and
            should not attempt to access unauthorized areas.
          </p>

          <h3>6. Agreement</h3>
          <p>
            By registering or logging into the system,
            you confirm that you agree to these Terms &
            Conditions.
          </p>

        </div>

        <a href="/register" className="back-home">
          ← Back to Register
        </a>

      </div>

    </div>
  );
}

export default Terms;
