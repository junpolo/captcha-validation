"use client";
import React from "react";

import { Button } from "@components";

export default function HomePage() {
  return (
    <section className="grid min-h-screen items-center justify-center">
      <div>
        <p>Hello World</p>
        <Button onClick={() => console.log("test")}>Button</Button>
      </div>
    </section>
  );
}
