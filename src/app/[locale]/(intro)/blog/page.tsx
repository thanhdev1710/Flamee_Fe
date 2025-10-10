import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Search, ArrowRight, TrendingUp } from "lucide-react";
import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";
import Image from "next/image";

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "The Future of Social Media: Trends to Watch in 2024",
    excerpt:
      "Discover the emerging trends that will shape social media platforms and user behavior in the coming year.",
    content: "Social media continues to evolve at a rapid pace...",
    author: "Sarah Johnson",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Trends",
    image: "/placeholder.svg?height=400&width=800",
    featured: true,
  };

  const blogPosts = [
    {
      id: 2,
      title: "Building Authentic Communities Online",
      excerpt:
        "Learn how to create and nurture genuine connections in digital spaces.",
      author: "Michael Chen",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2024-01-12",
      readTime: "6 min read",
      category: "Community",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "Content Creation Tips for Social Media Success",
      excerpt:
        "Master the art of creating engaging content that resonates with your audience.",
      author: "Emily Rodriguez",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2024-01-10",
      readTime: "5 min read",
      category: "Content",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      title: "Privacy and Security in Social Networking",
      excerpt:
        "Understanding how to protect your personal information while staying connected.",
      author: "David Kim",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Security",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      title: "The Psychology of Social Media Engagement",
      excerpt:
        "Explore the psychological factors that drive user engagement on social platforms.",
      author: "Dr. Lisa Wang",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Psychology",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 6,
      title: "Monetizing Your Social Media Presence",
      excerpt:
        "Discover strategies to turn your social media following into a sustainable income.",
      author: "Alex Thompson",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Business",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 7,
      title: "Cross-Platform Content Strategy",
      excerpt:
        "How to adapt your content for different social media platforms effectively.",
      author: "Maria Garcia",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2024-01-01",
      readTime: "8 min read",
      category: "Strategy",
      image: "/placeholder.svg?height=200&width=400",
    },
  ];

  const categories = [
    "All",
    "Trends",
    "Community",
    "Content",
    "Security",
    "Psychology",
    "Business",
    "Strategy",
  ];

  const popularPosts = [
    { title: "10 Social Media Mistakes to Avoid", views: "12.5K" },
    { title: "Building Your Personal Brand Online", views: "9.8K" },
    { title: "The Rise of Video Content", views: "8.2K" },
    { title: "Social Commerce Revolution", views: "7.1K" },
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
            Blog
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Insights & Stories from
            <span className="block text-primary">Our Community</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Discover the latest trends, tips, and insights about social media,
            community building, and digital connection.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles..." className="pl-10" />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Featured Article</h2>
            <p className="text-muted-foreground">Our top pick for this week</p>
          </div>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <Image
                  width={600}
                  height={400}
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-primary">
                  Featured
                </Badge>
              </div>

              <div className="p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-4">
                  {featuredPost.category}
                </Badge>

                <h3 className="text-2xl font-bold mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={featuredPost.authorImage || "/placeholder.svg"}
                        alt={featuredPost.author}
                      />
                      <AvatarFallback>
                        {featuredPost.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{featuredPost.author}</p>
                      <div className="flex items-center text-muted-foreground space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(featuredPost.date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-fit">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Latest Articles</h2>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={category === "All" ? "default" : "outline"}
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="relative">
                      <Image
                        width={600}
                        height={400}
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-background text-foreground">
                        {post.category}
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={post.authorImage || "/placeholder.svg"}
                              alt={post.author}
                            />
                            <AvatarFallback>
                              {post.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {post.author}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Popular Posts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Popular Posts</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start"
                    >
                      <h4 className="text-sm font-medium line-clamp-2 hover:text-primary cursor-pointer">
                        {post.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {post.views}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Stay Updated</h3>
                  <p className="text-sm text-muted-foreground">
                    Get the latest articles delivered to your inbox.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Your email address" />
                  <Button className="w-full">Subscribe</Button>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Categories</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.slice(1).map((category) => (
                      <div
                        key={category}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm hover:text-primary cursor-pointer">
                          {category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 20) + 5}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
