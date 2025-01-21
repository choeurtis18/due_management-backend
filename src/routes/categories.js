import express from 'express';
import prisma from '../../prisma/client.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

// Protéger toutes les routes de catégories
router.use(authenticateToken);

// GET - Récupérer toutes les catégories
router.get('/', async (req, res) => {
  console.log('GET /categories - Fetching all categories');
  
  try {
    const categories = await prisma.category.findMany({
      include: { members: true, dues: true },
    });

    if (categories.length === 0) {
      console.log('No categories found');
      return res.status(404).json({ message: 'No categories found' });
    }

    console.log('Categories fetched successfully');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET - Récupérer une catégorie spécifique par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /categories/${id} - Fetching category by ID`);
  
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id, 10) },
      include: { members: true, dues: true },
    });

    if (!category) {
      console.log('Category not found');
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('Category fetched successfully');
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST - Ajouter une catégorie
router.post('/', authorizeRole('ADMIN'), async (req, res) => {
  const { name, description } = req.body;
  console.log('POST /categories - Adding a new category');

  try {
    if (!name || !description) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const members = await prisma.member.findMany();
    if (members.length === 0) {
      console.log('No members found. Add members before creating categories.');
      return res.status(400).json({ message: 'No members found' });
    }

    const months = await prisma.month.findMany();
    if (months.length === 0) {
      console.log('No months found. Add months before creating categories.');
      return res.status(400).json({ message: 'No months found' });
    }

    const category = await prisma.category.create({
      data: { name, description },
    });

    for (const member of members) {
      for (const month of months) {
        await prisma.dues.create({
          data: {
            amount: 0,
            isLate: false,
            memberId: member.id,
            categoryId: category.id,
            monthId: month.id,
          },
        });
        console.log(`Dues created successfully for member ${member.id} and month ${month.id}`);
      }
    }

    console.log('Category created successfully:', category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH - Mettre à jour une catégorie
router.patch('/:id', authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  console.log(`PATCH /categories/${id} - Updating category`);

  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id, 10) },
      data: { name, description, update_date: new Date() },
    });

    console.log('Category updated successfully:', category);
    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE - Supprimer une catégorie
router.delete('/:id', authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /categories/${id} - Deleting category`);

  try {
    // Supprimer toutes les cotisations associées
    await prisma.dues.deleteMany({ where: { categoryId: parseInt(id, 10) } });
    console.log('Associated dues deleted successfully');

    // Supprimer la catégorie
    const category = await prisma.category.delete({ where: { id: parseInt(id, 10) } });
    console.log('Category deleted successfully:', category);

    res.status(200).json(category);
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
