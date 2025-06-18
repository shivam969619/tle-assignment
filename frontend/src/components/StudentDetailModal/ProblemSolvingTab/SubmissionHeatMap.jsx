import React, { useEffect, useState } from "react";
import axios from "axios";

const levels = [
  "bg-white",
  "bg-green-100",
  "bg-green-300",
  "bg-green-500",
  "bg-green-700",
];

const SubmissionHeatMap = ({ studentId }) => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/students/${studentId}/problem-data`
        );
        const buckets = res.data.buckets || {};

        // Convert to sorted array
        const sortedBuckets = Object.keys(buckets)
          .map(r => ({ rating: parseInt(r), count: buckets[r] }))
          .sort((a, b) => a.rating - b.rating)
          .map(obj => obj.count);

        // Reshape into 2D grid (e.g. 4 cols per row)
        const cols = 4;
        const grid = [];
        for (let i = 0; i < sortedBuckets.length; i += cols) {
          grid.push(sortedBuckets.slice(i, i + cols));
        }

        setGridData(grid);
      } catch (err) {
        console.error("Failed to load submission data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!gridData.length) return <div className="text-gray-400">No submission data</div>;

  const max = Math.max(...gridData.flat());
  const getLevel = (val) => {
    if (val === 0) return 0;
    const ratio = val / max;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col gap-1">
        {gridData.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((val, j) => (
              <div
                key={j}
                className={`w-6 h-6 ${levels[getLevel(val)]} rounded-sm border border-gray-300`}
                title={`Submissions: ${val}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
        <span>Low</span>
        {levels.map((cls, i) => (
          <div key={i} className={`w-4 h-4 ${cls} border rounded-sm`} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
};

export default SubmissionHeatMap;
