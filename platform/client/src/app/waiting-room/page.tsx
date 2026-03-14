'use client';

import { useAuth } from '@/context/AuthContext';
import { Clock, LogOut, ShieldCheck } from 'lucide-react';

export default function WaitingRoomPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-blue-100 p-4">
                        <Clock className="h-12 w-12 text-blue-600 animate-pulse" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Your request is pending
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
                    We have securely notified your IT administrator. You will receive an email once your workspace access is approved.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="rounded-md bg-blue-50 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ShieldCheck className="h-5 w-5 text-blue-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">Enterprise Security</h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        Your account (<strong>{user?.email}</strong>) has been verified. For compliance, access to the corporate workspace requires administrative approval.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={logout}
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <LogOut className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Logout securely
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
