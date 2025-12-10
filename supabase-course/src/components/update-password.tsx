import { useState } from "react";
import { supabase } from "../supabase-client";

export const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "info", text: "Password updated successfully! You can now sign in." });
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      {message && (
        <p style={{ color: message.type === "error" ? "red" : "green", marginTop: "0.5rem" }}>
          {message.text}
        </p>
      )}
    </div>
  );
};