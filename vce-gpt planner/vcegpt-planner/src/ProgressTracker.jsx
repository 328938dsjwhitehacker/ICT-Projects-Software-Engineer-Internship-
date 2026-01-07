import { useEffect, useState } from "react";
import SummaryCard from "./components/SummaryCard";
import LogViewer from "./LogViewer";   

export default function ProgressTracker({ plans, user }) {   
  const [stats, setStats] = useState({
    total: 0,
    urgent: 0,
    near: 0,
    far: 0,
    past: 0,
  });

  const classify = (date) => {
    const today = new Date();
    const exam = new Date(date);
    const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "past";
    if (diffDays <= 14) return "urgent";
    if (diffDays <= 60) return "near";
    return "far";
  };

  useEffect(() => {
    const counts = {
      total: plans.length,
      urgent: 0,
      near: 0,
      far: 0,
      past: 0,
    };

    plans.forEach((p) => {
      const type = classify(p.exam_date);
      counts[type]++;
    });

    setStats(counts);
  }, [plans]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Your Progress Overview</h3>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Urgent" count={stats.urgent} tone="red" />
        <SummaryCard label="Near" count={stats.near} tone="amber" />
        <SummaryCard label="Far" count={stats.far} tone="emerald" />
        <SummaryCard label="Past" count={stats.past} tone="slate" />
      </div>

      {/* 🔥 LogViewer is now part of ProgressTracker */}
      <div className="mt-6">
        <LogViewer user={user} />
      </div>
    </div>
  );
}