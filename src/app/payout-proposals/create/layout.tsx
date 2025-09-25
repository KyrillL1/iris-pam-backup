"use client";

import { PropsWithChildren } from "react";
import { PayoutProposalProvider } from "../payout-proposal.provider";

export default function CreateProposalLayout({ children }: PropsWithChildren) {
    return (
        <PayoutProposalProvider>
            {children}
        </PayoutProposalProvider>
    );
}
