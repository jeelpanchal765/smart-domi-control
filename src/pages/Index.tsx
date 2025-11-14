import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import smartHomeIcon from "@/assets/smart-home-icon.png";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-8">
          <img src={smartHomeIcon} alt="Smart Home" className="w-32 h-32" />
        </div>
        <h1 className="mb-4 text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Smart Home Automation
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Control your home devices from anywhere. Connect, manage, and automate your smart home ecosystem.
        </p>
        <Button
          onClick={() => navigate("/auth")}
          className="bg-gradient-primary hover:shadow-hover transition-all text-lg px-8 py-6"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
