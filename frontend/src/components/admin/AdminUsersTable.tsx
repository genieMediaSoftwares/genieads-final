import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  Filter,
  Users
} from 'lucide-react';
import { AdminUserRecord, AdminCardCategory } from '../../types/admin';

interface AdminUsersTableProps {
  users: AdminUserRecord[];
  category: AdminCardCategory | 'all';
  onSelectUser: (user: AdminUserRecord) => void;
  onOpenAddUserModal?: () => void;
}

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({
  users,
  category,
  onSelectUser,
  onOpenAddUserModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'offline'>('all');

  // Filter based on active category
  let categoryFiltered = users;
  let tableTitle = 'All Registered Accounts';
  let tableDescription = 'All verified client accounts registered on the platform';

  if (category === 'logged_in') {
    categoryFiltered = users.filter((u) => u.isLoggedIn);
    tableTitle = 'Currently Logged-in & Active Users';
    tableDescription = 'Real accounts with live authenticated sessions in the workspace';
  } else if (category === 'subscribers_1499') {
    categoryFiltered = users.filter((u) => u.subscriptionTier?.includes('1,499'));
    tableTitle = 'Active Subscribers — Social Intelligence (₹1,499/mo)';
    tableDescription = 'Registered customer accounts with active ₹1,499/mo subscription';
  } else if (category === 'subscribers_2499') {
    categoryFiltered = users.filter((u) => u.subscriptionTier?.includes('2,499'));
    tableTitle = 'Active Subscribers — Growth Intelligence (₹2,499/mo)';
    tableDescription = 'Registered customer accounts with active ₹2,499/mo subscription';
  }

  // Apply search
  const filteredUsers = categoryFiltered.filter((u) => {
    const userName = u.name || u.username || '';
    const userEmail = u.email || '';
    const userBrand = u.companyBrand || '';
    const userPhone = u.phone || '';

    const matchesSearch = 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userPhone.includes(searchTerm);
    
    if (statusFilter === 'active') {
      return matchesSearch && u.isLoggedIn;
    }
    if (statusFilter === 'offline') {
      return matchesSearch && !u.isLoggedIn;
    }
    return matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['ID,Name,Username,Email,Phone,Company,Role,Subscription Tier,Plan Price,Is Logged In,Last Active,Status'];
    const rows = filteredUsers.map((u) => 
      `"${u.id}","${u.name}","${u.username}","${u.email}","${u.phone || ''}","${u.companyBrand}","${u.role}","${u.subscriptionTier}","${u.planPrice}","${u.isLoggedIn}","${u.lastActive}","${u.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `genieads_users_${category}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E8DEB7]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#2A1A18] tracking-tight">{tableTitle}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F1E5A1] text-[#8B2626]">
              {filteredUsers.length} Real Records
            </span>
          </div>
          <p className="text-xs text-[#6A5652] mt-0.5">{tableDescription}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#6A5652] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#EF6905] text-[#2A1A18]"
            />
          </div>

          {/* Status Filter */}
          <div className="inline-flex items-center p-1 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-[#8B2626] text-white' : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'active' ? 'bg-[#8B2626] text-white' : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              Active Now
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6E8] hover:bg-[#E8DEB7] border border-[#E8DEB7] text-xs font-bold text-[#2A1A18] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#EF6905]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="py-14 text-center text-xs text-[#6A5652] space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center mx-auto text-[#8B2626]">
            <Users className="w-5 h-5 opacity-60" />
          </div>
          <p className="font-bold text-[#2A1A18] text-sm">
            {category === 'logged_in'
              ? 'No users currently logged in'
              : category === 'subscribers_1499'
                ? 'No registered users on ₹1,499 plan yet'
                : category === 'subscribers_2499'
                  ? 'No registered users on ₹2,499 plan yet'
                  : 'No registered accounts found'}
          </p>
          <p className="text-[12px] max-w-sm mx-auto">
            {category === 'logged_in'
              ? 'When registered users log into their account, their real-time authenticated session will appear here.'
              : category === 'subscribers_1499'
                ? 'When customer accounts register and subscribe to the Social Intelligence (₹1,499/mo) tier, they will be listed here.'
                : category === 'subscribers_2499'
                  ? 'When customer accounts register and subscribe to the Growth Intelligence (₹2,499/mo) tier, they will be listed here.'
                  : 'Only genuine registered user accounts are shown here. Zero demo or placeholder data.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#6A5652] uppercase tracking-wider border-b border-[#E8DEB7] text-[11px]">
                <th className="pb-3 font-bold">User / Account</th>
                <th className="pb-3 font-bold">Brand / Company</th>
                <th className="pb-3 font-bold">Current Tier</th>
                <th className="pb-3 font-bold">Session Status</th>
                <th className="pb-3 font-bold">Role</th>
                <th className="pb-3 font-bold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DEB7]">
              {filteredUsers.map((user) => {
                const displayName = user.name || user.username || 'User';
                const isSub2499 = user.subscriptionTier?.includes('2,499');
                const isSub1499 = user.subscriptionTier?.includes('1,499');

                return (
                  <tr 
                    key={user.id} 
                    onClick={() => onSelectUser(user)}
                    className="hover:bg-[#FAF6E8]/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center font-bold text-[#8B2626] text-xs">
                          {displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#2A1A18] flex items-center gap-1.5">
                            <span>{displayName}</span>
                            {user.isLoggedIn && (
                              <span className="w-2 h-2 rounded-full bg-[#486C2F]" title="Live session active" />
                            )}
                          </div>
                          <div className="text-[#6A5652] font-mono text-[11px] flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5 text-[#6A5652]" />
                            <span>{user.email || user.username}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="font-semibold text-[#2A1A18]">{user.companyBrand || 'Direct Client'}</div>
                      {user.phone && (
                        <div className="text-[11px] text-[#6A5652] font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${
                        isSub2499
                          ? 'bg-[#EF6905]/15 text-[#EF6905]'
                          : isSub1499
                          ? 'bg-[#8B2626]/15 text-[#8B2626]'
                          : 'bg-[#F1E5A1] text-[#8B2626]'
                      }`}>
                        {user.subscriptionTier || 'Free Trial'}
                      </span>
                    </td>

                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${user.isLoggedIn ? 'bg-[#486C2F] animate-pulse' : 'bg-[#6A5652]/40'}`} />
                      <span className="font-medium text-[#2A1A18]">{user.lastActive}</span>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' 
                        ? 'bg-[#8B2626] text-white' 
                        : 'bg-[#FAF6E8] text-[#6A5652] border border-[#E8DEB7]'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUser(user);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF6E8] group-hover:bg-[#E8DEB7] border border-[#E8DEB7] text-[#2A1A18] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
