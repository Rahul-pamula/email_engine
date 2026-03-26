"use client";

import {
    BarChart3,
    Download,
    Calendar,
    Filter,
    Info
} from "lucide-react";
import { PageHeader, Button, StatCard } from "@/components/ui";

const summaryMetrics = [
    { label: "Emails Sent", value: "245.2k", trendValue: 12, trendLabel: "from last period" },
    { label: "Avg Open Rate", value: "42.3%", trendValue: 2.1, trendLabel: "from last period" },
    { label: "Avg Click Rate", value: "8.7%", trendValue: -0.5, trendLabel: "from last period" },
    { label: "Bounces", value: "1.2%", trendValue: 0.1, trendLabel: "from last period" },
];

const ispPerformance = [
    { name: "Gmail", sent: "120k", openRate: "45%", clickRate: "9.2%", complaint: "0.01%" },
    { name: "Outlook", sent: "85k", openRate: "38%", clickRate: "7.8%", complaint: "0.03%" },
    { name: "Yahoo", sent: "25k", openRate: "41%", clickRate: "8.1%", complaint: "0.02%" },
    { name: "iCloud", sent: "15k", openRate: "48%", clickRate: "10.5%", complaint: "0.00%" },
];

export default function ReportsPage() {
    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <PageHeader 
                title="Reports" 
                subtitle="Analytics and performance insights"
                action={
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            Last 30 Days
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                }
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryMetrics.map((m) => (
                    <StatCard 
                        key={m.label} 
                        label={m.label} 
                        value={m.value} 
                        trend={m.trendValue} 
                        trendLabel={m.trendLabel}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Placeholder */}
                <div className="lg:col-span-2 p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] min-h-[300px]">
                    <div className="flex justify-between mb-6">
                        <h3 className="font-semibold text-[var(--text-primary)]">Email Performance</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div> Sent
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                                <div className="w-2.5 h-2.5 rounded-sm bg-blue-300"></div> Opens
                            </div>
                        </div>
                    </div>

                    {/* Mock Bar Chart */}
                    <div className="flex items-end justify-between h-[200px] pb-6 border-b border-[var(--border)] gap-2">
                        {[60, 45, 75, 50, 80, 65, 90, 55, 70, 40, 60, 85].map((h, i) => (
                            <div key={i} className="flex flex-col gap-0.5 items-center w-full max-w-[20px]">
                                <div className="w-full bg-blue-300 rounded-[var(--radius-sm)]" style={{ height: `${h * 0.4}%` }}></div>
                                <div className="w-full bg-blue-500 rounded-[var(--radius-sm)]" style={{ height: `${h}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-[var(--text-muted)]">
                        <span>Jan 1</span>
                        <span>Jan 7</span>
                        <span>Jan 14</span>
                        <span>Jan 21</span>
                        <span>Jan 28</span>
                    </div>
                </div>

                {/* Bot Filtering Card */}
                <div className="p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)]">
                    <h3 className="mb-4 font-semibold text-[var(--text-primary)]">Bot Filtering</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                        We automatically filter out bot clicks and opens to ensure your metrics are accurate.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-[var(--text-secondary)]">Bot Opens Blocked</span>
                                <span className="text-sm font-semibold text-[var(--text-primary)]">12.4k</span>
                            </div>
                            <div className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                                <div className="w-[35%] h-full bg-[var(--accent)] rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-[var(--text-secondary)]">Bot Clicks Blocked</span>
                                <span className="text-sm font-semibold text-[var(--text-primary)]">4.1k</span>
                            </div>
                            <div className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                                <div className="w-[18%] h-full bg-[var(--accent)] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-3 bg-[var(--bg-hover)] rounded-[var(--radius)] text-xs text-[var(--text-secondary)] flex gap-2 items-start">
                        <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span>Accuracy rate of 99.8% based on heuristic analysis.</span>
                    </div>
                </div>
            </div>

            {/* ISP Performance Table */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden hidden md:block mt-6">
                <div className="p-4 md:px-6 border-b border-[var(--border)]">
                    <h3 className="font-semibold text-[var(--text-primary)]">ISP Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                                {['ISP', 'Emails Sent', 'Open Rate', 'Click Rate', 'Complaint Rate'].map(h => (
                                    <th key={h} className="px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {ispPerformance.map((isp) => (
                                <tr key={isp.name} className="hover:bg-[var(--bg-hover)] transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{isp.name}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{isp.sent}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{isp.openRate}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{isp.clickRate}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{isp.complaint}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Mobile View for ISP */}
            <div className="md:hidden space-y-4 mt-6">
                <h3 className="font-semibold text-[var(--text-primary)]">ISP Performance</h3>
                {ispPerformance.map((isp) => (
                    <div key={isp.name} className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)]">
                        <div className="font-semibold text-[var(--text-primary)] mb-2">{isp.name}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                            <div>Sent: {isp.sent}</div>
                            <div>Open: {isp.openRate}</div>
                            <div>Click: {isp.clickRate}</div>
                            <div>Complaint: {isp.complaint}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
