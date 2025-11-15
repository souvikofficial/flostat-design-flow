import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Mail, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const roleColors = {
  Admin: "bg-destructive/10 text-destructive border-destructive/20",
  "Pending Request": "bg-warning/10 text-warning border-warning/20",
  Controller: "bg-aqua/10 text-aqua border-aqua/20",
  Guest: "bg-muted text-muted-foreground border-border",
} as const;

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  lastActive?: string;
  department?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.users.getAll();
      if (response.success) {
        // Transform the data to match the expected format
        const transformedUsers = response.users.map((user: any) => ({
          id: user.id || user.email,
          email: user.email,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role || "Pending Request",
          lastActive: user.lastActive || "Recently",
          department: user.department || "Not specified"
        }));
        setUsers(transformedUsers);
      } else {
        setError(response.message || "Failed to fetch users");
        toast({
          title: "Error",
          description: response.message || "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.message || "Failed to fetch users");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
          </div>
          <Button variant="aqua" className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
          </div>
          <Button variant="aqua" className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error: {error}</p>
            <Button onClick={fetchUsers}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
        </div>
        <Button variant="aqua" className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Role summary cards moved below search */}
      <div className="grid gap-4 md:grid-cols-4">
        {['Admin','Controller','Guest','Pending Request'].map((role) => {
          const count = filteredUsers.filter((u) => u.role === role).length;
          const label = role === 'Pending Request' ? 'Pending Requests' : `${role}s`;
          const isPending = role === 'Pending Request';
          return (
            <div key={role} className={"rounded-lg border bg-card p-4 shadow-elevation-1 flex flex-col"}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">{label}</div>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <span
                  className={"inline-flex items-center justify-center rounded-full font-bold text-sm h-10 w-10 " + (isPending ? "bg-[#C00000] text-white shadow-[0_0_0_6px_rgba(192,0,0,0.25)]" : "bg-muted text-soft")}
                  aria-label={`${count} ${label}`}
                >
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card shadow-elevation-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">User ID</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Last Active</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-sm">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColors[user.role || "Pending Request"]}>
                    <Shield className="mr-1 h-3 w-3" />
                    {user.role || "Pending Request"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.department || "Not specified"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.lastActive || "Recently"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary cards moved above; removed from bottom */}
    </div>
  );
}