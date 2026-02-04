import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Incident, InfectionControl } from '@/lib/models/Compliance';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // incident or infection

        if (type === 'infection') {
            const data = await InfectionControl.find().populate('patientId', 'firstName lastName');
            return NextResponse.json(data);
        }

        const incidents = await Incident.find()
            .populate('patientId', 'firstName lastName')
            .populate('reporterId', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(incidents);
    } catch (error) {
        console.error('Compliance GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { type, ...payload } = data;

        if (type === 'infection') {
            const newInfection = await InfectionControl.create(payload);
            return NextResponse.json(newInfection, { status: 201 });
        }

        const newIncident = await Incident.create({
            ...payload,
            reporterId: session.user.id
        });

        return NextResponse.json(newIncident, { status: 201 });
    } catch (error) {
        console.error('Compliance POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
