import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Auth } from "./components/auth";
import TaskManager from "./components/task-manager";
import { UpdatePassword } from "./components/update-password";
import { supabase } from "./supabase-client";
import { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setSession(null);
      window.location.href = "/";
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={session ? <Navigate to="/tasks" replace /> : <Auth />}
          />
          <Route
            path="/tasks"
            element={
              session ? (
                <>
                  <header style={{ marginBottom: "1rem" }}>
                    <button onClick={logout}>Log Out</button>
                  </header>
                  <TaskManager session={session} />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;