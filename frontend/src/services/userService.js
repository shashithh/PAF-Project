import api from './axiosInstance';

// ============================================================
// Resource API calls
// ============================================================


export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('api/users');
    return response.data;
  },

  // Get user by id with roles
  getUserById: async (id) => {
    const response = await api.get(`api/users/${id}`);
    return response.data;
  },

  // Get all roles
  getAllRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  // Update user roles
  updateUserRoles: async (userId, roleIds) => {
    const response = await api.put(`api/users/${userId}/roles`, { roleIds });
    return response.data;
  },

  // Assign single role
  assignRole: async (userId, roleId) => {
    const response = await api.post(`api/users/${userId}/roles`, { roleId });
    return response.data;
  },

  // Get role history
  getRoleHistory: async (userId) => {
    const response = await api.get(`api/users/${userId}/roles/history`);
    return response.data;
  },
};