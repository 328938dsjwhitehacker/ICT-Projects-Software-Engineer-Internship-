export default function PlanCard({ plan, onEdit, onDelete, urgency }) {
  const urgencyStyles = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    near: "bg-amber-100 text-amber-700 border-amber-200",
    far: "bg-emerald-100 text-emerald-700 border-emerald-200",
    past: "bg-slate-200 text-slate-600 border-slate-300",
  };

  const topicsArray = Array.isArray(plan.topics)
    ? plan.topics
    : typeof plan.topics === "string"
    ? plan.topics.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-3">
        <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-md border border-blue-200">
          {plan.subject}
        </span>

        <span className={`px-2 py-1 text-xs rounded-md border ${urgencyStyles[urgency]}`}>
          {urgency.toUpperCase()}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-2">
        Exam Date: <span className="font-medium">{plan.exam_date}</span>
      </p>

      <p className="text-sm mb-4">
        <span className="font-medium">Topics:</span>{" "}
        {topicsArray.length > 0 ? topicsArray.join(", ") : "No topics listed."}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(plan)}
          className="px-3 py-1 text-sm rounded-md border border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(plan.id)}
          className="px-3 py-1 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
