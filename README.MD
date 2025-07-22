# 📦 TP Scraping Blog du Modérateur

Projet réalisé dans le cadre d’un TP visant à scraper les articles du site [Blog du Modérateur](https://www.blogdumoderateur.com) à l’aide de **BeautifulSoup4**, stockés dans **MongoDB**, puis affichés via une interface frontend en **Next.js**.

---

## 🔧 Technologies utilisées

### Backend

* Python 3.11
* FastAPI 🚀
* Uvicorn
* BeautifulSoup4 🥣
* PyMongo / MongoClient
* Docker

### Frontend

* Next.js 15 (App Router)
* TypeScript 💙
* Axios
* TailwindCSS
* Docker

### Base de données

* MongoDB

---

## 📂 Structure du projet

```
├── backend
│   ├── app
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── start.py
│   │   └── init_paths.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── app
│   │   │   |── import
|   |   |   └── article
│   │   ├── components
│   │   ├── context        # 💡 Contexte global (React context API)
│   │   ├── services       # 📡 Appels Axios centralisés
│   │   └── types          # 📐 Déclarations TypeScript globales
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Lancement du projet (Docker recommandé)

### Pré-requis

* Docker & Docker Compose ✅
* (facultatif) MongoDB Compass ou autre interface pour visualiser les données

### 1. Cloner le projet

```bash
git clone https://github.com/liljoker06/BS4_example.git
cd tp-scraping-blogduweb
```

### 2. Lancer les services

```bash
docker-compose up --build
```

Cela démarre :

* Le backend FastAPI ([http://localhost:8000](http://localhost:8000))
* Le frontend Next.js ([http://localhost:3000](http://localhost:3000))

### 3. Accès à l’interface

* Visitez `http://localhost:3000`
* Cliquez sur **Importer un article** pour lancer un scraping ✨

---

## 🧪 Mode développement manuel (sans Docker)

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python app/start.py
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 🗃️ Accès à la base de données MongoDB

* Adresse : `mongodb://localhost:27017`
* Base utilisée : `bdm`
* Collections : `articles`

Utilisez MongoDB Compass pour visualiser les documents.

---

## 🐛 Résolution de problèmes courants

### Problème `ERR_EMPTY_RESPONSE`

Assurez-vous que :

* Le backend FastAPI tourne sans erreur
* Le `NEXT_PUBLIC_API_URL` est bien configuré (ex: `http://localhost:8000`)

### Erreur `Could not find .next build`

Le build frontend a échoué. Corrigez les erreurs TypeScript/ESLint ou exécutez :

```bash
npm run build
```

---

## 🧼 .gitignore recommandé

### Backend (`backend/.gitignore`)

```
__pycache__/
*.pyc
.env
*.log
```

### Frontend (`frontend/.gitignore`)

```
.next/
node_modules/
dist/
.env.local
```

---

## 💡 Bonus : MongoDB local sous Windows

```bash
net start MongoDB
```

Ou utilisez MongoDB Compass

---

## ✍️ Auteur

> Ce projet a été réalisé dans le cadre du TP « Scraping & Web Data » – 2025

---

## 🫶 Merci !

N’hésitez pas à forker, tester, améliorer ce projet. Bon scraping !
