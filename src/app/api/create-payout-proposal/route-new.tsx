import { NextRequest, NextResponse } from "next/server";
import { Contract, PayoutProposalItem, RequestBody } from "./types";
import {
    checkBodyValid,
    createPayoutProposal,
    fetchContractsWithRelations,
    insertProposalItems,
    mapContractToPayoutProposalItem,
} from "./service";
import { createSupabaseServerClient } from "@utils/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as RequestBody;

        const bodyInvalidResponse = checkBodyValid(body);
        if (bodyInvalidResponse) {
            return bodyInvalidResponse;
        }

        const supabase =
            await createSupabaseServerClient() as unknown as SupabaseClient;

        const payoutProposalId = await createPayoutProposal(supabase);

        const contractsWithRelations = await fetchContractsWithRelations(
            supabase,
            body.include_contracts!,
        );

        const payoutProposalItems: PayoutProposalItem[] = [];

        for (const contract of contractsWithRelations!) {
            const item: PayoutProposalItem =
                await mapContractToPayoutProposalItem(
                    supabase,
                    payoutProposalId,
                    contract as unknown as Contract,
                    body.worked_hours!,
                );
            payoutProposalItems.push(item);
        }

        await insertProposalItems(supabase, payoutProposalItems);

        NextResponse.json({
            message: "Successfully created new payout proposal",
            meta: { id: payoutProposalId },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message: err instanceof Error ? err.message : String(err),
        }, { status: 500 });
    }
}
