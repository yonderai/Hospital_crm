"use client";

import React, { useState, useEffect } from "react";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, MessageSquare, Monitor, Settings } from "lucide-react";

const VirtualClinic = () => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [activePatient, setActivePatient] = useState({
        name: "John Doe",
        mrn: "MRN-123456",
        appointmentTime: "10:30 AM",
        reason: "Follow-up on hypertension"
    });

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
            {/* Sidebar - Patient Info & Chat */}
            <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Active Patient</h2>
                    <div className="bg-slate-800 rounded-2xl p-4">
                        <p className="text-lg font-bold">{activePatient.name}</p>
                        <p className="text-xs text-slate-400">{activePatient.mrn}</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-medium text-green-400">Connected</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Clinical Context</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Reason for Visit</p>
                            <p className="text-sm">{activePatient.reason}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Last Encounter</p>
                            <p className="text-sm">Jan 10, 2026 - Cardiology</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button className="w-full py-3 bg-olive-700 hover:bg-olive-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white">
                        <MessageSquare size={18} /> Open Chat
                    </button>
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Remote Video (Patient) */}
                <div className="flex-1 bg-slate-950 relative flex items-center justify-center">
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center border-4 border-slate-800 rounded-3xl m-4 overflow-hidden shadow-2xl">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={40} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 font-medium">Waiting for patient to share video...</p>
                        </div>
                    </div>

                    {/* Local Video (Self) */}
                    <div className="absolute bottom-12 right-12 w-64 h-48 bg-slate-800 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            {isVideoOn ? (
                                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">My Video Stream</p>
                            ) : (
                                <VideoOff className="text-slate-600" size={32} />
                            )}
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-[10px] font-bold">You</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="h-24 bg-slate-900/50 backdrop-blur-md flex items-center justify-center gap-4 border-t border-slate-800/50">
                    <button
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </button>
                    <button
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? 'bg-olive-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                    >
                        <Monitor size={20} />
                    </button>
                    <div className="w-px h-8 bg-slate-800 mx-2"></div>
                    <button className="px-8 h-12 bg-red-600 hover:bg-red-700 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all">
                        <PhoneOff size={18} /> End Call
                    </button>
                </div>

                {/* Toolbar */}
                <div className="absolute top-8 left-8 flex gap-2">
                    <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full text-xs font-bold flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div> REC 00:12:45
                    </div>
                    <button className="w-10 h-10 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full flex items-center justify-center hover:bg-slate-800">
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VirtualClinic;
