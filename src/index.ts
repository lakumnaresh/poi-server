import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import poiRoutes from './routes/poi';
import { PointOfInterest } from './entity/PointOfInterest';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pois', poiRoutes);

// Database connection
createConnection({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'poitracker',
  entities: [PointOfInterest],
  synchronize: true,
  logging: true,
})
  .then(() => {
    console.log('Database connected successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });