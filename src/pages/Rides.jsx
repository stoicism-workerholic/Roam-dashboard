import { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import { Search, Pencil, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";



export default function Rides() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRide, setEditingRide] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "ride_requests"), (snapshot) => {
            const ridesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRides(ridesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this ride request?")) {
            try {
                await deleteDoc(doc(db, "ride_requests", id));
            } catch (error) {
                console.error("Error deleting ride:", error);
                alert("Failed to delete ride");
            }
        }
    };

    const handleEditClick = (ride) => {
        setEditingRide({ ...ride });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingRide) return;

        try {
            const rideRef = doc(db, "ride_requests", editingRide.id);
            const { id, createdAt, acceptedAt, ...updateData } = editingRide;

            await updateDoc(rideRef, updateData);
            setIsEditDialogOpen(false);
            setEditingRide(null);
        } catch (error) {
            console.error("Error updating ride:", error);
            alert("Failed to update ride");
        }
    };

    const filteredRides = rides.filter((ride) =>
        ride.pickup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.dropoff?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        if (isNaN(date.getTime())) return "Invalid Date";
        return format(date, "MMM d, yyyy, h:mm a");
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return <Badge className="bg-green-600 hover:bg-green-700">Accepted</Badge>;
            case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
            case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
            case 'completed': return <Badge variant="outline" className="border-blue-500 text-blue-500">Completed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    }

    if (loading) {
        return <div className="p-4">Loading rides...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Ride Requests</h2>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search pickup/dropoff..."
                        className="pl-8 w-[250px] md:w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Pickup</TableHead>
                            <TableHead>Dropoff</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rider ID</TableHead>
                            <TableHead>Driver ID</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRides.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                    No rides found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRides.map((ride) => (
                                <TableRow key={ride.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {ride.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={ride.pickup}>{ride.pickup}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={ride.dropoff}>{ride.dropoff}</TableCell>
                                    <TableCell>{getStatusBadge(ride.status)}</TableCell>
                                    <TableCell className="font-mono text-xs">{ride.riderId ? ride.riderId.substring(0, 6) + '...' : 'N/A'}</TableCell>
                                    <TableCell className="font-mono text-xs">{ride.driverId ? ride.driverId.substring(0, 6) + '...' : 'Pending'}</TableCell>
                                    <TableCell className="whitespace-nowrap">{formatDate(ride.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditClick(ride)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(ride.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Ride Request</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pickup">Pickup Location</Label>
                            <Input
                                id="pickup"
                                value={editingRide?.pickup || ""}
                                onChange={(e) =>
                                    setEditingRide({ ...editingRide, pickup: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dropoff">Dropoff Location</Label>
                            <Input
                                id="dropoff"
                                value={editingRide?.dropoff || ""}
                                onChange={(e) =>
                                    setEditingRide({ ...editingRide, dropoff: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={editingRide?.status || "pending"}
                                onChange={(e) =>
                                    setEditingRide({ ...editingRide, status: e.target.value })
                                }
                            >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="driverId">Driver ID</Label>
                            <Input
                                id="driverId"
                                value={editingRide?.driverId || ""}
                                onChange={(e) =>
                                    setEditingRide({ ...editingRide, driverId: e.target.value })
                                }
                                placeholder="Optional"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
