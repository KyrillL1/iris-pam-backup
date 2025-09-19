import { authProviderServer } from "@providers/auth-provider/auth-provider.server";
import { redirect } from "next/navigation";

export async function withAuth() {
    const { authenticated, redirectTo } = await authProviderServer.check();

    if (!authenticated) {
        return redirect(redirectTo || "/login");
    }

    return true;
}
