
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const bucketLabels = [800, 1000, 1200, 1400, 1600, 1700];
const ProblemBarChart = ({ buckets = {} }) => {
  const data = bucketLabels.map(rating => ({
    rating: rating,
    count: buckets[rating] || 0
  }));

  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#0891b2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ProblemBarChart;
