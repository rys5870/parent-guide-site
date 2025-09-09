import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>ד. רבינסקי - דף הבית</title>
        <meta name="keywords" content="אתר, דף הבית" />
      </Head>
      <main>
        <SignIn path="/sign-in" routing="path" />;
      </main>
    </>
  );
}
