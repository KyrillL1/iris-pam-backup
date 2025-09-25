import { useCallback, useEffect, useState } from "react";
import {
    CreatePayoutProposalBody,
    useCreatePayoutProposal,
} from "./use-create-payout-proposal";
import { useNavigation, useNotification } from "@refinedev/core";
import {
    PayoutProposalContext,
    usePayoutProposalProvider,
} from "../payout-proposal.provider";
import { useCallbackWaitForStateUpdate } from "@utils/use-callback-wait-for-state-update";

export function useHandleStepperComplete() {
    const { open } = useNotification();
    const { show } = useNavigation();

    const {
        createPayoutProposal,
        data: createPayoutResponse,
        error,
    } = useCreatePayoutProposal();

    const [createPayoutProposalLoading, setCreatePayoutProposalLoading] =
        useState(false);

    useEffect(() => {
        if (!error) return;

        open?.({ message: error.message, type: "error" });
        setCreatePayoutProposalLoading(false);
    }, [error]);

    const { hourRows, selectedContracts } = usePayoutProposalProvider();

    const handleCompleteClick = useCallbackWaitForStateUpdate(() => {
        const rows = hourRows;
        const includeContractIds = selectedContracts;
        if (!rows || !includeContractIds) {
            return;
        }

        setCreatePayoutProposalLoading(true);

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
    }, [hourRows, selectedContracts]);

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
