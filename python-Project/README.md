# TimezoneBuddy

TimezoneBuddy is a modern web application that helps you manage and compare time across different timezones. It provides real-time timezone conversion, a meeting time calculator, and a clean, responsive interface for seamless scheduling across the globe.

---

## 🚀 Features

- 🌍 Look up the current time in any timezone or major city
- 🕒 Compare times between multiple timezones
- 📅 Schedule meetings and see corresponding times in all selected zones
- 🌓 Dark/Light theme toggle
- ⚡ Real-time updates and conversion
- 🖥️ Modern, responsive UI built with Material-UI and React

---

## 🛠️ Tech Stack

- **Frontend:** React, Material-UI, Axios
- **Backend:** FastAPI, Uvicorn, Pydantic, pytz
- **Other:** Node.js, Python 3.8+, npm/yarn

---

## 📦 Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start the backend server
cd backend
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
# In a new terminal window/tab
cd frontend
npm install

# Start the frontend development server
npm start
```

The frontend will be available at [http://localhost:3000](http://localhost:3000) and the backend API at [http://localhost:8000](http://localhost:8000).

---

## 🧑‍💻 Usage

- Use the **Current Time Lookup** to search for the time in any timezone or city.
- Use the **Meeting Time Calculator** to schedule meetings and instantly view times across multiple timezones.
- Toggle between dark and light themes for your preferred viewing experience.

---

## 📚 API Endpoints

- `GET /time/{location}` — Get current time for a specific timezone or city
- `GET /timezones` — Get a list of all available timezones and supported cities
- `GET /time-stream/{location}` — Stream real-time time updates for a location

---

## 📝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [pytz](https://pythonhosted.org/pytz/)
