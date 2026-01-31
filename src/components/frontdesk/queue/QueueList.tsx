"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";

interface Appointment {
    _id: string;
    appointmentId: string;
    startTime: string;
    status: string;
    type: string;
    patientId: {
        firstName: string;
        lastName: string;
        mrn: string;
    };
    providerId: {
        firstName: string;
        lastName: string;
        department: string;
    };
}

export default function QueueList() {
    const [queue, setQueue] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchQueue = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/frontdesk/queue");
            if (!res.ok) throw new Error("Failed to fetch queue");
            const data = await res.json();
            setQueue(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "scheduled":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
            case "checked-in":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Checked In</Badge>;
            case "completed":
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Completed</Badge>;
            case "cancelled":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Today's Appointments</CardTitle>
                <Button variant="ghost" size="sm" onClick={fetchQueue} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                {error ? (
                    <div className="text-red-500 text-sm p-4 text-center">Error: {error}</div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>MRN</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queue.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No appointments found for today.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    queue.map((apt) => (
                                        <TableRow key={apt._id}>
                                            <TableCell className="font-medium">
                                                {apt.startTime ? format(new Date(apt.startTime), "h:mm a") : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {apt.patientId ? `${apt.patientId.firstName} ${apt.patientId.lastName}` : "Unknown"}
                                            </TableCell>
                                            <TableCell>{apt.patientId?.mrn || "-"}</TableCell>
                                            <TableCell>
                                                {apt.providerId ? `Dr. ${apt.providerId.firstName} ${apt.providerId.lastName}` : "Unassigned"}
                                            </TableCell>
                                            <TableCell>{apt.providerId?.department || "-"}</TableCell>
                                            <TableCell className="capitalize">{apt.type}</TableCell>
                                            <TableCell>{getStatusBadge(apt.status)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
