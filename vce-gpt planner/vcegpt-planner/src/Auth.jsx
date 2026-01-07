import { useState } from "react";
import { supabase } from "./supabase";

export default function AuthUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  const signIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setStatus("Please enter both email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatus(error.message);
  };

  const signUp = async () => {
    if (!email || !password) {
      setStatus("Please enter both email and password.");
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setStatus(error.message);
    else setStatus("Check your email to confirm your account.");
  };

  const resetPassword = async () => {
    if (!email) {
      setStatus("Enter your email to reset password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setStatus(error.message);
    else setStatus("Password reset email sent.");
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

      <form onSubmit={signIn} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-md p-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>

      <button
        onClick={signUp}
        className="w-full mt-3 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        Sign Up
      </button>

      <button
        onClick={resetPassword}
        className="w-full mt-3 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
      >
        Reset Password
      </button>

      {status && (
        <p className="mt-4 text-center text-sm text-slate-600">{status}</p>
      )}
    </div>
  );
}

