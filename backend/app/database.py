from pymongo import MongoClient
import os

def get_database():
    # On lit l'URI depuis une variable d'environnement, avec une valeur par défaut pour le développement local
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    
    client = MongoClient(mongo_uri)
    db = client["bdm"]

    # Force la création de la base si elle n'existe pas
    if "bdm" not in client.list_database_names():
        db["init"].insert_one({"init": True})
        db["init"].delete_many({})

    return db
