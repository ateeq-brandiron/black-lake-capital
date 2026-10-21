#!/usr/bin/env python3
"""
One-off import of every WordPress post into content/news.json (read-only against the live site).

Reads   content/_source/*.md          (author names from the per-company feed pages)
Fetches /wp-json/wp/v2/posts?_embed    (content, dates, categories, featured image)
        each featured and inline image (paced; retries on HTTP 429)
Writes  content/news.json              (sanitized HTML bodies, local image paths)
        public/images/news/*.webp      (max 1200px wide)

Needs Python 3 and Pillow. Usage:
  python3 scripts/import-posts.py              full import
  python3 scripts/import-posts.py --backfill   featured images from each post page (the REST API
                                               refuses media records), plus body clean-up
"""
import html
import io
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

from PIL import Image

BASE = "https://blacklakecap.com"
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content/_source"
OUT_IMG = ROOT / "public/images/news"
DELAY = 1.0  # seconds between requests; the host rate-limits
MAX_WIDTH = 1200

# Category slug -> news source id (columns on the News page)
SOURCES = [
    ("blc", "black-lake"),
    ("a5", "a5"),
    ("trapp", "trapp"),
    ("macrosoft", "macrosoft"),
    ("sca", "spinnaker"),
    ("omco-sumo", "omco-sumo"),
]


def get(url, binary=False):
    for attempt in range(5):
        url = urllib.parse.quote(url, safe=":/?&=%#+@,;~")
        req = urllib.request.Request(url, headers={"User-Agent": "BlackLakeRebuild-Importer/1.0 (read-only)"})
        try:
            with urllib.request.urlopen(req, timeout=60) as res:
                data = res.read()
                time.sleep(DELAY)
                return data if binary else data.decode("utf-8")
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 4:
                wait = int(e.headers.get("Retry-After") or 30 * (attempt + 1))
                print(f"429 {url}; waiting {wait}s", flush=True)
                time.sleep(wait)
                continue
            raise


def fetch_posts():
    posts, page = [], 1
    while True:
        batch = json.loads(get(f"{BASE}/wp-json/wp/v2/posts?per_page=100&page={page}&_embed=wp:featuredmedia"))
        posts += batch
        if len(batch) < 100:
            return posts
        page += 1


def author_names():
    """Post URL -> author name, parsed from the feed pages ("## [Title](url) ... By [Name](...)")."""
    names = {}
    for md in SRC.glob("*.md"):
        text = md.read_text()
        for m in re.finditer(r"## \[[^\]]+\]\((https://blacklakecap\.com/[^)]+)\)\s+By \[([^\]]+)\]", text):
            names.setdefault(m.group(1), m.group(2))
    return names


class Sanitizer(HTMLParser):
    """Keeps a small allowlist of tags and attributes; drops scripts, styles, iframes and classes."""

    ALLOWED = {
        "p", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "strong", "b", "em", "i", "a", "blockquote",
        "img", "figure", "figcaption", "br", "hr", "table", "thead", "tbody", "tr", "th", "td", "sup", "sub",
    }
    VOID = {"img", "br", "hr"}
    DROP = {"script", "style", "iframe", "noscript", "form", "svg", "button", "input", "select", "textarea"}
    ATTRS = {"a": {"href"}, "img": {"src", "alt"}, "th": {"colspan", "rowspan"}, "td": {"colspan", "rowspan"}}

    def __init__(self, image_map):
        super().__init__(convert_charrefs=True)
        self.out, self.skip, self.images = [], 0, image_map

    def handle_starttag(self, tag, attrs):
        if tag in self.DROP:
            self.skip += 1
            return
        if self.skip or tag not in self.ALLOWED:
            return
        if tag == "h1":
            tag = "h2"
        kept = []
        for k, v in attrs:
            if k not in self.ATTRS.get(tag, set()) or v is None:
                continue
            if tag == "a" and k == "href":
                if v.strip().lower().startswith("javascript:"):
                    continue
                v = re.sub(r"^https?://(www\.)?blacklakecap\.com", "", v) or "/"
            if tag == "img" and k == "src":
                v = self.images.get(v, v)
            kept.append(f'{k}="{html.escape(v, quote=True)}"')
        if tag == "a" and any(k == "href" and v and v.startswith("http") for k, v in attrs):
            kept += ['target="_blank"', 'rel="noopener"']
        self.out.append(f"<{tag}{' ' if kept else ''}{' '.join(kept)}>")

    def handle_endtag(self, tag):
        if tag in self.DROP:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip or tag not in self.ALLOWED or tag in self.VOID:
            return
        self.out.append(f"</{'h2' if tag == 'h1' else tag}>")

    def handle_data(self, data):
        if not self.skip:
            self.out.append(html.escape(data, quote=False))


def clean_html(raw, image_map):
    raw = re.sub(r"\[/?et_pb_[^\]]*\]", "", raw)  # stray Divi shortcodes
    s = Sanitizer(image_map)
    s.feed(raw)
    out = "".join(s.out)
    out = re.sub(r"<p>\s*(&nbsp;| )?\s*</p>", "", out)
    return re.sub(r"\n{3,}", "\n\n", out).strip()


