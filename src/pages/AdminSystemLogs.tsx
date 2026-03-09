import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Navigate } from "react-router-dom";
import { Loader2, Activity, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function AdminSystemLogs() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["system-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
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

  const filteredLogs = logs?.filter(
    (log) =>
      log.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventColor = (eventType: string) => {
    if (eventType.includes("erro") || eventType.includes("error") || eventType.includes("negado")) {
      return "destructive";
    }
    if (eventType.includes("permitido") || eventType.includes("granted") || eventType.includes("renewed") || eventType.includes("liberado") || eventType.includes("renovado")) {
      return "default";
    }
    if (eventType.includes("cancelad") || eventType.includes("cancelled")) {
      return "secondary";
    }
    return "outline";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Activity className="h-7 w-7 text-primary" /> Eventos do Sistema
        </h1>
        <p className="text-muted-foreground mt-1">
          Registro de eventos e erros do sistema
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por tipo de evento ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Tipo de Evento</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm">
                  {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <Badge variant={getEventColor(log.event_type)}>
                    {log.event_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{log.description}</TableCell>
              </TableRow>
            ))}
            {filteredLogs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Nenhum evento encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
