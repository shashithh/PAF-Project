// src/services/roleService.js
import api from './axiosInstance';

export const roleService = {
  // Get all roles
  getAllRoles: async () => {
    const response = await api.get('api/roles'); // backend exposes GET /api/roles
    return response.data;
  },

  // Assign a single role to a user
  assignRole: async (userId, roleId) => {
    const response = await api.post(`api/users/${userId}/roles`, { roleId });
    return response.data;
  },

  // Remove a role from a user
  removeRoleFromUser: async (userId, roleId) => {
    const response = await api.delete(`api/remove/role`, { data: { userId, roleId } });
    return response.data;
  },
};