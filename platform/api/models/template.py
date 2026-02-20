from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class TemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    subject: str = Field(..., min_length=1, max_length=255)
    category: Optional[str] = Field("marketing")
    mjml_json: Dict[str, Any] = Field(default_factory=dict)
    mjml_source: Optional[str] = Field(None)
    compiled_html: str = Field(...)

    @field_validator('compiled_html')
    def validate_html_size(cls, v):
        # 500KB limit
        if len(v.encode('utf-8')) > 500 * 1024:
            raise ValueError("Compiled HTML size must be less than 500KB")
        if not v.strip():
            raise ValueError("Compiled HTML cannot be empty")
        return v

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    subject: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = None
    mjml_json: Optional[Dict[str, Any]] = None
    mjml_source: Optional[str] = None
    compiled_html: Optional[str] = None
    
    @field_validator('compiled_html')
    def validate_html_size(cls, v):
        if v is None:
            return v
        if len(v.encode('utf-8')) > 500 * 1024:
            raise ValueError("Compiled HTML size must be less than 500KB")
        if not v.strip():
            raise ValueError("Compiled HTML cannot be empty")
        return v

class TemplateResponse(TemplateBase):
    id: UUID
    tenant_id: UUID
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
