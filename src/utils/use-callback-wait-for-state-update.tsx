import { useEffect, useState } from "react";

// Because of this https://stackoverflow.com/questions/73697416/react-stale-usestate-value-in-closure-how-to-fix/77282546#77282546
export function useCallbackWaitForStateUpdate(
    cbFn: () => void,
    deps: any[],
) {
    const [readyToComplete, setReadyToComplete] = useState(false);

    useEffect(() => {
        if (!readyToComplete) return;

        cbFn();
    }, [readyToComplete, ...deps]);

    return () => {
        setReadyToComplete(true);
    };
}
