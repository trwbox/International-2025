"use client";

import { useEffect } from "react";
import { initializeKeycloak } from "../lib/keycloak";

export default function KeycloakProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeKeycloak();
  }, []);

  return <>{children}</>;
}
