"prisma/seed/categories.js"

import { faker } from "@faker-js/faker";
import prisma from "../client.js";

export async function createCategorie(max) {
  for (let i = 0; i < max; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
        creation_date: new Date(),
        update_date: new Date(),
      },
    });

    console.log("Catégorie créée :", category);
  }
}

