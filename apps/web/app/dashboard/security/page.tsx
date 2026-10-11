import { auth } from "@/lib/auth";
import PasskeyManager from "./PasskeyManager";

export default async function SecurityPage() {
	const session = await auth();

	return (
		<main>
			<h1>Passkeys</h1>
			<p>
				<a href="/dashboard">Dashboard</a>
			</p>
			<PasskeyManager
				status={session?.user.passkeyStatus ?? "missing"}
				audience={session?.user.passkeyAudience}
				scopes={session?.user.passkeyScopes}
			/>
		</main>
	);
}
