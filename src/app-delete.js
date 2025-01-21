import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import des routes
import memberRoutes from './routes/members.js';
import categoryRoutes from './routes/categories.js';
import monthRoutes from './routes/months.js';
import duesRoutes from './routes/dues.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/months', monthRoutes);
app.use('/api/dues', duesRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'API is running!' });
});

export default app;
