import { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";  //import your context hook

export default function Notifications() {
    const { user } = useAuth();   // get current user from context
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("");   // define filterType
    const [filterDate, setFilterDate] = useState("");   // define filterDate

    useEffect(() => {
        if (user?.email) {
            fetchNotifications(user.email);
        }
    }, [user]);

    const fetchNotifications = async (email) => {
        try {
            const data = await notificationService.getNotificationsByEmail(email);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load notifications", err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesType = filterType ? n.type === filterType : true;
        const matchesDate = filterDate
            ? new Date(n.createdAt).toLocaleDateString("en-CA") === filterDate
            : true;
        return matchesType && matchesDate;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Notifications Card */}
            <div style={{
                background: "white", borderRadius: 12,
                boxShadow: "0 1px 8px rgba(0,0,0,0.08)", padding: 24
            }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "1rem", fontWeight: 700, color: "#111" }}>
                    Notifications
                </h3>

                {/* Filters */}
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        style={{
                            border: "1px solid #e5e7eb", borderRadius: 8,
                            padding: "8px 12px", background: "#f9fafb", cursor: "pointer"
                        }}
                    >
                        <option value="">All Types</option>
                        <option value="BOOKING_APPROVED">Booking Approved</option>
                        <option value="BOOKING_REJECTED">Booking Rejected</option>
                        <option value="TICKET_STATUS_CHANGED">Ticket Status Changed</option>
                        <option value="NEW_COMMENT">New Comment</option>
                    </select>

                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        style={{
                            border: "1px solid #e5e7eb", borderRadius: 8,
                            padding: "8px 12px", background: "#f9fafb"
                        }}
                    />
                </div>

                {/* Notification Table */}
                {loading ? (
                    <div style={{ color: "#6b7280" }}>Loading...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div style={{ color: "#6b7280" }}>No notifications found.</div>
                ) : (
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8 }}>
                        {filteredNotifications.map(n => (
                            <div key={n.id} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "12px 16px", borderBottom: "1px solid #f3f4f6",
                                background: n.isRead ? "white" : "#f0f9ff"
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111" }}>
                                        {n.message}
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: 2 }}>
                                        {n.type} • {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <span style={{
                                    background: n.isRead ? "#e5e7eb" : "#dbeafe",
                                    color: n.isRead ? "#374151" : "#1d4ed8",
                                    padding: "2px 10px", borderRadius: 20,
                                    fontSize: "0.75rem", fontWeight: 600
                                }}>
                                    {n.isRead ? "Read" : "Unread"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
