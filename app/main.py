from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import get_database
from app.routes import routeArticle  

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = get_database()
    if "articles" not in db.list_collection_names():
        print("Collection 'articles' absente, création en cours...")
        try:
            db.create_collection("articles")
            print("Collection 'articles' créée avec succès.")
        except Exception as e:
            print(f"Erreur lors de la création : {e}")
    else:
        print("Collection 'articles' déjà existante.")

    yield
    print("Application stoppée")

app = FastAPI(lifespan=lifespan)

# Enregistrement des routes 
app.include_router(routeArticle.router)

@app.get("/")
def read_root():
    return {"message": "API opérationnelle avec lifespan"}
