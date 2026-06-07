from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os, json

app = FastAPI(title='HermesOS Registry')
app.mount("/notifications", __import__("registery.notifications").notifications.notifs)
app.mount("/memory", __import__("registery.memory").memory.mem)
app.mount('/processes', __import__('registery.processes').processes.procs)

REGISTRY_PATH = 'skills'
USERS_PATH = 'users'
WORKSPACES_PATH = 'workspaces'

# --- Versioning & Ratings ---
ratings = {}
downloads = {}

class SkillManifest(BaseModel):
    name: str
    version: str = "0.1.0"
    changelog: str = "Initial release"
    description: str
    author: str
    tags: list = []
    price_cents: int = 0
    license_key_required: bool = False

@app.post("/skills/{name}/rate")
def rate_skill(name: str, data: dict):
    user_id = data.get("user_id", "anonymous")
    stars = data.get("stars", 0)
    if name not in ratings:
        ratings[name] = []
    ratings[name].append({"user_id": user_id, "stars": stars})
    return {"name": name, "avg_stars": sum(r["stars"] for r in ratings[name]) / len(ratings[name])}

@app.get("/skills/{name}/ratings")
def get_ratings(name: str):
    if name not in ratings:
        return {"name": name, "avg_stars": 0, "count": 0}
    arr = ratings[name]
    return {"name": name, "avg_stars": sum(r["stars"] for r in arr) / len(arr), "count": len(arr)}

@app.post("/skills/{name}/download")
def track_download(name: str):
    downloads[name] = downloads.get(name, 0) + 1
    return {"name": name, "downloads": downloads[name]}

@app.get("/skills/{name}/downloads")
def get_downloads(name: str):
    return {"name": name, "downloads": downloads.get(name, 0)}

# --- Skills CRUD ---
import glob as _glob

def _load_manifests():
    out = {}
    for path in _glob.glob(f"{REGISTRY_PATH}/*/manifest.json"):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            out[data.get("name", path)] = data
        except Exception:
            pass
    return out

@app.get("/skills")
def list_skills():
    manifests = _load_manifests()
    items = []
    for name, m in manifests.items():
        items.append({
            "name": m.get("name", name),
            "version": m.get("version", "0.1.0"),
            "description": m.get("description", ""),
            "author": m.get("author", ""),
            "tags": m.get("tags", []),
            "price_cents": m.get("price_cents", 0),
            "downloads": downloads.get(name, 0),
            "ratings": ratings.get(name, []),
        })
    return {"items": items}

@app.get("/skills/{name}")
def get_skill(name: str):
    manifests = _load_manifests()
    if name not in manifests:
        raise HTTPException(404, "Skill not found")
    m = manifests[name]
    return {
        "name": m.get("name", name),
        "version": m.get("version", "0.1.0"),
        "description": m.get("description", ""),
        "author": m.get("author", ""),
        "tags": m.get("tags", []),
        "price_cents": m.get("price_cents", 0),
        "downloads": downloads.get(name, 0),
        "ratings": ratings.get(name, []),
    }

@app.post("/skills/{name}/install")
def install_skill(name: str):
    manifests = _load_manifests()
    if name not in manifests:
        raise HTTPException(404, "Skill not found")
    downloads[name] = downloads.get(name, 0) + 1
    return {"installed": name, "downloads": downloads[name]}

@app.post("/skills/{name}/uninstall")
def uninstall_skill(name: str):
    manifests = _load_manifests()
    if name not in manifests:
        raise HTTPException(404, "Skill not found")
    return {"uninstalled": name}

@app.post("/skills")
def publish_skill(manifest: SkillManifest):
    return {
        "name": manifest.name,
        "version": manifest.version,
        "status": "published",
    }
