'use client'

import { authenticate } from '@/app/lib/actions'

export default function Page() {


	const handleGoogleSignUp = async () => {
	try {
		await createUserWithEmailAndPassword();
		// Perform actions after successful sign in
		// Redirect user or show success message
		console.log('good job')
	} catch (error) {
		console.error(error);
		// Handle errors here (like showing an error message)
	}
	};

	return (
		<form action={dispatch}>
			<input type="email" name="email" placeholder="Email" required />
			<input type="password" name="password" placeholder="Password" required />
			<div>{errorMessage && <p>{errorMessage}</p>}</div>
		</form>
	)
}
