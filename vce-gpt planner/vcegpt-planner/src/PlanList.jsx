export default function PlanList({ plans, onEdit, onDelete }) {
  if (!plans || plans.length === 0) {
    return <p>No plans submitted yet.</p>;
  }

  return (
    <div>

      <ul className="space-y-4">
        {plans.map((plan) => {
          const topics = Array.isArray(plan.topics)
            ? plan.topics.join(", ")
            : plan.topics || "No topics listed";

          const formattedDate = plan.exam_date
            ? new Date(plan.exam_date).toLocaleDateString()
            : "No date set";

          return (
            <li
              key={plan.id}
              className="p-3 border rounded-md bg-white shadow-sm"
            >
              <p className="font-medium text-slate-900">{plan.subject}</p>

              <p className="text-sm text-slate-600">
                <span className="font-medium">Exam Date:</span> {formattedDate}
              </p>

              <p className="text-sm mt-1">
                <span className="font-medium">Topics:</span> {topics}
              </p>

              <div className="flex gap-2 mt-3">
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}