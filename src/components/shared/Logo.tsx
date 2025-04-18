import Image from "next/image";

export function Logo({ size }: { size: number }) {
  return (
    <h1 className="flex gap-1">
      <span
        className="text-flamee-primary font-semibold"
        style={{ fontSize: size }}
      >
        Flame
      </span>
      <Image
        alt=""
        src="/assets/images/logo.svg"
        width={100}
        height={100}
        style={{ width: size, height: "auto" }}
      />
    </h1>
  );
}
