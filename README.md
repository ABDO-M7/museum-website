# Artisan Museum Website

A full-stack museum website built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## Project Structure

```
museum-website/
├── frontend/                 # Frontend (Deploy to Vercel)
│   ├── index.html           # Home page
│   ├── exhibitions.html     # Exhibitions page
│   ├── gallery.html         # Gallery page
│   ├── book-tour.html       # Booking form page
│   ├── css/
│   │   └── styles.css       # Main stylesheet
│   ├── js/
│   │   └── main.js          # Main JavaScript
│   └── vercel.json          # Vercel configuration
│
├── backend/                  # Backend (Deploy to Railway)
│   ├── server.js            # Express server
│   ├── package.json         # Dependencies
│   ├── models/
│   │   ├── Booking.js       # Booking model
│   │   └── Exhibition.js    # Exhibition model
│   ├── routes/
│   │   ├── bookings.js      # Booking routes
│   │   └── exhibitions.js   # Exhibition routes
│   ├── .env.example         # Environment variables template
│   └── railway.json         # Railway configuration
│
└── README.md
```

## Features

- **Home Page**: Welcome page with hero section, about section, featured exhibitions
- **Exhibitions Page**: Browse current, upcoming, and permanent exhibitions
- **Gallery Page**: Masonry grid gallery with filtering
- **Book a Tour Page**: Booking form with validation, connected to MongoDB

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookings` | POST | Create a new booking |
| `/api/bookings` | GET | Get all bookings |
| `/api/bookings/:id` | GET | Get booking by ID |
| `/api/exhibitions` | GET | Get all exhibitions |
| `/api/exhibitions/:id` | GET | Get exhibition by ID |
| `/api/exhibitions` | POST | Create exhibition |

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string
5. Whitelist IP addresses (0.0.0.0/0 for all)

### 2. Backend Setup (Local)

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/museum-db
PORT=5000
FRONTEND_URL=http://localhost:5500
```

Run the server:
```bash
npm run dev
```

### 3. Frontend Setup (Local)

Open `frontend/index.html` with Live Server or any local server.

Update `API_BASE_URL` in `frontend/js/main.js` if needed.

## Deployment

### Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select your repository and `backend` folder
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Your Vercel frontend URL
5. Deploy!

### Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your repository
3. Set root directory to `frontend`
4. Deploy!

**Important**: After deploying, update `API_BASE_URL` in `frontend/js/main.js` to your Railway backend URL.

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default: 5000) |
| `FRONTEND_URL` | Frontend URL for CORS |

## Testing

### Test the API with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Create a booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "visitorName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "visitDate": "2025-01-15",
    "numberOfVisitors": 2,
    "tourType": "guided"
  }'

# Get all bookings
curl http://localhost:5000/api/bookings
```

## Team Members

- [Team Member 1] - Role
- [Team Member 2] - Role
- [Team Member 3] - Role
- [Team Member 4] - Role

## License

This project is for educational purposes - CS3810T Web Development Team Project.
