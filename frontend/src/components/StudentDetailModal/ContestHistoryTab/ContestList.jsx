import React from "react";

const ContestList = ({ contests = [] }) => {
  if (!contests.length) {
    return <div className="text-center py-8 text-gray-400">No contests in period</div>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-2 px-4">Contest</th>
            <th>Date</th>
            <th>Rank</th>
            <th>Δ Rating</th>
            <th>New Rating</th>
            <th>Unsolved</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 px-4">{c.name}</td>
              <td>{c.date}</td>
              <td>{c.rank}</td>
              <td
                className={
                  c.delta >= 0
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {c.delta > 0 ? "+" : ""}
                {c.delta}
              </td>
              <td>{c.after}</td>
              <td>{c.unsolved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContestList;