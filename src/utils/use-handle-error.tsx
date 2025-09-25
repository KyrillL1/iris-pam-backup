import { useNotification } from "@refinedev/core";
import { useEffect, useState } from "react";

interface UseHandleErrorOptions {
    // will be logged
    meta?: any;
    hideFromUser?: boolean;
}

/**
 * Handle Error most high up in UI. -> closest to user
 * Use this hook
 */
export function useHandleError(
    error?: Error | any,
    { meta, hideFromUser }: UseHandleErrorOptions = {},
) {
    const { open } = useNotification();

    const handleError = (
        err: Error,
        opts: UseHandleErrorOptions = {},
    ) => {
        const message = err instanceof Error
            ? err.message
            : `Unknown error: ${JSON.stringify(err)}`;

        console.error(err, { meta: opts.meta });
        if (!opts.hideFromUser) open?.({ message, type: "error" });
    };

    useEffect(() => {
        if (!error) return;

        const message = error instanceof Error
            ? error.message
            : `Unknown error: ${JSON.stringify(error)}`;

        console.error(error, { meta });
        if (!hideFromUser) open?.({ message, type: "error" });
    }, [error, meta]);

    return {
        handleError,
    };
}
