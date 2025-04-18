import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchFiltersProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  nameFilter,
  setNameFilter,
  locationFilter,
  setLocationFilter,
  onSearch,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Search by medication name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full"
        />
        
        <Input
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="flex items-center"
        >
          <Search className="mr-1 h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
};