from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas.routine import Routine, RoutineCreate, RoutineUpdate
from app.crud import routine as routine_crud

router = APIRouter()

@router.get("/routines/", response_model=List[Routine])
def read_routines(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    routines = routine_crud.get_routines(db, skip=skip, limit=limit)
    return routines

@router.post("/routines/", response_model=Routine)
def create_routine(
    routine: RoutineCreate,
    db: Session = Depends(deps.get_db)
):
    print("Creating routine with data:", routine.dict())  # 로깅 추가
    return routine_crud.create_routine(db=db, routine=routine)

@router.get("/routines/{routine_id}", response_model=Routine)
def read_routine(
    routine_id: int,
    db: Session = Depends(deps.get_db)
):
    db_routine = routine_crud.get_routine(db, routine_id=routine_id)
    if db_routine is None:
        raise HTTPException(status_code=404, detail="Routine not found")
    return db_routine

@router.put("/routines/{routine_id}", response_model=Routine)
def update_routine(
    routine_id: int,
    routine: RoutineUpdate,
    db: Session = Depends(deps.get_db)
):
    print(f"Updating routine {routine_id} with data:", routine.dict())  # 로깅 추가
    db_routine = routine_crud.update_routine(db, routine_id=routine_id, routine=routine)
    if db_routine is None:
        raise HTTPException(status_code=404, detail="Routine not found")
    return db_routine

@router.delete("/routines/{routine_id}")
def delete_routine(
    routine_id: int,
    db: Session = Depends(deps.get_db)
):
    success = routine_crud.delete_routine(db, routine_id=routine_id)
    if not success:
        raise HTTPException(status_code=404, detail="Routine not found")
    return {"ok": True}

@router.post("/routines/{routine_id}/complete/{date}")
def complete_routine(
    routine_id: int,
    date: str,
    db: Session = Depends(deps.get_db)
):
    print(f"Completing routine {routine_id} for date {date}")
    db_routine = routine_crud.complete_routine(db, routine_id=routine_id, date=date)
    if db_routine is None:
        raise HTTPException(status_code=404, detail="Routine not found")
    return db_routine

@router.post("/routines/{routine_id}/uncomplete/{date}")
def uncomplete_routine(
    routine_id: int,
    date: str,
    db: Session = Depends(deps.get_db)
):
    print(f"Uncompleting routine {routine_id} for date {date}")
    db_routine = routine_crud.uncomplete_routine(db, routine_id=routine_id, date=date)
    if db_routine is None:
        raise HTTPException(status_code=404, detail="Routine not found")
    return db_routine

@router.post("/routines/import")
def import_routines(
    routines: List[RoutineCreate],
    db: Session = Depends(deps.get_db)
):
    """가져온 루틴 데이터를 데이터베이스에 추가"""
    try:
        imported_routines = []
        skipped_routines = []
        
        for routine in routines:
            # 동일한 제목의 루틴이 있는지 확인
            existing_routine = routine_crud.get_routine_by_title(db, routine.title)
            
            if existing_routine:
                # 이미 존재하는 루틴은 건너뛰기
                skipped_routines.append(routine.title)
                continue
            
            # 새로운 루틴 추가
            db_routine = routine_crud.create_routine(db, routine)
            imported_routines.append(db_routine)
        
        return {
            "imported": len(imported_routines),
            "skipped": skipped_routines,
            "routines": imported_routines
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to import routines: {str(e)}"
        )