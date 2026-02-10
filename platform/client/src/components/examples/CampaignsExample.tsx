/**
 * EXAMPLE: How to Use the Centralized API Client
 * 
 * This component demonstrates the correct pattern for making API calls.
 * Copy this pattern to all components that need backend data.
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Campaign {
    id: string;
    name: string;
    subject: string;
    status: string;
    created_at: string;
}

export default function CampaignsExample() {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            setError(null);

            // ✅ CORRECT: Use apiClient
            // Tenant ID is automatically injected
            const response = await apiClient.campaigns.list();

            setCampaigns(response.data.campaigns || []);

            console.log('✅ Loaded campaigns for tenant:', user?.tenantId);
        } catch (err: any) {
            console.error('❌ Failed to load campaigns:', err);
            setError(err.message || 'Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    const createCampaign = async () => {
        try {
            // ✅ CORRECT: Use apiClient
            const response = await apiClient.campaigns.create({
                name: 'Test Campaign',
                subject: 'Hello from ' + user?.tenantId,
                body_html: '<p>This is a test</p>',
                status: 'draft',
            });

            console.log('✅ Created campaign:', response.data);

            // Reload list
            await loadCampaigns();
        } catch (err: any) {
            console.error('❌ Failed to create campaign:', err);
            alert('Failed to create campaign: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <p>Loading campaigns...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <p>Error: {error}</p>
                <button onClick={loadCampaigns}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Campaigns for Tenant: {user?.tenantId}</h2>

            <button
                onClick={createCampaign}
                style={{
                    padding: '10px 20px',
                    marginBottom: '20px',
                    backgroundColor: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                }}
            >
                Create Test Campaign
            </button>

            <div>
                {campaigns.length === 0 ? (
                    <p>No campaigns found for this tenant.</p>
                ) : (
                    <ul>
                        {campaigns.map((campaign) => (
                            <li key={campaign.id} style={{ marginBottom: '10px' }}>
                                <strong>{campaign.name}</strong> - {campaign.status}
                                <br />
                                <small>{campaign.subject}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

/**
 * ❌ ANTI-PATTERNS (DO NOT DO THIS):
 * 
 * // WRONG: Direct fetch without tenant
 * fetch('/api/campaigns')
 * 
 * // WRONG: Manual axios without interceptor
 * axios.get('http://localhost:8000/campaigns')
 * 
 * // WRONG: Manually adding headers (error-prone)
 * fetch('/api/campaigns', {
 *   headers: { 'X-Tenant-ID': user.tenantId }
 * })
 * 
 * ✅ CORRECT PATTERN:
 * 
 * import { apiClient } from '@/lib/api';
 * 
 * const response = await apiClient.campaigns.list();
 * // Tenant ID is automatically injected by interceptor
 */
