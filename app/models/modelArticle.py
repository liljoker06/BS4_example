from typing import List, Dict, Optional
from pydantic import BaseModel


class ImageInfo(BaseModel):
    url: str
    alt: Optional[str] = ""

class Article(BaseModel):
    url: str
    title: str
    thumbnail: Optional[str]
    subcategory: Optional[str]
    summary: Optional[str]
    date: Optional[str]  
    author: Optional[str]
    content: str
    images: List[ImageInfo]