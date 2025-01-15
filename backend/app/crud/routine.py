from sqlalchemy.orm import Session
from typing import Optional, Dict
from app.models.routine import Routine
from app.schemas.routine import RoutineCreate, RoutineUpdate
import json

def get_routines(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Routine).offset(skip).limit(limit).all()

def get_routine(db: Session, routine_id: int):
    return db.query(Routine).filter(Routine.id == routine_id).first()

def create_routine(db: Session, routine: RoutineCreate):
    db_routine = Routine(
        title=routine.title,
        description=routine.description,
        category=routine.category,
        color_theme=routine.color_theme.dict(),
        notification=routine.notification.dict(),
        completed_dates={}
    )
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    return db_routine

def update_routine(db: Session, routine_id: int, routine: RoutineUpdate):
    print("Starting update for routine:", routine_id)  # 로깅 추가
    db_routine = get_routine(db, routine_id)
    if db_routine:
        update_data = routine.dict(exclude_unset=True)
        print("Update data:", update_data)  # 로깅 추가
        
        for key, value in update_data.items():
            if isinstance(value, dict):
                value = value.copy()
            setattr(db_routine, key, value)
            
        print("DB routine before commit:", db_routine.__dict__)  # 로깅 추가
        db.commit()
        db.refresh(db_routine)
    return db_routine

def delete_routine(db: Session, routine_id: int):
    db_routine = get_routine(db, routine_id)
    if db_routine:
        db.delete(db_routine)
        db.commit()
        return True
    return False

def complete_routine(db: Session, routine_id: int, date: str):
    print(f"Setting completion for routine {routine_id} on date {date}")
    db_routine = get_routine(db, routine_id)
    
    if db_routine:
        if not db_routine.completed_dates:
            db_routine.completed_dates = {}
        
        # 완료 상태 업데이트 (기존 값 유지 + 새 값 추가)
        completed_dates = db_routine.completed_dates
        completed_dates[date] = True  # 새로운 날짜 추가
        print(f"Updated completed_dates: {db_routine.completed_dates}")
        
        # 데이터베이스 업데이트
        db.query(Routine).filter(Routine.id == routine_id).update(
            {"completed_dates": db_routine.completed_dates}
        )
        db.commit()
        db.refresh(db_routine)
        return db_routine
    return None

def uncomplete_routine(db: Session, routine_id: int, date: str):
    print(f"Removing completion for routine {routine_id} on date {date}")
    db_routine = get_routine(db, routine_id)
    
    if db_routine:
        if not db_routine.completed_dates:
            return db_routine
            
        if date in db_routine.completed_dates:
            del db_routine.completed_dates[date]
            print(f"Updated completed_dates after removal: {db_routine.completed_dates}")
            
            # 데이터베이스 업데이트
            db.query(Routine).filter(Routine.id == routine_id).update(
                {"completed_dates": db_routine.completed_dates}
            )
            db.commit()
            db.refresh(db_routine)
        return db_routine
    return None

def get_routine_by_title(db: Session, title: str):
    """제목으로 루틴 찾기"""
    return db.query(Routine).filter(Routine.title == title).first()