from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class ContactListBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)

class ContactListCreate(ContactListBase):
    pass

class ContactListResponse(ContactListBase):
    id: UUID
    project_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ContactBase(BaseModel):
    email: EmailStr
    is_subscribed: bool = True
    # Flexible fields for custom data
    fields: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ContactCreate(ContactBase):
    list_id: Optional[UUID] = None

class ContactUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_subscribed: Optional[bool] = None
    list_id: Optional[UUID] = None
    fields: Optional[Dict[str, Any]] = None

class ContactResponse(ContactBase):
    id: UUID
    project_id: UUID
    list_id: Optional[UUID]
    unsubscribed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
