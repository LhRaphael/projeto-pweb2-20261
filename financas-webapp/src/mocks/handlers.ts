import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/goals', () => {
    return HttpResponse.json([])
  }),
]