import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

const statusStyles: { [key: string]: string } = {
  // Election Statuses
  'Active': 'bg-green-100 text-green-700',
  'Published': 'bg-teal-100 text-teal-700',
  'Closed': 'bg-slate-100 text-slate-700',
  'Draft': 'bg-amber-100 text-amber-700',
  
  // Node Statuses
  'Online': 'bg-green-100 text-green-700',
  'Offline': 'bg-red-100 text-red-700',

  // Verification Statuses
  'Verified': 'bg-blue-100 text-blue-700',
  'Unverified': 'bg-orange-100 text-orange-700',
};

const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const badgeClasses = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'} ${className}`;
  return <span className={badgeClasses}>{status}</span>;
};

export default Badge;