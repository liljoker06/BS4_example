from pymongo import MongoClient

def get_database():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["bdm"]
    # Force la création de la base en insérant un document fictif si elle n’existe pas
    if "bdm" not in client.list_database_names():
        db["init"].insert_one({"init": True})
        db["init"].delete_many({})             

    return db
