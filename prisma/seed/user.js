import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

import prisma from "../client.js";

export async function  createUser() {
    const hashedPassword = bcrypt.hashSync("password.cas.code", 10); // 10 est le nombre de tours pour le hachage

    // Enregistrez l'utilisateur dans la base de données avec le mot de passe haché
    const user = await prisma.user.create({
        data: {
            username: faker.name.firstName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: "USER"
        },
    });

    const hashedPasswordAdmin = bcrypt.hashSync("password123", 10)
    // Enregistrez l'utilisateur dans la base de données avec le mot de passe haché
    const userAdmin = await prisma.user.create({
        data: {
            username: "admin",
            email: "admin.cas@yopmail.com",
            password: hashedPasswordAdmin,
            role: "ADMIN"
        },
    });

    console.log("Utilisateur créé Admin:", userAdmin);
    return user;
};
