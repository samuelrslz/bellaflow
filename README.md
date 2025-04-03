# BellaFlow

<img src="lilysalon_frontend/src/assets/logo.webp" alt="BellaFlow Logo" width="400">

BellaFlow is a web application designed to manage salon operations efficiently. Follow the steps below to set up and run the project.

---

## Prerequisites

Ensure you have the following installed on your system:
- **Python 3.8+**
- **Node.js 16+** and **npm**
- **pip** (Python package manager)
- **Virtualenv** (optional but recommended for Python dependencies)

---

## Setup Instructions

### 1. Clone the Repository
Clone the project repository to your local machine:
```
git clone <repository-url>
cd bellaflow
```

---

### 2. Backend Setup

#### Navigate to the Backend Directory
```
cd lilysalon_backend
```

#### Create a Virtual Environment (Optional)
```
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install Dependencies
```
pip install -r requirements.txt
```

#### Apply Migrations
```
python3 manage.py migrate
```

#### Start the Backend Server
```
python3 manage.py runserver
```

The backend server will start at `http://127.0.0.1:8000`.  
You can access the admin page at `http://127.0.0.1:8000/admin` (credentials required).

---

### 3. Frontend Setup

#### Navigate to the Frontend Directory
```
cd ../lilysalon_frontend
```

#### Install Dependencies
```
npm install
```

#### Start the Frontend Server
```
npm run dev
```

The frontend server will start, and the address will be displayed in the terminal (e.g., `http://localhost:5173`).

---

## Running the Application

1. Start the backend server as described in the **Backend Setup** section.
2. Start the frontend server as described in the **Frontend Setup** section.
3. Open the frontend server address in your browser to use the application.

---

## Additional Notes

- **Admin Credentials**: To access the admin page, you will need credentials. These can be set up in the backend.
- **Environment Variables**: Ensure any required `.env` files are properly configured for both the backend and frontend.
- **Dependencies**: If you encounter issues, ensure all dependencies are installed as specified in `requirements.txt` (backend) and `package.json` (frontend).