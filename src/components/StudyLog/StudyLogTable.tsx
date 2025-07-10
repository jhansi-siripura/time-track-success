import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from 'lucide-react';
import StudyLogForm from './StudyLogForm';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { validateAuthState, sanitizeInput, rateLimiter } from '@/lib/security';

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
  const [columnFilters, setColumnFilters] = useState({
    subject: '',
    topic: '',
    source: '',
    achievements: '',
    date: ''
  });
  const [tempFilters, setTempFilters] = useState({
    subject: '',
    topic: '',
    source: '',
    achievements: '',
    date: ''
  });
  const [openPopovers, setOpenPopovers] = useState<{
    [key: string]: boolean;
  }>({});
  const { user } = useAuth();

  const fetchStudyLogs = async () => {
    if (!user) return;

    const authValidation = await validateAuthState();
    if (!authValidation.isValid) {
      toast({
        title: "Authentication Error",
        description: "Please log in again to view your study logs",
        variant: "destructive"
      });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('study_logs')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setStudyLogs(data || []);
    } catch (error: any) {
      console.error('Fetch study logs error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch study logs",
        variant: "destructive"
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
      return (!columnFilters.subject || log.subject?.toLowerCase().includes(columnFilters.subject.toLowerCase())) && 
             (!columnFilters.topic || log.topic?.toLowerCase().includes(columnFilters.topic.toLowerCase())) && 
             (!columnFilters.source || log.source?.toLowerCase().includes(columnFilters.source.toLowerCase())) && 
             (!columnFilters.achievements || log.achievements?.toLowerCase().includes(columnFilters.achievements.toLowerCase())) && 
             (!columnFilters.date || log.date?.includes(columnFilters.date));
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';

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
    setCurrentPage(1);
  }, [studyLogs, columnFilters, sortField, sortDirection]);

  const handleDelete = async (id: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete study logs",
        variant: "destructive"
      });
      return;
    }
    if (!confirm('Are you sure you want to delete this study log?')) return;

    if (!rateLimiter.canMakeRequest(user.id + '_delete')) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before deleting another study log",
        variant: "destructive"
      });
      return;
    }

    const authValidation = await validateAuthState();
    if (!authValidation.isValid) {
      toast({
        title: "Authentication Error",
        description: "Please log in again to delete study logs",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('study_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Study log deleted successfully!"
      });
      fetchStudyLogs();
    } catch (error: any) {
      console.error('Delete study log error:', error);
      toast({
        title: "Error",
        description: "Failed to delete study log",
        variant: "destructive"
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
    const sanitizedValue = sanitizeInput(value);
    setTempFilters(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const applyFilter = (field: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [field]: tempFilters[field as keyof typeof tempFilters]
    }));
    setOpenPopovers(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleFilterKeyPress = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') {
      applyFilter(field);
    }
  };

  const clearColumnFilter = (field: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [field]: ''
    }));
    setTempFilters(prev => ({
      ...prev,
      [field]: ''
    }));
    setOpenPopovers(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handlePopoverOpenChange = (field: string, open: boolean) => {
    setOpenPopovers(prev => ({
      ...prev,
      [field]: open
    }));

    if (!open && tempFilters[field as keyof typeof tempFilters]) {
      applyFilter(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const FilterPopover = ({ field, placeholder }: { field: string; placeholder: string }) => {
    const hasFilter = columnFilters[field as keyof typeof columnFilters];
    const isOpen = openPopovers[field] || false;
    
    return (
      <Popover open={isOpen} onOpenChange={(open) => handlePopoverOpenChange(field, open)}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-6 w-6 p-0 ${hasFilter ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Filter className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="flex items-center gap-2">
            <Input
              placeholder={placeholder}
              value={tempFilters[field as keyof typeof tempFilters]}
              onChange={(e) => handleFilterChange(field, e.target.value)}
              onKeyPress={(e) => handleFilterKeyPress(e, field)}
              className="text-sm"
              autoFocus
            />
            {hasFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearColumnFilter(field)}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

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
    return <StudyLogForm editingLog={editingLog} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
  }

  return (
    <Card className="bg-background border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-card/50">
        <CardTitle className="text-lg font-semibold text-foreground">Study Logs</CardTitle>
        <Button onClick={() => setShowForm(true)} className="h-10 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Loading study logs...</div>
          </div>
        ) : (
          <>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">No study logs found.</p>
                <Button onClick={() => setShowForm(true)} className="h-10">
                  Add Your First Study Session
                </Button>
              </div>
            ) : (
              <>
                {/* Results summary */}
                <div className="px-6 py-3 border-b bg-muted/20 text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/40 border-b">
                        <TableHead className="w-36 font-semibold">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('date')}>
                              Date {getSortIcon('date')}
                            </div>
                            <FilterPopover field="date" placeholder="Filter date..." />
                          </div>
                        </TableHead>
                        <TableHead className="w-32 font-semibold">
                          <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('time')}>
                            Time {getSortIcon('time')}
                          </div>
                        </TableHead>
                        <TableHead className="w-24 font-semibold">
                          <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('duration')}>
                            Duration {getSortIcon('duration')}
                          </div>
                        </TableHead>
                        <TableHead className="w-32 font-semibold">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('subject')}>
                              Subject {getSortIcon('subject')}
                            </div>
                            <FilterPopover field="subject" placeholder="Filter subject..." />
                          </div>
                        </TableHead>
                        <TableHead className="w-32 font-semibold">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('topic')}>
                              Topic {getSortIcon('topic')}
                            </div>
                            <FilterPopover field="topic" placeholder="Filter topic..." />
                          </div>
                        </TableHead>
                        <TableHead className="w-32 font-semibold">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('source')}>
                              Source {getSortIcon('source')}
                            </div>
                            <FilterPopover field="source" placeholder="Filter source..." />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('achievements')}>
                              Achievements {getSortIcon('achievements')}
                            </div>
                            <FilterPopover field="achievements" placeholder="Filter achievements..." />
                          </div>
                        </TableHead>
                        <TableHead className="w-20 font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((log, index) => (
                        <TableRow 
                          key={log.id} 
                          className={`
                            border-b transition-colors
                            ${index % 2 === 0 
                              ? 'bg-background hover:bg-muted/30' 
                              : 'bg-muted/10 hover:bg-muted/40'
                            }
                          `}
                        >
                          <TableCell className="w-36 whitespace-nowrap font-medium">
                            {formatDate(log.date)}
                          </TableCell>
                          <TableCell className="w-32 whitespace-nowrap text-muted-foreground">
                            {formatTime(log.time)}
                          </TableCell>
                          <TableCell className="w-24 font-medium">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                              {formatDuration(log.duration)}
                            </span>
                          </TableCell>
                          <TableCell className="w-32 font-medium">{log.subject}</TableCell>
                          <TableCell className="w-32 text-muted-foreground">{log.topic || '-'}</TableCell>
                          <TableCell className="w-32 text-muted-foreground">{log.source || '-'}</TableCell>
                          <TableCell className="break-words text-sm">{log.achievements}</TableCell>
                          <TableCell className="w-20">
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(log)} 
                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(log.id)} 
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
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
                <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Items per page:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                      <SelectTrigger className="w-20 h-9">
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
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-muted'}
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
                                className="cursor-pointer hover:bg-muted"
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-muted'}
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
