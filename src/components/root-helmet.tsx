import React from "react";
import { Helmet } from "react-helmet-async";

export function RootHelmet() {
  return (
    <Helmet>
      <html lang="en" />

      <meta charSet="utf-8" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#31383F" />

      <meta
        name="description"
        content="Use resumemakr online resume builder app. Build your perfect resume in minutes. Download, apply, and start getting more interviews!"
      />
      <meta name="application" content="resumemakr" />
    </Helmet>
  );
}
