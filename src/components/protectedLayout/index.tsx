"use client";

import React from "react";
import { ThemedLayout } from "@refinedev/mui";
import { Header } from "../header";
import { Sider } from "../sider";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
    return <ThemedLayout Header={Header} Sider={Sider}>{children}</ThemedLayout>;
};
