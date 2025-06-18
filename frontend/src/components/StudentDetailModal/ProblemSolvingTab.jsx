import React, { useState, useEffect } from "react";
import ProblemBarChart from "./ProblemSolvingTab/ProblemBarChart";
import SubmissionHeatMap from "./ProblemSolvingTab/SubmissionHeatMap";

const API_BASE = "http://localhost:5000";

const filterOptions = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

// Fallback heatmap until your API provides one
const mockHeatMap = [
  [0, 1, 2, 3, 0, 1, 0, 1],
  [1, 2, 1, 0, 0, 2, 0, 0],
  [3, 0, 1, 2, 2, 1, 1, 0],
  [2, 0, 1, 1, 1, 2, 1, 0],
  [0, 1, 0, 2, 0, 0, 2, 3],
  [0, 2, 0, 1, 1, 0, 1, 0],
  [1, 0, 2, 1, 1, 3, 0, 0],
];

const ProblemSolvingTab = ({ student }) => {
  const [filter, setFilter] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // whenever student or filter changes, re‑fetch
  useEffect(() => {
    if (!student?._id) return;

    setLoading(true);
    setError(null);

    fetch(
      `${API_BASE}/api/students/${student._id}/problem-data?days=${filter}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [student?._id, filter]);

  if (!student?._id) {
    return (
      <div className="py-8 text-center text-gray-500">
        Select a student to see problem‑solving stats.
      </div>
    );
  }

  if (loading) {
    return <div className="py-8 text-center">Loading problem data…</div>;
  }
  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        Error loading data: {error}
      </div>
    );
  }

  // destructure the API response
  const {
    total,
    avgPerDay,
    avgRating,
    hardest,
    buckets,
    heatmap,
  } = data;

  return (
    <div>
      {/* Time Filter */}
      <div className="flex flex-wrap gap-2 mt-4 mb-7">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            className={`px-3 py-1 text-sm rounded-lg border transition ${
              filter === opt.value
                ? "bg-blue-100 border-blue-500 text-blue-800"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gray-800">
            <span className="font-medium">Most Difficult:</span>{" "}
            <span className="text-purple-700 font-bold">
              {hardest?.problemId ?? "--"}
            </span>{" "}
            <span className="text-xs text-gray-400">
              ({hardest?.rating ?? "--"})
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-800 mt-1">
            <span className="font-medium">Total Solved:</span> {total}
          </div>
          <div className="flex items-center gap-2 text-gray-800 mt-1">
            <span className="font-medium">Avg Rating:</span>{" "}
            {isNaN(avgRating) ? "--" : Math.round(avgRating)}
          </div>
          <div className="flex items-center gap-2 text-gray-800 mt-1">
            <span className="font-medium">Avg/Day:</span>{" "}
            {isNaN(avgPerDay) ? "--" : avgPerDay.toFixed(2)}
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">
            Problems by Rating
          </h3>
          <ProblemBarChart buckets={buckets} />
        </div>
      </div>

      {/* Heatmap */}
      <h3 className="font-semibold text-gray-700 mb-2 mt-8">
        Submission Heatmap
      </h3>
      <SubmissionHeatMap  studentId={student._id} />
    </div>
  );
};

export default ProblemSolvingTab;
