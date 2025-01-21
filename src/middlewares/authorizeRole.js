const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ error: 'Accès interdit. Rôle insuffisant.' });
      }
      next();
    };
};
  
export default authorizeRole;
  