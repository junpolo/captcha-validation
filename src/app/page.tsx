"use client";
import React from "react";

import { Button, CaptchaValidator } from "@components";

export default function HomePage() {
  return (
    <section className="grid min-h-screen items-center justify-center max-w-7xl mx-auto">
      <CaptchaValidator />
    </section>
  );
}
