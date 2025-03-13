"prisma/seed/members.js"

import { faker } from "@faker-js/faker";
import prisma from "../client.js";

export async function createMember(max) {
  for (let i = 0; i < max; i++) {
    const member = await prisma.member.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        creation_date: new Date(),
        update_date: new Date(),
      },
    });

    console.log("Membre créé :", member);
  }
}

