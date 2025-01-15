import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const routineApi = {
  // 모든 루틴 조회
  getAll: () => api.get('/routines'),
  
  // 특정 루틴 조회
  getById: (id) => api.get(`/routines/${id}`),
  
  // 새 루틴 생성
  create: (routine) => api.post('/routines', routine),
  
  // 루틴 수정
  update: (id, routine) => api.put(`/routines/${id}`, routine),
  
  // 루틴 삭제
  delete: (id) => api.delete(`/routines/${id}`),
  
  // 루틴 완료 체크
  completeRoutine: (id, date) => api.post(`/routines/${id}/complete/${date}`),

  // 루틴 완료 해제
  uncompleteRoutine: (id, date) => api.post(`/routines/${id}/uncomplete/${date}`),

  // 통계 조회
  getStatistics: () => api.get('/routines/statistics'),

  importRoutines: (routines) => api.post(`/routines/import`, routines)

};