import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import React from "https://esm.sh/react@18.2.0";
import { renderToStream } from "https://esm.sh/@react-pdf/renderer@3.3.7";
import { PayslipPdf } from "./payslip.tsx";
import type { PayslipPayload } from "./payslip.tsx";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const payload: PayslipPayload = await req.json();

    // Instead of JSX: React.createElement
    const element = React.createElement<PayslipPayload>(PayslipPdf, {
      ...payload,
    });

    const pdfStream = await renderToStream(element);

    return new Response(pdfStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=payslip.pdf",
      },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: String(err?.message ?? err) }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
});
