// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <SignUp
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
