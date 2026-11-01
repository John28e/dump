import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLACEHOLDER_PROJECTS, PLACEHOLDER_DATA } from "@/data/content";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PLACEHOLDER_PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = PLACEHOLDER_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-grid-margin py-12 flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between pb-8 border-b border-gray-800">
        <Link
          href="/"
          className="text-nav uppercase font-bold hover:opacity-70 transition-opacity inline-flex items-center gap-2"
        >
          <span>←</span> Back to {PLACEHOLDER_DATA.brand}
        </Link>
        <span className="text-label text-gray-500 uppercase">{project.year}</span>
      </div>

      {/* Main Hero & Media */}
      <div className="my-16 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-label text-gray-400 font-bold uppercase tracking-wider block mb-2">
            Client: {project.client}
          </span>
          <h1 className="text-heading-xl text-white tracking-tight uppercase">
            {project.title}
          </h1>
        </div>

        {/* Video / Poster Frame (Aspect 348 / 259) */}
        <div
          className="relative w-full aspect-[348/259] overflow-hidden bg-neutral-900 border border-gray-800"
          style={{ background: project.posterBg }}
        >
          {project.videoUrl && (
            <video
              poster={project.imageUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            >
              {project.webmUrl && <source src={project.webmUrl} type="video/webm" />}
              <source src={project.videoUrl} type="video/mp4" />
            </video>
          )}
        </div>

        {/* Project Description */}
        <div className="mt-8 max-w-2xl">
          <p className="text-body-md text-gray-300 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-8 border-t border-gray-800 flex justify-between items-center text-label text-gray-500">
        <span>© 2026 {PLACEHOLDER_DATA.brand}</span>
        <span className="uppercase">{project.title} — {project.client}</span>
      </div>
    </main>
  );
}

