import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import { resources } from "./resources"

export const supportedLanguages = ["en", "de", "es", "zh-CN", "fr", "ru", "ar", "it"] as const

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  nonExplicitSupportedLngs: false,
  interpolation: { escapeValue: false },
  detection: { order: ["cookie", "localStorage", "navigator"], caches: ["cookie", "localStorage"], lookupCookie: "kobani_language", lookupLocalStorage: "kobani-language", cookieMinutes: 525600, cookieOptions: { path: "/", sameSite: "lax", secure: window.location.protocol === "https:" } },
  react: { useSuspense: false },
  saveMissing: import.meta.env.DEV,
  missingKeyHandler: (languages, namespace, key) => {
    if (import.meta.env.DEV) console.warn(`[i18n] Missing translation: ${languages.join(",")}:${namespace}:${key}`)
  },
})

const authTranslations = {
  en: { creatingAccount: "Creating account...", signingIn: "Signing in...", pleaseWait: "Please wait", accountCreated: "Account created successfully", welcomeBack: "Welcome back", logoutSuccessful: "You have signed out", errors: { EMAIL_ALREADY_EXISTS: "This email is already registered.", INVALID_CREDENTIALS: "Invalid email or password.", ACCOUNT_DISABLED: "This account is disabled.", TOKEN_EXPIRED: "Your session expired.", UNAUTHORIZED: "Please sign in to continue.", VALIDATION_ERROR: "Please check the highlighted fields.", RATE_LIMITED: "Too many attempts. Please try again later.", SERVER_ERROR: "Something went wrong." } },
  de: { creatingAccount: "Konto wird erstellt...", signingIn: "Anmeldung...", pleaseWait: "Bitte warten", accountCreated: "Konto erfolgreich erstellt", welcomeBack: "Willkommen zurück", logoutSuccessful: "Sie wurden abgemeldet", errors: { EMAIL_ALREADY_EXISTS: "Diese E-Mail ist bereits registriert.", INVALID_CREDENTIALS: "Ungültige E-Mail oder ungültiges Passwort.", ACCOUNT_DISABLED: "Dieses Konto ist deaktiviert.", TOKEN_EXPIRED: "Ihre Sitzung ist abgelaufen.", UNAUTHORIZED: "Bitte melden Sie sich an.", VALIDATION_ERROR: "Bitte prüfen Sie die markierten Felder.", RATE_LIMITED: "Zu viele Versuche. Bitte versuchen Sie es später erneut.", SERVER_ERROR: "Etwas ist schiefgelaufen." } },
  es: { creatingAccount: "Creando cuenta...", signingIn: "Iniciando sesión...", pleaseWait: "Espera, por favor", accountCreated: "Cuenta creada correctamente", welcomeBack: "Bienvenido de nuevo", logoutSuccessful: "Has cerrado sesión", errors: { EMAIL_ALREADY_EXISTS: "Este correo ya está registrado.", INVALID_CREDENTIALS: "Correo o contraseña incorrectos.", ACCOUNT_DISABLED: "Esta cuenta está desactivada.", TOKEN_EXPIRED: "Tu sesión ha caducado.", UNAUTHORIZED: "Inicia sesión para continuar.", VALIDATION_ERROR: "Revisa los campos marcados.", RATE_LIMITED: "Demasiados intentos. Inténtalo más tarde.", SERVER_ERROR: "Algo salió mal." } },
  "zh-CN": { creatingAccount: "正在创建账户...", signingIn: "正在登录...", pleaseWait: "请稍候", accountCreated: "账户创建成功", welcomeBack: "欢迎回来", logoutSuccessful: "您已退出登录", errors: { EMAIL_ALREADY_EXISTS: "此邮箱已注册。", INVALID_CREDENTIALS: "邮箱或密码无效。", ACCOUNT_DISABLED: "此账户已停用。", TOKEN_EXPIRED: "会话已过期。", UNAUTHORIZED: "请登录后继续。", VALIDATION_ERROR: "请检查标记的字段。", RATE_LIMITED: "尝试次数过多，请稍后重试。", SERVER_ERROR: "出现错误。" } },
  fr: { creatingAccount: "Création du compte...", signingIn: "Connexion...", pleaseWait: "Veuillez patienter", accountCreated: "Compte créé avec succès", welcomeBack: "Bon retour", logoutSuccessful: "Vous êtes déconnecté", errors: { EMAIL_ALREADY_EXISTS: "Cette adresse e-mail est déjà enregistrée.", INVALID_CREDENTIALS: "Adresse e-mail ou mot de passe incorrect.", ACCOUNT_DISABLED: "Ce compte est désactivé.", TOKEN_EXPIRED: "Votre session a expiré.", UNAUTHORIZED: "Connectez-vous pour continuer.", VALIDATION_ERROR: "Vérifiez les champs indiqués.", RATE_LIMITED: "Trop de tentatives. Réessayez plus tard.", SERVER_ERROR: "Une erreur est survenue." } },
}
Object.entries(authTranslations).forEach(([language, auth]) => i18n.addResourceBundle(language, "translation", { auth }, true, true))

