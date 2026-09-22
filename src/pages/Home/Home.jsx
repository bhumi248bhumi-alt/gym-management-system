import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">🏋️</span>
          <div>
            <strong>GYM</strong>
            <span> MANAGEMENT</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="/" className="active">Home</a>
          <a href="#features">Features</a>
          <a href="#plans">Plans</a>
          <a href="/login">Login</a>
          <a href="/register" className="nav-register">
            Get Started
          </a>
        </div>

      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-badge">
            🔥 SMART FITNESS MANAGEMENT
          </div>

          <h1>
            Transform Your
            <br />
            <span>Body.</span> Transform
            <br />
            Your <span>Life.</span>
          </h1>

          <p>
            A smarter way to manage your gym, members,
            trainers, memberships and payments — all in one powerful system.
          </p>

          <div className="hero-buttons">

            <a href="/register" className="btn primary-btn">
              Join Now <span>→</span>
            </a>

            <a href="/login" className="btn secondary-btn">
              Login
            </a>

          </div>

          <div className="hero-trust">
            <div className="avatars">
              <span>👨🏻</span>
              <span>👩🏻</span>
              <span>👨🏽</span>
              <span>👩🏽</span>
            </div>

            <div>
              <strong>500+ Members</strong>
              <small>Growing stronger every day</small>
            </div>
          </div>

        </div>

        <div className="hero-floating-card card-one">
          <span>🔥</span>
          <div>
            <strong>Stay Consistent</strong>
            <small>Every workout counts</small>
          </div>
        </div>

        <div className="hero-floating-card card-two">
          <span>🏆</span>
          <div>
            <strong>Reach Your Goals</strong>
            <small>Track your progress</small>
          </div>
        </div>

      </section>

      {/* STATS */}
      <section className="stats-section">

        <div className="stat">
          <strong>500+</strong>
          <span>Active Members</span>
        </div>

        <div className="stat">
          <strong>25+</strong>
          <span>Expert Trainers</span>
        </div>

        <div className="stat">
          <strong>10+</strong>
          <span>Membership Plans</span>
        </div>

        <div className="stat">
          <strong>98%</strong>
          <span>Member Satisfaction</span>
        </div>

      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <span>POWERFUL FEATURES</span>

          <h2>
            Everything Your Gym
            <br />
            Needs in <span>One Place</span>
          </h2>

          <p>
            Manage your entire gym operation with simple,
            powerful and easy-to-use tools.
          </p>

        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon blue">👥</div>
            <h3>Member Management</h3>
            <p>
              Add, edit and manage gym members with all
              their membership information in one place.
            </p>
            <a href="/login">Learn more →</a>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">🏋️</div>
            <h3>Trainer Management</h3>
            <p>
              Manage trainers, specializations and
              experience with an organized system.
            </p>
            <a href="/login">Learn more →</a>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">💳</div>
            <h3>Membership Plans</h3>
            <p>
              Create flexible plans, manage pricing and
              keep your memberships organized.
            </p>
            <a href="/login">Learn more →</a>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">📊</div>
            <h3>Reports & Analytics</h3>
            <p>
              Understand your gym performance through
              useful reports and analytics.
            </p>
            <a href="/login">Learn more →</a>
          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">

        <div className="why-image">

          <div className="image-decoration"></div>

          <div className="gym-visual">
            <div className="visual-icon">💪</div>
            <strong>GET STRONGER</strong>
            <span>EVERY SINGLE DAY</span>
          </div>

        </div>

        <div className="why-content">

          <span className="section-label">
            WHY CHOOSE US
          </span>

          <h2>
            Built To Help You
            <br />
            <span>Manage & Grow</span>
          </h2>

          <p>
            Our Gym Management System makes everyday gym
            management easier, faster and more organized.
          </p>

          <div className="why-list">

            <div className="why-item">
              <div>✓</div>
              <span>
                Easy and simple member management
              </span>
            </div>

            <div className="why-item">
              <div>✓</div>
              <span>
                Complete trainer and workout management
              </span>
            </div>

            <div className="why-item">
              <div>✓</div>
              <span>
                Secure payment and membership tracking
              </span>
            </div>

            <div className="why-item">
              <div>✓</div>
              <span>
                Powerful dashboard and reports
              </span>
            </div>

          </div>

          <a href="/register" className="why-button">
            Get Started →
          </a>

        </div>

      </section>

      {/* PLANS */}
      <section className="plans-preview" id="plans">

        <div className="section-heading">

          <span>MEMBERSHIP</span>

          <h2>
            Choose Your <span>Plan</span>
          </h2>

          <p>
            Flexible membership options designed for
            different fitness goals.
          </p>

        </div>

        <div className="plans-grid">

          <div className="plan-preview-card">

            <span className="plan-name">BASIC</span>

            <h3>
              ₹999 <small>/ month</small>
            </h3>

            <div className="plan-line"></div>

            <p>✓ Gym access</p>
            <p>✓ Cardio equipment</p>
            <p>✓ Locker facility</p>

            <a href="/register">
              Choose Plan
            </a>

          </div>

          <div className="plan-preview-card featured-plan">

            <div className="popular">POPULAR</div>

            <span className="plan-name">PREMIUM</span>

            <h3>
              ₹1,999 <small>/ 3 months</small>
            </h3>

            <div className="plan-line"></div>

            <p>✓ Everything in Basic</p>
            <p>✓ Personal trainer</p>
            <p>✓ Workout plan</p>

            <a href="/register">
              Choose Plan
            </a>

          </div>

          <div className="plan-preview-card">

            <span className="plan-name">PRO</span>

            <h3>
              ₹3,999 <small>/ 6 months</small>
            </h3>

            <div className="plan-line"></div>

            <p>✓ Everything in Premium</p>
            <p>✓ Diet guidance</p>
            <p>✓ Progress tracking</p>

            <a href="/register">
              Choose Plan
            </a>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="cta-section">

        <div>

          <span>READY TO START?</span>

          <h2>
            Your Stronger Self
            <br />
            Starts <span>Today.</span>
          </h2>

          <p>
            Take the first step toward a healthier,
            stronger and better you.
          </p>

        </div>

        <a href="/register" className="cta-button">
          Join Now →
        </a>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-brand">

          <div className="logo">
            <span className="logo-icon">🏋️</span>
            <div>
              <strong>GYM</strong>
              <span> MANAGEMENT</span>
            </div>
          </div>

          <p>
            Manage your gym smarter.
            <br />
            Train better. Grow stronger.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>QUICK LINKS</h4>
            <a href="/">Home</a>
            <a href="#features">Features</a>
            <a href="#plans">Plans</a>
          </div>

          <div>
            <h4>ACCOUNT</h4>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>

          <div>
            <h4>CONTACT</h4>
            <span>📧 support@gym.com</span>
            <span>📞 +91 98765 43210</span>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Gym Management System. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;