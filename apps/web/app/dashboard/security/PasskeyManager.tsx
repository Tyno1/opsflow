"use client";

import { useCallback, useEffect, useState } from "react";
import { refreshSignIn } from "@/app/actions/passkeyActions";
import type { PasskeyTokenState } from "@/lib/passkeys/config";
import {
	createPasskey,
	type PublicKeyCreationJSON,
} from "@/lib/passkeys/webauthn";
import styles from "./security.module.css";

type PasskeyMethod = {
	id: string;
	displayName: string | null;
	model: string | null;
	createdDateTime: string | null;
};

type ApiError = {
	code?: string;
	message?: string;
	correlationId?: string;
};

type Props = {
	status: PasskeyTokenState;
};

async function readError(response: Response): Promise<ApiError> {
	try {
		return (await response.json()) as ApiError;
	} catch {
		return { message: "Passkey request failed." };
	}
}

function statusMessage(status: PasskeyTokenState): string {
	switch (status) {
		case "ready":
			return "MFA was completed in the last five minutes. You can add or remove a passkey.";
		case "stale":
			return "MFA is older than five minutes. Sign in again before changing passkeys.";
		case "mfa_required":
			return "This sign-in did not include MFA. Sign in again with MFA before changing passkeys.";
		default:
			return "Sign in before managing passkeys.";
	}
}

export default function PasskeyManager({ status }: Props) {
	const [methods, setMethods] = useState<PasskeyMethod[]>([]);
	const [canEnroll, setCanEnroll] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [message, setMessage] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [loaded, setLoaded] = useState(status !== "ready");
	const [listFailed, setListFailed] = useState(false);
	const [needsSignIn, setNeedsSignIn] = useState(status !== "ready");
	const [originHost, setOriginHost] = useState<string | null>(null);

	useEffect(() => {
		setOriginHost(window.location.hostname);
	}, []);

	const loadMethods = useCallback(async () => {
		if (status !== "ready") {
			setLoaded(true);
			return;
		}

		const response = await fetch("/api/passkeys");
		if (response.status === 401) {
			const body = await readError(response);
			setNeedsSignIn(true);
			setMessage(body.message ?? "Sign in again before changing passkeys.");
			setLoaded(true);
			return;
		}
		if (!response.ok) {
			const body = await readError(response);
			setListFailed(true);
			setMessage(body.message ?? "Passkeys could not be loaded.");
			setLoaded(true);
			return;
		}

		setListFailed(false);

		const body = (await response.json()) as {
			methods: PasskeyMethod[];
			canEnroll: boolean;
		};
		setMethods(body.methods);
		setCanEnroll(body.canEnroll);
		setLoaded(true);
	}, [status]);

	useEffect(() => {
		void loadMethods();
	}, [loadMethods]);

	async function addPasskey() {
		setBusy(true);
		setMessage(null);
		try {
			const started = await fetch("/api/passkeys/start", { method: "POST" });
			if (!started.ok) {
				const body = await readError(started);
				setMessage(body.message ?? "Passkey registration could not start.");
				return;
			}

			const registration = (await started.json()) as {
				publicKey: PublicKeyCreationJSON;
			};

			if (registration.publicKey.rp.id !== window.location.hostname) {
				setMessage(
					`This page is ${window.location.hostname}, but Microsoft Graph issued this passkey for ${registration.publicKey.rp.id}. The browser creates a passkey only when those hosts match.`,
				);
				return;
			}

			const credential = await createPasskey(registration.publicKey);
			const finished = await fetch("/api/passkeys/finish", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					displayName: displayName.trim(),
					credential,
				}),
			});

			if (!finished.ok) {
				const body = await readError(finished);
				setMessage(body.message ?? "Passkey registration did not finish.");
				return;
			}

			setDisplayName("");
			setMessage("Passkey added.");
			await loadMethods();
		} catch (error) {
			const name = error instanceof DOMException ? error.name : "";
			if (name === "NotAllowedError") {
				setMessage("Passkey creation was cancelled.");
			} else {
				setMessage(
					error instanceof Error ? error.message : "Passkey creation failed.",
				);
			}
		} finally {
			setBusy(false);
		}
	}

	async function removePasskey(method: PasskeyMethod) {
		setBusy(true);
		setMessage(null);
		try {
			const response = await fetch("/api/passkeys", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: method.id }),
			});
			if (!response.ok) {
				const body = await readError(response);
				setMessage(body.message ?? "Passkey could not be deleted.");
				return;
			}
			setMessage("Passkey deleted.");
			await loadMethods();
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Passkey could not be deleted.",
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<section className={styles.panel}>
			<p>{statusMessage(status)}</p>
			{originHost === "localhost" ? (
				<p className={styles.note}>
					This origin is localhost. Adding a passkey needs the page host to
					match the relying party id Microsoft Graph returns.
				</p>
			) : null}
			{needsSignIn ? (
				<form action={refreshSignIn}>
					<button type="submit">Sign in again</button>
				</form>
			) : null}
			{message ? <p role="status">{message}</p> : null}
			{status === "ready" && !loaded ? <p>Loading passkeys...</p> : null}
			{status === "ready" && loaded && !needsSignIn && !listFailed ? (
				<>
					{methods.length === 0 ? <p>No passkeys yet.</p> : null}
					<ul className={styles.list}>
						{methods.map((method) => (
							<li key={method.id}>
								<strong>{method.displayName ?? "Passkey"}</strong>
								<span>{method.model ?? "Unknown authenticator"}</span>
								{method.createdDateTime ? (
									<span>
										Added {new Date(method.createdDateTime).toLocaleString()}
									</span>
								) : null}
								<button
									type="button"
									disabled={busy}
									onClick={() => void removePasskey(method)}
								>
									Delete
								</button>
							</li>
						))}
					</ul>
					{canEnroll ? (
						<form
							className={styles.add}
							onSubmit={(event) => {
								event.preventDefault();
								void addPasskey();
							}}
						>
							<label htmlFor="passkey-name">Passkey name</label>
							<input
								id="passkey-name"
								value={displayName}
								maxLength={120}
								required
								onChange={(event) => setDisplayName(event.target.value)}
							/>
							<button type="submit" disabled={busy}>
								Add passkey
							</button>
						</form>
					) : (
						<p>Passkey registration is not available for this account.</p>
					)}
				</>
			) : null}
		</section>
	);
}
