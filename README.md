# Quant Web Application

A modern web application with a Next.js frontend and FastAPI backend for quantitative calculations.

## Project Structure

```
quant/
├── backend/           # FastAPI backend
│   ├── main.py
│   └── requirements.txt
└── frontend/         # Next.js frontend
    ├── pages/
    │   ├── _app.tsx
    │   └── index.tsx
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Python (3.8 or later)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:3000`

## Development

- Backend API documentation (when running): `http://localhost:8000/docs`
- Frontend development server: `http://localhost:3000`

## Features

- Modern, responsive UI built with Next.js and Chakra UI
- RESTful API built with FastAPI
- Real-time calculation results
- Error handling and user feedback

## License

MIT
