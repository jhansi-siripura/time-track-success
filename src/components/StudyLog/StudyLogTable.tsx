
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import StudyLogForm from './StudyLogForm';
import { Input } from '@/components/ui/input';

const StudyLogTable = () => {
  const [studyLogs, setStudyLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    subject: '',
    topic: '',
    source: '',
    achievements: '',
    date: ''
  });
  const { user } = useAuth();

  const fetchStudyLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_logs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setStudyLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch study logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyLogs();
  }, [user]);

  useEffect(() => {
    let filtered = studyLogs.filter(log => {
      return (
        (!filters.subject || log.subject?.toLowerCase().includes(filters.subject.toLowerCase())) &&
        (!filters.topic || log.topic?.toLowerCase().includes(filters.topic.toLowerCase())) &&
        (!filters.source || log.source?.toLowerCase().includes(filters.source.toLowerCase())) &&
        (!filters.achievements || log.achievements?.toLowerCase().includes(filters.achievements.toLowerCase())) &&
        (!filters.date || log.date?.includes(filters.date))
      );
    });

    // Sort the filtered data
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      // Handle date and time sorting
      if (sortField === 'date') {
        aValue = new Date(a.date + ' ' + a.time).getTime();
        bValue = new Date(b.date + ' ' + b.time).getTime();
      } else if (sortField === 'duration') {
        aValue = Number(a.duration) || 0;
        bValue = Number(b.duration) || 0;
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [studyLogs, filters, sortField, sortDirection]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this study log?')) return;

    try {
      const { error } = await supabase
        .from('study_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study log deleted successfully!",
      });

      fetchStudyLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete study log",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (log: any) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLog(null);
    fetchStudyLogs();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLog(null);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Pagination calculations
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  if (showForm) {
    return (
      <StudyLogForm
        editingLog={editingLog}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Study Logs</CardTitle>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading study logs...</div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <Input
                placeholder="Filter by subject..."
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Filter by topic..."
                value={filters.topic}
                onChange={(e) => handleFilterChange('topic', e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Filter by source..."
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Filter by achievements..."
                value={filters.achievements}
                onChange={(e) => handleFilterChange('achievements', e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Filter by date..."
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="text-sm"
              />
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No study logs found.</p>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  Add Your First Study Session
                </Button>
              </div>
            ) : (
              <>
                {/* Results summary */}
                <div className="mb-4 text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="w-24 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            Date {getSortIcon('date')}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="w-20 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('time')}
                        >
                          <div className="flex items-center gap-1">
                            Time {getSortIcon('time')}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="w-20 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('duration')}
                        >
                          <div className="flex items-center gap-1">
                            Duration {getSortIcon('duration')}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="w-32 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('subject')}
                        >
                          <div className="flex items-center gap-1">
                            Subject {getSortIcon('subject')}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="w-32 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('topic')}
                        >
                          <div className="flex items-center gap-1">
                            Topic {getSortIcon('topic')}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="w-32 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('source')}
                        >
                          <div className="flex items-center gap-1">
                            Source {getSortIcon('source')}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('achievements')}
                        >
                          <div className="flex items-center gap-1">
                            Achievements {getSortIcon('achievements')}
                          </div>
                        </TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="w-24">{log.date}</TableCell>
                          <TableCell className="w-20">{log.time}</TableCell>
                          <TableCell className="w-20">{formatDuration(log.duration)}</TableCell>
                          <TableCell className="w-32">{log.subject}</TableCell>
                          <TableCell className="w-32">{log.topic || '-'}</TableCell>
                          <TableCell className="w-32">{log.source || '-'}</TableCell>
                          <TableCell className="break-words">{log.achievements}</TableCell>
                          <TableCell className="w-20">
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(log)}
                                className="h-7 w-7 p-0"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(log.id)}
                                className="h-7 w-7 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNumber)}
                                isActive={currentPage === pageNumber}
                                className="cursor-pointer"
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyLogTable;
