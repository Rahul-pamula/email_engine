from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List, Dict
from services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["Assets"])

def get_asset_service():
    return AssetService()

@router.post("/upload")
async def upload_asset(
    files: List[UploadFile] = File(...),
    service: AssetService = Depends(get_asset_service)
):
    """
    Upload one or more assets for use in the editor.
    """
    uploaded_urls = []
    for file in files:
        url = await service.upload_asset(file)
        uploaded_urls.append(url)
    
    # Return format expected by GrapesJS Asset Manager (often simpler to return list of objects)
    # But usually it expects: { data: [ { src: 'url' } ] }
    return {"data": uploaded_urls}

@router.get("")
async def list_assets(
    service: AssetService = Depends(get_asset_service)
):
    """
    List all available assets.
    """
    assets = service.get_assets()
    return assets
