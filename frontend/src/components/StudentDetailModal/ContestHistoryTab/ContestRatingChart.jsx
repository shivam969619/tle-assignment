import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

const ContestRatingChart = ({ contests = [], base = 1400 }) => {
  if (!contests.length) {
    return <div className="text-gray-400">No contest data</div>;
  }

  // sort by actual date and build data series
  const sorted = [...contests].sort((a, b) => a._rawDate - b._rawDate);
  const data = sorted.map((c) => ({
    name: c.name,
    date: c.date,
    rating: c.after,
  }));

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[
            (dataMin) => Math.min(dataMin, base),
            (dataMax) => Math.max(dataMax, base),
          ]} />
          <Tooltip />
          {/* baseline reference */}
          <ReferenceLine y={base} stroke="#9CA3AF" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContestRatingChart;
