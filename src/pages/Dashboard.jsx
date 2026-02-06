import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, MapPin, CheckCircle } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDrivers: 0,
        totalRides: 0,
        completedRides: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
            setStats(prev => ({ ...prev, totalUsers: snap.size }));
        });

        const unsubDrivers = onSnapshot(collection(db, "drivers"), (snap) => {
            setStats(prev => ({ ...prev, totalDrivers: snap.size }));
        });

        const unsubRides = onSnapshot(collection(db, "ride_requests"), (snap) => {
            const completed = snap.docs.filter(doc => doc.data().status === 'completed').length;
            setStats(prev => ({
                ...prev,
                totalRides: snap.size,
                completedRides: completed
            }));
            setLoading(false);
        });

        return () => {
            unsubUsers();
            unsubDrivers();
            unsubRides();
        };
    }, []);

    if (loading) {
        return <div className="p-8">Loading dashboard metrics...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDrivers}</div>
                        <p className="text-xs text-muted-foreground">Registered drivers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ride Requests</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRides}</div>
                        <p className="text-xs text-muted-foreground">All time requests</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Rides</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedRides}</div>
                        <p className="text-xs text-muted-foreground">Successfully dropped off</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
