import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { SiteContext } from '../../contexts/SiteContext';

const SiteSwitcher: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { currentOrganization, setCurrentOrganization } = useContext(SiteContext);

  if (!user || !user.organizations || user.organizations.length <= 1) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentOrganization(event.target.value);
  };

  return (
    <div className="relative">
      <select
        value={currentOrganization}
        onChange={handleChange}
        className="block appearance-none w-full bg-indigo-800 border border-indigo-700 text-white py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-indigo-700 focus:border-teal-500"
      >
        {user.organizations.map(org => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="http://www.w3.org/2020">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default SiteSwitcher;