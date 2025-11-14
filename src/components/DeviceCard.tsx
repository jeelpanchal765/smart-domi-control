import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import tvIcon from "@/assets/tv-icon.png";
import acIcon from "@/assets/ac-icon.png";
import cameraIcon from "@/assets/camera-icon.png";

interface DeviceCardProps {
  id: string;
  deviceType: string;
  deviceName: string;
  isConnected: boolean;
  onUpdate: () => void;
}

const deviceIcons: Record<string, string> = {
  TV: tvIcon,
  AC: acIcon,
  Camera: cameraIcon,
};

export const DeviceCard = ({
  id,
  deviceType,
  deviceName,
  isConnected,
  onUpdate,
}: DeviceCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("devices")
        .update({ is_connected: true })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${deviceName} connected successfully!`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("devices")
        .update({ is_connected: false })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${deviceName} disconnected successfully!`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 hover:shadow-hover transition-all bg-gradient-card">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
          <img
            src={deviceIcons[deviceType]}
            alt={deviceType}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{deviceName}</h3>
          <p className="text-sm text-muted-foreground">
            {isConnected ? "Connected" : "Disconnected"}
          </p>
        </div>
        <div className="flex gap-2">
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              Connect
            </Button>
          ) : (
            <Button
              onClick={handleRemove}
              disabled={isLoading}
              variant="outline"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
