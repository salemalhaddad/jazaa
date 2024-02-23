import { useEffect } from "react";
import { useRouter } from "next/router";
import { getRedirectResult, signInWithRedirect, signOut } from "firebase/auth";
import { auth, provider } from "../lib/firebase-config";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    getRedirectResult(auth).then(async (userCred) => {
      if (!userCred) {
        return;
      }

      fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await userCred.user.getIdToken()}`,
        },
      }).then(async (response) => {
        if (response.status === 200) {
          router.push("/protected");
        }
      });
    });
  }, []);

  function signIn() {
    signInWithRedirect(auth, provider);
  }

  async function signOutUser() {
    // Sign out with the Firebase client
    await signOut(auth);

    // Clear the cookies in the server by sending a POST request to the sign-out API endpoint
    const response = await fetch("/api/signOut", {
      method: "POST",
    });

    if (response.status === 200) {
      router.push("/login");
    }
  }

  return (
    <>
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
}
