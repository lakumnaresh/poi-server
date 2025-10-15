# POITracker Server

This is the backend server for the POITracker application, built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v18 or later)
- Docker Desktop
- npm or yarn

## Getting Started

1. **Clone the repository** (if you haven't already)
```bash
git clone <repository-url>
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**

Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

This will start PostgreSQL with the following configuration:
- Port: 5432
- Username: postgres
- Password: postgres
- Database: poitracker

The database comes pre-configured with the PostGIS extension for geospatial queries.

4. **Build the TypeScript code**
```bash
npm run build
```

5. **Start the development server**
```bash
npm run dev
```

Or for production:
```bash
npm start
```

The server will be running at http://localhost:3000

## API Endpoints

### Points of Interest (POIs)

- `GET /api/pois` - Get all POIs
- `GET /api/pois/nearby` - Get POIs within a radius
  - Query parameters:
    - `latitude` (number)
    - `longitude` (number)
    - `radius` (number, in kilometers)
- `POST /api/pois` - Create a new POI
- `PUT /api/pois/:id` - Update a POI
- `DELETE /api/pois/:id` - Delete a POI

### Request/Response Examples

#### Create POI
```json
POST /api/pois
{
  "name": "Coffee Shop",
  "description": "Great local coffee",
  "latitude": 51.5074,
  "longitude": -0.1278
}
```

#### Get Nearby POIs
```json
GET /api/pois/nearby?latitude=51.5074&longitude=-0.1278&radius=1
```

## Database Schema

### PointOfInterest
```sql
- id (UUID, primary key)
- name (string)
- description (string)
- latitude (float)
- longitude (float)
- createdAt (timestamp)
- updatedAt (timestamp)
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript code
- `npm start` - Start production server
- `npm test` - Run tests

### Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=poitracker
```

## Docker

The included `docker-compose.yml` file sets up:
- PostgreSQL database with PostGIS extension
- Persistent volume for database data

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Remove volumes (will delete all data)
docker-compose down -v
```

## Troubleshooting

1. **Database Connection Issues**
   - Ensure Docker is running
   - Check if PostgreSQL container is running: `docker ps`
   - Verify database credentials in your .env file
   - Try restarting the container: `docker-compose restart`

2. **Port Conflicts**
   - If port 5432 is already in use, modify the port mapping in docker-compose.yml
   - If port 3000 is in use, change the PORT environment variable

3. **Build Errors**
   - Remove dist folder: `rm -rf dist`
   - Clear npm cache: `npm cache clean --force`
   - Rebuild: `npm run build`