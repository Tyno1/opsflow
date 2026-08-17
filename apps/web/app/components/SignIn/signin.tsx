import { signInAction, signOutAction } from "@/app/actions/authServerActions";

export default function SignIn() {
	return (
		<div>
				<button onClick={signInAction} type="button">Sign in</button>
				<button onClick={signOutAction} type="button">Sign out</button>
		</div>	
	);
}
