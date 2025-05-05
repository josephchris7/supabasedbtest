import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ConnectionStatus() {
  const [apiUrl, setApiUrl] = useState<string>("https://example.supabase.co");
  const [apiKey, setApiKey] = useState<string>("your-api-key");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const testConnection = async () => {
    setIsConnecting(true);
    
    try {
      // In a real application, we would make a test request to Supabase here
      // For this demo, we'll simulate a successful connection after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Supabase",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Could not connect to Supabase",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-900">Supabase Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
            <Input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="rounded-md border border-gray-300"
              placeholder="Enter Supabase URL"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="rounded-md border border-gray-300"
              placeholder="Enter API Key"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={testConnection} 
              disabled={isConnecting}
              className="bg-primary hover:bg-blue-600 text-white transition-colors"
            >
              {isConnecting ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
