import { useRoute } from "wouter";
import { useLocation } from "wouter";
import ShareView from "@/components/ShareView";

export default function Share() {
  const [, params] = useRoute("/share/:id");
  const [, setLocation] = useLocation();

  const shareId = params?.id || "";

  const handleNavigateHome = () => {
    setLocation("/app");
  };

  return (
    <ShareView 
      shareId={shareId} 
      onNavigateHome={handleNavigateHome} 
    />
  );
}