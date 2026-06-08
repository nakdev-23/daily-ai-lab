import { redirect } from "next/navigation"

// Google sign-in handles sign-up automatically (first login creates the account),
// so there is a single auth screen. Keep /register as a redirect for old links.
export default function RegisterRedirect() {
  redirect("/login")
}
