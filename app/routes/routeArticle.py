from fastapi import APIRouter, Query, HTTPException
from app.controllers import controllerArticle
from app.services.scraper import extract_article_data
from app.models.modelArticle import Article
from typing import List
from fastapi import Path

router = APIRouter()

@router.post("/articles", summary="Insérer un article manuellement")
def create_article(article: Article):
    return controllerArticle.insert_article(article.dict())

@router.get("/articles", response_model=List[Article])
def list_articles_by_subcategory(subcategory: str = Query(...)):
    return controllerArticle.get_articles_by_subcategory(subcategory)

@router.post("/scrape", summary="Scraper un article depuis une URL")
def scrape_article(url: str = Query(..., description="URL complète de l'article BDM")):
    data = extract_article_data(url)
    if not data:
        raise HTTPException(status_code=400, detail="Impossible de scraper l'article.")
    return controllerArticle.insert_article(data)


@router.post("/scrape/subcategory/range/{subcategory:path}", summary="Scraper une plage de pages d'une sous‑catégorie")
def scrape_subcat_range(
    subcategory: str = Path(..., description="Slug ou URL complète de la sous-catégorie"),
    start: int = Query(1, ge=1, description="Page de début"),
    end:   int = Query(1, ge=1, description="Page de fin"),
    limit: int | None = Query(None, description="Limite totale d'articles (optionnel)")
):
    if end < start:
        raise HTTPException(status_code=400, detail="`end` doit être ≥ `start`")
    return controllerArticle.scrape_range_by_subcategory(
        subcategory=subcategory,
        start_page=start,
        end_page=end,
        articles_limit=limit
    )