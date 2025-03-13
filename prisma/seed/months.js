import prisma from "../client.js";

export async function createMonths(name, year) {
  try {
    const month = await prisma.month.create({
      data: {
        name: name,
        year: year,
      },
    });

    console.log("Mois créé :", month);
  } catch (error) {
    console.error("Erreur lors de la création du mois :", error);
    throw error;
  }
}

