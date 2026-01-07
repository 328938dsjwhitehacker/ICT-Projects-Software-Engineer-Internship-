import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function LogViewer({ user }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setLogs(data);
    };

    if (user) fetchLogs();
  }, [user]);

  if (!logs.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Recent Logs</h2>
      <div className="bg-gray-100 p-4 rounded-md space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="text-sm text-gray-800">
            <span className="font-medium">{log.action}</span>: {log.error}
            <br />
            <span className="text-xs text-gray-500">
              {new Date(log.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogViewer;