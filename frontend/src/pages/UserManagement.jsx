import { useState, useEffect } from "react";
import axios from "axios";
import { roleService } from '../services/roleService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const API = "http://localhost:8080";

const avatarColors = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];

function Avatar({ name, picture, size = 40 }) {
  if (picture) {
    return (
      <img src={picture} alt={name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />
    );
  }
  const initials = name
    ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const color = avatarColors[initials.charCodeAt(0) % avatarColors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: "700", fontSize: size * 0.35, flexShrink: 0
    }}>{initials}</div>
  );
}

const ROLE_DESCRIPTIONS = {
  ADMIN: "Full access to all features and settings.",
  TECHNICIAN: "Can manage services and tasks.",
  USER: "Basic access to the platform.",
};

// const ALL_ROLES = [
//   { name: "ADMIN", description: ROLE_DESCRIPTIONS.ADMIN },
//   { name: "TECHNICIAN", description: ROLE_DESCRIPTIONS.TECHNICIAN },
//   { name: "USER", description: ROLE_DESCRIPTIONS.USER },
// ];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => {
    roleService.getAllRoles()
      .then(setRoles)
      .catch(err => console.error("Failed to load roles", err));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // const fetchUsers = () => {
  //   axios.get(`${API}/api/users`, { withCredentials: true })
  //     .then(res => { setUsers(res.data); setLoading(false); })
  //     .catch(() => setLoading(false));
  // };
  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (userId, roleId) => {
    try {
      await roleService.removeRoleFromUser(userId, roleId);
      // Refresh user details after removal
      const updatedUser = await userService.getUserById(userId);
      setSelectedUser(updatedUser);
    } catch (err) {
      console.error("Failed to remove role", err);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    // If user has roles, store the first role ID
    if (user.roles && user.roles.length > 0) {
      setSelectedRole(user.roles[0].id); // numeric ID
    } else {
      setSelectedRole(null);
    }
    setDropdownOpen(false);
  };

  // const updateRole = async () => {
  //   if (!selectedUser || !selectedRole) return;
  //   try {
  //     await roleService.assignRole(selectedUser.id, selectedRole);
  //     showToast("Role updated successfully!");
  //     fetchUsers(); // refresh list
  //   } catch (err) {
  //     if (err.response?.status === 400 && err.response?.data?.error) {
  //       // Show the backend error message as a notification
  //       showToast(err.response.data.error, "error");
  //     } else {
  //       showToast("Failed to update role", "error");
  //     }
  //   }
  // };
  const updateRole = async () => {
  if (!selectedUser || !selectedRole) return;
  try {
    await roleService.assignRole(selectedUser.id, selectedRole);
    showToast("Role updated successfully!");

    // Refresh the full users list
    fetchUsers();

    // ✅ Refresh the selected user details
    const updatedUser = await userService.getUserById(selectedUser.id);
    setSelectedUser(updatedUser);

  } catch (err) {
    if (err.response?.status === 400 && err.response?.data?.error) {
      showToast(err.response.data.error, "error");
    } else {
      showToast("Failed to update role", "error");
    }
  }
};

  const filteredUsers = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          padding: "12px 20px", borderRadius: 8, fontWeight: 600,
          background: toast.type === "success" ? "#1a5c3a" : "#dc2626",
          color: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#111" }}>
          User Management
        </h1>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.95rem" }}>
          Manage users and their roles
        </p>
      </div>

      {/* Two panel layout */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>

        {/* LEFT — User List */}
        <div style={{
          background: "white", borderRadius: 12,
          boxShadow: "0 1px 8px rgba(0,0,0,0.08)", overflow: "hidden"
        }}>
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "1rem", fontWeight: 600, color: "#111" }}>
              Users
            </h3>
            <div style={{ position: "relative" }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                style={{
                  width: "100%", padding: "9px 36px 9px 12px",
                  border: "1px solid #e5e7eb", borderRadius: 8,
                  fontSize: "0.88rem", outline: "none",
                  boxSizing: "border-box", background: "#f9fafb", color: "#111"
                }}
              />
              <span style={{
                position: "absolute", right: 10, top: "50%",
                transform: "translateY(-50%)", color: "#9ca3af"
              }}>🔍</span>
            </div>
          </div>

          <div style={{ maxHeight: 480, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>No users found</div>
            ) : filteredUsers.map(user => (
              <div key={user.id} onClick={() => selectUser(user)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", cursor: "pointer",
                borderBottom: "1px solid #f9fafb",
                background: selectedUser?.id === user.id ? "#eff6ff" : "white",
                borderLeft: selectedUser?.id === user.id
                  ? "3px solid #2563eb" : "3px solid transparent",
                transition: "background 0.15s"
              }}>
                <Avatar name={user.name} picture={user.picture} size={42} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#111" }}>
                    {user.name || "Unknown"}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>
                    {user.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — User Details */}
        {selectedUser ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* User Details Card */}
            <div style={{
              background: "white", borderRadius: 12,
              boxShadow: "0 1px 8px rgba(0,0,0,0.08)", padding: 24
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 700, color: "#111" }}>
                User Details
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Avatar name={selectedUser.name} picture={selectedUser.picture} size={64} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111" }}>
                      {selectedUser.name}
                    </span>
                    <span style={{
                      background: "#dcfce7", color: "#16a34a",
                      padding: "2px 10px", borderRadius: 20,
                      fontSize: "0.75rem", fontWeight: 600
                    }}>Active</span>
                  </div>
                  <div style={{ color: "#4b5563", fontSize: "0.88rem" }}>{selectedUser.email}</div>
                  <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: 4 }}>
                    {selectedUser.createdAt && (
                      <>Joined on {new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })} • </>
                    )}
                    ID: {selectedUser.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Roles Card */}
            <div style={{
              background: "white", borderRadius: 12,
              boxShadow: "0 1px 8px rgba(0,0,0,0.08)", padding: 24
            }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 700, color: "#111" }}>
                Assigned Roles
              </h3>
              <div style={{ marginTop: 20 }}>
                {selectedUser.roles && selectedUser.roles.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {selectedUser.roles.map(role => (
                      <li key={role.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "#f9fafb", borderRadius: 8, padding: "6px 12px", marginBottom: 6
                      }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#111" }}>
                          {role.name}
                        </span>
                        <button
                          onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                          style={{
                            background: "transparent", border: "none", color: "#ef4444",
                            fontSize: "0.8rem", cursor: "pointer", fontWeight: 600
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>No roles assigned</p>
                )}
              </div>
              <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "0.85rem" }}>
                Select roles to assign to this user.
              </p>

              {/* Dropdown trigger */}
              <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                border: "1px solid #e5e7eb", borderRadius: dropdownOpen ? "8px 8px 0 0" : 8,
                padding: "10px 14px", display: "flex", alignItems: "center",
                justifyContent: "space-between", cursor: "pointer",
                background: "#f9fafb", marginBottom: 0
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{
                    background: "#dbeafe", color: "#1d4ed8",
                    padding: "3px 12px", borderRadius: 20,
                    fontSize: "0.8rem", fontWeight: 600
                  }}>
                    {roles.find(r => r.id === selectedRole)?.name || "Select a role"}
                    <span
                      onClick={e => { e.stopPropagation(); }}
                      style={{ marginLeft: 6, cursor: "default" }}>
                    </span>
                  </span>
                </div>
                <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>▼</span>
              </div>

              {/* Dropdown options */}
              {dropdownOpen && (
                <div style={{
                  border: "1px solid #e5e7eb", borderTop: "none",
                  borderRadius: "0 0 8px 8px", background: "white", marginBottom: 16
                }}>
                  {roles.map(role => (
                    <label key={role.id} style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "12px 16px", cursor: "pointer",
                      borderBottom: "1px solid #f9fafb",
                      background: selectedRole === role.name ? "#eff6ff" : "white"
                    }}>
                      <input
                        type="radio"
                        name="role"
                        checked={selectedRole === role.id}
                        onChange={() => setSelectedRole(role.id)}
                        style={{ marginTop: 3, accentColor: "#2563eb", cursor: "pointer" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111" }}>
                          {role.name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>
                          {role.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button onClick={() => {
                  setSelectedRole(selectedUser.role);
                  setDropdownOpen(false);
                }} style={{
                  padding: "9px 22px", borderRadius: 8,
                  border: "1px solid #e5e7eb", background: "white",
                  cursor: "pointer", fontWeight: 600, fontSize: "0.88rem", color: "#374151"
                }}>Cancel</button>
                <button onClick={() => { updateRole(); setDropdownOpen(false); }} style={{
                  padding: "9px 22px", borderRadius: 8, border: "none",
                  background: "#2563eb", color: "white",
                  cursor: "pointer", fontWeight: 600, fontSize: "0.88rem"
                }}>Update Roles</button>
              </div>
            </div>

            {/* Role Assignment History
            <div style={{
              background: "white", borderRadius: 12,
              boxShadow: "0 1px 8px rgba(0,0,0,0.08)", padding: 24
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 700, color: "#111" }}>
                Role Assignment History
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                    {["Role", "Assigned At", "Assigned By"].map(h => (
                      <th key={h} style={{
                        padding: "8px 12px", textAlign: "left",
                        fontSize: "0.82rem", color: "#6b7280", fontWeight: 600
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "12px", fontSize: "0.88rem", color: "#111" }}>
                      {selectedUser.role}
                    </td>
                    <td style={{ padding: "12px", fontSize: "0.88rem", color: "#4b5563" }}>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        }) : "—"}
                    </td>
                    <td style={{ padding: "12px", fontSize: "0.88rem", color: "#4b5563" }}>
                      Admin User
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> */}

          </div>
        ) : (
          <div style={{
            background: "white", borderRadius: 12,
            boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: 80, color: "#9ca3af", textAlign: "center"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>👤</div>
            <p style={{ fontSize: "1rem", fontWeight: 500, margin: 0 }}>
              Select a user to view details
            </p>
            <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
              Click any user from the list on the left
            </p>
          </div>
        )}
      </div>
    </div>
  );
}