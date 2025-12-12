import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, ArrowRight } from "lucide-react";

const services = [
  {
    id: "at-ishare",
    title: "AT iShare Business",
    description: "Stay connected with AT iShare bundles. Enjoy seamless browsing, streaming, and downloading with our affordable and flexible data plans.",
    icon: "🌐",
    color: "from-blue-600 to-blue-400",
    url: "/services/at-ishare",
  },
  {
    id: "mtn-up2u",
    title: "MTN UP2U Business",
    description: "Get high-speed data with MTN UP2U. Flexible bundles tailored for your needs with reliable connectivity.",
    icon: "📱",
    color: "from-yellow-600 to-yellow-400",
    url: "/services/mtn-up2u",
  },
  {
    id: "telecel",
    title: "Telecel Business",
    description: "Experience fast and reliable data with Telecel. Affordable bundles perfect for all your digital needs.",
    icon: "🚀",
    color: "from-red-600 to-red-400",
    url: "/services/telecel",
  },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary/90 to-primary/70 text-white px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wifi className="h-8 w-8" />
            <h1 className="text-3xl md:text-5xl font-bold">Our Services</h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Choose from our premium data bundle providers and enjoy seamless connectivity
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 py-8 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border-border hover:border-primary/50"
                onClick={() => navigate(service.url)}
              >
                {/* Color gradient top */}
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-4xl">{service.icon}</span>
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>

                <CardContent className="pb-6">
                  <CardDescription className="text-sm mb-6 text-muted-foreground">
                    {service.description}
                  </CardDescription>

                  {/* CTA Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.url);
                    }}
                    className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-card rounded-xl p-8 border border-border">
            <h3 className="text-lg font-semibold mb-4">Why Choose Our Services?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Affordable Pricing</h4>
                  <p className="text-sm text-muted-foreground">Competitive rates for all data bundles</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Instant Delivery</h4>
                  <p className="text-sm text-muted-foreground">Bundles activated immediately after purchase</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Secure Payment</h4>
                  <p className="text-sm text-muted-foreground">Safe transactions via Paystack</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
