import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
} from "react";

export interface SelectMultipleContext<T = any> {
    toggle?: () => void;
    showMultiple?: boolean;
    selected?: { key: string; value: T }[];
    addSelected?: (key: string, value: T) => void;
    removeSelected?: (key: string) => void;
    clearSelected?: () => void;
    setSelected?: (entries: { key: string; value: T }[]) => void;
}

const SelectMultipleContext = createContext<SelectMultipleContext>({}); // TODO: Fix this?

export const SelectMultipleProvider: React.FC<PropsWithChildren> = (
    { children },
) => {
    const [showMultiple, setShowMultiple] = useState(false);
    const [selected, setSelected] = useState<{ key: string; value: any }[]>([]);

    const addSelected = (key: string, value: any) => {
        setSelected((prev) => [...prev, { key, value }]);
    };

    const removeSelected = (key: string) => {
        setSelected((prev) => prev.filter((item) => item.key !== key));
    };

    const clearSelected = () => {
        setSelected([]);
    };

    const value = useMemo(() => {
        return {
            toggle: () => setShowMultiple((prev) => !prev),
            showMultiple,
            selected,
            addSelected,
            removeSelected,
            clearSelected,
            setSelected,
        };
    }, [showMultiple, selected]);

    return (
        <SelectMultipleContext.Provider value={value}>
            {children}
        </SelectMultipleContext.Provider>
    );
};

export function useSelectMultipleContext() {
    return useContext(SelectMultipleContext);
}
