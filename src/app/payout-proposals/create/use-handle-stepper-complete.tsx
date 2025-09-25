import { useCallback, useEffect, useState } from "react";
import {
    CreatePayoutProposalBody,
    useCreatePayoutProposal,
} from "./use-create-payout-proposal";
import { useNavigation, useNotification } from "@refinedev/core";
import { PayoutProposalContext } from "../payout-proposal.provider";

export function useHandleStepperComplete() {
    const { open } = useNotification();
    const { show } = useNavigation();
    const [customError, setCustomError] = useState<Error>();

    const {
        createPayoutProposal,
        data: createPayoutResponse,
        error,
        loading: createPayoutProposalLoading,
    } = useCreatePayoutProposal();
    
    useEffect(() => {
        const errorToShow = error || customError;
        if (!errorToShow) return;
        open?.({ message: errorToShow.message, type: "error" });
    }, [error, customError]);

    const handleCompleteClick = useCallback(
        (
            rows?: PayoutProposalContext["hourRows"],
            includeContractIds?: string[],
        ) => {
            if (!rows) {
                setCustomError(new Error("Missing hour rows"));
                return;
            }
            if (!includeContractIds) {
                setCustomError(new Error("Missing contractIds"));
                return;
            }

            const worked_hours: CreatePayoutProposalBody["worked_hours"] = rows
                .map(
                    (r) => {
                        return {
                            contract_id: r.contractId,
                            hours: r.workedHours,
                        };
                    },
                );
            const body: CreatePayoutProposalBody = {
                worked_hours,
                include_contracts: includeContractIds,
            };

            createPayoutProposal(body);
        },
        [],
    );

    useEffect(() => {
        if (!createPayoutResponse) return;

        const payoutProposalId = createPayoutResponse.meta.id;
        open?.({
            message: `${createPayoutResponse.message}`,
            type: "success",
        });
        show("payout_proposals", payoutProposalId);
    }, [createPayoutResponse]);

    return {
        handleCompleteClick,
        createPayoutProposalLoading,
    };
}
