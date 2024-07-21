import Image, { StaticImageData } from "next/image";

type AuthImageProps = {
  src: StaticImageData;
  alt?: string;
};

function AuthImage({ src, alt = "" }: AuthImageProps) {
  return (
    <Image
      className="hidden w-1/2 object-cover md:block md:w-1/2"
      src={src}
      alt={alt}
      priority
      placeholder="blur"
      sizes="(max-width: 1024px) 50vw, 32rem"
    />
  );
}
export default AuthImage;
