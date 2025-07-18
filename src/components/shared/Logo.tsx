import Image from "next/image";
import Link from "next/link";

export function Logo({
  size,
  classname,
  isText = true,
}: {
  size: number;
  classname?: string;
  isText?: boolean;
}) {
  return (
    <Link href="/feeds" className={classname + " flex gap-1"}>
      {isText && (
        <span
          className="text-flamee-primary font-semibold"
          style={{ fontSize: size }}
        >
          Flame
        </span>
      )}
      <Image
        alt="Flamee Logo"
        src="/assets/images/logo.svg"
        width={300}
        height={300}
        priority
        style={{ width: size, height: "auto" }}
      />
    </Link>
  );
}
