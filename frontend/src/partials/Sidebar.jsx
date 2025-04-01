import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";



// import React from "react";

// const Slider = ({ filters, handleFilterChange, applyFilters }) => {
//   return (
//     <div style={{ width: "250px", padding: "20px", background: "#f4f4f4" }}>
//       <h2>Filters</h2>
//       {Object.keys(filters).map(key => (
//         <div key={key}>
//           <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
//           <input type="text" name={key} value={filters[key]} onChange={handleFilterChange} />
//         </div>
//       ))}
//       <button onClick={applyFilters}>Apply Filters</button>
//     </div>
//   );
// };

// export default Slider;



function Sidebar({ sidebarOpen, setSidebarOpen, filters, handleFilterChange, applyFilters, originalData}) {
  const location = useLocation();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [filterOptions, setFilterOptions] = useState({
    end_year: [],
    topic: [],
    sector: [],
    region: [],
    pestle: [],
    source: [],
    country: [],
    city: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
    city: "",
  });

  // ✅ Fetch filter options from the backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/data").then((response) => {
      const rawData = response.data;
      //const labels = [...new Set(filteredData.map(item => item.topic || "Unknown"))];
      const options = Object.keys(filterOptions).reduce((acc, key) => {
        acc[key] = [...new Set(rawData.map((item) => item[key]))].filter(Boolean);
        return acc;
      }, {});
      setFilterOptions(options);
      console.log(options);
    });
  }, []);

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   const newFilters = { ...selectedFilters, [name]: value };
  //   setSelectedFilters(newFilters);
  //   setFilters(newFilters);
  // };

  return (
    <div className="min-w-fit overflow-auto">
      {/* Sidebar Backdrop (for Mobile) */}
      {sidebarOpen && <div className="fixed inset-0 bg-gray-900/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div hidden={sidebarOpen}
        ref={sidebar}
        className={`fixed flex flex-col z-50 left-0 top-0 w-64 bg-white dark:bg-gray-900 p-4 border-r border-gray-300 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } lg:static lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-5">
          <NavLink to="/" className="flex items-center gap-2 text-violet-500 font-semibold text-lg">
            <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>
        </div>

        {/* Filters Section */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Filters</h3>
          {Object.keys(filterOptions).map((key) => (
            <div key={key} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {key.replace("_", " ").toUpperCase()}
              </label>
              <select
                name={key}
                value={filters[key]}
                onChange={handleFilterChange}
                className="w-full mt-1 p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="">All</option>
                {filterOptions[key]?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Apply Filters Button */}
          <button
            onClick={applyFilters}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-white font-bold bg-violet-500 hover:bg-violet-600 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
