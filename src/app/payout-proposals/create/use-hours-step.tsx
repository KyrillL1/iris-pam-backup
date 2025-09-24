import { useMemo } from "react";

export function useHoursStep() {
    const hoursView = useMemo(() => {
        return <div>hi from hours</div>;
    }, []);

    return {
        hoursView,
    };
}
