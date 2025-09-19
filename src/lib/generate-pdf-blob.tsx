"use client"

import { pdf } from "@react-pdf/renderer";
import { JSX, useCallback, useState } from "react";

export function useGeneratePdfBlob() {
    const [pdfBlob, setPdfBlob] = useState<Blob>();

    const generatePdfBlob = useCallback(async (doc: JSX.Element) => {
        const blob = await pdf(doc).toBlob();
        setPdfBlob(blob);
    }, [setPdfBlob, pdf])

    return {
        generatePdfBlob,
        pdfBlob
    }
}
