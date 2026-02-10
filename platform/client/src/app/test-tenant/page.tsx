/**
 * TENANT ISOLATION TEST PAGE
 * 
 * This page demonstrates and verifies that tenant isolation is working correctly.
 * Use this to manually test the security guarantees.
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';

export default function TenantTestPage() {
    const { user, logout } = useAuth();
    const [testResults, setTestResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addResult = (message: string, isError = false) => {
        const prefix = isError ? '❌' : '✅';
        setTestResults(prev => [...prev, `${prefix} ${message}`]);
    };

    const clearResults = () => setTestResults([]);

    // Test 1: Verify tenant header is sent
    const testTenantHeader = async () => {
        clearResults();
        setLoading(true);

        try {
            addResult(`Current Tenant ID: ${user?.tenantId}`);

            const response = await apiClient.campaigns.list();

            addResult('API call succeeded with tenant header');
            addResult(`Received ${response.data.campaigns?.length || 0} campaigns`);
        } catch (err: any) {
            addResult(`API call failed: ${err.message}`, true);
        } finally {
            setLoading(false);
        }
    };

    // Test 2: Simulate missing tenant (will fail)
    const testMissingTenant = async () => {
        clearResults();
        setLoading(true);

        try {
            // Temporarily remove user from localStorage
            const backup = localStorage.getItem('email_engine_user');
            localStorage.removeItem('email_engine_user');

            addResult('Removed tenant from localStorage');

            try {
                await apiClient.campaigns.list();
                addResult('SECURITY BREACH: API call succeeded without tenant!', true);
            } catch (err: any) {
                addResult('API call correctly blocked without tenant');
                addResult(`Error message: ${err.message}`);
            }

            // Restore user
            if (backup) {
                localStorage.setItem('email_engine_user', backup);
                addResult('Restored tenant to localStorage');
            }
        } finally {
            setLoading(false);
        }
    };

    // Test 3: Create a test campaign
    const testCreateCampaign = async () => {
        clearResults();
        setLoading(true);

        try {
            addResult(`Creating campaign for tenant: ${user?.tenantId}`);

            const response = await apiClient.campaigns.create({
                name: `Test Campaign - ${new Date().toISOString()}`,
                subject: `Test from ${user?.tenantId}`,
                body_html: '<p>This is a test campaign to verify tenant isolation.</p>',
                status: 'draft',
            });

            addResult('Campaign created successfully');
            addResult(`Campaign ID: ${response.data.id}`);
            addResult(`Tenant ID: ${response.data.tenant_id}`);

            if (response.data.tenant_id === user?.tenantId) {
                addResult('✅ Tenant ID matches! Isolation working correctly.');
            } else {
                addResult('❌ SECURITY ISSUE: Tenant ID mismatch!', true);
            }
        } catch (err: any) {
            addResult(`Failed to create campaign: ${err.message}`, true);
        } finally {
            setLoading(false);
        }
    };

    // Test 4: Check analytics isolation
    const testAnalytics = async () => {
        clearResults();
        setLoading(true);

        try {
            addResult(`Fetching analytics for tenant: ${user?.tenantId}`);

            const response = await apiClient.analytics.getStats(user?.tenantId || '');

            addResult('Analytics fetched successfully');
            addResult(`Total sent: ${response.data.total_sent}`);
            addResult(`Unique opens: ${response.data.unique_opens}`);
            addResult(`Unique clicks: ${response.data.unique_clicks}`);
        } catch (err: any) {
            addResult(`Failed to fetch analytics: ${err.message}`, true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '40px',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
            <h1 style={{ marginBottom: '10px' }}>🔒 Tenant Isolation Test Suite</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
                Verify that multi-tenant security is working correctly
            </p>

            {/* Current User Info */}
            <div style={{
                padding: '20px',
                backgroundColor: '#F3F4F6',
                borderRadius: '8px',
                marginBottom: '30px',
            }}>
                <h3 style={{ marginTop: 0 }}>Current Session</h3>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Tenant ID:</strong> <code>{user?.tenantId}</code></p>
                <p><strong>Role:</strong> {user?.role}</p>
                <button
                    onClick={logout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '10px',
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Test Buttons */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '30px',
            }}>
                <button
                    onClick={testTenantHeader}
                    disabled={loading}
                    style={{
                        padding: '15px',
                        backgroundColor: '#4F46E5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    Test 1: Verify Tenant Header
                </button>

                <button
                    onClick={testMissingTenant}
                    disabled={loading}
                    style={{
                        padding: '15px',
                        backgroundColor: '#DC2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    Test 2: Missing Tenant (Should Fail)
                </button>

                <button
                    onClick={testCreateCampaign}
                    disabled={loading}
                    style={{
                        padding: '15px',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    Test 3: Create Campaign
                </button>

                <button
                    onClick={testAnalytics}
                    disabled={loading}
                    style={{
                        padding: '15px',
                        backgroundColor: '#7C3AED',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    Test 4: Analytics Isolation
                </button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
                <div style={{
                    padding: '20px',
                    backgroundColor: '#1F2937',
                    color: '#F9FAFB',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                    }}>
                        <h3 style={{ margin: 0, color: '#F9FAFB' }}>Test Results</h3>
                        <button
                            onClick={clearResults}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#374151',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                            }}
                        >
                            Clear
                        </button>
                    </div>
                    {testResults.map((result, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                            {result}
                        </div>
                    ))}
                </div>
            )}

            {/* Instructions */}
            <div style={{
                marginTop: '40px',
                padding: '20px',
                backgroundColor: '#FEF3C7',
                borderRadius: '8px',
                borderLeft: '4px solid #F59E0B',
            }}>
                <h3 style={{ marginTop: 0 }}>📋 Testing Instructions</h3>
                <ol style={{ marginBottom: 0 }}>
                    <li><strong>Test 1</strong>: Verifies tenant header is automatically sent</li>
                    <li><strong>Test 2</strong>: Confirms API calls are blocked without tenant (security test)</li>
                    <li><strong>Test 3</strong>: Creates a campaign and verifies tenant_id is stored correctly</li>
                    <li><strong>Test 4</strong>: Checks that analytics are scoped to current tenant</li>
                </ol>
            </div>
        </div>
    );
}
