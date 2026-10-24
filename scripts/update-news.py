"""Save the latest Sammamish headlines to data/news.json for the homepage news section.

Run by .github/workflows/update-news.yml every few hours. Uses only Python's standard library.
Only headlines, dates, sections, links, and the story's preview photo address are saved; the photos stay on
the newspaper's site, and each story links back to it.
"""
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path

FEED = "https://sammamishindependent.com/feed/"
SOURCE = {"name": "Sammamish Independent", "url": "https://sammamishindependent.com/"}
MAX_STORIES = 3   # the homepage shows one big story and two smaller ones
# Feed tags that describe placement rather than topic.
SKIP_SECTIONS = {"Headline Story", "Top Story", "Uncategorized"}
OUT = Path(__file__).resolve().parent.parent / "data" / "news.json"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "SammamishCommunityResources/1.0 (student FBLA project)"})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read()


CONTENT = "{http://purl.org/rss/1.0/modules/content/}encoded"


def large_photo(url):
    """The story's full-size preview photo (its og:image), or None."""
    try:
        page = fetch(url).decode("utf-8", "ignore")
    except OSError:
        return None
    m = re.search(r'<meta property="og:image" content="([^"]+)"', page)
    return unescape(m.group(1)) if m else None


def stories():
    root = ET.fromstring(fetch(FEED))
    for item in root.iter("item"):
        sections = [unescape(c.text or "").strip() for c in item.findall("category")]
        html = (item.findtext("description") or "") + (item.findtext(CONTENT) or "")
        photo = re.search(r'<img[^>]+src="([^"]+)"', html)
        yield {
            "title": unescape(item.findtext("title") or "").strip(),
            "url": (item.findtext("link") or "").strip(),
            "date": parsedate_to_datetime(item.findtext("pubDate")).isoformat(),
            "section": next((s for s in sections if s and s not in SKIP_SECTIONS), "News"),
            "image": unescape(photo.group(1)) if photo else None,
        }


def main():
    items = [s for s in stories() if s["title"] and s["url"]][:MAX_STORIES]
    for story in items:
        story["imageLarge"] = large_photo(story["url"]) or story["image"]
    if not items:
        raise SystemExit("No stories found; keeping the existing news.json.")
    old = json.loads(OUT.read_text()) if OUT.exists() else {}
    if old.get("items") == items:
        print("No new stories.")
        return
    OUT.write_text(json.dumps({
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": SOURCE,
        "items": items,
    }, indent=2, ensure_ascii=False) + "\n")
    print(f"Saved {len(items)} stories.")


if __name__ == "__main__":
    main()
