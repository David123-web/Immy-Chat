import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    name: "Mar 23",
    revenue: 25,
  },
  {
    name: "Apr 23",
    revenue: 50,
  },
  {
    name: "May 23",
    revenue: 60,
  },
  {
    name: "June 23",
    revenue: 110,
  },
];

export default function ChartWrapper() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#777" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
