export const LEGAL_VERSIONS = { terms: "2026-08-21", privacy: "2026-08-21", refund: "2026-08-21", cancellation: "2026-08-21", cookies: "2026-08-21" } as const
export const legalConfig = {
  companyName: "THE KOBANI HISTORICAL AND LUXURY TOURS",
  tradingName: "KOBANI Tours", country: "Ghana", contactEmail: "info@kobanitours.com",
  registeredAddress: "", companyRegistrationNumber: "", dataProtectionRegistrationNumber: "",
  effectiveDate: "2026-08-06", dpcUrl: "https://dataprotection.org.gh/",
} as const
if (import.meta.env.DEV && (!legalConfig.registeredAddress || !legalConfig.companyRegistrationNumber)) console.warn("KOBANI legal configuration requires production company details and Ghana-qualified legal review.")
