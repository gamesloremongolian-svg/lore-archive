#!/usr/bin/env python3
"""Static checks for every published Lore Archive HTML page."""
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
    required = {
        "catalogTabs", "catalogSearch", "catalogGo", "catalogStatus",
        "catalogResults", "catalogMore", "publishedPosts", "loreAiLauncher",
        "publicArchive", "publicArchiveResults", "publicArchiveLang",
        "publicArchiveFilters",
    }

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

        if path == Path("index.html"):
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
