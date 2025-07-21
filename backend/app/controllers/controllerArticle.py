from app.database import get_database
from app.models.modelArticle import Article
from app.services.scraper import scrape_category_range

db = get_database()
collection = db["articles"]


def get_all_articles():
    return list(collection.find({}, {"_id": 0}))

def insert_article(article_data: dict):
    collection.update_one(
        {"url": article_data["url"]},
        {"$set": article_data},
        upsert=True
    )
    return {"message": "Article inséré ou mis à jour avec succès."}

def get_articles_by_category(category: str):
    results = collection.find({"categories": category}, {"_id": 0})
    return list(results)

def scrape_range_by_category(
    category: str,
    start_page: int = 1,
    end_page: int = 1,
    articles_limit: int | None = None
):
    # On scrape la plage et on récupère les dicts
    scraped = scrape_category_range(
        category=category,
        start_page=start_page,
        end_page=end_page,
        articles_limit=articles_limit
    )

    # On insère et on collecte titres + URLs
    titles = []
    urls = []
    for art in scraped:
        insert_article(art)
        titles.append(art["title"])
        urls.append(art["url"])

    # On renvoie un résumé incluant les URLs
    return {
        "count": len(titles),
        "titles": titles,
        "urls": urls
    }
