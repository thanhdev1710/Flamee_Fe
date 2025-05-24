import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Search, Filter } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Flamee Community Meetup",
      date: "2024-02-15",
      time: "18:00",
      location: "Ho Chi Minh City",
      attendees: 45,
      maxAttendees: 100,
      category: "Meetup",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Join fellow Flamee users for an evening of networking and community building.",
    },
    {
      id: 2,
      title: "Social Media Workshop",
      date: "2024-02-20",
      time: "14:00",
      location: "Online",
      attendees: 120,
      maxAttendees: 200,
      category: "Workshop",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Learn advanced social media strategies and content creation techniques.",
    },
    {
      id: 3,
      title: "Flamee Creator Conference",
      date: "2024-03-05",
      time: "09:00",
      location: "Hanoi",
      attendees: 200,
      maxAttendees: 500,
      category: "Conference",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Annual conference for content creators and social media influencers.",
    },
    {
      id: 4,
      title: "Photography Challenge",
      date: "2024-03-12",
      time: "10:00",
      location: "Da Nang",
      attendees: 30,
      maxAttendees: 50,
      category: "Challenge",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Capture the beauty of Da Nang in our monthly photography challenge.",
    },
    {
      id: 5,
      title: "Tech Talk: Future of Social",
      date: "2024-03-18",
      time: "19:00",
      location: "Online",
      attendees: 85,
      maxAttendees: 150,
      category: "Tech Talk",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Explore the future of social media and emerging technologies.",
    },
    {
      id: 6,
      title: "Community Volunteer Day",
      date: "2024-03-25",
      time: "08:00",
      location: "Ho Chi Minh City",
      attendees: 60,
      maxAttendees: 80,
      category: "Volunteer",
      image: "/placeholder.svg?height=200&width=400",
      description:
        "Give back to the community with our monthly volunteer activities.",
    },
  ];

  const categories = [
    "All",
    "Meetup",
    "Workshop",
    "Conference",
    "Challenge",
    "Tech Talk",
    "Volunteer",
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
            Events
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Connect Through
            <span className="block text-primary">Amazing Events</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Join our vibrant community at exciting events, workshops, and
            meetups. Network with like-minded people and grow your social
            connections.
          </p>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-background p-6 rounded-2xl shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search events..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="hcm">Ho Chi Minh City</SelectItem>
                  <SelectItem value="hanoi">Hanoi</SelectItem>
                  <SelectItem value="danang">Da Nang</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
              <Button className="px-8">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button variant="outline">Create Event</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="relative">
                  <Image
                    width={600}
                    height={400}
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">
                    {event.category}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString("vi-VN")} at{" "}
                    {event.time}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees}/{event.maxAttendees} attendees
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${
                          (event.attendees / event.maxAttendees) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <Button className="w-full mt-4">Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-orange-100 text-orange-600"
              >
                Featured Event
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Flamee Annual Summit 2024
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join us for our biggest event of the year! Connect with
                thousands of Flamee users, attend inspiring talks, participate
                in workshops, and celebrate our amazing community.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <span>April 15-16, 2024</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>Saigon Convention Center, Ho Chi Minh City</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <span>2,000+ Expected Attendees</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>2 Days of Amazing Content</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8">
                  Register Now
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                width={600}
                height={400}
                src="/placeholder.svg?height=500&width=600"
                alt="Flamee Annual Summit"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
