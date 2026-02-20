import os
import shutil
from abc import ABC, abstractmethod
from fastapi import UploadFile
from pathlib import Path
from typing import List, Dict

class StorageProvider(ABC):
    """
    Abstract Interface for Storage Providers.
    Any new storage method (S3, Azure, Google Cloud) must implement these methods.
    """
    @abstractmethod
    async def upload(self, file: UploadFile, key: str) -> str:
        """Uploads a file and returns its public URL."""
        pass

    @abstractmethod
    def list_files(self) -> List[Dict[str, str]]:
        """Lists all files in the storage bucket."""
        pass

    @abstractmethod
    def delete(self, key: str) -> bool:
        """Deletes a file by its key."""
        pass

class LocalStorageProvider(StorageProvider):
    """
    Implementation for Local Disk Storage.
    Best for Development and Student Projects.
    """
    def __init__(self, base_path: str = "assets", base_url: str = "http://127.0.0.1:8000/static/assets"):
        self.base_path = Path(base_path)
        self.base_url = base_url
        self.base_path.mkdir(parents=True, exist_ok=True)

    async def upload(self, file: UploadFile, key: str) -> str:
        file_path = self.base_path / key
        
        # Ensure we are at the start of the file
        await file.seek(0)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return f"{self.base_url}/{key}"

    def list_files(self) -> List[Dict[str, str]]:
        assets = []
        if not self.base_path.exists():
            return []
            
        for file in self.base_path.iterdir():
            if file.is_file() and not file.name.startswith("."):
                assets.append({
                    "src": f"{self.base_url}/{file.name}",
                    "name": file.name,
                    "type": "image" 
                })
        return assets

    def delete(self, key: str) -> bool:
        file_path = self.base_path / key
        if file_path.exists():
            os.remove(file_path)
            return True
        return False

# Placeholder for S3 - This shows verify scalability
class S3StorageProvider(StorageProvider):
    """
    Implementation for S3 Storage (AWS/Cloudflare R2/MinIO).
    Ready for Production/Enterprise.
    """
    def __init__(self, bucket_name: str, region: str, access_key: str, secret_key: str):
        # In a real app, we would initialize boto3 client here
        pass

    async def upload(self, file: UploadFile, key: str) -> str:
        # boto3.client.upload_fileobj(...)
        raise NotImplementedError("S3 is not configured yet. Set STORAGE_TYPE=local for now.")

    def list_files(self) -> List[Dict[str, str]]:
        raise NotImplementedError("S3 is not configured yet.")

    def delete(self, key: str) -> bool:
        raise NotImplementedError("S3 is not configured yet.")

def get_storage_provider() -> StorageProvider:
    """Factory method to get the configured storage provider."""
    storage_type = os.getenv("STORAGE_TYPE", "local")
    
    if storage_type == "s3":
        return S3StorageProvider(
            bucket_name=os.getenv("S3_BUCKET"),
            region=os.getenv("S3_REGION"),
            access_key=os.getenv("AWS_ACCESS_KEY_ID"),
            secret_key=os.getenv("AWS_SECRET_ACCESS_KEY")
        )
    
    return LocalStorageProvider()
