import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function StealthLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            Digital Solutions Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide professional digital solutions and web utilities to help modern businesses 
            streamline their operations and enhance productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover-elevate" data-testid="card-service-consulting">
            <CardHeader>
              <CardTitle className="text-xl">Web Consulting</CardTitle>
              <CardDescription>
                Strategic guidance for your digital transformation journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Expert advice on web technologies, architecture decisions, and best practices 
                to help your business succeed online.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-service-development">
            <CardHeader>
              <CardTitle className="text-xl">Custom Development</CardTitle>
              <CardDescription>
                Tailored solutions built for your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From simple utilities to complex applications, we create solutions 
                that integrate seamlessly with your existing workflow.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-service-support">
            <CardHeader>
              <CardTitle className="text-xl">Technical Support</CardTitle>
              <CardDescription>
                Ongoing maintenance and optimization services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep your digital assets running smoothly with our comprehensive 
                support and monitoring services.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card data-testid="card-contact">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
              <CardDescription>
                Ready to discuss your project? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3" data-testid="contact-email">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-foreground">contact@digitalsolutions.com</span>
              </div>
              <div className="flex items-center gap-3" data-testid="contact-phone">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3" data-testid="contact-address">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-foreground">123 Business Ave, Suite 100, City, State 12345</span>
              </div>
              <div className="pt-4 text-center">
                <Button data-testid="button-contact" onClick={() => console.log('Contact form opened')}>
                  Start a Conversation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}