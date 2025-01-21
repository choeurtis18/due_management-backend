import express from 'express';
import prisma from '../../prisma/client.js';
import authenticateToken from "../middlewares/authenticateToken.js"; // Middleware d'authentification
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

// Toutes les routes ci-dessous nécessitent une authentification
router.use(authenticateToken);

// GET - Récupérer tous les membres
router.get('/', async (req, res) => {
  console.log('GET /members - Fetching all members');
  try {
    const members = await prisma.member.findMany({
      include: { dues: true, categories: true },
    });
    if (members.length === 0) {
      console.log('No members found');
      return res.status(404).json({ message: 'No members found' });
    }
    console.log('Members fetched successfully');
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET - Récupérer un membre spécifique par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /members/${id} - Fetching member by ID`);
  try {
    const member = await prisma.member.findUnique({
      where: { id: parseInt(id, 10) },
      include: { dues: true, categories: true },
    });
    if (!member) {
      console.log('Member not found');
      return res.status(404).json({ message: 'Member not found' });
    }
    console.log('Member fetched successfully');
    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST - Ajouter un membre
router.post('/', authorizeRole('ADMIN'), async (req, res) => {
  const { firstName, lastName } = req.body;
  console.log('POST /members - Adding a new member');

  try {
    if (!firstName || !lastName) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const categories = await prisma.category.findMany();
    if (categories.length === 0 || !categories) {
      console.log("No categories found. Add categories before creating members.");
      return res.status(400).json({ error: 'No categories found' });
    }
  
    const months = await prisma.month.findMany();
    if (months.length === 0 || !months) {
      console.log("No months found. Add months before creating members.");
      return res.status(400).json({ error: 'No months found' });
    }

    const newMember = await prisma.member.create({
      data: { firstName, lastName },
    });
    console.log('New member created successfully');
        
    for (const month of months) {
      for (const category of categories) {
        await prisma.dues.create({
          data: {
            amount: 0,
            isLate: false,
            memberId: newMember.id,
            categoryId: category.id,
            monthId: month.id,
          },
        });
        console.log('Dues created successfully for member');
      }
    }

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH - Mettre à jour un membre
router.patch('/:id', authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  console.log(`PATCH /members/${id} - Updating member`);

  try {
    const updatedMember = await prisma.member.update({
      where: { id: parseInt(id, 10) },
      data: { firstName, lastName, update_date: new Date() },
    });
    console.log('Member updated successfully');
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE - Supprimer un membre
router.delete('/:id', authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /members/${id} - Deleting member`);

  try {
    // Supprimer toutes les cotisations associées
    await prisma.dues.deleteMany({ where: { memberId: parseInt(id, 10) } });
    console.log('Associated dues deleted successfully');

    // Supprimer le membre
    const deletedMember = await prisma.member.delete({ where: { id: parseInt(id, 10) } });
    console.log('Member deleted successfully');
    res.status(200).json(deletedMember);
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
