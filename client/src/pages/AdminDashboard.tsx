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
              <CardContent className="pb-1">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="pipeline-search" className="sr-only">Search</Label>
                      <Input
                        id="pipeline-search"
                        placeholder="Search pipeline..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
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
                        Little Rock
                      </Button>
                      <Button 
                        variant={locationFilter === "birmingham" ? "default" : "outline"}
                        onClick={() => setLocationFilter("birmingham")}
                        size="sm"
                      >
                        Birmingham
                      </Button>
                    </div>
                  </div>
                </div>
                
                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-auto pb-6">
                    <div className="flex gap-4 min-w-max">
                      {/* Pipeline Stage: Contacted */}
                      <div className="w-80 shrink-0">
                        <div className="bg-gray-100 px-3 py-2 rounded-t-md">
                          <h3 className="font-medium flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            Contacted <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">3</Badge>
                          </h3>
                        </div>
                        <div className="mt-2 space-y-3">
                          {filteredProspects.slice(0, 3).map((company) => (
                            <Card key={`contacted-${company.id}`} className="overflow-hidden shadow-sm border-l-[3px] border-l-blue-500">
                              <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                                <CardDescription className="text-xs flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                    <span className="text-gray-500">Call scheduled: Apr 09</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <Badge variant="outline" className="text-xs">New</Badge>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Company
                          </Button>
                        </div>
                      </div>
                      
                      {/* Pipeline Stage: Meeting Scheduled */}
                      <div className="w-80 shrink-0">
                        <div className="bg-gray-100 px-3 py-2 rounded-t-md">
                          <h3 className="font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                            Meeting Scheduled <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100">2</Badge>
                          </h3>
                        </div>
                        <div className="mt-2 space-y-3">
                          {filteredProspects.slice(1, 3).map((company) => (
                            <Card key={`meeting-${company.id}`} className="overflow-hidden shadow-sm border-l-[3px] border-l-purple-500">
                              <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                                <CardDescription className="text-xs flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                    <span className="text-gray-500">Meeting: Apr 12 @ 2:00 PM</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <Badge variant="outline" className="text-xs">Priority</Badge>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Company
                          </Button>
                        </div>
                      </div>
                      
                      {/* Pipeline Stage: Proposal Sent */}
                      <div className="w-80 shrink-0">
                        <div className="bg-gray-100 px-3 py-2 rounded-t-md">
                          <h3 className="font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-amber-600" />
                            Proposal Sent <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">2</Badge>
                          </h3>
                        </div>
                        <div className="mt-2 space-y-3">
                          {filteredProspects.slice(2, 4).map((company) => (
                            <Card key={`proposal-${company.id}`} className="overflow-hidden shadow-sm border-l-[3px] border-l-amber-500">
                              <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                                <CardDescription className="text-xs flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1 text-gray-500" />
                                    <span className="text-gray-500">Proposal sent: Apr 05</span>
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1 text-gray-500" />
                                    <span className="text-gray-500">Value: $4,500</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <Badge variant="outline" className="text-xs">Follow up</Badge>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Company
                          </Button>
                        </div>
                      </div>
                      
                      {/* Pipeline Stage: Negotiation */}
                      <div className="w-80 shrink-0">
                        <div className="bg-gray-100 px-3 py-2 rounded-t-md">
                          <h3 className="font-medium flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                            Negotiation <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">1</Badge>
                          </h3>
                        </div>
                        <div className="mt-2 space-y-3">
                          {filteredProspects.slice(0, 1).map((company) => (
                            <Card key={`negotiation-${company.id}`} className="overflow-hidden shadow-sm border-l-[3px] border-l-green-500">
                              <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                                <CardDescription className="text-xs flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {company.city}{company.city && company.state ? ', ' : ''}{company.state}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                <div className="text-xs space-y-1">
                                  <div className="flex items-center">
                                    <MessageSquare className="h-3 w-3 mr-1 text-gray-500" />
                                    <span className="text-gray-500">Last contact: Apr 06</span>
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1 text-gray-500" />
                                    <span className="text-gray-500">Value: $7,800</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <Badge variant="outline" className="text-xs">Hot lead</Badge>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full mt-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Company
                          </Button>
                        </div>
                      </div>
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