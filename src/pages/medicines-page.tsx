import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Medicine } from '../lib/supabase';
import { MedicineSearch } from '../components/medicine-search';
import { Pagination } from '../components/ui/pagination';
import { Loading } from '../components/ui/loading';
import { ErrorBoundary } from '../components/error-boundary';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MedicineDetailsModal } from '../components/medicines/medicine-details-modal'; // Import the modal
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 12;

export const MedicinesPage: React.FC = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null); // State for selected medicine
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterAndSortMedicines();
  }, [medicines, searchQuery, statusFilter, sortBy]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedicines(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMedicines = () => {
    let result = [...medicines];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        medicine =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(medicine => medicine.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'expiry':
        result.sort(
          (a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
        );
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredMedicines(result);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filter: string) => {
    setStatusFilter(filter);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (medicine: Medicine) => {
    setSelectedMedicine(medicine); // Set the selected medicine
    setIsDetailsModalOpen(true); // Open the modal
  };

  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={fetchMedicines}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Medicines</h1>
          <Button onClick={() => navigate('/medicines/new')}>Add New Medicine</Button>
        </div>

        <MedicineSearch onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />

        {filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-slate-600">No medicines found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {paginatedMedicines.map(medicine => (
                <Card key={medicine.id} className="p-6">
                  <div className="space-y-4">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={medicine.image_url}
                        alt={medicine.name}
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{medicine.name}</h3>
                      <p className="text-slate-600 mt-1 line-clamp-2">{medicine.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">
                        Expires: {format(new Date(medicine.expiry_date), 'MMM d, yyyy')}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          medicine.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : medicine.status === 'claimed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {medicine.status}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleViewDetails(medicine)} // Open modal on click
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* Medicine Details Modal */}
        <MedicineDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          medicine={selectedMedicine}
        />
      </div>
    </ErrorBoundary>
  );
};
