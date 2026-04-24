import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';

const UserDetails = ({ user, roles, onRolesUpdated, showToast }) => {
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [roleHistory, setRoleHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Set current roles as selected
      const currentRoleIds = user.roles?.map(r => r.id) || [];
      setSelectedRoleIds(currentRoleIds);
      fetchRoleHistory();
    }
  }, [user]);

  const fetchRoleHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const history = await userService.getRoleHistory(user.id);
      setRoleHistory(history);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRoleToggle = (roleId) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleUpdateRoles = async () => {
    setLoading(true);
    try {
      await userService.updateUserRoles(user.id, selectedRoleIds);
      showToast('Roles updated successfully!', 'success');
      onRolesUpdated();
      fetchRoleHistory();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 
        h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-5xl mb-3">👤</div>
          <p className="text-lg font-medium">Select a user</p>
          <p className="text-sm">Click on a user to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 
      h-full overflow-y-auto">

      {/* User Profile */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {user.picture ? (
            <img src={user.picture} alt={user.name}
              className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-600 
              flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">
                {user.name}
              </h2>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 
                text-xs rounded-full font-medium">
                Active
              </span>
            </div>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-400 text-xs mt-1">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Current Role Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {user.roles?.map(role => (
            <span key={role.id}
              className="px-3 py-1 bg-green-600 text-white 
                text-sm rounded-full font-medium">
              {role.name}
            </span>
          ))}
          {user.roles?.length === 0 && (
            <span className="text-gray-400 text-sm">No roles assigned</span>
          )}
        </div>
      </div>

      {/* Role Assignment */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          🎭 Assign Roles
        </h3>

        {/* Selected Role Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-8">
          {selectedRoleIds.map(id => {
            const role = roles.find(r => r.id === id);
            return role ? (
              <span key={id}
                className="px-3 py-1 bg-blue-100 text-blue-700 
                  text-sm rounded-full font-medium flex items-center gap-1">
                {role.name}
                <button onClick={() => handleRoleToggle(id)}
                  className="ml-1 text-blue-400 hover:text-blue-700">
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>

        {/* Role Checkboxes */}
        <div className="space-y-2 mb-4">
          {roles.map(role => (
            <label key={role.id}
              className="flex items-center gap-3 p-3 rounded-lg 
                border border-gray-100 cursor-pointer hover:bg-gray-50 
                transition-all">
              <input
                type="checkbox"
                checked={selectedRoleIds.includes(role.id)}
                onChange={() => handleRoleToggle(role.id)}
                className="w-4 h-4 accent-green-600"
              />
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  {role.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {role.description}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdateRoles}
          disabled={loading}
          className="w-full py-2.5 bg-green-600 text-white rounded-lg 
            font-medium hover:bg-green-700 transition-all disabled:opacity-50
            disabled:cursor-not-allowed">
          {loading ? 'Updating...' : '✅ Update Roles'}
        </button>
      </div>

      {/* Role History */}
      <div className="p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          📋 Role History
        </h3>

        {historyLoading ? (
          <div className="text-center text-gray-400 py-4">Loading...</div>
        ) : roleHistory.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No role history found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 rounded-lg">
                  <th className="px-4 py-2 text-left text-gray-600 
                    font-medium">Role</th>
                  <th className="px-4 py-2 text-left text-gray-600 
                    font-medium">Assigned At</th>
                </tr>
              </thead>
              <tbody>
                {roleHistory.map(history => (
                  <tr key={history.id}
                    className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-green-100 
                        text-green-700 rounded-full text-xs font-medium">
                        {history.role?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(history.assignedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
