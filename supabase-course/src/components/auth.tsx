import { useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "../supabase-client";

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    const cleanEmail = email.trim();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });
      if (error) {
        setErrorMessage(error.message || "Sign-up failed. Try again.");
      } else {
        setInfoMessage("Sign-up successful! Check your email to confirm.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        setErrorMessage(error.message || "Sign-in failed. Try again.");
      } else {
        setInfoMessage("Signed in successfully!");
        window.location.href = "/tasks"; // redirect after login
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: "http://localhost:3000/update-password", // change to deployed URL
    });

    if (error) {
      setErrorMessage(error.message || "Failed to send reset email.");
    } else {
      setInfoMessage("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      {errorMessage && <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMessage}</p>}
      {infoMessage && <p style={{ color: "green", marginTop: "0.5rem" }}>{infoMessage}</p>}

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ padding: "0.5rem 1rem", marginTop: "0.5rem" }}
        disabled={loading}
      >
        {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
      </button>

      {!isSignUp && (
        <button
          onClick={handleForgotPassword}
          disabled={loading}
          style={{ padding: "0.5rem 1rem", marginTop: "0.5rem", background: "#eee" }}
        >
          Forgot Password
        </button>
      )}
    </div>
  );
};
