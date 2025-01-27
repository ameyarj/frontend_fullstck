import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  loading?: boolean;
}

export default function StatCard({ title, value, change, icon, loading }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 hover:ring-2 hover:ring-emerald-500/20 transition-all">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-gray-400 text-sm">{title}</h3>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="text-2xl font-bold text-white animate-pulse">-</div>
            ) : (
              <span className="text-2xl font-bold text-white">{value}</span>
            )}
            {change && <span className="text-xs text-emerald-400">{change}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}