
# **Dues Manager**

Gestionnaire de cotisations pour une association, comprenant une application frontend (React) et un backend (Node.js/Express).

---

## **Sommaire**
- [Aperçu](#apercu)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
  - [Prérequis](#prérequis)
  - [Étapes d'installation](#étapes-dinstallation)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Variables d'environnement](#variables-denvironnement)
- [Contributeurs](#contributeurs)
- [Licence](#licence)

---

## **Aperçu**
**Dues Manager** est une application qui permet de gérer les membres, catégories, mois et cotisations d'une association. L'application inclut :
- **Frontend** : Interface utilisateur réalisée avec React (Vite.js).
- **Backend** : API RESTful réalisée avec Node.js, Express, et Prisma.
- **Base de données** : MySQL (via Railway).

---

## **Technologies utilisées**
### **Frontend :**
- React (Vite.js)
- Tailwind CSS
- React Router

### **Backend :**
- Node.js
- Express.js
- Prisma ORM
- JSON Web Tokens (JWT) pour l'authentification

### **Base de données :**
- MySQL (via Railway)

---

## **Installation**

### **Prérequis**
- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **MySQL** ou un hébergement de base de données (exemple : Railway)

### **Étapes d'installation**
1. Clonez le dépôt :
   ```bash
   git clone <URL_DU_DEPOT>
   cd dues-manager
   ```

2. Installez les dépendances :
   - Pour le backend :
     ```bash
     cd backend
     npm install
     ```
   - Pour le frontend :
     ```bash
     cd frontend
     npm install
     ```

3. Configurez les variables d'environnement :
   - **Backend (`backend/.env`)** :
     ```env
     DATABASE_URL=<URL_DE_VOTRE_BASE_DE_DONNÉES>
     JWT_SECRET=<VOTRE_SECRET_JWT>
     PORT=4000
     FRONTEND_URL=<URL_DE_VOTRE_APP>
     ```
   - **Frontend (`frontend/.env`)** :
     ```env
     VITE_API_BASE_URL=http://localhost:4000
     ```

4. Lancez les applications :
   - Backend :
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend :
     ```bash
     cd frontend
     npm run dev
     ```

5. Accédez à l'application :
   - Frontend : [http://localhost:5173](http://localhost:5173)
   - Backend (API) : [http://localhost:4000](http://localhost:4000)

---

## **Scripts disponibles**
### **Backend**
| Script            | Description                                    |
|--------------------|------------------------------------------------|
| `npm run dev`      | Démarre le backend en mode développement      |
| `npm run build`    | Compile le backend pour la production          |
| `npm start`        | Démarre le backend en mode production          |
| `npm test`         | Lance les tests unitaires                     |

### **Frontend**
| Script            | Description                                    |
|--------------------|------------------------------------------------|
| `npm run dev`      | Démarre le frontend en mode développement     |
| `npm run build`    | Compile le frontend pour la production         |
| `npm start`        | Lance le frontend compilé                     |

---

## **Structure du projet**
```plaintext
dues-manager/
├── frontend/               # Code source du frontend
│   ├── public/             # Fichiers publics
│   ├── src/                # Code React
│   │   ├── components/     # Composants réutilisables
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── pages/          # Pages principales (Home, Login, etc.)
│   │   ├── services/       # Appels API
│   │   ├── App.jsx         # Point d'entrée principal
│   │   ├── vite.config.js  # Configuration Vite.js
│   ├── .env                # Variables d'environnement
│   ├── package.json        # Dépendances
│
├── backend/                # Code source du backend
│   ├── prisma/             # Prisma config et schéma
│   ├── src/                # Code principal
│   │   ├── controllers/    # Contrôleurs
│   │   ├── middlewares/    # Middlewares
│   │   ├── routes/         # Routes
│   │   ├── tests/          # Tests
│   │   ├── utils/          # Utils
│   │   ├── server.js       # Point d'entrée du backend
│   ├── .env                # Variables d'environnement
│   ├── package.json        # Dépendances
│
├── .gitignore              # Fichiers à ignorer dans Git
├── README.md               # Documentation
```

---

## **Déploiement**

### **Frontend**
1. Déployez le frontend sur Vercel ou Netlify.
2. Configurez la variable d'environnement `VITE_API_BASE_URL` pour pointer vers l'URL du backend.

### **Backend**
1. Déployez le backend sur Railway.
2. Configurez les variables d'environnement sur Railway (`DATABASE_URL`, `JWT_SECRET`, etc.).
3. Assurez-vous que le frontend utilise l'URL de production du backend.

---

## **Variables d'environnement**
Voici les variables d'environnement nécessaires :

### **Backend (`backend/.env`)**
```env
DATABASE_URL=mysql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>
JWT_SECRET=your_jwt_secret
PORT=4000
```

### **Frontend (`frontend/.env`)**
```env
VITE_API_BASE_URL=https://votre-backend-deploye.com
```

---

## **Contributeurs**
- **Choeutis Tchounga** – *Frontend & Backend Development*
- **Choeutis Tchounga** – *Testing & Deployment*

---

## **Licence**
Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le redistribuer.
