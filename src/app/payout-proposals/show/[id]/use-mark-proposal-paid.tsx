import { supabaseBrowserClient } from "@utils/supabase/client";
import { useCallback, useState } from "react";

export interface MarkProposalPaidItems {
    payoutProposalItemId: string;
    amount: number;
    payslipBlob: Blob;
}

export function useMarkProposalPaid() {
    const [markProposalPaidError, setMarkProposalPaidError] = useState<Error>();
    const [finished, setFinished] = useState<boolean>(false);

    const markProposalPaid = useCallback(
        async (id: string, items: MarkProposalPaidItems[]) => {
            const { error: payoutProposalError } = await supabaseBrowserClient
                .from("payout_proposals")
                .update({ status: "PAID_OUT" })
                .eq("id", id)
                .select();
            if (payoutProposalError) {
                setMarkProposalPaidError(
                    payoutProposalError,
                );
                return;
            }

            for (const item of items) {
                // 1. Upload payslip
                const fileName = `${Date.now()}__${item.payoutProposalItemId}`;
                const file = new File([item.payslipBlob], fileName, {
                    type: item.payslipBlob.type,
                });
                const { error: uploadPayslipError } =
                    await supabaseBrowserClient.storage
                        .from("payslips")
                        .upload(fileName, file);
                if (uploadPayslipError) {
                    setMarkProposalPaidError(uploadPayslipError);
                    return;
                }

                // Insert payout entries for every single employee/ contract that got paid
                const { error: proposalItemsError } =
                    await supabaseBrowserClient
                        .from("payouts")
                        .insert({
                            payout_proposal_item_id: item.payoutProposalItemId,
                            amount: item.amount,
                            payout_slip_path: `${fileName}`,
                        });
                if (proposalItemsError) {
                    setMarkProposalPaidError(proposalItemsError);
                    return;
                }

                // Hurray, all done!
                setFinished(true);
            }
        },
        [],
    );

    return {
        markProposalPaid,
        markProposalPaidError,
        finished,
    };
}
