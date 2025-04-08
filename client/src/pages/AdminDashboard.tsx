import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Calendar,
  Globe,
  LogOut,
  BarChart3,
  Loader2,
  UserPlus, 
  Phone, 
  Mail, 
  ExternalLink, 
  MapPin,
  Plus,
  FileText,
  MessageSquare,
  DollarSign
} from "lucide-react";
import { Company } from "@/types/company";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const { data: companies, isLoading: isLoadingCompanies } = useQuery<Company[]>({
    queryKey: ["/api/admin/companies"],
    enabled: !!user,
  });

  // Stats summary
  const totalCompanies = companies?.length || 0;
  const activeCompanies = companies?.filter(c => c.status === 'active').length || 0;
  const prospectCompanies = companies?.filter(c => c.status === 'prospect').length || 0;

  // Filter state for companies
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  
  // Filter functions
  const matchesSearch = (company: Company) => 
    !searchQuery || 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.state?.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesLocation = (company: Company) => 
    !locationFilter || (
      (locationFilter === "little-rock" && 
        (company.city?.toLowerCase().includes("little rock") || 
        company.state?.toLowerCase() === "ar" || 
        company.state?.toLowerCase() === "arkansas")) ||
      (locationFilter === "birmingham" && 
        (company.city?.toLowerCase().includes("birmingham") || 
        company.state?.toLowerCase() === "al" || 
        company.state?.toLowerCase() === "alabama"))
    );

  const matchesStatus = (company: Company) => 
    !statusFilter || company.status === statusFilter;

  // Get filtered prospect companies
  const filteredProspects = companies?.filter(company => 
    company.status === 'prospect' && matchesSearch(company) && matchesLocation(company)
  ) || [];

  // Get filtered active clients
  const filteredClients = companies?.filter(company => 
    company.status === 'active' && matchesSearch(company) && matchesLocation(company)
  ) || [];

  // Get all filtered companies (for the Companies tab)
  const filteredCompanies = companies?.filter(company => 
    matchesSearch(company) && matchesStatus(company) && matchesLocation(company)
  ) || [];
  
  // Logout handler
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-8">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">HVAC Admin</h1>
        </div>

        <nav className="space-y-1">
          <Button 
            variant={activeTab === "dashboard" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </Button>
          
          {/* Sales funnel section */}
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase">Sales Funnel</p>
          </div>
          
          <Button 
            variant={activeTab === "new-leads" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("new-leads")}
          >
            <UserPlus className="h-5 w-5 mr-3" />
            New Leads
          </Button>
          <Button 
            variant={activeTab === "pipeline" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("pipeline")}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Pipeline
          </Button>
          <Button 
            variant={activeTab === "clients" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("clients")}
          >
            <Building2 className="h-5 w-5 mr-3" />
            Clients
          </Button>
          
          {/* Administration section */}
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase">Administration</p>
          </div>
          
          <Button 
            variant={activeTab === "users" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </Button>
          <Button 
            variant={activeTab === "domains" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("domains")}
          >
            <Globe className="h-5 w-5 mr-3" />
            Domains
          </Button>
          
          {/* Legacy section */}
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase">Legacy</p>
          </div>
          
          <Button 
            variant={activeTab === "prospects" ? "default" : "ghost"} 
            className="w-full justify-start text-gray-500"
            onClick={() => setActiveTab("prospects")}
          >
            <Building2 className="h-5 w-5 mr-3" />
            Old Prospects
          </Button>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 mt-8">
          {user && (
            <div className="mb-4">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">Welcome, {user.firstName || user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className="md:hidden"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    From all sources and statuses
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    Companies with active status
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Prospects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{prospectCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    Potential clients in the sales pipeline
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest dashboard activity across all companies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Activity tracking is coming soon. This will display recent page visits,
                    contact form submissions, and other user interactions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* New Leads Tab */}
          <TabsContent value="new-leads">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>New Leads</CardTitle>
                  <CardDescription>
                    Manage and qualify new business opportunities
                  </CardDescription>
                </div>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Lead
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="leads-search" className="sr-only">Search</Label>
                    <Input
                      id="leads-search"
                      placeholder="Search by name, city, or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={!locationFilter ? "default" : "outline"}
                          onClick={() => setLocationFilter(null)}
                          size="sm"
                        >
                          All Locations
                        </Button>
                        <Button 
                          variant={locationFilter === "little-rock" ? "default" : "outline"}
                          onClick={() => setLocationFilter("little-rock")}
                          size="sm"
                        >
                          Little Rock, AR
                        </Button>
                        <Button 
                          variant={locationFilter === "birmingham" ? "default" : "outline"}
                          onClick={() => setLocationFilter("birmingham")}
                          size="sm"
                        >
                          Birmingham, AL
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredProspects.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No new leads found matching your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProspects.map((company) => (
                      <Card key={company.id} className="overflow-hidden border-l-4 border-l-yellow-400">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">New Lead</div>
                          </div>
                          <CardDescription className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 space-y-4">
                          <div className="text-sm space-y-2">
                            {company.phone && (
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-2" />
                                <span>{company.phone}</span>
                              </div>
                            )}
                            {company.contactEmail && (
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-2" />
                                <span>{company.contactEmail}</span>
                              </div>
                            )}
                            {company.site && (
                              <div className="flex items-center">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                <a href={company.site} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{company.site}</a>
                              </div>
                            )}
                          </div>
                          
                          <div className="border-t pt-3 mt-2">
                            <p className="text-xs text-gray-500 mb-2">Actions:</p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Button>
                              <Button variant="default" size="sm" className="flex-1">
                                Move to Pipeline
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pipeline Tab */}
          <TabsContent value="pipeline">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sales Pipeline</CardTitle>
                  <CardDescription>
                    Track and manage your active sales opportunities
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add to Pipeline
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <Label htmlFor="pipeline-search" className="text-sm mb-2 block">Search leads</Label>
                    <Input
                      id="pipeline-search"
                      placeholder="Search by name, city, state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Pipeline Stage Filter */}
                  <div>
                    <Label className="text-sm mb-2 block">Pipeline Stage</Label>
                    <select 
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      onChange={(e) => console.log(e.target.value)}
                      defaultValue="all"
                    >
                      <option value="all">All Stages</option>
                      <option value="new_lead">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="meeting_scheduled">Meeting Scheduled</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                    </select>
                  </div>
                  
                  {/* Location Filter */}
                  <div className="lg:col-span-2">
                    <Label className="text-sm mb-2 block">Location</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={!locationFilter ? "default" : "outline"}
                        onClick={() => setLocationFilter(null)}
                        size="sm"
                      >
                        All Locations
                      </Button>
                      <Button 
                        variant={locationFilter === "little-rock" ? "default" : "outline"}
                        onClick={() => setLocationFilter("little-rock")}
                        size="sm"
                      >
                        Little Rock, AR
                      </Button>
                      <Button 
                        variant={locationFilter === "birmingham" ? "default" : "outline"}
                        onClick={() => setLocationFilter("birmingham")}
                        size="sm"
                      >
                        Birmingham, AL
                      </Button>
                    </div>
                  </div>
                </div>
                
                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredProspects.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No leads found matching your filters.</p>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vertical Pipeline View */}
                    <div className="lg:w-1/3">
                      <h3 className="text-sm font-medium mb-3">Pipeline Companies</h3>
                      <div className="space-y-3">
                        {filteredProspects.map((company) => (
                          <Card 
                            key={company.id} 
                            className={`cursor-pointer hover:shadow-md transition-shadow ${
                              selectedCompany?.id === company.id ? 'border-primary' : ''
                            }`}
                            onClick={() => setSelectedCompany(company)}
                          >
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{company.name}</CardTitle>
                                <Badge 
                                  className={company.pipelineStage === 'new_lead' 
                                    ? "bg-blue-100 text-blue-800" 
                                    : company.pipelineStage === 'contacted' 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-green-100 text-green-800"
                                  }
                                >
                                  {company.pipelineStage === 'new_lead' 
                                    ? 'New Lead' 
                                    : company.pipelineStage === 'contacted'
                                    ? 'Contacted'
                                    : 'Meeting Scheduled'
                                  }
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-2" />
                                {company.city}, {company.state}
                              </div>
                              
                              {company.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                                  <span>{company.phone}</span>
                                </div>
                              )}
                              
                              {company.site && (
                                <div className="flex items-center text-sm">
                                  <ExternalLink className="h-3 w-3 mr-2 text-muted-foreground" />
                                  <a
                                    href={company.site}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline truncate"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {company.site}
                                  </a>
                                </div>
                              )}

                              {company.lastContactedAt && (
                                <div className="flex items-center text-xs mt-2 text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Last contact: {new Date(company.lastContactedAt).toLocaleDateString()}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    {/* Selected Company Details */}
                    <div className="lg:w-2/3">
                      {selectedCompany ? (
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{selectedCompany.name}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {selectedCompany.city}, {selectedCompany.state}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={selectedCompany.pipelineStage === 'new_lead' 
                                    ? "bg-blue-100 text-blue-800" 
                                    : selectedCompany.pipelineStage === 'contacted' 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-green-100 text-green-800"
                                  }
                                >
                                  {selectedCompany.pipelineStage === 'new_lead' 
                                    ? 'New Lead' 
                                    : selectedCompany.pipelineStage === 'contacted'
                                    ? 'Contacted'
                                    : 'Meeting Scheduled'
                                  }
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Company Info */}
                              <div className="space-y-3">
                                <h3 className="text-sm font-medium">Company Information</h3>
                                <div className="space-y-2">
                                  {selectedCompany.phone && (
                                    <div className="flex items-center text-sm">
                                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{selectedCompany.phone}</span>
                                    </div>
                                  )}
                                  {selectedCompany.site && (
                                    <div className="flex items-center text-sm">
                                      <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <a
                                        href={selectedCompany.site}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        {selectedCompany.site}
                                      </a>
                                    </div>
                                  )}
                                  {selectedCompany.rating && (
                                    <div className="flex items-center text-sm">
                                      <div className="flex mr-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <div
                                            key={i}
                                            className={`h-4 w-4 ${
                                              i < Math.floor(selectedCompany.rating || 0)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          >
                                            ★
                                          </div>
                                        ))}
                                      </div>
                                      <span>
                                        {selectedCompany.rating} ({selectedCompany.reviewCount || 0} reviews)
                                      </span>
                                    </div>
                                  )}
                                  {selectedCompany.employees && (
                                    <div className="flex items-center text-sm">
                                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{selectedCompany.employees} employees</span>
                                    </div>
                                  )}
                                  {selectedCompany.industry && (
                                    <div className="flex items-center text-sm">
                                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{selectedCompany.industry}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Contact Info */}
                              <div className="space-y-3">
                                <h3 className="text-sm font-medium">Contact Information</h3>
                                <div className="space-y-2">
                                  {selectedCompany.contactName && (
                                    <div className="flex items-center text-sm">
                                      <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{selectedCompany.contactName}</span>
                                    </div>
                                  )}
                                  {selectedCompany.contactEmail && (
                                    <div className="flex items-center text-sm">
                                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{selectedCompany.contactEmail}</span>
                                    </div>
                                  )}
                                  {selectedCompany.contactPhone && (
                                    <div className="flex items-center text-sm">
                                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>{selectedCompany.contactPhone}</span>
                                    </div>
                                  )}
                                  {selectedCompany.lastContactedAt && (
                                    <div className="flex items-center text-sm">
                                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span>Last contacted: {new Date(selectedCompany.lastContactedAt).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Pipeline Stage Management */}
                            <div className="pt-4 border-t">
                              <h3 className="text-sm font-medium mb-3">Pipeline Management</h3>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs mb-1 block">Move to Stage</Label>
                                  <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm">
                                      New Lead
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Contacted
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Meeting Scheduled
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Proposal Sent
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Won
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Lost
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Notes */}
                            <div className="pt-4 border-t">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-medium">Notes & History</h3>
                                <Button variant="ghost" size="sm">
                                  <Plus className="h-4 w-4 mr-1" /> Add Note
                                </Button>
                              </div>
                              <textarea
                                className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Add notes about this company..."
                                defaultValue={selectedCompany.notes || ""}
                              />
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-between pt-3 border-t">
                              <div>
                                <Button variant="outline" size="sm" className="mr-2">
                                  <Phone className="h-4 w-4 mr-2" />
                                  Log Call
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule Meeting
                                </Button>
                              </div>
                              <div>
                                <Button variant="default" size="sm">
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="h-full flex items-center justify-center border rounded-lg bg-muted/10 p-12">
                          <div className="text-center space-y-3">
                            <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="text-lg font-medium">Select a company</h3>
                            <p className="text-sm text-muted-foreground">
                              Click on a company card from the pipeline to view details and manage the lead.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Prospects Tab */}
          <TabsContent value="prospects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Prospect Management</CardTitle>
                  <CardDescription>
                    Manage potential HVAC contractor clients in your sales pipeline
                  </CardDescription>
                </div>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Prospect
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="prospect-search" className="sr-only">Search</Label>
                    <Input
                      id="prospect-search"
                      placeholder="Search by name, city, or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={!locationFilter ? "default" : "outline"}
                          onClick={() => setLocationFilter(null)}
                          size="sm"
                        >
                          All Locations
                        </Button>
                        <Button 
                          variant={locationFilter === "little-rock" ? "default" : "outline"}
                          onClick={() => setLocationFilter("little-rock")}
                          size="sm"
                        >
                          Little Rock, AR
                        </Button>
                        <Button 
                          variant={locationFilter === "birmingham" ? "default" : "outline"}
                          onClick={() => setLocationFilter("birmingham")}
                          size="sm"
                        >
                          Birmingham, AL
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredProspects.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No prospects found matching your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProspects.map((company) => (
                      <Card key={company.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <CardDescription className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 space-y-4">
                          <div className="text-sm space-y-2">
                            {company.phone && (
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-2" />
                                <span>{company.phone}</span>
                              </div>
                            )}
                            {company.contactEmail && (
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-2" />
                                <span>{company.contactEmail}</span>
                              </div>
                            )}
                            {company.site && (
                              <div className="flex items-center">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                <a href={company.site} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{company.site}</a>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <Badge variant="secondary">Prospect</Badge>
                            <div className="flex gap-2">
                              <Link href={`/${company.slug}`} target="_blank">
                                <Button variant="ghost" size="sm">
                                  Preview
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                Contact
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>
                    Manage your active HVAC contractor clients
                  </CardDescription>
                </div>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="client-search" className="sr-only">Search</Label>
                    <Input
                      id="client-search"
                      placeholder="Search by name, city, or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={!locationFilter ? "default" : "outline"}
                          onClick={() => setLocationFilter(null)}
                          size="sm"
                        >
                          All Locations
                        </Button>
                        <Button 
                          variant={locationFilter === "little-rock" ? "default" : "outline"}
                          onClick={() => setLocationFilter("little-rock")}
                          size="sm"
                        >
                          Little Rock, AR
                        </Button>
                        <Button 
                          variant={locationFilter === "birmingham" ? "default" : "outline"}
                          onClick={() => setLocationFilter("birmingham")}
                          size="sm"
                        >
                          Birmingham, AL
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No active clients found matching your filters.</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                      <div className="col-span-4">Name</div>
                      <div className="col-span-2">Location</div>
                      <div className="col-span-2">Website</div>
                      <div className="col-span-2">Last Contact</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    {filteredClients.map((company) => (
                      <div key={company.id} className="grid grid-cols-12 p-3 text-sm border-t hover:bg-gray-50">
                        <div className="col-span-4 flex items-center truncate">
                          <span className="font-medium truncate">{company.name}</span>
                        </div>
                        <div className="col-span-2 truncate">
                          {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                        </div>
                        <div className="col-span-2">
                          {company.site ? (
                            <a 
                              href={company.site} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Visit
                            </a>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </div>
                        <div className="col-span-2 text-gray-500">
                          {company.lastContactedAt ? 
                            new Date(company.lastContactedAt).toLocaleDateString() : 
                            'Never'}
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <Link href={`/${company.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Preview
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Companies Tab - Kept for backward compatibility, will be removed later */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Management</CardTitle>
                <CardDescription>
                  Manage all your HVAC contractor companies and prospects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">Search</Label>
                    <Input
                      id="search"
                      placeholder="Search by name, city, or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pipeline Status Filter */}
                    <div className="space-y-2">
                      <Label>Pipeline Status</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={!statusFilter ? "default" : "outline"}
                          onClick={() => setStatusFilter(null)}
                          size="sm"
                        >
                          All
                        </Button>
                        <Button 
                          variant={statusFilter === "prospect" ? "default" : "outline"}
                          onClick={() => setStatusFilter("prospect")}
                          size="sm"
                        >
                          Prospects
                        </Button>
                        <Button 
                          variant={statusFilter === "active" ? "default" : "outline"}
                          onClick={() => setStatusFilter("active")}
                          size="sm"
                        >
                          Active
                        </Button>
                        <Button 
                          variant={statusFilter === "inactive" ? "default" : "outline"}
                          onClick={() => setStatusFilter("inactive")}
                          size="sm"
                        >
                          Inactive
                        </Button>
                      </div>
                    </div>
                    
                    {/* Location Filter */}
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={!locationFilter ? "default" : "outline"}
                          onClick={() => setLocationFilter(null)}
                          size="sm"
                        >
                          All Locations
                        </Button>
                        <Button 
                          variant={locationFilter === "little-rock" ? "default" : "outline"}
                          onClick={() => setLocationFilter("little-rock")}
                          size="sm"
                        >
                          Little Rock, AR
                        </Button>
                        <Button 
                          variant={locationFilter === "birmingham" ? "default" : "outline"}
                          onClick={() => setLocationFilter("birmingham")}
                          size="sm"
                        >
                          Birmingham, AL
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredCompanies.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No companies found matching your filters.</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                      <div className="col-span-4">Name</div>
                      <div className="col-span-2">Location</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Last Contact</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    {filteredCompanies.map((company) => (
                      <div key={company.id} className="grid grid-cols-12 p-3 text-sm border-t hover:bg-gray-50">
                        <div className="col-span-4 flex items-center truncate">
                          <span className="font-medium truncate">{company.name}</span>
                        </div>
                        <div className="col-span-2 truncate">
                          {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                        </div>
                        <div className="col-span-2">
                          <Badge variant={
                            company.status === 'active' ? "default" :
                            company.status === 'prospect' ? "secondary" :
                            company.status === 'inactive' ? "outline" : "destructive"
                          }>
                            {company.status || 'Unknown'}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-gray-500">
                          {company.lastContactedAt ? 
                            new Date(company.lastContactedAt).toLocaleDateString() : 
                            'Never'}
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <Link href={`/${company.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Preview
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  User management functionality is coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar & Appointments</CardTitle>
                <CardDescription>Schedule and manage appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Calendar functionality is coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle>Domain Management</CardTitle>
                <CardDescription>Manage custom domains for client websites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Domain management functionality is coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}