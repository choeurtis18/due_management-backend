import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

import duesRoutes from './routes/dues.js';
import membersRoutes from './routes/members.js';
import categoriesRoutes from './routes/categories.js';
import monthsRoutes from './routes/months.js';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Configuration de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Autorise le front-end
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true, // Autoriser les cookies (si nécessaire)
};
app.use(cors(corsOptions)); // Application du middleware CORS

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Ajout des routes
app.use('/api/dues', duesRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/months', monthsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Middleware global pour gérer les erreurs
app.use(errorHandler);

// Définir le port (dynamique en mode test)
const PORT = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 4000;

// Démarrer le serveur uniquement si l'environnement n'est pas "test"
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export de l'application pour utilisation dans les tests
export default app;
