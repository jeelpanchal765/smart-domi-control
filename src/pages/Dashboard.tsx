import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { DeviceCard } from "@/components/DeviceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import smartHomeIcon from "@/assets/smart-home-icon.png";

interface Device {
  id: string;
  device_type: string;
  device_name: string;
  is_connected: boolean;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDeviceType, setNewDeviceType] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const { toast } = useToast();

  const fetchDevices = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching devices:", error);
      return;
    }

    setDevices(data || []);
  };

  useEffect(() => {
    fetchDevices();
  }, [user]);

  const handleAddDevice = async () => {
    if (!user || !newDeviceType || !newDeviceName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("devices").insert({
      user_id: user.id,
      device_type: newDeviceType,
      device_name: newDeviceName,
      is_connected: false,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Device added successfully!",
    });

    setIsAddDialogOpen(false);
    setNewDeviceType("");
    setNewDeviceName("");
    fetchDevices();
  };

  const filteredDevices = devices.filter((device) =>
    device.device_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={smartHomeIcon} alt="Smart Home" className="w-12 h-12" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Home Automation
            </h1>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your device"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-hover transition-all gap-2">
                <Plus className="w-4 h-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Device Type
                  </label>
                  <Select value={newDeviceType} onValueChange={setNewDeviceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TV">TV</SelectItem>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="Camera">Camera</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Device Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Living Room TV"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddDevice}
                  className="w-full bg-gradient-primary"
                >
                  Add Device
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery
                  ? "No devices found matching your search"
                  : "No devices added yet. Click 'Add Device' to get started!"}
              </p>
            </div>
          ) : (
            filteredDevices.map((device) => (
              <DeviceCard
                key={device.id}
                id={device.id}
                deviceType={device.device_type}
                deviceName={device.device_name}
                isConnected={device.is_connected}
                onUpdate={fetchDevices}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
