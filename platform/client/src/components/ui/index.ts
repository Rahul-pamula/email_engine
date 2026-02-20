/**
 * Email Engine Design System — Central export barrel
 *
 * Usage: import { Button, StatCard, useToast } from '@/components/ui';
 *
 * ATOMS — Single purpose
 */
export { Button, buttonVariants } from './Button';
export { Badge, badgeVariants } from './Badge';
export { HealthDot } from './HealthDot';
export { LoadingSpinner, PageLoader } from './LoadingSpinner';

/**
 * MOLECULES — Combined atoms
 */
export { StatCard } from './StatCard';
export { StatusBadge, statusConfig } from './StatusBadge';
export { ConfirmModal } from './ConfirmModal';
export { ToastProvider, useToast } from './Toast';

/**
 * ORGANISMS — Full sections
 */
export { PageHeader } from './PageHeader';
export { DataTable } from './DataTable';
export { EmptyState } from './EmptyState';
export { Breadcrumb } from './Breadcrumb';

/**
 * Type exports
 */
export type { HealthDotProps } from './HealthDot';
export type { CampaignStatus } from './StatusBadge';
export type { BreadcrumbItem } from './Breadcrumb';
export type { Column, DataTableProps } from './DataTable';
export type { ToastVariant } from './Toast';
