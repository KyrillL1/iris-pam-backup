import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

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
    }, [selectedContracts, setSelectedContracts, hourRows, setHourRows]);

    return (
        <PayoutProposalContext.Provider value={value}>
            {children}
        </PayoutProposalContext.Provider>
    );
};

export function usePayoutProposalProvider() {
    return useContext(PayoutProposalContext);
}
