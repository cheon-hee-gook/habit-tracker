from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

class ColorTheme(BaseModel):
    theme: str
    intensity: int

class Notification(BaseModel):
    enabled: bool
    time: str

class RoutineBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    color_theme: ColorTheme
    notification: Notification

class RoutineCreate(RoutineBase):
    pass

class RoutineUpdate(RoutineBase):
    pass

class Routine(RoutineBase):
    id: int
    completed_dates: Dict[str, bool] = {}
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True