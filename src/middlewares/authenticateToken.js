import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Récupère le token depuis "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Stocke les données décodées (id, username, role) dans req.user
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token invalide ou expiré.' });
  }
};

export default authenticateToken;
