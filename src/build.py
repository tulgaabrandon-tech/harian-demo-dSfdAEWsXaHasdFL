"""Inline the icon sprite into the HTML pages so icons work offline and from file://.
Run from the project root:  python3 src/build.py"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
sprite = (root / "assets/icons/sprite.svg").read_text()
sprite = sprite.replace('<svg xmlns="http://www.w3.org/2000/svg">',
                        '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">', 1).strip()
for name in ("index", "design-system"):
    tpl = (root / f"src/{name}.template.html").read_text()
    (root / f"{name}.html").write_text(tpl.replace("{{SPRITE}}", sprite))
    print("built", name + ".html")
