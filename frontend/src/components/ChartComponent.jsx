import React, { useEffect, useState } from "react";
import { Line, Bar, Pie, Scatter, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from "chart.js";

// ✅ Register ChartJS Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const ChartComponent = ({ chartType, apiUrl }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch data dynamically from Flask backend
  useEffect(() => {
    // alert(chartType);
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/data');
        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  // ✅ Loading and Error handling
  if (loading) return <p className="text-gray-500 dark:text-gray-300">Loading...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  // ✅ Render different charts based on `chartType`
  const chartProps = { data: chartData, options: { responsive: true } };

  switch (chartType) {
    case "line":
      return <Line {...chartProps} />;
    case "bar":
      return <Bar {...chartProps} />;
    case "pie":
      return <Pie {...chartProps} />;
    case "scatter":
      return <Scatter {...chartProps} />;
    case "radar":
      return <Radar {...chartProps} />;
    default:
      return <p className="text-gray-500">Invalid Chart Type</p>;
  }
};

export default ChartComponent;