def save_image(url, name):
    """Downloads an image once, resized to MAX_WIDTH and stored as WebP. Returns the public path."""
    target = OUT_IMG / f"{name}.webp"
    if not target.exists():
        data = get(url, binary=True)
        im = Image.open(io.BytesIO(data))
        im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
        if im.width > MAX_WIDTH:
            im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
        im.save(target, "WEBP", quality=78, method=6)
    w, h = Image.open(target).size
    return f"/images/news/{target.name}", w, h


TRACKERS = re.compile(r'<img[^>]+src="https?://(track\.hubspot\.com|[^"]*\.gif\?)[^"]*"[^>]*>')
EMOJI = re.compile(r'<img[^>]+src="https://s\.w\.org/images/core/emoji/[^"]+"[^>]*alt="([^"]*)"[^>]*>|<img[^>]+alt="([^"]*)"[^>]+src="https://s\.w\.org/images/core/emoji/[^"]+"[^>]*>')


def tidy(body):
    """Drops tracking pixels and turns WordPress emoji images back into the emoji character."""
    body = TRACKERS.sub("", body)
    return EMOJI.sub(lambda m: m.group(1) or m.group(2) or "", body)


def backfill():
    news_path = ROOT / "content/news.json"
    news = json.loads(news_path.read_text())
    for n, post in enumerate(news["posts"], 1):
        post["body"] = tidy(post["body"] or "") or None
        if post["featuredImage"]:
            continue
        page = get(f"{BASE}/{post['slug']}/")
        main = re.search(r'<div id="main-content">([\s\S]*?)(<footer|$)', page)
        header = re.search(r'et_post_meta_wrapper[\s\S]*?<img[^>]+src="([^"]+)"[^>]*?(?:alt="([^"]*)")?', main.group(1) if main else "")
        if header and "wp-content/uploads" in header.group(1):
            try:
                path, w, h = save_image(header.group(1), f"{post['slug'][:60]}-featured")
                post["featuredImage"] = {"src": path, "alt": html.unescape(header.group(2) or ""), "width": w, "height": h}
            except Exception as e:
                print(f"featured failed {post['slug']}: {e}", flush=True)
        print(f"[{n}/{len(news['posts'])}] {post['slug']} {'image' if post['featuredImage'] else '-'}", flush=True)
    news_path.write_text(json.dumps(news, indent=2, ensure_ascii=False) + "\n")
    print("done backfill", flush=True)


def text_of(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment or "")).strip()


def main():
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    cats = {c["id"]: c["slug"] for c in json.loads((SRC / "wp-json/categories.json").read_text())}
    names = author_names()
    posts = fetch_posts()
    print(f"{len(posts)} posts", flush=True)

    out = []
    for n, p in enumerate(posts, 1):
        slug = p["slug"]
        slugs = [cats.get(c, "") for c in p["categories"]]
        source = next((sid for cat, sid in SOURCES if cat in slugs), "black-lake")
        raw = p["content"]["rendered"]

        image_map = {}
        for i, src in enumerate(dict.fromkeys(re.findall(r'<img[^>]+src="([^"]+)"', raw))):
            if "blacklakecap.com/wp-content/uploads" not in src:
                continue
            try:
                image_map[src] = save_image(src, f"{slug[:60]}-{i + 1}")[0]
            except Exception as e:  # keep going; a broken inline image is dropped below
                print(f"image failed {src}: {e}", flush=True)
                image_map[src] = ""

        featured = None
        media = (p.get("_embedded") or {}).get("wp:featuredmedia") or []
        if media and media[0].get("source_url"):
            try:
                path, w, h = save_image(media[0]["source_url"], f"{slug[:60]}-featured")
                featured = {"src": path, "alt": media[0].get("alt_text") or "", "width": w, "height": h}
            except Exception as e:
                print(f"featured failed {slug}: {e}", flush=True)

        body = tidy(clean_html(raw, image_map))
        body = re.sub(r'<img src=""[^>]*>', "", body)
        out.append({
            "slug": slug,
            "source": source,
            "title": text_of(p["title"]["rendered"]),
            "author": names.get(p["link"], ""),
            "date": p["date"],
            "url": None,
            "excerpt": text_of(p["excerpt"]["rendered"]).replace(" […]", "…")[:300] or None,
            "featuredImage": featured,
            "categories": [s for s in slugs if s],
            "body": body,
        })
        print(f"[{n}/{len(posts)}] {source:10s} {slug}", flush=True)

    out.sort(key=lambda x: x["date"], reverse=True)
    news_path = ROOT / "content/news.json"
    news = json.loads(news_path.read_text())
    news["posts"] = out
    news["confirmed"] = True
    news["note"] = "Imported from blacklakecap.com by scripts/import-posts.py. Posts keep their WordPress URLs (/<slug>/)."
    news_path.write_text(json.dumps(news, indent=2, ensure_ascii=False) + "\n")
    print("done", len(out), "posts", flush=True)


if __name__ == "__main__":
    sys.exit(backfill() if "--backfill" in sys.argv else main())
