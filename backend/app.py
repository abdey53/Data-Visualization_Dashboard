from flask import Flask, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Database Configuration
DB_SERVER = "ABDEYALI\\SQLEXPRESS"
DB_NAME = "dashboard_db"
DB_USER = "jobportal"
DB_PASS = "123"

# Create connection
conn = pyodbc.connect(
   f"DRIVER={{SQL Server}};SERVER={DB_SERVER};DATABASE={DB_NAME};UID={DB_USER};PWD={DB_PASS}"
)
cursor = conn.cursor()

# ✅ API to get raw data (Frontend will filter)
@app.route('/api/data')
def get_data():
   query = "select * from dashboard_data"
   cursor.execute(query)
   columns = [col[0] for col in cursor.description]
   data = [dict(zip(columns, row)) for row in cursor.fetchall()]
   return jsonify(data)

if __name__ == "__main__":
   app.run(debug=True)
