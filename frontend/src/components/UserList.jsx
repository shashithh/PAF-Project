import React, { useState } from 'react';

const UserList = ({ users, selectedUser, onSelectUser, loading }) => {
  const [search, setSearch] = useState('');

  const filtered = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          👥 Users
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({users.length})
          </span>
        </h2>
        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 
            text-sm focus:outline-none focus:ring-2 focus:ring-green-500
            focus:border-transparent"
        />
      </div>

      {/* User List */}
      <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
        {loading ? (
          <div className="p-4 text-center text-gray-400">
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No users found
          </div>
        ) : (
          filtered.map(user => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer 
                border-b border-gray-50 transition-all hover:bg-green-50
                ${selectedUser?.id === user.id
                  ? 'bg-green-50 border-l-4 border-l-green-600'
                  : ''}`}
            >
              {/* Avatar */}
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-600 
                  flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {user.email}
                </p>
              </div>

              {/* Role badges */}
              <div className="flex flex-col gap-1">
                {user.roles?.slice(0, 2).map(role => (
                  <span key={role.id}
                    className="text-xs px-2 py-0.5 rounded-full bg-green-100 
                      text-green-700 font-medium">
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;