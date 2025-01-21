// src/middlewares/errorHandler.js

export default (err, req, res, next) => {
    console.error(err.stack); // Affiche l'erreur dans la console pour le debug
    res.status(err.status || 500).json({
      error: err.message || 'Erreur interne du serveur',
    });
  };
  