from typing import List, Optional
from pydantic import BaseModel

class Article(BaseModel):
    url: str
    title: str
    thumbnail: Optional[str]
    categories: Optional[str] 
    summary: Optional[str]
    date: Optional[str]
    author: Optional[str]
    content: str
    images: List[str]  
