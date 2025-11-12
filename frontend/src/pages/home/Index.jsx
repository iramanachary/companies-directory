import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Filter, X, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Table from '../../components/Table';
import { BASE_URL } from '../../utils/baseurl';

const columns = ["Company Name", "Location", "Industry"];

const Index = () => {
    const [open, setOpen] = useState(false)
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/companies`);
            setCompanies(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch companies. Please try again later.');
            console.error('Error fetching companies:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);


    const locations = useMemo(() => {
        return [...new Set(companies.map(c => c.location))].sort();
    }, [companies]);


    const industries = useMemo(() => {
        return [...new Set(companies.map(c => c.industry))].sort();
    }, [companies]);

    const filteredCompanies = useMemo(() => {
        let result = [...companies];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(company =>
                company.name.toLowerCase().includes(query) ||
                company.location.toLowerCase().includes(query) ||
                company.industry.toLowerCase().includes(query)
            );
        }

       
        if (selectedLocation) {
            result = result.filter(company => company.location === selectedLocation);
        }

        if (selectedIndustry) {
            result = result.filter(company => company.industry === selectedIndustry);
        }

       
        result.sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (typeof aValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

        return result;
    }, [companies, searchQuery, selectedLocation, selectedIndustry, sortBy, sortOrder]);

 
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedLocation, selectedIndustry, sortBy, sortOrder]);

    const paginationData = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

        return { currentItems, totalPages };
    }, [filteredCompanies, currentPage, itemsPerPage]);

    const { currentItems, totalPages } = paginationData;

    // useCallback for event handlers to prevent recreation
    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedLocation('');
        setSelectedIndustry('');
        setSortBy('name');
        setSortOrder('asc');
    }, []);

    const modelHandler = useCallback(() => {
        setOpen(prev => !prev);
    }, []);

    const handleLocationChange = useCallback((e) => {
        setSelectedLocation(e.target.value);
    }, []);

    const handleIndustryChange = useCallback((e) => {
        setSelectedIndustry(e.target.value);
    }, []);

    const handleSortChange = useCallback((e) => {
        const [field, order] = e.target.value.split('-');
        setSortBy(field);
        setSortOrder(order);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading companies...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error</h2>
                    <p className="text-gray-600 text-center mb-6">{error}</p>
                    <button
                        onClick={fetchCompanies}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className='max-w-[1440px] mx-auto p-4 sm:p-10 space-y-6'>
            <Table 
                tableColumns={columns} 
                resetFilters={resetFilters} 
                modelHandler={modelHandler} 
                tableData={currentItems} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />
            
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === index + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="bg-white pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between">
                                    <div className='flex items-center gap-2'>
                                        <Filter className="w-5 h-5 text-gray-600" />
                                        <h2 className="text-xl font-medium text-gray-800">Filters</h2>
                                    </div>
                                    <button onClick={modelHandler}>
                                        <X />
                                    </button>
                                </div>
                                
                                <div className="mt-5 space-y-4">
                                    {/* Location Filter */}
                                    <div className="relative">
                                        <select
                                            value={selectedLocation}
                                            onChange={handleLocationChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">All Locations</option>
                                            {locations.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Industry Filter */}
                                    <div className="relative">
                                        <select
                                            value={selectedIndustry}
                                            onChange={handleIndustryChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">All Industries</option>
                                            {industries.map(ind => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Sort */}
                                    <div className="relative">
                                        <select
                                            value={`${sortBy}-${sortOrder}`}
                                            onChange={handleSortChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="name-asc">Name (A-Z)</option>
                                            <option value="name-desc">Name (Z-A)</option>
                                            <option value="location-asc">Location (A-Z)</option>
                                            <option value="location-desc">Location (Z-A)</option>
                                            <option value="industry-asc">Industry (A-Z)</option>
                                            <option value="industry-desc">Industry (Z-A)</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </section>
    )
}

export default React.memo(Index);