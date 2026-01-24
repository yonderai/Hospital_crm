
import React from 'react';
import Link from 'next/link';

export default function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-700 mb-6">
                    You do not have permission to view this page.
                </p>
                <div className="space-y-4">
                    <Link href="/login" className="block w-full py-2 px-4 bg-olive-600 text-white rounded hover:bg-olive-700 transition">
                        Return to Login
                    </Link>
                    <Link href="/" className="block w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition">
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
