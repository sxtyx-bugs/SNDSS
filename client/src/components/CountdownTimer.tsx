import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  expiresAt: string;
  onExpired?: () => void;
}

export default function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;
      
      if (difference <= 0) {
        setExpired(true);
        setTimeLeft(0);
        onExpired?.();
        return;
      }
      
      setTimeLeft(difference);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getTimerColor = () => {
    const totalMinutes = timeLeft / (1000 * 60);
    if (expired) return "text-destructive";
    if (totalMinutes < 2) return "text-destructive";
    if (totalMinutes < 5) return "text-amber-500";
    return "text-green-600";
  };

  const getTimerIcon = () => {
    const totalMinutes = timeLeft / (1000 * 60);
    if (expired || totalMinutes < 2) {
      return <AlertTriangle className="h-5 w-5" />;
    }
    return <Clock className="h-5 w-5" />;
  };

  if (expired) {
    return (
      <div className="flex items-center gap-2 text-destructive" data-testid="timer-expired">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Content Expired</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${getTimerColor()}`} data-testid="countdown-timer">
      {getTimerIcon()}
      <span className="font-medium" data-testid="timer-value">
        Expires in {formatTime(timeLeft)}
      </span>
    </div>
  );
}