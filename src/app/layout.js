import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "SkillSwap",
  description: "Swap your skills with freelancers globally",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
