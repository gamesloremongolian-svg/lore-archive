#!/usr/bin/env python3
"""Lightweight static checks for the Lore Archive entry page."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import sys

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.scripts = 0
        self.script_closes = 0
        self.html_lang = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "script":
            self.scripts += 1
        if tag == "html":
            self.html_lang = attrs.get("lang")
    def handle_endtag(self, tag):
        if tag == "script":
            self.script_closes += 1

def main():
    path = Path("index.html")
    if not path.is_file():
        print("ERROR: index.html not found")
        return 1
    source = path.read_text(encoding="utf-8")
    parser = SiteParser()
    parser.feed(source)
    parser.close()
    errors = []
    duplicates = [key for key, count in Counter(parser.ids).items() if count > 1]
    if duplicates:
        errors.append("Duplicate HTML id attributes: " + ", ".join(duplicates))
    required = {"catalogTabs", "catalogSearch", "catalogGo", "catalogStatus", "catalogResults", "catalogMore", "publishedPosts", "loreAiLauncher", "publicArchive", "publicArchiveResults", "publicArchiveLang", "publicArchiveFilters"}
    missing = sorted(required - set(parser.ids))
    if missing:
        errors.append("Missing required page elements: " + ", ".join(missing))
    if parser.html_lang != "mn":
        errors.append("Expected <html lang=\"mn\">")
    if parser.scripts != parser.script_closes:
        errors.append(f"Unbalanced script tags: {parser.scripts} open, {parser.script_closes} close")
    if errors:
        for error in errors:
            print("ERROR:", error)
        return 1
    print(f"OK: parsed index.html; {len(parser.ids)} unique IDs; {parser.scripts} script blocks.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
