"use client";

import React from "react";
import { PLACEHOLDER_DATA } from "@/data/content";

export const AboutStatement: React.FC = () => {
  return (
    <div className="pt-section pb-gap-xl px-grid-margin select-none">
      {/* Overline */}
      <p className="font-futura text-body-sm text-black font-bold tracking-wider uppercase mb-6">
        {PLACEHOLDER_DATA.about.overline}
      </p>

      {/* Large Justified Statement */}
      <div className="grid-layout">
        <div className="col-span-5 md:col-start-1 md:col-span-11">
          <h2 className="text-heading-xl text-black leading-[0.95] text-justify uppercase font-bold tracking-tight">
            {PLACEHOLDER_DATA.about.statement}
          </h2>
        </div>
      </div>
    </div>
  );
};

