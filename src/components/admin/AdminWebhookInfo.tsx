import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Webhook, Copy, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function AdminWebhookInfo() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kiwify-webhook`;

  const { data: lastEvent } = useQuery({
    queryKey: ["admin-last-webhook"],
    queryFn: async () => {
      const { data } = await supabase
        .from("webhook_logs")
        .select("event_type, received_at, status")
        .order("received_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    staleTime: 30000,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast({ title: "URL copiada!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Webhook className="h-5 w-5 text-primary" />
          Webhook Central
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-secondary/50 px-3 py-2 rounded-lg border border-border truncate text-muted-foreground">
            {webhookUrl}
          </code>
          <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
            {copied ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Último evento:</span>
          </div>
          {lastEvent ? (
            <div className="flex items-center gap-2">
              <code className="text-xs bg-secondary px-2 py-0.5 rounded">{lastEvent.event_type}</code>
              <span className="text-xs text-muted-foreground">{format(new Date(lastEvent.received_at), "dd/MM/yyyy HH:mm")}</span>
              <Badge variant={lastEvent.status === "success" ? "default" : "destructive"} className="text-[10px]">
                {lastEvent.status}
              </Badge>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Nenhum evento recebido</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
