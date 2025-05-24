import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Zap, Globe } from "lucide-react";
import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";
import Image from "next/image";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Passionate about connecting people through technology.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Building scalable solutions for the next generation.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Creating beautiful experiences that users love.",
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Spreading the word about amazing social connections.",
    },
  ];

  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description:
        "We believe in building strong, supportive communities where everyone feels welcome and valued.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Authentic Connections",
      description:
        "We foster genuine relationships and meaningful interactions between our users.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation",
      description:
        "We continuously push boundaries to create cutting-edge social experiences.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Impact",
      description:
        "We're committed to making a positive difference in communities worldwide.",
    },
  ];

  const stats = [
    { number: "2M+", label: "Active Users" },
    { number: "50+", label: "Countries" },
    { number: "10M+", label: "Posts Shared" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen">
      <MenuBar />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-4 bg-orange-100 text-orange-600"
          >
            About Us
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Building the Future of
            <span className="block text-primary">Social Connection</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At Flamee, we&apos;re passionate about creating meaningful
            connections in the digital age. Our platform empowers people to
            share their stories, build communities, and discover new
            perspectives from around the world.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-orange-100 text-orange-600"
              >
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Empowering Human Connection
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We believe that technology should bring people closer together,
                not drive them apart. Our mission is to create a social platform
                that prioritizes authentic relationships, meaningful
                conversations, and positive community building.
              </p>
              <div className="flex items-center space-x-4">
                <Target className="h-6 w-6 text-primary" />
                <span className="font-medium">
                  Connecting 10 million users by 2025
                </span>
              </div>
            </div>
            <div className="relative">
              <Image
                height={400}
                width={600}
                src="/placeholder.svg?height=400&width=600"
                alt="Team collaboration"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-orange-100 text-orange-600"
            >
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape the culture
              we&apos;re building at Flamee.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-orange-100 text-orange-600"
            >
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Meet the People Behind Flamee
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our diverse team of passionate individuals is dedicated to
              creating the best social experience for our users.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Be part of the social revolution. Connect with like-minded people
            and share your story with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8">
              Get Started Today
            </Button>
            <Button size="lg" variant="ghost" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
