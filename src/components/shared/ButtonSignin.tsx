import { signIn } from "next-auth/react";
import Image from "next/image";

export default function ButtonSignin({ type }: { type: string }) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => signIn("google")}
        className="bg-black flex gap-2 items-center justify-center text-white cursor-pointer w-full py-2 rounded-lg"
      >
        <Image
          alt="Logo Google"
          src="/assets/images/gg.webp"
          width={30}
          height={30}
        />
        <span>
          Hoặc{" "}
          {type === "signin" || type === "send-reset-password"
            ? "đăng nhập"
            : "đăng ký"}{" "}
          với Google
        </span>
      </button>
      <div className="flex gap-4">
        <button
          onClick={() => signIn("facebook")}
          className="bg-black flex gap-2 items-center justify-center text-white cursor-pointer w-full py-2 rounded-lg"
        >
          <Image
            alt="Logo Facebook"
            src="/assets/images/fb.webp"
            width={30}
            height={30}
          />
          <span>
            Hoặc{" "}
            {type === "signin" || type === "send-reset-password"
              ? "đăng nhập"
              : "đăng ký"}{" "}
            với Facebook
          </span>
        </button>
        <button
          onClick={() => signIn("github")}
          className="bg-black flex gap-2 items-center justify-center text-white cursor-pointer w-full py-2 rounded-lg"
        >
          <Image
            alt="Logo Github"
            src="/assets/images/github.webp"
            width={30}
            height={30}
          />
          <span>
            Hoặc{" "}
            {type === "signin" || type === "send-reset-password"
              ? "đăng nhập"
              : "đăng ký"}{" "}
            với Github
          </span>
        </button>
      </div>
    </div>
  );
}
