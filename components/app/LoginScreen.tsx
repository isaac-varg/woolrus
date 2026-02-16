import Image from "next/image";
import { signIn } from "@/auth";
import { BsDiscord } from "react-icons/bs";

export default function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body items-center text-center gap-6">
          <Image
            src="/logos/woolrus.png"
            alt="Woolrus"
            width={128}
            height={128}
            priority
          />
          <div>
            <h1 className="text-2xl font-bold">Woolrus</h1>
            <p className="text-base-content/60 text-sm mt-1">
              Pick, pack and verify with confidence.
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signIn("discord");
            }}
          >
            <button type="submit" className="btn btn-primary w-full gap-2">
              <BsDiscord className="size-5" />

              Sign in with Discord
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
