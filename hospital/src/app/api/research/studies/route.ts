import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { ResearchStudy, SubjectEnrollment } from '@/lib/models/Research';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const studies = await ResearchStudy.find()
            .populate('principalInvestigator', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(studies);
    } catch (error) {
        console.error('Research Studies GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const newStudy = await ResearchStudy.create(data);

        return NextResponse.json(newStudy, { status: 201 });
    } catch (error) {
        console.error('Research Study POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
