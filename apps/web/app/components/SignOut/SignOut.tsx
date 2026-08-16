"use client"

import { signOutAction } from "@/app/actions/authServerActions";

export default function SignOut() {
	return (
		<button type="button" onClick={() => signOutAction()}>
			SIgn out
		</button>
	);
}
