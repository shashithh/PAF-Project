import api from './axiosInstance';

// ============================================================
// Resource API calls
// ============================================================

/**
 * Fetch all resources with optional filters.
 * GET /api/resources?type=LAB&status=ACTIVE&location=...&minCapacity=50
 */
export async function fetchResources(filters = {}) {
  const params = {}
  if (filters.type) params.type = filters.type
  if (filters.location) params.location = filters.location
  if (filters.status) params.status = filters.status
  if (filters.minCapacity) params.minCapacity = filters.minCapacity

  const response = await api.get('/api/resources', { params })
  return response.data // ApiResponse<List<ResourceResponseDto>>
}

/**
 * Fetch a single resource by ID.
 * GET /api/resources/{id}
 */
export async function fetchResourceById(id) {
  const response = await api.get(`/api/resources/${id}`)
  return response.data
}

/**
 * Create a new resource.
 * POST /api/resources
 */
export async function createResource(data) {
  const response = await api.post('/api/resources', data)
  return response.data
}

/**
 * Update an existing resource.
 * PUT /api/resources/{id}
 */
export async function updateResource(id, data) {
  const response = await api.put(`/api/resources/${id}`, data)
  return response.data
}

/**
 * Delete a resource.
 * DELETE /api/resources/{id}
 */
export async function deleteResource(id) {
  await api.delete(`/api/resources/${id}`)
}

/**
 * Update resource status (ACTIVE / OUT_OF_SERVICE).
 * PATCH /api/resources/{id}/status?status=OUT_OF_SERVICE
 */
export async function updateResourceStatus(id, status) {
  const response = await api.patch(`/api/resources/${id}/status`, null, {
    params: { status },
  })
  return response.data
}

/**
 * Fetch analytics for dashboard widget.
 * GET /api/resources/analytics
 */
export async function fetchAnalytics() {
  const response = await api.get('/api/resources/analytics')
  return response.data
}



// import axios from 'axios'

// const BASE_URL = 'http://localhost:8080'

// function getAxios(jwtToken) {
//   return axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: jwtToken ? `Bearer ${jwtToken}` : undefined,
//     },
//   })
// }

// // ============================================================
// // Resource API calls
// // ============================================================

// /**
//  * Fetch all resources with optional filters.
//  * GET /api/resources?type=LAB&status=ACTIVE&location=...&minCapacity=50
//  */
// export async function fetchResources(auth, filters = {}) {
//   const params = {}
//   if (filters.type) params.type = filters.type
//   if (filters.location) params.location = filters.location
//   if (filters.status) params.status = filters.status
//   if (filters.minCapacity) params.minCapacity = filters.minCapacity

//   const response = await getAxios(auth).get('/api/resources', { params })
//   return response.data // ApiResponse<List<ResourceResponseDto>>
// }

// /**
//  * Fetch a single resource by ID.
//  * GET /api/resources/{id}
//  */
// export async function fetchResourceById(auth, id) {
//   const response = await getAxios(auth).get(`/api/resources/${id}`)
//   return response.data
// }

// /**
//  * Create a new resource.
//  * POST /api/resources
//  */
// export async function createResource(auth, data) {
//   const response = await getAxios(auth).post('/api/resources', data)
//   return response.data
// }

// /**
//  * Update an existing resource.
//  * PUT /api/resources/{id}
//  */
// export async function updateResource(auth, id, data) {
//   const response = await getAxios(auth).put(`/api/resources/${id}`, data)
//   return response.data
// }

// /**
//  * Delete a resource.
//  * DELETE /api/resources/{id}
//  */
// export async function deleteResource(auth, id) {
//   await getAxios(auth).delete(`/api/resources/${id}`)
// }

// /**
//  * Update resource status (ACTIVE / OUT_OF_SERVICE).
//  * PATCH /api/resources/{id}/status?status=OUT_OF_SERVICE
//  */
// export async function updateResourceStatus(auth, id, status) {
//   const response = await getAxios(auth).patch(`/api/resources/${id}/status`, null, {
//     params: { status },
//   })
//   return response.data
// }

// /**
//  * Fetch analytics for dashboard widget.
//  * GET /api/resources/analytics
//  */
// export async function fetchAnalytics(auth) {
//   const response = await getAxios(auth).get('/api/resources/analytics')
//   return response.data
// }
