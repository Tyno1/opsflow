import SignOut from "../components/SignOut/SignOut";

export default async function DashboardPage() {
	return (
		<main>
			<h1>Dashboard</h1>
			<p>
				<a href="/dashboard/security">Passkeys</a>
			</p>
			<SignOut />
		</main>
	);
}
