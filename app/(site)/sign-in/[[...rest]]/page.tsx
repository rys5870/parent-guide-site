import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>ד. רבינסקי - התחברות</title>
        <meta name="keywords" content="אתר, התחברות, דף הבית" />
      </Head>
      <main className="flex justify-center items-center min-h-screen bg-gray-50">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
}
