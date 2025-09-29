import { z } from "zod";

// ✅ Validate env variables before anything else runs
(() => {
  const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]),
  });

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1); // ⛔ Kill the build!
  }

  console.log("✅ Env vars look good! You’re safe to ship 🚀");
})();


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

export default nextConfig
