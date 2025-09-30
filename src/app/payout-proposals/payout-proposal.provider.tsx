"use client";

import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Optional: add translations for context-related labels
myI18n.addResourceBundle("en", "payout-proposal/context", {
    hourRows: "Hour Rows",
    selectedContracts: "Selected Contracts",
});

myI18n.addResourceBundle("pt", "payout-proposal/context", {
    hourRows: "Linhas de Horas",
    selectedContracts: "Contratos Selecionados",
});

interface PayoutProposalContextRow {
    contractId: string;
    workedHours: number;
}

export interface PayoutProposalContext {
    hourRows?: PayoutProposalContextRow[];
    setHourRows?: React.Dispatch<
        React.SetStateAction<PayoutProposalContextRow[] | undefined>
    >;
    selectedContracts?: string[];
    setSelectedContracts?: React.Dispatch<
        React.SetStateAction<string[] | undefined>
    >;
}

const PayoutProposalContext = createContext<PayoutProposalContext>({});

export const PayoutProposalProvider: React.FC<PropsWithChildren> = (
    { children },
) => {
    const [hourRows, setHourRows] = useState<PayoutProposalContextRow[]>();
    const [selectedContracts, setSelectedContracts] = useState<string[]>();

    const value = useMemo<PayoutProposalContext>(() => {
        return {
            selectedContracts,
            setSelectedContracts,
            hourRows,
            setHourRows,
        };
    }, [selectedContracts, hourRows]);

    return (
        <PayoutProposalContext.Provider value={value}>
            {children}
        </PayoutProposalContext.Provider>
    );
};

export function usePayoutProposalProvider() {
    return useContext(PayoutProposalContext);
}
