import React, { useState, useEffect } from "react";
import ContestRatingChart from "./ContestHistoryTab/ContestRatingChart";
import ContestList from "./ContestHistoryTab/ContestList";

// Base URL for API (configure in .env with REACT_APP_API_URL)
const API_BASE =  "http://localhost:5000";

const timeOptions = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "365 days", value: 365 },
];

const ContestHistoryTab = ({ student }) => {
  const [filterDays, setFilterDays] = useState(90);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student?._id) {
      setContests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/students/${student._id}/contests`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setContests(
          data.map((c) => ({
            name: `Contest ${c.contestId}`,
            date: new Date(c.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            rank: c.rank,
            delta: c.delta,
            after: c.newRating,
            unsolved: c.unsolved,
            _rawDate: new Date(c.date),
          }))
        );
      })
      .catch((err) => {
        setError(err.message);
        setContests([]);
      })
      .finally(() => setLoading(false));
  }, [student]);

  // compute cut‑off date for filtering
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - filterDays);
  const displayed = contests.filter((c) => c._rawDate >= cutoff);

  if (loading) {
    return <div className="py-8 text-center">Loading contests…</div>;
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">Error: {error}</div>
    );
  }

  return (
    // make the tab vertically scrollable if content exceeds viewport
    <div
      className="p-4 max-w-screen-lg mx-auto overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      {/* Filter Buttons: hide scrollbar until hover */}
      <div
        className="
          flex gap-3 mb-6
          overflow-x-hidden hover:overflow-x-auto
          whitespace-nowrap
          px-2
          lg:justify-center
          scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-600
        "
        style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
      >
        {timeOptions.map((opt) => (
          <button
            key={opt.value}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition shadow-sm
              ${
                filterDays === opt.value
                  ? "bg-blue-500 text-white border border-blue-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            onClick={() => setFilterDays(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Rating Graph Card */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Rating Graph
        </h3>
        <div className="w-full h-64 md:h-80">
          <ContestRatingChart
            contests={displayed}
            base={student.currentRating - 20}
          />
        </div>
      </div>

      {/* Contests Table Card */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Contests
        </h3>
        <ContestList contests={displayed} />
      </div>
    </div>
  );
};

export default ContestHistoryTab;
