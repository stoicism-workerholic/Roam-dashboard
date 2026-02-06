export const MOCK_USERS = [
    { id: "user-1", name: "Alice Johnson", email: "alice@example.com", phone: "+1234567890", role: "rider", createdAt: new Date().toISOString() },
    { id: "user-2", name: "Bob Smith", email: "bob@example.com", phone: "+0987654321", role: "driver", numberPlate: "ABC-1234", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "user-3", name: "Charlie Brown", email: "charlie@example.com", phone: "+1122334455", role: "admin", createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const MOCK_RIDES = [
    { id: "ride-1", pickup: "Central Station", dropoff: "Airport Terminal 1", status: "completed", riderId: "user-1", driverId: "user-2", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "ride-2", pickup: "Downtown Mall", dropoff: "Suburbia", status: "pending", riderId: "user-1", driverId: null, createdAt: new Date().toISOString() },
    { id: "ride-3", pickup: "The Grand Hotel", dropoff: "City Park", status: "accepted", riderId: "user-3", driverId: "user-2", createdAt: new Date(Date.now() - 1800000).toISOString() },
];

export const MOCK_DRIVERS = [
    { id: "user-2", notificationsEnabled: true },
    { id: "driver-x", notificationsEnabled: false },
];

export const MOCK_TOKENS = [
    { id: "token-1", token: "exp_1234567890" },
    { id: "token-2", token: "exp_0987654321" },
];
