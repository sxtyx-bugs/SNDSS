import CountdownTimer from '../CountdownTimer';

export default function CountdownTimerExample() {
  // Mock expiry time 30 seconds from now for demonstration
  const expiresAt = new Date(Date.now() + 30000).toISOString();
  
  return (
    <div className="p-4 space-y-4">
      <CountdownTimer 
        expiresAt={expiresAt} 
        onExpired={() => console.log('Timer expired!')} 
      />
      
      {/* Additional examples with different times */}
      <CountdownTimer 
        expiresAt={new Date(Date.now() + 90000).toISOString()} 
        onExpired={() => console.log('90 second timer expired!')} 
      />
      
      <CountdownTimer 
        expiresAt={new Date(Date.now() + 5000).toISOString()} 
        onExpired={() => console.log('5 second timer expired!')} 
      />
    </div>
  );
}