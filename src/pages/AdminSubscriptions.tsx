import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Navigate } from "react-router-dom";
import { Loader2, CreditCard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function AdminSubscriptions() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(`
          *,
          profiles!inner(full_name, email),
          subscription_plans!inner(plan_name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  if (adminLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const filteredSubs = subscriptions?.filter(
    (sub: any) =>
      sub.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.app_key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "cancelled":
        return "destructive";
      case "expired":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <CreditCard className="h-7 w-7 text-primary" /> Assinaturas
        </h1>
        <p className="text-muted-foreground mt-1">
          Todas as assinaturas dos usuários
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por email, nome ou aplicativo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Aplicativo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Expiração</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubs?.map((sub: any) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">
                  {sub.profiles?.full_name || "-"}
                </TableCell>
                <TableCell className="text-sm">{sub.profiles?.email}</TableCell>
                <TableCell className="text-sm">
                  {sub.subscription_plans?.plan_name}
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-secondary px-2 py-1 rounded">
                    {sub.app_key}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(sub.status)}>
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(sub.started_at), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-sm">
                  {sub.expires_at
                    ? format(new Date(sub.expires_at), "dd/MM/yyyy")
                    : "Vitalício"}
                </TableCell>
              </TableRow>
            ))}
            {filteredSubs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhuma assinatura encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
