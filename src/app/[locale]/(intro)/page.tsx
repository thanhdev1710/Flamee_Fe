import CommentSection from "@/components/landing-page/Comment";
import Footer from "@/components/landing-page/Footer";
import MenuBar from "@/components/landing-page/MenuBar";
import SocialControl from "@/components/landing-page/SocialControl";
import SocialMedia from "@/components/landing-page/SocialMedia";

export default function page() {
  return (
    <main>
      <MenuBar />
      <SocialMedia />
      <SocialControl />
      <CommentSection />
      <Footer />
    </main>
  );
}
