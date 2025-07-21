# Image Python
FROM python:3.11-slim

# Dépendances système utiles (ex: compilation de dépendances)
RUN apt-get update && apt-get install -y build-essential

# Dossier de travail
WORKDIR /app

# Copie du code source
COPY ./app /app
COPY requirements.txt .

# Installation des dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Port exposé (optionnel mais recommandé)
EXPOSE 8000

# Lancement de l'application avec start.py
CMD ["python", "start.py"]
