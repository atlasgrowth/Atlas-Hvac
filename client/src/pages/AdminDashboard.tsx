import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DollarSign,
  ArrowDownToLine,
  Search,
  Upload,
  ArrowLeft,
  Save,
  Monitor,
  X
} from "lucide-react";
import { Company } from "@/types/company";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetail, setShowCompanyDetail] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [pipelineStage, setPipelineStage] = useState<"new_lead" | "contacted" | "website_sent" | "website_viewed" | "meeting_scheduled" | "proposal_sent" | "negotiation" | "won" | "lost">("new_lead");
  
  const { data: companies, isLoading: isLoadingCompanies } = useQuery<Company[]>({
    queryKey: ["/api/admin/companies"],
    enabled: !!user,
  });
  
  // Mutations for updating company
  const updateCompanyMutation = useMutation({
    mutationFn: async (data: { id: number; updateData: Partial<Company> }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/admin/companies/${data.id}`, 
        data.updateData
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      toast({
        title: "Success",
        description: "Company information updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update company",
        variant: "destructive",
      });
    },
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
                  <CardTitle>New Lead Import</CardTitle>
                  <CardDescription>
                    Find and import new business opportunities
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                  <Button size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Find Leads
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4 bg-muted/20">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-grow space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Search for HVAC businesses by location</h3>
                        <div className="flex gap-2">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Cities</SelectItem>
                              <SelectItem value="little-rock">Little Rock, AR</SelectItem>
                              <SelectItem value="birmingham">Birmingham, AL</SelectItem>
                              <SelectItem value="nashville">Nashville, TN</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm mb-2">Recent searches:</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">HVAC, Little Rock, AR</Badge>
                          <Badge variant="secondary">HVAC, Birmingham, AL</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center md:text-right">
                      <p className="text-sm text-muted-foreground mb-1">This month's quota:</p>
                      <div className="text-2xl font-bold">150 <span className="text-sm text-muted-foreground">searches left</span></div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Recent imports</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 border rounded flex items-center justify-between">
                      <div>
                        <span className="font-medium">HVAC Leads - Little Rock</span>
                        <span className="text-muted-foreground ml-2">• 47 leads</span> 
                        <span className="text-muted-foreground ml-2">• Apr 5, 2025</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowDownToLine className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="p-2 border rounded flex items-center justify-between">
                      <div>
                        <span className="font-medium">Birmingham HVAC Businesses</span>
                        <span className="text-muted-foreground ml-2">• 32 leads</span> 
                        <span className="text-muted-foreground ml-2">• Mar 27, 2025</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowDownToLine className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pipeline Tab */}
          <TabsContent value="pipeline">
            {!showCompanyDetail ? (
              // Grid view - list of companies
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sales Pipeline</CardTitle>
                    <CardDescription>
                      Track and manage your active sales opportunities
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Lead
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
                    
                    {/* Location Filter */}
                    <div>
                      <Label className="text-sm mb-2 block">Location</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={!locationFilter ? "default" : "outline"}
                          onClick={() => setLocationFilter(null)}
                          size="sm"
                        >
                          All
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
                  ) : filteredProspects.length === 0 ? (
                    <div className="text-center py-8">
                      <p>No leads found matching your filters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProspects.map((company) => (
                        <Card 
                          key={company.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowCompanyDetail(true);
                            setPipelineStage(company.pipelineStage || "new_lead");
                            setNotes(company.notes || "");
                          }}
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
                            
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {company.pipelineStage ? company.pipelineStage.replace('_', ' ') : 'New Lead'}
                              </Badge>
                              <a 
                                href={`/${company.slug}`} 
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                className="text-blue-500 hover:underline text-xs flex items-center"
                              >
                                <Monitor className="h-3 w-3 mr-1" />
                                View Demo Site
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Detail view - single company
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => setShowCompanyDetail(false)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <div>
                      <CardTitle>{selectedCompany!.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedCompany!.city}, {selectedCompany!.state}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    className={selectedCompany?.pipelineStage === 'new_lead' 
                      ? "bg-blue-100 text-blue-800" 
                      : selectedCompany?.pipelineStage === 'contacted' 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-green-100 text-green-800"
                    }
                  >
                    {selectedCompany?.pipelineStage === 'new_lead' 
                      ? 'New Lead' 
                      : selectedCompany?.pipelineStage === 'contacted'
                      ? 'Contacted'
                      : 'Meeting Scheduled'
                    }
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Info */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Company Information</h3>
                      <div className="space-y-2">
                        {selectedCompany?.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedCompany.phone}</span>
                          </div>
                        )}
                        {selectedCompany?.site && (
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
                        {selectedCompany?.rating && (
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
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Contact Information</h3>
                      <div className="space-y-2">
                        {selectedCompany?.contactName && (
                          <div className="flex items-center text-sm">
                            <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedCompany.contactName}</span>
                          </div>
                        )}
                        {selectedCompany?.contactEmail && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedCompany.contactEmail}</span>
                          </div>
                        )}
                        {selectedCompany?.lastContactedAt && (
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
                          <Button 
                            variant={pipelineStage === "new_lead" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("new_lead")}
                          >
                            New Lead
                          </Button>
                          <Button 
                            variant={pipelineStage === "contacted" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("contacted")}
                          >
                            Contacted
                          </Button>
                          <Button 
                            variant={pipelineStage === "website_sent" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("website_sent")}
                          >
                            Website Sent
                          </Button>
                          <Button 
                            variant={pipelineStage === "website_viewed" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("website_viewed")}
                          >
                            Website Viewed
                          </Button>
                          <Button 
                            variant={pipelineStage === "meeting_scheduled" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("meeting_scheduled")}
                          >
                            Meeting Scheduled
                          </Button>
                          <Button 
                            variant={pipelineStage === "proposal_sent" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("proposal_sent")}
                          >
                            Proposal Sent
                          </Button>
                          <Button 
                            variant={pipelineStage === "won" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("won")}
                          >
                            Won
                          </Button>
                          <Button 
                            variant={pipelineStage === "lost" ? "default" : "outline"} 
                            size="sm"
                            onClick={() => setPipelineStage("lost")}
                          >
                            Lost
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity Tracking */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium">Site Activity</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h4 className="text-xs text-muted-foreground mb-1">Total Page Views</h4>
                            <div className="text-2xl font-semibold">12</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h4 className="text-xs text-muted-foreground mb-1">Avg. Time on Site</h4>
                            <div className="text-2xl font-semibold">1:45</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center">
                            <h4 className="text-xs text-muted-foreground mb-1">Last Visit</h4>
                            <div className="text-2xl font-semibold">Today</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="border rounded-md mb-4">
                      <div className="p-3 bg-muted text-sm font-medium">Recent Visits</div>
                      <div className="divide-y">
                        <div className="p-3 text-sm">
                          <div className="flex justify-between">
                            <div className="font-medium">Home Page</div>
                            <div className="text-muted-foreground">10:23 AM, Today</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Duration: 2m 15s</div>
                        </div>
                        <div className="p-3 text-sm">
                          <div className="flex justify-between">
                            <div className="font-medium">Services Page</div>
                            <div className="text-muted-foreground">Yesterday</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Duration: 1m 47s</div>
                        </div>
                        <div className="p-3 text-sm">
                          <div className="flex justify-between">
                            <div className="font-medium">Contact Page</div>
                            <div className="text-muted-foreground">Apr 6, 2025</div>
                          </div>
                          <div className="text-xs text-muted-foreground">Duration: 38s</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium">Notes & History</h3>
                    </div>
                    <textarea
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Add notes about this company..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          updateCompanyMutation.mutate({
                            id: selectedCompany!.id,
                            updateData: {
                              pipelineStage: pipelineStage,
                              notes: notes,
                              lastContactedAt: new Date().toISOString()
                            }
                          });
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
                              <a href={`/${company.slug}`} target="_blank">
                                <Button variant="ghost" size="sm">
                                  Preview
                                </Button>
                              </a>
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
                          <a href={`/${company.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Preview
                            </Button>
                          </a>
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
                          <a href={`/${company.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              Preview
                            </Button>
                          </a>
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