import express from 'express';
import prisma from '../../prisma/client.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

// Protéger toutes les routes de catégories
router.use(authenticateToken);

// GET - Récupérer toutes les cotisations
router.get('/', async (req, res) => {
  console.log('GET /dues - Fetching all dues');

  try {
    const dues = await prisma.dues.findMany({
      include: { member: true, category: true, month: true },
    });

    if (dues.length === 0) {
      console.log('No dues found');
      return res.status(404).json({ message: 'No dues found' });
    }

    console.log('Dues fetched successfully');
    res.status(200).json(dues);
  } catch (error) {
    console.error('Error fetching dues:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET - Récupérer une cotisation spécifique par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /dues/${id} - Fetching due by ID`);

  try {
    const due = await prisma.dues.findUnique({
      where: { id: parseInt(id, 10) },
      include: { member: true, category: true, month: true },
    });

    if (!due) {
      console.log('Due not found');
      return res.status(404).json({ message: 'Due not found' });
    }

    console.log('Due fetched successfully');
    res.status(200).json(due);
  } catch (error) {
    console.error('Error fetching due:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST - Ajouter une cotisation
router.post('/', authorizeRole('ADMIN'), async (req, res) => {
  const { amount, isLate, memberId, categoryId, monthId } = req.body;
  console.log('POST /dues - Adding new due');
  
  try {
    if (!amount || memberId === undefined || categoryId === undefined || monthId === undefined) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Valider les relations
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    const month = await prisma.month.findUnique({ where: { id: monthId } });

    if (!member || !category || !month) {
      console.log('Invalid memberId, categoryId, or monthId');
      return res.status(400).json({ error: 'Invalid memberId, categoryId, or monthId' });
    }

    const newDue = await prisma.dues.create({
      data: { amount, isLate, memberId, categoryId, monthId },
    });

    console.log('Due created successfully');
    res.status(201).json(newDue);
  } catch (error) {
    console.error('Error creating due:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH - Mettre à jour une cotisation
router.patch('/:id', authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { amount, isLate } = req.body;
  console.log(`PATCH /dues/${id} - Updating due`);

  try {
    const due = await prisma.dues.update({
      where: { id: parseInt(id, 10) },
      data: { amount, isLate },
    });

    console.log('Due updated successfully');
    res.status(200).json(due);
  } catch (error) {
    console.error('Error updating due:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE - Supprimer une cotisation
router.delete('/:id',authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /dues/${id} - Deleting due`);

  try {
    const due = await prisma.dues.delete({ where: { id: parseInt(id, 10) } });
    console.log('Due deleted successfully');
    res.status(200).json(due);
  } catch (error) {
    console.error('Error deleting due:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
