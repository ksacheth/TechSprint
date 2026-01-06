"""
Beach Safety Prediction API
"""
from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]
from fastapi.responses import HTMLResponse  # pyright: ignore[reportMissingImports]
from config import settings
from app.api.routes import router
import os

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the HTML page"""
    static_file = os.path.join(os.path.dirname(__file__), "static", "index.html")
    if os.path.exists(static_file):
        with open(static_file, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Beach Safety API</h1><p>HTML file not found. <a href='/docs'>API Docs</a></p>")


@app.get("/api")
async def api_info():
    return {
        "service": "Beach Safety Prediction API",
        "version": settings.API_VERSION,
        "docs": "/docs"
    }


@app.on_event("shutdown")
async def shutdown():
    from app.services.data_ingestion import data_service
    await data_service.close()


if __name__ == "__main__":
    import uvicorn  # pyright: ignore[reportMissingImports]
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
