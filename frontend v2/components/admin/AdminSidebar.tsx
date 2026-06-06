import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-800 font-semibold'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

    const Icon = ({ path, className = "w-5 h-5 mr-3" } : { path: string; className?: string}) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d={path} clipRule="evenodd" />
        </svg>
      );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex-shrink-0">
      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={navLinkClass}>
          <Icon path="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/create-election" className={navLinkClass}>
          <Icon path="M12 4.5a.75.75 0 01.75.75v6h6a.75.75 0 010 1.5h-6v6a.75.75 0 01-1.5 0v-6h-6a.75.75 0 010-1.5h6v-6A.75.75 0 0112 4.5z" />
          Create Election
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;