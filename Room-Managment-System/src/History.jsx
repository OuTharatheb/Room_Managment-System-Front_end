import { useEffect, useMemo, useState } from "react";
import "./History.css";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRoom, setFilterRoom] = useState("all");
  const [bookingHistory, setBookingHistory] = useState([]);

  const loadBookingHistory = () => {
    const saved = localStorage.getItem("bookingHistory");
    const parsed = saved ? JSON.parse(saved) : [];

    return parsed.map((booking) => {
      const checkInDate = booking.checkInDate || "";
      const checkOutDate = booking.checkOutDate || "";
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const hasValidDates =
        !Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime());
      const nights = hasValidDates
        ? Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        ...booking,
        guestEmail: booking.email || booking.guestEmail || "-",
        guestPhone: booking.phone || booking.guestPhone || "-",
        checkInTime: booking.checkInTime || "--",
        checkOutTime: booking.checkOutTime || "--",
        duration: `${nights} ${nights === 1 ? "night" : "nights"}`,
        totalCost: booking.totalCost || "$0",
      };
    });
  };

  useEffect(() => {
    const refreshHistory = () => setBookingHistory(loadBookingHistory());

    refreshHistory();
    window.addEventListener("bookings-updated", refreshHistory);
    window.addEventListener("storage", refreshHistory);

    return () => {
      window.removeEventListener("bookings-updated", refreshHistory);
      window.removeEventListener("storage", refreshHistory);
    };
  }, []);

  const rooms = useMemo(() => {
    const roomSet = new Set(
      bookingHistory.map((booking) => booking.roomNo).filter(Boolean),
    );
    return ["all", ...Array.from(roomSet).sort()];
  }, [bookingHistory]);

  const filteredHistory = bookingHistory.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = filterRoom === "all" || booking.roomNo === filterRoom;
    return matchesSearch && matchesRoom;
  });

  const calculateRevenue = () => {
    return filteredHistory.reduce((sum, booking) => {
      const cost =
        Number(String(booking.totalCost).replace(/[^0-9.-]/g, "")) || 0;
      return sum + cost;
    }, 0);
  };

  return (
    <div className="booking-history">
      {/* Header */}
      <div className="history-header">
        <div className="header-content">
          <div className="header-copy">
            <h1>Booking History</h1>
          </div>
          <p>View all past bookings and guest check-out records</p>
        </div>
      </div>

      {/* Stats */}
      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-label">Total Check-outs</div>
          <div className="stat-value">{filteredHistory.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${calculateRevenue()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Stay</div>
          <div className="stat-value">
            {filteredHistory.length > 0
              ? (
                  filteredHistory.reduce(
                    (sum, b) => sum + parseInt(b.duration),
                    0,
                  ) / filteredHistory.length
                ).toFixed(1)
              : 0}{" "}
            nights
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="history-main">
        {/* History Section */}
        <div className="history-section">
          <div className="section-header">
            <h2>Check-out Records ({filteredHistory.length})</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search by guest name or email..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
              >
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room === "all" ? "All Rooms" : room}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* History Table */}
          <div className="history-container">
            {filteredHistory.length === 0 ? (
              <div className="empty-state">
                <p>No booking history found.</p>
              </div>
            ) : (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Guest Information</th>
                      <th>Room</th>
                      <th>Check-in / Check-out</th>
                      <th>Duration</th>
                      <th>Times</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((booking) => (
                      <tr key={booking.id} className="history-row">
                        <td className="guest-info-cell">
                          <div className="guest-name">{booking.guestName}</div>
                          <div className="guest-details">
                            {booking.guestEmail}
                            <br />
                            {booking.guestPhone}
                          </div>
                        </td>
                        <td className="room-cell">
                          <span className="room-badge">{booking.roomNo}</span>
                        </td>
                        <td className="dates-cell">
                          <div className="date-info">
                            Check-in:{" "}
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </div>
                          <div className="date-info">
                            Check-out:{" "}
                            {new Date(
                              booking.checkOutDate,
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="duration-cell">
                          <span className="duration-badge">
                            {booking.duration}
                          </span>
                        </td>
                        <td className="times-cell">
                          <div className="time-info">
                            In: {booking.checkInTime}
                          </div>
                          <div className="time-info">
                            Out: {booking.checkOutTime}
                          </div>
                        </td>
                        <td className="revenue-cell">
                          <span className="revenue-badge">
                            {booking.totalCost}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
