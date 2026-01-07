import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import LogViewer from "./LogViewer";
import AuthUI from "./Auth";
import Dashboard from "./Dashboard";
import PlanForm from "./Plan";
import PlanList from "./PlanList";
import ProgressTracker from "./ProgressTracker";

console.log("🔥 App.jsx loaded");

function App() {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);

  // ----------------------------------------------------
  // 1. Insert user metadata on first login
  // ----------------------------------------------------
  const ensureUserMetadata = async (user) => {
    if (!user) return;

    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult?.data?.session;
    const token = session?.access_token;

    console.log("🔐 TOKEN:", token || "❌ No token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("🧠 JWT ROLE:", payload.role);
      console.log("🧠 JWT SUB (user_id):", payload.sub);
    }

    const { error } = await supabase.from("vcaa_users").upsert(
      {
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name ?? "Unknown",
        year_level: 12,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      await supabase.from("logs").insert({
        user_id: user.id,
        action: "usermetadataupsert",
        error: error.message,
      });
    }

    await supabase.from("logs").insert({
      user_id: user.id,
      action: "test_insert",
      error: "This is a test log",
    });
  };

  // ----------------------------------------------------
  // 2. Fetch plans for the logged-in user
  // ----------------------------------------------------
  const fetchPlans = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("user_id", user.id)
      .order("exam_date", { ascending: true });

    if (error) {
      await supabase.from("logs").insert({
        user_id: user.id,
        action: "fetch_plans",
        error: error.message,
      });
      return;
    }

    setPlans(data);
  };

  // ----------------------------------------------------
  // 3. Auth listener
  // ----------------------------------------------------
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) ensureUserMetadata(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) ensureUserMetadata(session.user);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ----------------------------------------------------
  // 4. Fetch plans whenever user logs in
  // ----------------------------------------------------
  useEffect(() => {
    fetchPlans();
  }, [user]);

  // ----------------------------------------------------
  // 5. Delete a plan
  // ----------------------------------------------------
  const deletePlan = async (id) => {
    await supabase.from("plans").delete().eq("id", id);
    fetchPlans();
  };

  // ----------------------------------------------------
  // 6. Sign out
  // ----------------------------------------------------
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // ----------------------------------------------------
  // 7. Show Auth UI when no user is logged in
  // ----------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AuthUI signOut={signOut} />
      </div>
    );
  }

  // ----------------------------------------------------
  // 8. Logged-in dashboard
  // ----------------------------------------------------
  return (
    <Dashboard
      user={user}
      plans={plans}
      onEdit={fetchPlans}
      onDelete={fetchPlans}
      onSubmit={fetchPlans}
    >
      <div className="mb-6">
        <ProgressTracker plans={plans} user={user} />
      </div>

      <div className="mb-6">
        <PlanForm
          user={user}
          editingPlan={editingPlan}
          setEditingPlan={setEditingPlan}
          onSaved={fetchPlans}
        />
      </div>

      <PlanList
        plans={plans}
        onEdit={(plan) => setEditingPlan(plan)}
        onDelete={deletePlan}
      />

      <button
        onClick={signOut}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Sign Out
      </button>
    </Dashboard>
  );
}

export default App;

