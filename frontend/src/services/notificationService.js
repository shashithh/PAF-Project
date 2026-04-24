import api from "./axiosInstance";

// ============================================================
// Notification API calls
// ============================================================

export const notificationService = {
  // Get all notifications for the logged-in user email
  getNotificationsByEmail: async (email) => {
    const response = await api.get(`/api/notifications/${email}`);
    return response.data;
  },

//   // Get unread count
//   getUnreadCount: async () => {
//     const response = await api.get("/api/notifications/unread-count");
//     return response.data;
//   },

//   // Mark one notification as read
//   markAsRead: async (id) => {
//     const response = await api.put(`/api/notifications/${id}/read`);
//     return response.data;
//   },

//   // Mark all notifications as read
//   markAllAsRead: async () => {
//     const response = await api.put("/api/notifications/read-all");
//     return response.data;
//   },

//   // Create a new notification
//   createNotification: async (message, type) => {
//     const response = await api.post("/api/notifications", { message, type });
//     return response.data;
//   }
};
