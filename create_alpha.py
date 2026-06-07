import json, os, textwrap
from pathlib import Path

ROOT = Path(".")
ROOT.mkdir(exist_ok=True)
(ROOT / "skills").mkdir(exist_ok=True)
(ROOT / "docs").mkdir(exist_ok=True)

(ROOT / "README.md").write_text(textwrap.dedent("""\
# HermesOS — Agent OS Marketplace

Alpha build. Multi-tenant Hermes runtime with skill marketplace.
"""), encoding="utf-8")

(ROOT / "CHANGELOG.md").write_text(textwrap.dedent("""\
# Changelog

## [0.1.0-alpha] — 2026-06-07
- Registry API skeleton
- Per-user Docker Compose template
- Launch skill manifest schema
- Placeholder storefront
"""), encoding="utf-8")

(ROOT / "docs" / "ELF.md").write_text(textwrap.dedent("""\
# HermesOS Evergreen Framework
"""), encoding="utf-8")

for s in [
    {"name":"crypto-analyst","version":"0.1.0","description":"Multi-timeframe crypto analysis.","author":"essencocean-oss","license":"MIT","price_cents":0,"tools":["web_search","terminal"],"tags":["crypto","analysis"]},
    {"name":"abb-assistant","version":"0.1.0","description":"ABB engineering helper.","author":"essencocean-oss","license":"MIT","price_cents":0,"tools":["terminal"],"tags":["abb","engineering"]},
]:
    (ROOT / "skills" / f"{s['name']}.json").write_text(json.dumps(s, indent=2), encoding="utf-8")

print("Done:", ROOT)
