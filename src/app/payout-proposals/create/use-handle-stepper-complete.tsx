import { useCallback, useEffect } from "react";
import {
    CreatePayoutProposalBody,
    useCreatePayoutProposal,
} from "./use-create-payout-proposal";
import { useNavigation, useNotification } from "@refinedev/core";
import { PayoutProposalCreateRow } from "./use-hours-step";

export function useHandleStepperComplete() {
    const { open } = useNotification();
    const { show } = useNavigation();

    const {
        createPayoutProposal,
        data: createPayoutResponse,
        error,
        loading: createPayoutProposalLoading,
    } = useCreatePayoutProposal();
    useEffect(() => {
        if (!error) return;
        open?.({ message: error.message, type: "error" });
    }, [error]);

    const handleCompleteClick = useCallback(
        (rows?: PayoutProposalCreateRow[], includeContractIds?: string[]) => {
            if (!rows) return;
            if (!includeContractIds) return;

            const worked_hours: CreatePayoutProposalBody["worked_hours"] = rows
                .map(
                    (r) => {
                        return {
                            contract_id: r.id,
                            hours: r.hours_worked || 0,
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
