export default function BrandLogo({
  className = "w-10 h-10",
  alt = "KOBANI logo",
}: {
  className?: string
  alt?: string
}) {
  return (
    <img
      src="/images/company_logo_kobani.png"
      alt={alt}
      className={`${className} rounded-full object-cover flex-shrink-0`}
    />
  )
}
