import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Phone, 
  Mail, 
  Globe, 
  DollarSign, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2,
  ChevronDown
} from 'lucide-react';
import { CustomFormSubmission } from '../../types/admin';

interface AdminSubmissionsTableProps {
  submissions: CustomFormSubmission[];
  onSelectSubmission: (submission: CustomFormSubmission) => void;
  onUpdateStatus: (id: string, status: CustomFormSubmission['status']) => void;
  onOpenAddModal: () => void;
}

export const AdminSubmissionsTable: React.FC<AdminSubmissionsTableProps> = ({
  submissions,
  onSelectSubmission,
  onUpdateStatus,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = submissions.filter((sub) => {
    const matchesQuery = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.workEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.companyBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm) ||
      sub.businessCategory.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesQuery;
    return matchesQuery && sub.status === statusFilter;
  });

  const handleExportCSV = () => {
    const headers = ['ID,Name,Email,Phone,Company Brand,Website,Monthly Ad Spend,Category,Plan Interest,Notes,Submitted At,Status'];
    const rows = filtered.map((s) => 
      `"${s.id}","${s.name}","${s.workEmail}","${s.phone}","${s.companyBrand}","${s.websiteUrl || ''}","${s.monthlyAdSpend}","${s.businessCategory}","${s.planInterest}","${(s.notes || '').replace(/"/g, '""')}","${s.submittedAt}","${s.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `genieads_custom_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeStyle = (status: CustomFormSubmission['status']) => {
    switch (status) {
      case 'New Lead':
        return 'bg-[#8B2626]/12 text-[#8B2626] border-[#8B2626]/30';
      case 'In Discussion':
        return 'bg-[#EF6905]/15 text-[#EF6905] border-[#EF6905]/30';
      case 'Audit Scheduled':
        return 'bg-[#F1E5A1] text-[#8B2626] border-[#E8DEB7]';
      case 'Converted':
        return 'bg-[#486C2F]/15 text-[#486C2F] border-[#486C2F]/30';
      case 'Archived':
        return 'bg-[#6A5652]/15 text-[#6A5652] border-[#6A5652]/30';
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E8DEB7]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#2A1A18] tracking-tight">
              Custom Form Submissions (Managed Growth Leads)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F1E5A1] text-[#8B2626]">
              {filtered.length} Leads
            </span>
          </div>
          <p className="text-xs text-[#6A5652] mt-0.5">
            Real inquiries submitted for custom enterprise, Zero → Hero Managed, and ad audit services
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#6A5652] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, brands, phones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#EF6905] text-[#2A1A18]"
            />
          </div>

          {/* Status Dropdown Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl font-semibold text-[#2A1A18] focus:outline-none focus:ring-1 focus:ring-[#EF6905]"
          >
            <option value="all">All Lead Stages</option>
            <option value="New Lead">New Lead</option>
            <option value="In Discussion">In Discussion</option>
            <option value="Audit Scheduled">Audit Scheduled</option>
            <option value="Converted">Converted</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Add New Lead button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>

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

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#6A5652] space-y-2">
          <p className="font-semibold text-[#2A1A18]">No custom form submissions found.</p>
          <p className="text-[11px]">When visitors click custom plan CTAs and submit their inquiry, it will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#6A5652] uppercase tracking-wider border-b border-[#E8DEB7] text-[11px]">
                <th className="pb-3 font-bold">Applicant / Contact</th>
                <th className="pb-3 font-bold">Brand & Category</th>
                <th className="pb-3 font-bold">Monthly Ad Spend</th>
                <th className="pb-3 font-bold">Plan Interest</th>
                <th className="pb-3 font-bold">Submitted</th>
                <th className="pb-3 font-bold">Lead Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DEB7]">
              {filtered.map((sub) => (
                <tr 
                  key={sub.id}
                  onClick={() => onSelectSubmission(sub)}
                  className="hover:bg-[#FAF6E8]/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5">
                    <div className="font-bold text-[#2A1A18] text-[13px]">{sub.name}</div>
                    <div className="flex flex-col gap-0.5 mt-0.5 font-mono text-[11px] text-[#6A5652]">
                      <span className="flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" />
                        {sub.workEmail}
                      </span>
                      <span className="flex items-center gap-1 text-[#2A1A18]">
                        <Phone className="w-2.5 h-2.5 text-[#EF6905]" />
                        {sub.phone}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <div className="font-semibold text-[#2A1A18] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#6A5652]" />
                      <span>{sub.companyBrand}</span>
                    </div>
                    <div className="text-[11px] text-[#6A5652] mt-0.5">
                      {sub.businessCategory}
                    </div>
                  </td>

                  <td className="py-3.5 font-mono font-bold text-[#2A1A18]">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF6E8] border border-[#E8DEB7]">
                      {sub.monthlyAdSpend}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1E5A1]/90 text-[#8B2626]">
                      {sub.planInterest}
                    </span>
                  </td>

                  <td className="py-3.5 text-[#6A5652] whitespace-nowrap">
                    {sub.submittedAt}
                  </td>

                  <td className="py-3.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={sub.status}
                      onChange={(e) => onUpdateStatus(sub.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${getStatusBadgeStyle(sub.status)}`}
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Audit Scheduled">Audit Scheduled</option>
                      <option value="Converted">Converted</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSubmission(sub);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF6E8] group-hover:bg-[#E8DEB7] border border-[#E8DEB7] text-[#2A1A18] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      View Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
