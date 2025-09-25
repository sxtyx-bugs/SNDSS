import ShareView from '../ShareView';

export default function ShareViewExample() {
  return (
    <ShareView 
      shareId="demo123" 
      onNavigateHome={() => console.log('Navigate to home')} 
    />
  );
}