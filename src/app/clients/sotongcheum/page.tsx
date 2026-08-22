import React from "react";
import SotongchaeumLandingPage from "../sotongchaeum/page";

export const revalidate = 60;
export const dynamicParams = true;

export default function LegacySotongcheumPage() {
  return <SotongchaeumLandingPage />;
}
