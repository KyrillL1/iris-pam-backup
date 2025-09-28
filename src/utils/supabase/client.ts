import { myI18n } from "@i18n/i18n-provider";
import { createBrowserClient } from "@supabase/ssr";

myI18n.addResourceBundle("en", "supabase/client", {
  cantDeleteForeign: "Another item depends on it. {{details}}",
});
myI18n.addResourceBundle("pt", "supabase/client", {
  cantDeleteForeign: "Um outro item depende disso. {{details}}",
});

export const supabaseBrowserClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  {
    db: {
      schema: "public",
    },
    global: {
      fetch: async (input: string | URL | Request, init?: RequestInit) => {
        const res = await fetch(input, init);

        // Clone the response so we don’t consume the original stream
        const clone = res.clone();

        try {
          const json = await clone.json();

          const { code, details } = json;

          // Try to delete item where foreign relation depends on this id
          // https://github.com/orgs/supabase/discussions/35294
          if (code === "23503") {
            console.error("Supabase response: ", json);
            return new Response(
              JSON.stringify({
                error: "CustomForeignKeyError",
                message: myI18n.t("cantDeleteForeign", {
                  ns: "supabase/client",
                  details,
                }),
                code: "23503",
                details,
              }),
              {
                status: 409,
                headers: { "Content-Type": "application/json" },
              },
            );
          }
        } catch (err) {
          // ignore
        }

        return res;
      },
    },
  },
);
