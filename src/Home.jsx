import { useEffect, useState } from "react";
import singleRoomImage from "../assets/Single.jpg";
import doubleRoomImage from "../assets/Double Room.jpg";
import suiteRoomImage from "../assets/Suit.jpg";
import "./Home.css";

const roomRates = {
  "Single Room 101": 100,
  "Single Room 102": 100,
  "Double Room 201": 180,
  "Double Room 202": 180,
  "Suite 301": 250,
  "Suite 302": 250,
};

const formatCurrency = (amount) => `$${amount}`;
const getRoomRate = (roomName) => roomRates[roomName] ?? 0;

export default function Home() {
  const [bookingsVersion, setBookingsVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const onBookingsUpdated = () => setBookingsVersion((v) => v + 1);
    window.addEventListener("bookings-updated", onBookingsUpdated);
    window.addEventListener("storage", onBookingsUpdated);
    return () => {
      window.removeEventListener("bookings-updated", onBookingsUpdated);
      window.removeEventListener("storage", onBookingsUpdated);
    };
  }, []);

  const rooms = [
    {
      id: 1,
      name: "Single Room 101",
      capacity: 1,
      status: "available",
      floor: "1st",
      image: singleRoomImage,
    },
    {
      id: 2,
      name: "Single Room 102",
      capacity: 1,
      status: "available",
      floor: "1st",
      image: singleRoomImage,
    },
    {
      id: 3,
      name: "Double Room 201",
      capacity: 2,
      status: "available",
      floor: "2nd",
      image: doubleRoomImage,
    },
    {
      id: 4,
      name: "Double Room 202",
      capacity: 2,
      status: "available",
      floor: "2nd",
      image: doubleRoomImage,
    },
    {
      id: 5,
      name: "Suite 301",
      capacity: 3,
      status: "available",
      floor: "3rd",
      image: suiteRoomImage,
    },
    {
      id: 6,
      name: "Suite 302",
      capacity: 3,
      status: "available",
      floor: "3rd",
      image: suiteRoomImage,
    },
  ];

  // Calculate stats based on current bookings
  function getStats() {
    void bookingsVersion;
    const activeBookings = JSON.parse(
      localStorage.getItem("activeBookings") || "[]",
    );
    const bookedRoomNames = new Set(
      activeBookings.map((booking) => booking.roomNo),
    );
    const bookedCount = bookedRoomNames.size;
    const totalGuests = activeBookings.reduce(
      (sum, booking) => sum + (parseInt(booking.guests, 10) || 0),
      0,
    );

    const availableCount = 6 - bookedCount;
    return [
      { label: "Total Rooms", value: 6 },
      {
        label: "Available",
        value: availableCount,
      },
      { label: "Booked", value: bookedCount },
      { label: "Guests", value: totalGuests },
    ];
  }

  const stats = getStats();

  const getStatusClass = (status) => {
    return `status status-${status}`;
  };

  const filteredRooms = rooms.filter((room) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch === "" ||
      room.name.toLowerCase().includes(normalizedSearch);
    const matchesStatus =
      selectedStatus === "" || room.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Hotel Room Booking System</h1>
            <p>
              Receptionist booking system for guests - Manage rooms efficiently
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        {/* Statistics Cards */}
        <section className="stats-section">
          <h2>Overview</h2>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms Section */}
        <section className="rooms-section">
          <div className="section-header">
            <h2>Rooms</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search rooms..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Rooms Table */}
          <div className="rooms-container">
            <div className="rooms-list">
              {filteredRooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-media-wrap">
                    <img
                      className="room-image"
                      src={room.image}
                      alt={`${room.name} view`}
                      loading="lazy"
                    />
                    <h3>{room.name}</h3>
                  </div>
                  <div className="room-status-line">
                    <span className={getStatusClass(room.status)}>
                      {room.status.charAt(0).toUpperCase() +
                        room.status.slice(1)}
                    </span>
                  </div>
                  <div className="room-details">
                    <div className="detail-item">
                      <span className="detail-label">Capacity</span>
                      <span className="detail-value">
                        {room.capacity} people
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Floor</span>
                      <span className="detail-value">{room.floor}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price</span>
                      <span className="detail-value">{formatCurrency(getRoomRate(room.name))}/night</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredRooms.length === 0 && (
                <p className="no-rooms-message">
                  No rooms match your search and status filters.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
