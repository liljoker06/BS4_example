import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin
from app.database import get_database

# Initialiser la collection
db = get_database()
collection = db["articles"]


#fonction pour extraire le slug de la sous-catégorie
def parse_subcat_slug(subcat: str) -> str|None:

    match = re.search(r'/dossier/([^/]+)/', subcat)
    if match:
        return match.group(1)
    if "/" not in subcat or subcat.strip():
        return subcat.strip()
    return None


#fonction pour nettoyer le texte
def clean_text(text: str) -> str:
    return ' '.join(text.split()).strip()


# fonciton pour extraire les données d'un article depuis une URL
def extract_article_data(url: str) -> dict | None:
    print(f"Scraping {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()
    except Exception as e:
        print(f"Erreur lors du chargement : {e}")
        return None

    soup = BeautifulSoup(response.content, 'html.parser')
    article = soup.find('article')
    if not article:
        print("⚠️ Article introuvable")
        return None

    # 1. Titre
    title_tag = article.find('h1')
    title = clean_text(title_tag.text) if title_tag else "Titre non trouvé"

    # 2. Thumbnail (Open Graph)
    og_image = soup.find('meta', property='og:image')
    thumbnail = og_image['content'] if og_image else None

    # 3. Sous-catégorie depuis .cats-list > .cat[data-cat]
    cat_span = soup.select_one('div.cats-list span.cat')
    subcategory = cat_span['data-cat'] if cat_span and cat_span.has_attr('data-cat') else None

    # 4. Résumé (meta description)
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    summary = meta_desc['content'] if meta_desc else None

    # 5. Date
    time_tag = soup.find('time', class_='entry-date')
    date = time_tag['datetime'].split('T')[0] if time_tag and time_tag.has_attr('datetime') else None

    # 6. Auteur (via span.byline a)
    author_tag = soup.select_one("span.byline a")
    author = author_tag.text.strip() if author_tag else None

    # 7. Tags / sous-catégories (ul.tags-list li a)
    tags_list = []
    tags_section = soup.select("ul.tags-list li a.post-tags")
    if tags_section:
        tags_list = [tag.text.strip() for tag in tags_section if tag.text.strip()]

    # 8. Contenu principal (entry-content)
    content_section = soup.find('div', class_='entry-content')
    content = ''
    if content_section:
        elements = content_section.find_all(['p', 'h2', 'h3', 'ul', 'li'])
        content = '\n'.join([clean_text(el.get_text()) for el in elements])

    # 9. Images avec légendes (figure > img + figcaption) + vérif HTTPS
    images = []
    if content_section:
        for figure in content_section.find_all('figure'):
            img = figure.find('img')
            caption = figure.find('figcaption')
            if img:
                src = img.get('src') or img.get('data-src')
                alt = img.get('alt') or ''
                legend = clean_text(caption.text) if caption else clean_text(alt)
                if src:
                    # Forcer HTTPS
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('http:'):
                        src = src.replace('http:', 'https:')
                    images.append({'url': src, 'alt': legend})

    return {
        'url': url,
        'title': title,
        'thumbnail': thumbnail,
        'subcategory': subcategory,
        'summary': summary,
        'date': date,
        'author': author,
        'tags': tags_list,
        'content': content,
        'images': images
    }


# scraping d'une plage de pages
def scrape_subcategory_range(
    subcat: str,
    start_page: int = 1,
    end_page: int = 1,
    articles_limit: int | None = None
) -> list[dict]:
    base = "https://www.blogdumoderateur.com"
    slug = parse_subcat_slug(subcat)
    if not slug:
        print(f"Impossible de parser le slug depuis '{subcat}'")
        return []

    prefix = f"{base}/dossier/{slug}"
    seen_urls = set()
    results = []

    for page in range(start_page, end_page + 1):
        page_url = f"{prefix}/page/{page}/" if page > 1 else prefix + "/"
        print(f"Charge page {page} : {page_url}")
        try:
            resp = requests.get(page_url, timeout=10)
            resp.raise_for_status()
        except Exception as e:
            print(f"Erreur page {page} : {e}")
            continue

        soup = BeautifulSoup(resp.content, "html.parser")
        links = []

        
        for a in soup.select("header.entry-header a"):
            href = a.get("href")
            if not href:
                continue
            full_url = href if href.startswith("http") else urljoin(base, href)
            if full_url not in seen_urls:
                seen_urls.add(full_url)
                links.append(full_url)

        if not links:
            print(f"Plus de liens sur page {page}.")
            continue

        for url in links:
            if collection.find_one({"url": url}):
                print(f"Déjà en base : {url}")
                continue
            data = extract_article_data(url)
            if data:
                results.append(data)
                print(f"{data['title']}")
            else:
                print(f"Échec scraping {url}")

            if articles_limit and len(results) >= articles_limit:
                print(f"Limite de {articles_limit} atteinte.")
                return results

    print(f"Fin scraping : {len(results)} articles.")
    return results
