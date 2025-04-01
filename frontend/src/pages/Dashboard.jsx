import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Sidebar from "../partials/Sidebar";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../partials/Header";
import FilterButton from "../components/DropdownFilter";
import Datepicker from "../components/Datepicker";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend, ArcElement);



const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
 
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [filters, setFilters] = useState({ 
    year: "", endYear: "", country: "", region: "", city: "", topic: "", sector: "", pest: "", source: "", swot: "", intensity: "", likelihood: "", relevance: "" 
  });
  const [originalData, setOriginalData] = useState([]);
  const [regionChartData, setRegionChartData] = useState({ labels: [], datasets: [] });
  const [trendChartData, setTrendChartData] = useState({ labels: [], datasets: [] });
  const [topTopicsChartData, setTopTopicsChartData] = useState({ labels: [], datasets: [] });
  const [kpiData, setKpiData] = useState({ intensity: 0, likelihood: 0, relevance: 0, totalRecords: 0 });
  const [mapData, setMapData] = useState([]);

  const [sectorPieChartData, setSectorPieChartData] = useState({ labels: [], datasets: [] });
  const [regionPieChartData, setRegionPieChartData] = useState({ labels: [], datasets: [] });
  const [countryPieChartData, setCountryPieChartData] = useState({ labels: [], datasets: [] });
  const [topicPieChartData, setTopicPieChartData] = useState({ labels: [], datasets: [] });
  const [sourcePieChartData, setSourcePieChartData] = useState({ labels: [], datasets: [] });
  const [pestPieChartData, setPestPieChartData] = useState({ labels: [], datasets: [] });
  const [swotPieChartData, setSwotPieChartData] = useState({ labels: [], datasets: [] });
 

  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then(response => response.json())
      .then(data => {
        setOriginalData(data);
        updateCharts(data);
        setSidebarOpen(false);
      });
  }, []);

  const updateCharts = (data) => {
    const filteredData = data.filter(item => 
      (filters.year ? new Date(item.published).getFullYear().toString() === filters.year : true) &&
      (filters.endYear ? item.end_year === filters.endYear : true) &&
      (filters.country ? item.country === filters.country : true) &&
      (filters.region ? item.region === filters.region : true) &&
      (filters.city ? item.city === filters.city : true) &&
      (filters.topic ? item.topic === filters.topic : true) &&
      (filters.sector ? item.sector === filters.sector : true) &&
      (filters.pest ? item.pestle === filters.pest : true) &&
      (filters.source ? item.source === filters.source : true) &&
      (filters.intensity ? item.intensity >= parseInt(filters.intensity) : true) &&
      (filters.likelihood ? item.likelihood >= parseInt(filters.likelihood) : true) &&
      (filters.relevance ? item.relevance >= parseInt(filters.relevance) : true)
    );

    //const labels = filteredData.map(item => item.topic || "Unknown");
    const labels = [...new Set(filteredData.map(item => item.topic || "Unknown"))];
    const intensity = filteredData.map(item =>  parseInt(item.intensity) || 0);
    const likelihood = filteredData.map(item => item.likelihood || 0);
    const relevance = filteredData.map(item => item.relevance || 0);
    
    setChartData({
      labels,
      datasets: [
        { label: "Intensity", data: intensity, backgroundColor: "rgba(255, 99, 132, 0.5)" },
      ]
    });
    



    const regionLabels = [...new Set(filteredData.map(item => item.region || "Unknown"))];
    const regionIntensity = regionLabels.map(region => 
      filteredData.filter(item => item.region === region).reduce((sum, item) => sum + ( parseInt(item.intensity) || 0), 0)
    );

    const regionLikelihood = regionLabels.map(region => 
      filteredData.filter(item => item.region === region).reduce((sum, item) => sum + ( parseInt(item.likelihood) || 0), 0)
    );

    const regionRelevance = regionLabels.map(region => 
      filteredData.filter(item => item.region === region).reduce((sum, item) => sum + ( parseInt(item.relevance) || 0), 0)
    );


    console.log(regionLabels);
    console.log(regionIntensity);
    setRegionChartData({
      labels: regionLabels,
      datasets: [
        { label: "Intensity", data: regionIntensity, backgroundColor: "rgba(255, 99, 132, 1)" },
        { label: "Likelihood", data:regionLikelihood, backgroundColor: "rgba(54, 162, 235, 1)" },
        { label: "Relevance", data: regionRelevance, backgroundColor: "rgba(255, 206, 86, 1)" }
      ]
    });

    const yearLabels = [...new Set(filteredData.map(item => new Date(item.published).getFullYear().toString()))];
    yearLabels.sort(); // Ensure chronological order
    const yearIntensity = yearLabels.map(year => 
      filteredData.filter(item => new Date(item.published).getFullYear().toString() === year).reduce((sum, item) => sum + ( parseInt(item.intensity) || 0), 0)
    );
    const yearLikelihood = yearLabels.map(year => 
      filteredData.filter(item => new Date(item.published).getFullYear().toString() === year).reduce((sum, item) => sum + ( parseInt(item.likelihood) || 0), 0)
    );

    const yearRelevance = yearLabels.map(year => 
      filteredData.filter(item => new Date(item.published).getFullYear().toString() === year).reduce((sum, item) => sum + ( parseInt(item.relevance) || 0), 0)
    );

    updateMapData(filteredData);
    updatePieCharts(filteredData);
    setTrendChartData({
      labels: yearLabels,
      datasets: [
        { label: "Intensity", data: yearIntensity, borderColor: "rgba(255, 99, 132, 1)", fill: false },
        { label: "Likelihood", data:yearLikelihood, borderColor: "rgba(54, 162, 235, 1)", fill: false },
        { label: "Relevance", data: yearRelevance, borderColor: "rgba(255, 206, 86, 1)", fill: false }
      ]
    });


    const topicCounts = {};
    filteredData.map(item => {
      if (item.topic) {
        topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
      }
    });

    const sortedTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    setTopTopicsChartData({
      labels: sortedTopics.map(topic => topic[0]),
      datasets: [
        { label: "Insight", data: sortedTopics.map(topic => topic[1]), backgroundColor: "rgba(75, 192, 192, 0.5)" }
      ]
    });
  };

  const updatePieCharts = (data) => {
    setSectorPieChartData(generatePieChartData(data, "sector"));
    setRegionPieChartData(generatePieChartData(data, "region"));
    setCountryPieChartData(generatePieChartData(data, "country"));
    setTopicPieChartData(generatePieChartData(data, "topic"));
    setSourcePieChartData(generatePieChartData(data, "source"));
    setPestPieChartData(generatePieChartData(data, "pest"));
    setSwotPieChartData(generateSWOTData(data));
    setPestPieChartData(generatePESTData(data));
  };

  const generatePieChartData = (data, key) => {
    const counts = {};
    data.map(item => {
      if (item[key]) {
        counts[item[key]] = (counts[item[key]] || 0) + 1;
      }
    });
    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return {
      labels: sortedEntries.map(entry => entry[0]),
      datasets: [{
        label: key + " Distribution",
        data: sortedEntries.map(entry => entry[1]),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
      }]
    };
  };

  
  const updateMapData = (data) => {
    const countryRelevance = {};
    data.map(item => {
      if (item.country) {
        const location = countryCoordinates[item.country];
        if (location) {
          if (!countryRelevance[item.country]) {
            countryRelevance[item.country] = { 
              name: item.country,
              relevance: 0, 
              latitude: location.latitude, 
              longitude: location.longitude 
            };
          }
          countryRelevance[item.country].relevance += item.relevance || 0;
        }
      }
    });
    setMapData(Object.values(countryRelevance));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const generateSWOTData = (data) => {
    const swotCounts = { Strengths: 0, Weaknesses: 0, Opportunities: 0, Threats: 0 };
  
    data.map(item => {
      const impact = parseInt(item.impact) || 0;
      const relevance = item.relevance || 0;
  
      if (impact >= 3 && relevance >= 3) {
        swotCounts.Strengths += 1;
      } else if (impact < 3 && relevance >= 3) {
        swotCounts.Weaknesses += 1;
      } else if (impact >= 3 && relevance < 3) {
        swotCounts.Opportunities += 1;
      } else {
        swotCounts.Threats += 1;
      }
    });
  
    return {
      labels: Object.keys(swotCounts),
      datasets: [{
        label: "SWOT Distribution",
        data: Object.values(swotCounts),
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FF9800"]
      }]
    };
  };
   // ✅ Filled Map (Relevance by Country)
   const countryData = [
    { name: "USA", lat: 37.0902, lng: -95.7129, relevance: 80 },
    { name: "India", lat: 20.5937, lng: 78.9629, relevance: 70 },
    { name: "Germany", lat: 51.1657, lng: 10.4515, relevance: 65 },
    { name: "China", lat: 35.8617, lng: 104.1954, relevance: 90 },
  ];

  const countryCoordinates = {
    "United Arab Emirates": { latitude: 23.4241, longitude: 53.8478 },
    "Ghana": { latitude: 7.9465, longitude: -1.0232 },
    "Belize": { latitude: 17.1899, longitude: -88.4976 },
    "Iraq": { latitude: 33.2232, longitude: 43.6793 },
    "Turkey": { latitude: 38.9637, longitude: 35.2433 },
    "Greece": { latitude: 39.0742, longitude: 21.8243 },
    "Libya": { latitude: 26.3351, longitude: 17.2283 },
    "Indonesia": { latitude: -0.7893, longitude: 113.9213 },
    "Saudi Arabia": { latitude: 23.8859, longitude: 45.0792 },
    "Iran": { latitude: 32.4279, longitude: 53.688 },
    "Venezuela": { latitude: 6.4238, longitude: -66.5897 },
    "United Kingdom": { latitude: 55.3781, longitude: -3.4360 },
    "Nigeria": { latitude: 9.082, longitude: 8.6753 },
    "Japan": { latitude: 36.2048, longitude: 138.2529 },
    "Mexico": { latitude: 23.6345, longitude: -102.5528 },
    "Morocco": { latitude: 31.7917, longitude: -7.0926 },
    "Ethiopia": { latitude: 9.145, longitude: 40.4897 },
    "Norway": { latitude: 60.472, longitude: 8.4689 },
    "Liberia": { latitude: 6.4281, longitude: -9.4295 },
    "Brazil": { latitude: -14.235, longitude: -51.9253 },
    "Jordan": { latitude: 30.5852, longitude: 36.2384 },
    "Syria": { latitude: 34.8021, longitude: 38.9968 },
    "Pakistan": { latitude: 30.3753, longitude: 69.3451 },
    "Russia": { latitude: 61.524, longitude: 105.3188 },
    "Burkina Faso": { latitude: 12.2383, longitude: -1.5616 },
    "Lebanon": { latitude: 33.8547, longitude: 35.8623 },
    "Estonia": { latitude: 58.5953, longitude: 25.0136 },
    "Qatar": { latitude: 25.2769, longitude: 51.5200 },
    "Egypt": { latitude: 26.8206, longitude: 30.8025 },
    "United States of America": { latitude: 37.0902, longitude: -95.7129 },
    "Niger": { latitude: 17.6078, longitude: 8.0817 },
    "Kuwait": { latitude: 29.3759, longitude: 47.9774 },
    "Canada": { latitude: 56.1304, longitude: -106.3468 },
    "Ukraine": { latitude: 48.3794, longitude: 31.1656 },
    "Malaysia": { latitude: 4.2105, longitude: 101.9758 },
    "Austria": { latitude: 47.5162, longitude: 14.5501 },
    "Spain": { latitude: 40.4637, longitude: -3.7492 },
    "South Africa": { latitude: -30.5595, longitude: 22.9375 },
    "Oman": { latitude: 21.4735, longitude: 55.9754 },
    "Mali": { latitude: 17.5707, longitude: -3.9962 },
    "Hungary": { latitude: 47.1625, longitude: 19.5033 },
    "Algeria": { latitude: 28.0339, longitude: 1.6596 },
    "Cyprus": { latitude: 35.1264, longitude: 33.4299 },
    "Azerbaijan": { latitude: 40.1431, longitude: 47.5769 },
    "Gabon": { latitude: -0.8037, longitude: 11.6094 },
    "Australia": { latitude: -25.2744, longitude: 133.7751 },
    "Poland": { latitude: 51.9194, longitude: 19.1451 },
    "Kazakhstan": { latitude: 48.0196, longitude: 66.9237 },
    "Denmark": { latitude: 56.2639, longitude: 9.5018 },
    "Germany": { latitude: 51.1657, longitude: 10.4515 },
    "Colombia": { latitude: 4.5709, longitude: -74.2973 },
    "South Sudan": { latitude: 6.877, longitude: 31.307 },
    "China": { latitude: 35.8617, longitude: 104.1954 },
    "India": { latitude: 20.5937, longitude: 78.9629 },
    "Angola": { latitude: -11.2027, longitude: 17.8739 },
    "Argentina": { latitude: -38.4161, longitude: -63.6167 }
  };

  const generatePESTData = (data) => {
    const pestCounts = { Political: 0, Economic: 0, Social: 0, Technological: 0 };
    data.map(item => {
      if (item.insight) {
        const topic = item.insight.toLowerCase();
        if (topic.includes("policy") || topic.includes("government") || topic.includes("regulation")) {
          pestCounts.Political += 1;
        } else if (topic.includes("market") || topic.includes("economy") || topic.includes("finance")) {
          pestCounts.Economic += 1;
        } else if (topic.includes("culture") || topic.includes("society") || topic.includes("demographics")) {
          pestCounts.Social += 1;
        } else if (topic.includes("technology") || topic.includes("innovation") || topic.includes("digital")) {
          pestCounts.Technological += 1;
        }
      }
    });
    return {
      labels: Object.keys(pestCounts),
      datasets: [{
        label: "PEST Analysis",
        data: Object.values(pestCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
      }]
    };
  };

  const applyFilters = () => {
    updateCharts(originalData);
  };

  return (
    <div className="flex h-screen overflow bg-gray-100 dark:bg-gray-900">

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}  originalData={originalData} filters={filters} handleFilterChange={handleFilterChange} applyFilters={applyFilters} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-6 py-8 w-full max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
              <div className="flex gap-4">
                <FilterButton align="right" />
                <Datepicker align="right" />
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Avg Relevance", value: ((originalData.reduce((sum, item) => sum + (parseInt(item.relevance) || 0), 0))/originalData.length).toFixed(2) },
                { title: "Avg Likelihood", value: ((originalData.reduce((sum, item) => sum + (parseInt(item.likelihood) || 0), 0))/originalData.length).toFixed(2) },
                { title: "Avg Intensity", value: ((originalData.reduce((sum, item) => sum + (parseInt(item.intensity) || 0), 0))/originalData.length).toFixed(2) },
                { title: "Total Records", value: originalData.length },
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg text-gray-800 dark:text-gray-100">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-3xl font-bold mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-12 gap-6 mt-8">

            <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Insights by Region</h3>
                <Bar data={regionChartData}  options={{ responsive: true }} />
              </div>

              {/* Column Chart */}
              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Trend Over Years</h3>
                <Line data={trendChartData} options={{ responsive: true }} />
              </div>
                {/* Map Chart */}
                <div className="col-span-12 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Relevance by Country</h3>
                <MapContainer center={[20, 0]} zoom={2} className="w-full h-[300px] rounded-lg">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {mapData.map((country, index) => (
                    <CircleMarker key={index} center={[country.latitude, country.longitude]} radius={Math.sqrt(country.relevance) * 1.5} color="#F43F5E">
                      <Tooltip>{country.name}: {country.relevance}%</Tooltip>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
 {/* Treemap Chart */}
 <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Top 10 Topics by Insight</h3>
                <Bar data={topTopicsChartData} />
              </div>


              {/* Line Chart */}
              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Intensity Trend Over Years</h3>
                <Line data={chartData} options={{ responsive: true }} />
              </div>

              {/* Column Chart */}
              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Top 10 Topics by Insight</h3>
                <Bar data={chartData} options={{ responsive: true }} />
              </div>

              
        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Scatter Chart (Intensity vs Likelihood)</h3>
                <Scatter data={{ datasets: [{ label: "Intensity vs Likelihood", data: originalData.map(item => ({ x: item.intensity, y: item.likelihood })), backgroundColor: "rgba(75, 192, 192, 0.5)" }] }}   options={{ responsive: true }}/>
              </div>

              {/* Column Chart */}
              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Intensity Trend Over Years</h3>
                <Bar data={chartData}  options={{ responsive: true }} />
              </div>

              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>PEST Analysis</h2><Doughnut data={pestPieChartData} /></div>
          

              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>SWOT Analysis</h2><Doughnut data={swotPieChartData} /></div>
              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Sector Distribution</h2><Doughnut data={sectorPieChartData} /></div>
          <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Region Distribution</h2><Pie data={regionPieChartData} /></div>
          <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Country Distribution</h2><Pie data={countryPieChartData} /></div>
          <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Topic Distribution</h2><Pie data={topicPieChartData} /></div>
          <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Source Distribution</h2><Pie data={sourcePieChartData} /></div>

        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Pie Chart</h2><Pie data={chartData} /></div>
        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Line Chart</h2><Line data={chartData} /></div>
        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Doughnut Chart</h2><Doughnut data={chartData} /></div>
        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Radar Chart</h2><Radar data={chartData} /></div>
        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Polar Area Chart</h2><PolarArea data={chartData} /></div>
        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Scatter Chart</h2><Scatter data={chartData} /></div>
        <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg"><h2>Bubble Chart</h2><Bubble data={chartData} /></div>
        

            







              {/* Scatter Chart */}
              <div className="col-span-6 bg-white dark:bg-gray-800 shadow-md p-5 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Intensity vs Likelihood</h3>
                {/* <Scatter data={scatterData} options={{ responsive: true }} /> */}
                <Scatter data={{ datasets: [{ label: "Intensity vs Likelihood", data: originalData.map(item => ({ x: item.intensity, y: item.likelihood })), backgroundColor: "rgba(75, 192, 192, 0.5)" }] }} options={{ responsive: true }}/>
              </div>

             

            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