const verificationTranslations = {
  en: { title: "Verify Your Email", sentTo: "We sent a code to {{email}}", code: "Verification Code", enterCode: "Enter the six-digit code", enterEmail: "Enter your email address", verify: "Verify Account", verifying: "Verifying...", resend: "Resend Code", resendIn: "Resend in {{seconds}} seconds", sending: "Sending...", expires: "The code expires in 10 minutes.", success: "Verification successful. Redirecting to your dashboard...", back: "Back to Registration", spam: "Check your spam folder if the message does not arrive within a few minutes.", support: "Contact Support" },
  de: { title: "E-Mail bestätigen", sentTo: "Wir haben einen Code an {{email}} gesendet", code: "Bestätigungscode", enterCode: "Geben Sie den sechsstelligen Code ein", enterEmail: "Geben Sie Ihre E-Mail-Adresse ein", verify: "Konto bestätigen", verifying: "Wird bestätigt...", resend: "Code erneut senden", resendIn: "Erneut senden in {{seconds}} Sekunden", sending: "Wird gesendet...", expires: "Der Code läuft in 10 Minuten ab.", success: "Bestätigung erfolgreich. Weiterleitung...", back: "Zurück zur Registrierung", spam: "Prüfen Sie Ihren Spam-Ordner, falls die Nachricht nicht eintrifft.", support: "Support kontaktieren" },
  es: { title: "Verifica tu correo", sentTo: "Enviamos un código a {{email}}", code: "Código de verificación", enterCode: "Introduce el código de seis dígitos", enterEmail: "Introduce tu correo electrónico", verify: "Verificar cuenta", verifying: "Verificando...", resend: "Reenviar código", resendIn: "Reenviar en {{seconds}} segundos", sending: "Enviando...", expires: "El código caduca en 10 minutos.", success: "Verificación correcta. Redirigiendo...", back: "Volver al registro", spam: "Revisa la carpeta de spam si no recibes el mensaje.", support: "Contactar con soporte" },
  "zh-CN": { title: "验证您的邮箱", sentTo: "验证码已发送至 {{email}}", code: "验证码", enterCode: "请输入六位验证码", enterEmail: "请输入您的邮箱", verify: "验证账户", verifying: "正在验证...", resend: "重新发送验证码", resendIn: "{{seconds}} 秒后重新发送", sending: "正在发送...", expires: "验证码将在 10 分钟后过期。", success: "验证成功，正在跳转到控制面板...", back: "返回注册", spam: "如果几分钟内未收到邮件，请检查垃圾邮件文件夹。", support: "联系支持" },
  fr: { title: "Vérifiez votre adresse e-mail", sentTo: "Nous avons envoyé un code à {{email}}", code: "Code de vérification", enterCode: "Saisissez le code à six chiffres", enterEmail: "Saisissez votre adresse e-mail", verify: "Vérifier le compte", verifying: "Vérification...", resend: "Renvoyer le code", resendIn: "Renvoyer dans {{seconds}} secondes", sending: "Envoi...", expires: "Le code expire dans 10 minutes.", success: "Vérification réussie. Redirection...", back: "Retour à l’inscription", spam: "Vérifiez vos courriers indésirables si le message n’arrive pas.", support: "Contacter l’assistance" },
}
const verificationErrors = {
  en: { EMAIL_DELIVERY_FAILED: "The verification email could not be delivered.", EMAIL_NOT_VERIFIED: "Verify your email before signing in.", VERIFICATION_REQUIRED: "Start registration again to request a new code.", INVALID_VERIFICATION_CODE: "The verification code is invalid.", VERIFICATION_CODE_EXPIRED: "The verification code has expired.", VERIFICATION_ATTEMPTS_EXCEEDED: "Too many incorrect attempts. Request a new code.", VERIFICATION_RESEND_TOO_SOON: "Please wait before requesting another code." },
  de: { EMAIL_DELIVERY_FAILED: "Die Bestätigungs-E-Mail konnte nicht zugestellt werden.", EMAIL_NOT_VERIFIED: "Bestätigen Sie Ihre E-Mail vor der Anmeldung.", VERIFICATION_REQUIRED: "Starten Sie die Registrierung erneut.", INVALID_VERIFICATION_CODE: "Der Bestätigungscode ist ungültig.", VERIFICATION_CODE_EXPIRED: "Der Bestätigungscode ist abgelaufen.", VERIFICATION_ATTEMPTS_EXCEEDED: "Zu viele falsche Versuche.", VERIFICATION_RESEND_TOO_SOON: "Bitte warten Sie vor dem erneuten Senden." },
  es: { EMAIL_DELIVERY_FAILED: "No se pudo entregar el correo de verificación.", EMAIL_NOT_VERIFIED: "Verifica tu correo antes de iniciar sesión.", VERIFICATION_REQUIRED: "Vuelve a iniciar el registro.", INVALID_VERIFICATION_CODE: "El código no es válido.", VERIFICATION_CODE_EXPIRED: "El código ha caducado.", VERIFICATION_ATTEMPTS_EXCEEDED: "Demasiados intentos incorrectos.", VERIFICATION_RESEND_TOO_SOON: "Espera antes de solicitar otro código." },
  "zh-CN": { EMAIL_DELIVERY_FAILED: "验证邮件无法送达。", EMAIL_NOT_VERIFIED: "请先验证邮箱再登录。", VERIFICATION_REQUIRED: "请重新开始注册。", INVALID_VERIFICATION_CODE: "验证码无效。", VERIFICATION_CODE_EXPIRED: "验证码已过期。", VERIFICATION_ATTEMPTS_EXCEEDED: "错误尝试次数过多。", VERIFICATION_RESEND_TOO_SOON: "请稍后再请求新验证码。" },
  fr: { EMAIL_DELIVERY_FAILED: "L’e-mail de vérification n’a pas pu être envoyé.", EMAIL_NOT_VERIFIED: "Vérifiez votre e-mail avant de vous connecter.", VERIFICATION_REQUIRED: "Recommencez l’inscription.", INVALID_VERIFICATION_CODE: "Le code est incorrect.", VERIFICATION_CODE_EXPIRED: "Le code a expiré.", VERIFICATION_ATTEMPTS_EXCEEDED: "Trop de tentatives incorrectes.", VERIFICATION_RESEND_TOO_SOON: "Veuillez patienter avant de demander un autre code." },
}
Object.entries(verificationTranslations).forEach(([language, verify]) => i18n.addResourceBundle(language, "translation", { auth: { verify, errors: verificationErrors[language as keyof typeof verificationErrors] } }, true, true))

const updateDocumentLanguage = (language: string) => {
  const resolved = supportedLanguages.includes(language as (typeof supportedLanguages)[number]) ? language : "en"
  document.documentElement.lang = resolved
  document.documentElement.dir = ["ar", "he"].includes(resolved.split("-")[0]) ? "rtl" : "ltr"
}

updateDocumentLanguage(i18n.resolvedLanguage || i18n.language)
i18n.on("languageChanged", updateDocumentLanguage)

export default i18n
