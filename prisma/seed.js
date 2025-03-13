import prisma from "./client.js";
import { createMember } from "./seed/members.js";
import { createMonths } from "./seed/months.js";
import { createCategorie } from "./seed/categories.js";
import { createUser } from "./seed/user.js";

async function main() {
  try {
    await prisma.$connect();
    console.log("Connecté à la base de données.");

    /* Réinitialisation de la base de données */
    console.log("Réinitialisation de la base de données...");
    await prisma.dues.deleteMany();
    await prisma.member.deleteMany();
    await prisma.category.deleteMany();
    await prisma.month.deleteMany();
    await prisma.user.deleteMany();
    console.log("Base de données réinitialisée.");

    /* Création des données */

    // Création d'un utilisateur
    await createUser();

    // Création des catégories
    await createCategorie(1);

    // Création des mois
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ];
    const year = 2021 + Math.floor(Math.random() * 10); // Années entre 2021 et 2030
    await Promise.all(months.map((month) => createMonths(month, year)));

    // Création des membres
    await createMember(2);

    // Attendre que toutes les données soient créées avant d'ajouter les cotisations
    const members = await prisma.member.findMany();
    const categories = await prisma.category.findMany();
    const monthsData = await prisma.month.findMany();

    if (members.length > 0 && categories.length > 0 && monthsData.length > 0) {
      const duesPromises = [];

      members.forEach((member) => {
        categories.forEach((category) => {
          monthsData.forEach((month) => {
            // Vérifier si la cotisation existe déjà avant d'insérer
            duesPromises.push(
              prisma.dues.create({
                data: {
                  amount: 0,
                  isLate: false,
                  memberId: member.id,
                  categoryId: category.id,
                  monthId: month.id,
                },
              })
            );
          });
        });
      });

      await Promise.all(duesPromises);
      console.log("Cotisations créées avec succès !");
    } else {
      console.log("Impossible de créer des cotisations : données manquantes.");
    }
  } catch (e) {
    console.error("Erreur lors de la création des données :", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

function initDB() {
  require("./seed");
}