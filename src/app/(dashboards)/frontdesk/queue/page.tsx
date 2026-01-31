"use client";

import QueueList from "@/components/frontdesk/queue/QueueList";

export default function frontdeskqueuePage() {
    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">QUEUE</h2>
                <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">PORTAL</p>
            </div>

            <QueueList />
        </div>
    );
}
