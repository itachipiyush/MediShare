import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';

interface MedicineSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  onSort: (sort: string) => void;
}

export const MedicineSearch: React.FC<MedicineSearchProps> = ({
  onSearch,
  onFilter,
  onSort,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </form>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Filter by Status
            </label>
            <Select
              onChange={(e) => onFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="claimed">Claimed</option>
              <option value="expired">Expired</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sort by
            </label>
            <Select
              onChange={(e) => onSort(e.target.value)}
              className="w-full"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="expiry">Expiry Date</option>
              <option value="name">Name</option>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}; 