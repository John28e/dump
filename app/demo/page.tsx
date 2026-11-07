import Demo from "@/components/ui/demo";

export const metadata = {
  title: "Tumble Deck Showcase Demo",
  description: "Interactive 3D scroll-driven card tumble showcase",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Demo />
    </main>
  );
}

