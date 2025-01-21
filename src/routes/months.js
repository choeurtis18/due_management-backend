import express from 'express';
import prisma from '../../prisma/client.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

// Protéger toutes les routes de catégories
router.use(authenticateToken);


// GET - Récupérer tous les mois
router.get('/', async (req, res) => {
  console.log('GET /months - Fetching all months');
  try {
    const months = await prisma.month.findMany({
      include: { dues: true },
    });
    if (months.length === 0) {
      console.log('No months found');
      return res.status(404).json({ message: 'No months found' });
    }
    console.log('Months fetched successfully');
    res.status(200).json(months);
  } catch (error) {
    console.error('Error fetching months:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET - Récupérer un mois spécifique par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /months/${id} - Fetching month by ID`);
  try {
    const month = await prisma.month.findUnique({
      where: { id: parseInt(id, 10) },
      include: { dues: true },
    });
    if (!month) {
      console.log('Month not found');
      return res.status(404).json({ message: 'Month not found' });
    }
    console.log('Month fetched successfully');
    res.status(200).json(month);
  } catch (error) {
    console.error('Error fetching month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST - Ajouter un mois
router.post('/', authorizeRole('ADMIN'), async (req, res) => {
  const { name, year } = req.body;
  console.log('POST /months - Adding a new month');

  try {
    if (!name || !year) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const members = await prisma.member.findMany();
    if (members.length === 0 || !members) {
      console.log("Pas de menbres trouvés. Ajoutez des menbres avant de créer des mois.");
      return;
    }

    const categories = await prisma.category.findMany();
    if (categories.length === 0 || !categories) {
      console.log("Pas de catégories trouvées. Ajoutez des catégories avant de créer des mois.");
      return;
    }

    const newMonth = await prisma.month.create({
      data: { name, year },
    });

    for (const member of members) {
      for (const category of categories) {
        await prisma.dues.create({
          data: {
            amount: 0,
            isLate: false,
            memberId: member.id,
            categoryId: category.id,
            monthId: newMonth.id,
          },
        });
        console.log("Cotisation créée avec succès pour le membre", member.id, "et la catégorie", category.id);
      }
    }

    console.log("Nouveau mois créé avec succès:", newMonth);
    res.status(201).json(newMonth);
  } catch (error) {
    console.error('Error creating month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH - Mettre à jour un mois
router.patch('/:id', authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { name, year } = req.body;
  console.log(`PATCH /months/${id} - Updating month`);

  try {
    const updatedMonth = await prisma.month.update({
      where: { id: parseInt(id, 10) },
      data: { name, year },
    });

    console.log('Month updated successfully:', updatedMonth);
    res.status(200).json(updatedMonth);
  } catch (error) {
    console.error('Error updating month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE - Supprimer un mois
router.delete('/:id', authorizeRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /months/${id} - Deleting month`);

  try {
    // Supprimer toutes les cotisations associées
    await prisma.dues.deleteMany({ where: { monthId: parseInt(id, 10) } });
    console.log('Associated dues deleted successfully');

    // Supprimer le mois
    const deletedMonth = await prisma.month.delete({ where: { id: parseInt(id, 10) } });
    console.log('Month deleted successfully:', deletedMonth);

    res.status(200).json(deletedMonth);
  } catch (error) {
    console.error('Error deleting month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
