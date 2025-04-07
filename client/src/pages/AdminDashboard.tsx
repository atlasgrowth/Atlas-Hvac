import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Users, Calendar, BarChart3, Globe, LogOut } from "lucide-react";
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
  
  // Filter companies
  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = !searchQuery || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.state?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || company.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
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
          <Button 
            variant={activeTab === "companies" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("companies")}
          >
            <Building2 className="h-5 w-5 mr-3" />
            Companies
          </Button>
          <Button 
            variant={activeTab === "users" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </Button>
          <Button 
            variant={activeTab === "calendar" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Calendar
          </Button>
          <Button 
            variant={activeTab === "domains" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("domains")}
          >
            <Globe className="h-5 w-5 mr-3" />
            Domains
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
          <TabsList className="md:hidden grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
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
          
          {/* Companies Tab */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Company Management</CardTitle>
                <CardDescription>
                  Manage all your HVAC contractor companies and prospects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                  <div className="flex gap-2">
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
                  </div>
                </div>

                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredCompanies?.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No companies found matching your filters.</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium">
                      <div className="col-span-5">Name</div>
                      <div className="col-span-3">Location</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    {filteredCompanies?.map((company) => (
                      <div key={company.id} className="grid grid-cols-12 p-3 text-sm border-t">
                        <div className="col-span-5 flex items-center">
                          {company.name}
                        </div>
                        <div className="col-span-3">
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
                        <div className="col-span-2">
                          <Button variant="ghost" size="sm">
                            View
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
                <CardDescription>
                  Manage system users and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management functionality is coming soon. This will allow you to add,
                  edit, and remove users from the system, as well as manage their roles.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Manage appointments and schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Calendar functionality is coming soon. This will allow you to track appointments,
                  set reminders, and manage your schedule across all clients.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle>Domain Management</CardTitle>
                <CardDescription>
                  Manage custom domains for your client websites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Domain management functionality is coming soon. This will allow you to configure
                  custom domains for each client, set up DNS records, and manage SSL certificates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}