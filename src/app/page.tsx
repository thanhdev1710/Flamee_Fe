import React from "react";
import MenuBar from "../containers/landing-page/MenuBar";
import SocialMediaSection from "../containers/landing-page/SocialMedia";
import Footer from "../containers/landing-page/Footer";
import SocialControl from "../containers/landing-page/SocialControl";
import Pricing from "../containers/landing-page/Pricing";
import Comment from "../containers/landing-page/Comment";

export default function page() {
  return (
    <main>
      <MenuBar />
      <SocialMediaSection />
      <SocialControl />
      <Pricing />
      <Comment/>
      <Footer />
    </main>
  );


}
