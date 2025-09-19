import React from "react";
import { ProtectedLayout } from "@components/protectedLayout";
import { withAuth } from "@components/protectedLayout/withAuth";

export default async function Layout({ children }: React.PropsWithChildren) {
  await withAuth();
  return <ProtectedLayout>{children}</ProtectedLayout>;
}