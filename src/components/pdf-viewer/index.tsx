"use client"

import React from "react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const Document = dynamic(
    () => import("react-pdf").then((mod) => mod.Document),
    { ssr: false }
);
const Page = dynamic(
    () => import("react-pdf").then((mod) => mod.Page),
    { ssr: false }
);

export interface PdfViewerProps {
    file: File | Blob;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {

    const [numPages, setNumPages] = useState(0);

    // set worker *only on client*
    useEffect(() => {
        (async () => {
            const { pdfjs } = await import("react-pdf");
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs",
                import.meta.url
            ).toString();
        })();
    }, []);

    const onDocumentLoadSuccess = useCallback(
        ({ numPages }: { numPages: number }) => {
            setNumPages(numPages);
        },
        []
    );

    if (!file) return;

    return <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
    </Document>
}