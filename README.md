# BFHL Graph Analyzer

> Full Stack Application for the **Chitkara Full Stack Engineering Challenge**  
> Processes hierarchical node relationships and returns structured insights including tree hierarchies, cycle detection, invalid entries, duplicate edges, and summary statistics.

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│   React Frontend    │  POST   │   Express.js Backend     │
│   (Vite + Tailwind) │ ──────► │   /bfhl endpoint         │
│   Port: 5173        │ ◄────── │   Port: 3000             │
└─────────────────────┘  JSON   └──────────────────────────┘
                                         │
                                         ▼
                                ┌──────────────────┐
                                │  Graph Engine    │
                                │  • Validation    │
                                │  • Deduplication │
                                │  • Multi-parent  │
                                │  • DFS Cycle Det.│
                                │  • Tree Builder  │
                                │  • Depth Calc    │
                                └──────────────────┘
```

## 📂 Folder Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── routes/          # Express route definitions
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic (graph algorithms)
│   │   ├── validators/      # Input validation
│   │   ├── utils/           # Tree builder utility
│   │   ├── middleware/      # Error handling middleware
│   │   └── app.js           # Express app configuration
│   ├── tests/               # Jest + Supertest test suites
│   ├── server.js            # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication
│   │   ├── App.jsx          # Main application
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Tailwind CSS styles
│   ├── vercel.json          # Vercel deployment config
│   ├── vite.config.js       # Vite configuration
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bhfl

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

**Backend** (Terminal 1):
```bash
cd backend
cp .env.example .env   # Edit .env with your identity fields
npm run dev            # Starts on http://localhost:3000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev            # Starts on http://localhost:5173
```

The frontend dev server proxies `/bfhl` requests to the backend automatically.

### Running Tests

```bash
cd backend
npm test
```

---

## 📡 API Documentation

### `POST /bfhl`

Process hierarchical node relationships.

**Request:**
```json
{
  "data": [
    "A->B",
    "A->C",
    "B->D"
  ]
}
```

**Response:**
```json
{
  "user_id": "fullname_ddmmyyyy",
  "email_id": "college_email",
  "college_roll_number": "college_roll_number",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

### `GET /bfhl`

Health check endpoint.

**Response:**
```json
{
  "operation_code": 1,
  "message": "BFHL endpoint is active..."
}
```

---

## 📋 Validation Rules

| Rule | Valid | Invalid |
|------|-------|---------|
| Format | `A->B` | `hello`, `1->2`, `A-B` |
| Single uppercase letter | `X->Y` | `AB->C`, `a->b` |
| No self-loops | `A->B` | `A->A` |
| No empty strings | `A->B` | `""`, `A->` |
| Whitespace trimmed | `" A->B "` → `A->B` | — |

---

## 🔄 Edge Cases

### Duplicate Edges
Same edge appearing multiple times → first occurrence used, duplicate recorded once.

### Diamond Pattern (Multi-Parent)
Node with multiple parents → first parent wins, rest silently ignored.

### Pure Cycles
No node qualifies as root → lexicographically smallest node chosen as root.

### Cycle Detection
Uses DFS with recursion stack (3-color algorithm). Cyclic components return `has_cycle: true`.

---

## 📊 Example Requests

### Simple Tree
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "A->C", "B->D"]}'
```

### With Cycle
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "B->C", "C->A"]}'
```

### Mixed Input
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "A->B", "hello", "C->D", "D->C"]}'
```

---

## 🚢 Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Set environment variables:
   ```
   USER_ID=yourname_ddmmyyyy
   EMAIL_ID=your_email@chitkara.edu.in
   COLLEGE_ROLL_NUMBER=your_roll_number
   PORT=3000
   ```

### Backend → Railway

1. Push code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Deploy from GitHub repo
4. Set **Root Directory** to `backend`
5. Railway auto-detects Node.js, sets `npm install` and `node server.js`
6. Add environment variables in Settings

### Frontend → Vercel

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

---

## 🧪 Testing

### Test Suites

| Suite | File | Tests |
|-------|------|-------|
| Validation | `tests/validation.test.js` | 12 tests |
| Graph Service | `tests/graphService.test.js` | 15 tests |
| API Integration | `tests/api.test.js` | 13 tests |

### Run Tests

```bash
cd backend
npm test
```

All 40 tests pass with < 1s execution time.

---

## ⚡ Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Max Nodes | 50 | ✅ Supported |
| Response Time | < 3s | ✅ < 10ms |
| Target | < 100ms | ✅ < 10ms |
| Complexity | O(V + E) | ✅ All operations |

**Data Structures:**
- `Map` for adjacency lists and parent tracking
- `Set` for deduplication and visited tracking
- DFS for cycle detection and depth calculation

---

## 🖼️ Screenshots

*Add screenshots of the running application here.*

---

## 📄 License

MIT
