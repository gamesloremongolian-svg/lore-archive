#!/usr/bin/env python3
"""Static checks for every published Lore Archive HTML page."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET


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
    pages = sorted(
        path for path in Path(".").rglob("*.html")
        if path.name != "index.backup.html"
        and ".git" not in path.parts
    )
    if not pages:
        print("ERROR: no HTML pages found")
        return 1

    errors = []
    total_ids = 0
    total_scripts = 0
    required = {"mainNav", "menuBtn", "main-content"}

    for path in pages:
        parser = SiteParser()
        parser.feed(path.read_text(encoding="utf-8"))
        parser.close()
        total_ids += len(parser.ids)
        total_scripts += parser.scripts

        duplicates = [
            key for key, count in Counter(parser.ids).items() if count > 1
        ]
        if duplicates:
            errors.append(
                f"{path}: duplicate HTML id attributes: {', '.join(duplicates)}"
            )

        if parser.html_lang != "mn":
            errors.append(f'{path}: expected <html lang="mn">')

        if parser.scripts != parser.script_closes:
            errors.append(
                f"{path}: unbalanced script tags "
                f"({parser.scripts} open, {parser.script_closes} close)"
            )

        if path == Path("knowledge/index.html"):
            knowledge_required = {"search", "filter", "gameGrid", "animeGrid"}
            missing = sorted(knowledge_required - set(parser.ids))
            if missing:
                errors.append(
                    "knowledge/index.html: missing required knowledge elements: "
                    + ", ".join(missing)
                )

        if path == Path("archive/index.html"):
            archive_required = {
                "publicArchive", "publicArchiveResults", "publicArchiveLang",
                "publicArchiveFilters", "publicArchiveSearch",
            }
            missing = sorted(archive_required - set(parser.ids))
            if missing:
                errors.append(
                    "archive/index.html: missing required archive elements: "
                    + ", ".join(missing)
                )

        if path == Path("index.html"):
            source = path.read_text(encoding="utf-8")
            if 'href="https://loreverse-ctrl.github.io/lore-archive/"' not in source:
                errors.append("index.html: canonical URL must match the GitHub Pages project URL")
            if 'class="skip-link"' not in source or 'id="main-content"' not in source:
                errors.append("index.html: missing accessible skip navigation target")
            missing = sorted(required - set(parser.ids))
            if missing:
                errors.append(
                    "index.html: missing required page elements: "
                    + ", ".join(missing)
                )

    editorial = Path("editorial/index.html")
    if editorial.is_file():
        source = editorial.read_text(encoding="utf-8")
        if 'id="lang"' not in source or 'id="translationLang"' not in source:
            errors.append(
                "editorial/index.html: interface and translation language "
                "selectors must have separate IDs"
            )
        if 'language_code:$("translationLang").value' not in source:
            errors.append(
                "editorial/index.html: translation form must read translationLang"
            )

    sitemap_path = Path("sitemap.xml")
    if not sitemap_path.is_file():
        errors.append("sitemap.xml: missing public sitemap")
    else:
        try:
            root = ET.parse(sitemap_path).getroot()
            namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            locations = [node.text or "" for node in root.findall("sm:url/sm:loc", namespace)]
            base = "https://loreverse-ctrl.github.io/lore-archive/"
            if not locations:
                errors.append("sitemap.xml: no URLs found")
            for url in locations:
                parsed = urlsplit(url)
                if parsed.scheme != "https" or parsed.netloc != "loreverse-ctrl.github.io" or not parsed.path.startswith("/lore-archive/"):
                    errors.append(f"sitemap.xml: URL outside canonical site: {url}")
                    continue
                relative = parsed.path[len("/lore-archive/"):].strip("/")
                target = Path(relative) / "index.html" if relative else Path("index.html")
                if not target.is_file():
                    errors.append(f"sitemap.xml: URL has no published page: {url}")
                else:
                    page_source = target.read_text(encoding="utf-8")
                    if 'name="robots" content="noindex' in page_source.lower():
                        errors.append(f"sitemap.xml: noindex page must not be listed: {url}")
        except ET.ParseError as error:
            errors.append(f"sitemap.xml: invalid XML: {error}")

    robots_path = Path("robots.txt")
    if not robots_path.is_file() or "Sitemap: https://loreverse-ctrl.github.io/lore-archive/sitemap.xml" not in robots_path.read_text(encoding="utf-8"):
        errors.append("robots.txt: missing sitemap declaration")

    if errors:
        for error in errors:
            print("ERROR:", error)
        return 1

    print(
        f"OK: checked {len(pages)} HTML pages; "
        f"{total_ids} IDs; {total_scripts} script blocks."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
