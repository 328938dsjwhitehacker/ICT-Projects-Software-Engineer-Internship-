export default function Dashboard({ user, plans, children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-100 bg-opacity-90 backdrop-blur-sm 
                   flex items-center justify-between p-4 border-b border-slate-200">
  <div>
    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
      VCEGPT
    </h1>
    <p className="text-sm text-slate-600 mt-1">
      Welcome back, {user.email}
    </p>
  </div>
</header>


        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="space-y-6 lg:col-span-1">

            {/* Progress Overview */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              {children[0]}
            </div>

            {/* Plan Form */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              {children[1]}
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white p-4 rounded-lg shadow-sm border lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Your Submitted Plans</h3>

            <div className="max-h-[600px] overflow-y-auto pr-2">
              {children[2]}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end">
          {children[3]}
        </div>

      </div>
    </div>
  );
}