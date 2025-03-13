import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis : username, email, password' });
    }
  
    try {
        // Vérifie si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
        where: { email },
        });

        if (existingUser) {
        return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
        }

        // Hache le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crée un nouvel utilisateur
        const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role: role || 'USER', // Définit le rôle par défaut si non spécifié
        },
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error('Erreur lors de l’inscription :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

export const login = async (req, res) => {
    console.log('🔹 Login endpoint called');
    console.log('🔹 Request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('❌ Champ manquant');
        return res.status(400).json({ error: 'Tous les champs sont requis : email, password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('🔹 Recherche de l’utilisateur dans la base de données',hashedPassword );
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log('🔹 User found:', user);

        if (!user) {
            console.log('❌ Utilisateur non trouvé');
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        // Vérifier si le mot de passe correspond
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('🔹 Mot de passe valide:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Mot de passe incorrect');
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('✅ Connexion réussie, token généré');
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role },
        });

    } catch (error) {
        console.error('❌ Erreur lors de la connexion :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
