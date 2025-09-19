"use client";
import { AuthPage as AuthPageBase } from "@refinedev/mui";
import type { AuthPageProps } from "@refinedev/core";

export const AuthPage = (props: AuthPageProps) => {
  return (
    <AuthPageBase
      {...props}
      renderContent={(content) => {
        return <div style={{ minWidth: "300px" }}>{content}</div>;
      }}
    />
  );
};
