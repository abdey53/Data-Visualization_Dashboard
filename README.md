![db19c318d9134233a7f070bc3ad4cc64](https://github.com/user-attachments/assets/1ce5d294-73de-4e26-b281-e561754257f2)
![bb54b474ed02442192cb11132c29a4e2](https://github.com/user-attachments/assets/d3b48b3a-ac1b-4c52-8459-044f2b9391e9)
![16401bf492004c5faf2014d6129ae875](https://github.com/user-attachments/assets/06782132-6ff4-43cb-a628-1e27b845a858)
![925cb37d5248471abaef1c3f16c04075](https://github.com/user-attachments/assets/54f9ed18-5d4a-49ff-b9a9-97f75e2f105c)
![1d4f0e421d684456bd012abceb52351a](https://github.com/user-attachments/assets/b7af5df2-8db8-4f72-bb47-2fec49aaff07)
# BlackCoffer Data Visualization Dashboard

## 📌 Project Overview
This project is a *Data Visualization Dashboard* built using *Flask, SQL Server, React.js, and Tailwind CSS*. The dashboard provides interactive visualizations for various key metrics, helping users analyze data effectively.

---

## 🚀 Features
- *Backend (Flask & SQL Server)*
  - API to fetch data from SQL Server (dashboard_db)
  - Data model: DashboardData
  - RESTful endpoints for fetching insights
  
- *Frontend (React.js & Tailwind CSS)*
  - Glassmorphism & Neomorphism UI design
  - Interactive visualizations (D3.js, Chart.js, Plotly.js, etc.)
  - Responsive design

- *Data Visualizations*
  - *Line Chart:* Intensity over time
  - *KPI Cards:* Avg Relevance, Likelihood, Intensity, Total Records
  - *Clustered Column Chart:* Top 10 Topics
  - *World Map:* Relevance by Country
  - *Scatter Plot:* Intensity vs. Likelihood (grouped by Topic)
  - *Treemap Chart:* Insights by Region

- *Filters:*
  - End Year, Topics, Sector, Region, PEST, Source, SWOT, Country, City, etc.

---

## 📂 Folder Structure

📁 blackcoffer-dashboard/
│── 📂 backend/ (Flask API & SQL Server Connection)
│    ├── app.py (Flask server)
│    ├── models.py (Database Models)
│    ├── routes.py (API Endpoints)
│    ├── config.py (Database Config)
│    ├── requirements.txt (Dependencies)
│
│── 📂 frontend/ (React + Tailwind UI)
│    ├── src/
│    │   ├── components/
│    │   │   ├── ChartComponent.jsx
│    │   │   ├── Filter.jsx
│    │   │   ├── Layout.jsx
│    │   │   ├── Navbar.jsx
│    │   │   ├── Sidebar.jsx
│    │   ├── pages/
│    │   │   ├── Dashboard.jsx
│    │   │   ├── Reports.jsx
│    │   ├── App.js
│    │   ├── index.js
│    ├── package.json
│    ├── tailwind.config.js
│    ├── vite.config.js
│
│── README.md (Project Documentation)


---

## 🛠 Installation & Setup

### *🔹 Backend (Flask + SQL Server)*
1. Navigate to the backend directory:
   sh
   cd backend
   
2. Create a virtual environment (optional but recommended):
   sh
   python -m venv venv
   source venv/bin/activate  # For Mac/Linux
   venv\Scripts\activate     # For Windows
   
3. Install dependencies:
   sh
   pip install -r requirements.txt
   
4. Set up your *SQL Server connection* in config.py.
5. Run the backend server:
   sh
   python app.py
   

### *🔹 Frontend (React + Tailwind CSS)*
1. Navigate to the frontend directory:
   sh
   cd frontend
   
2. Install dependencies:
   sh
   npm install
   
3. Start the React development server:
   sh
   npm run dev
   

---

## 🔗 API Endpoints (Backend)
| Method | Endpoint  | Description |
|--------|----------|-------------|
| GET    | /api/data | Fetch all dashboard data |
| GET    | /api/data?filter=value | Fetch filtered data |

---

## 🎨 UI Design Guidelines
- *Glassmorphism & Neomorphism* for modern UI aesthetics.
- *Smooth Box Shadows, Colors, and Typography* for an intuitive user experience.

---

## 🛠 Technologies Used
### *Backend*
- Flask
- SQL Server
- SQLAlchemy
- Pandas (Data Processing)
- Flask-CORS (Cross-Origin Requests)

### *Frontend*
- React.js
- Tailwind CSS
- Vite (Fast Build)
- Chart.js, D3.js, Plotly.js (Data Visualization)

---

## ⚡ Troubleshooting
### *Common Issues & Fixes*
1️⃣ **npm start not working?**
- Use npm run dev instead (for Vite projects).

2️⃣ **Recharts or react-simple-maps dependency issue?**
- Run: npm install recharts react-simple-maps --legacy-peer-deps

3️⃣ *HMR (Hot Module Replacement) Errors in Vite?*
- Restart the frontend: npm run dev
- Clear cache: rm -rf node_modules package-lock.json && npm install


Feel free to fork, improve, and contribute! 🚀
