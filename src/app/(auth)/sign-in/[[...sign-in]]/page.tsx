// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#8B5CF6",
            colorBackground: "#0D0D14",
          },
        }}
      />
    </div>
  );
}
