from fastapi import UploadFile
from typing import List, Dict
from .storage import get_storage_provider

class AssetService:
    def __init__(self):
        self.storage = get_storage_provider()

    async def upload_asset(self, file: UploadFile) -> str:
        """
        Save an uploaded file using the configured storage provider.
        """
        # We use the filename as the key for now. 
        # In production, we might want to uuid prefix it to avoid collisions.
        return await self.storage.upload(file, file.filename)

    def get_assets(self) -> List[Dict[str, str]]:
        """
        List all assets using the configured storage provider.
        """
        return self.storage.list_files()

