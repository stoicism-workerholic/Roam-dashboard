import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";



export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "drivers"), (snapshot) => {
            const driversData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDrivers(driversData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleNotificationToggle = async (driver, checked) => {
        try {
            const driverRef = doc(db, "drivers", driver.id);
            await updateDoc(driverRef, { notificationsEnabled: checked });
        } catch (error) {
            console.error("Error updating notification settings:", error);
            alert("Failed to update notification settings");
        }
    }

    const filteredDrivers = drivers.filter((driver) =>
        driver.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-4">Loading drivers...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Drivers</h2>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search driver ID..."
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
                            <TableHead>Driver ID</TableHead>
                            <TableHead>Notifications Enabled</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDrivers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                    No drivers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDrivers.map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell className="font-mono text-sm">{driver.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id={`notify-${driver.id}`}
                                                checked={driver.notificationsEnabled || false}
                                                onCheckedChange={(checked) => handleNotificationToggle(driver, checked)}
                                            />
                                            <label htmlFor={`notify-${driver.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {driver.notificationsEnabled ? "Enabled" : "Disabled"}
                                            </label>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
