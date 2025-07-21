import subprocess
import os
import sys
from init_paths import create_init_files

def is_mongodb_running():
    # Vérifie si le service MongoDB est actif
    try:
        result = subprocess.run(["sc", "query", "MongoDB"], capture_output=True, text=True)
        return "RUNNING" in result.stdout
    except Exception as e:
        return False

if __name__ == "__main__":
    print("Initialisation des fichiers __init__.py...")
    create_init_files("app")

    if is_mongodb_running():
        print("MongoDB est en cours d'exécution.")
    else:
        print("MongoDB ne semble pas démarré.")
        print("Lance-le manuellement (ex: net start MongoDB ou via MongoDB Compass).")

    print("Lancement du serveur FastAPI...")
    subprocess.run([sys.executable, "-m", "uvicorn", "app.main:app", "--reload"])
