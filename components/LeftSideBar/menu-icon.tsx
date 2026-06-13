export default function OrkutMenuIcon({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      className="mr-1 inline-block align-middle"
    />
  );
}
