
import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./index.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your registered email.");
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (error) throw error;

      setMessage(
        "If an account exists for this email, a password reset link will be sent. Please check your inbox and spam folder."
      );
    } catch (err) {
      setError(err.message || "Unable to send the reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-page">
      <section className="forgot-card">
        <div className="forgot-icon" aria-hidden="true">
          🔐
        </div>

        <h1>Forgot Password?</h1>

        <p className="forgot-description">
          No worries! Enter your registered email address
          and we'll help you reset your Gym Management
          System password.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <label htmlFor="reset-email">
            Registered Email Address
          </label>

          <input
            id="reset-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <button
            type="submit"
            className="forgot-submit"
            disabled={loading}
          >
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="forgot-message" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="forgot-error" role="alert">
            {error}
          </p>
        )}

        <div className="forgot-footer">
          Remember your password?{" "}
          <a href="/login">Back to Login</a>
        </div>
      </section>
    </main>
  );
}
