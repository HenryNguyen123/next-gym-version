// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import type { FormEvent } from "react";
// import { z } from "zod";
// import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Fingerprint, HeartHandshake, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
// import { FaFacebook, FaGithub } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/providers/toast-provider";
// import { login, register, requestPasswordReset, resetPassword } from "@/lib/services/auth.service";
// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
// import { loginAuthentication } from '@/lib/redux/features/slices/auth/login.slice'
// import { RoleCode } from '@/lib/enums/role-code.enum';

// import { setLogin } from "@/lib/redux/features/slices/account/account.slice";
// // import { useAppDispatch } from "@/lib/redux/hooks";
// import type { UserData } from "@/lib/types/account";

// import {
//   APP_ROUTES,
//   getSafeNextPath,
// } from "@/lib/auth/routes";
// import { isAdminRole } from "@/lib/auth/permissions";

// type AuthMode = "login" | "register" | "forgot" | "reset" | "verify";
// type Props = { mode: AuthMode; admin?: boolean };

// const emailSchema = z.string().trim().email("Enter a valid email address.");
// const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password.") });
// const registerSchema = z.object({ displayName: z.string().trim().min(2, "Use at least 2 characters.").max(60, "Use 60 characters or fewer."), email: emailSchema, password: z.string().min(8, "Use at least 8 characters.") });

// const titles: Record<AuthMode, { heading: string; intro: string; button: string }> = {
//   login: { heading: "Welcome back", intro: "Your people and your little corner are right where you left them.", button: "Sign in to Pulse" },
//   register: { heading: "Make room for you", intro: "Create an account and start building a more thoughtful feed.", button: "Create my account" },
//   forgot: { heading: "Forgot your password?", intro: "It happens. Add your email and we’ll help you find your way back.", button: "Send reset instructions" },
//   reset: { heading: "Choose a new password", intro: "Choose something strong that you don’t use anywhere else.", button: "Update password" },
//   verify: { heading: "Check your inbox", intro: "A quick email check helps keep your account safe and yours.", button: "I’ve verified my email" },
// };

// export function AuthPage({ mode, admin = false }: Props) {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const { toast } = useToast();
//   const [displayName, setDisplayName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [remember, setRemember] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [done, setDone] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const content = titles[mode];
//   const resetToken = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") ?? "" : "";

//   function clearError(name: string) { setErrors((current) => ({ ...current, [name]: "" })); }
//   function fieldError(name: string) { return errors[name] ? <span className="form-error" role="alert">{errors[name]}</span> : null; }



//   async function onSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (loading) return;

//     const nextErrors: Record<string, string> = {};

//     // 1. Validate form
//     if (mode === "login") {
//       const result = loginSchema.safeParse({
//         email,
//         password,
//       });

//       if (!result.success) {
//         for (const issue of result.error.issues) {
//           nextErrors[String(issue.path[0])] = issue.message;
//         }
//       }
//     }

//     if (mode === "register") {
//       const result = registerSchema.safeParse({
//         displayName,
//         email,
//         password,
//       });

//       if (!result.success) {
//         for (const issue of result.error.issues) {
//           nextErrors[String(issue.path[0])] = issue.message;
//         }
//       }

//       if (password !== confirmPassword) {
//         nextErrors.confirmPassword = "Passwords don’t match.";
//       }

//       if (!termsAccepted) {
//         nextErrors.termsAccepted =
//           "Please accept the terms to continue.";
//       }
//     }

//     if (mode === "forgot") {
//       const result = emailSchema.safeParse(email);

//       if (!result.success) {
//         nextErrors.email = "Enter a valid email address.";
//       }
//     }

//     if (mode === "reset") {
//       if (!resetToken) {
//         nextErrors.token =
//           "This reset link is missing a token. Open the link from your email.";
//       }

//       if (password.length < 8) {
//         nextErrors.password = "Use at least 8 characters.";
//       }

//       if (password !== confirmPassword) {
//         nextErrors.confirmPassword = "Passwords don’t match.";
//       }
//     }

//     setErrors(nextErrors);

//     if (Object.keys(nextErrors).length > 0) {
//       return;
//     }

//     // 2. Call API
//     try {
//       setLoading(true);

//       // LOGIN
//       if (mode === "login") {
//         const data = await dispatch(
//           loginAuthentication({
//             email: email.trim(),
//             password,
//           })
//         ).unwrap();

//         // Check user data
//         const roles = data.user?.roles ?? [];

//         const isAdmin = roles.some(
//           (role) =>
//             role.code === RoleCode.ADMIN ||
//             role.code === RoleCode.SUPERADMIN
//         );

//         // Admin login page only accepts admin accounts
//         if (admin && !isAdmin) {
//           toast(
//             "Bạn không có quyền truy cập trang quản trị.",
//             "error"
//           );
//           return;
//         }

//         // Read the requested destination
//         const requested = new URLSearchParams(
//           window.location.search
//         ).get("next");

//         // Prevent external redirects and unauthorized admin redirects
//         const isSafePath =
//           requested?.startsWith("/") &&
//           !requested.startsWith("//") &&
//           !requested.includes("\\") &&
//           !requested.includes("://");

//         const canAccessPath = isAdmin
//           ? requested?.startsWith("/admin")
//           : requested !== undefined &&
//             requested !== null &&
//             !requested.startsWith("/admin");

//         const safeNext =
//           isSafePath && canAccessPath
//             ? requested!
//             : isAdmin
//               ? "/admin"
//               : "/";

//         toast("Đăng nhập thành công.", "success");

//         router.replace(safeNext);
//         router.refresh();

//         return;
//       }

//       // REGISTER
//       if (mode === "register") {
//         await register({
//           displayName: displayName.trim(),
//           email: email.trim(),
//           password,
//         });

//         setDone(true);

//         toast(
//           "Registration successful. Please check your email if verification is required.",
//           "success"
//         );

//         return;
//       }

//       // FORGOT PASSWORD
//       if (mode === "forgot") {
//         await requestPasswordReset(email.trim());

//         setDone(true);

//         toast(
//           "If the account exists, reset instructions will be sent.",
//           "success"
//         );

//         return;
//       }

//       // RESET PASSWORD
//       if (mode === "reset") {
//         await resetPassword(resetToken, password);

//         setDone(true);

//         toast("Password updated successfully.", "success");

//         return;
//       }

//       // VERIFY EMAIL
//       if (mode === "verify") {
//         setDone(true);

//         toast(
//           "Email verification has not been connected to the API yet.",
//           "info"
//         );
//       }
//     } catch (error: unknown) {
//       console.error("Authentication error:", error);

//       const message =
//         error instanceof Error
//           ? error.message
//           : typeof error === "string"
//             ? error
//             : "Something went wrong. Please try again.";

//       toast(message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }



//   //login handle
//   // const handleOnclickLogin = async () => {
//   //   console.log('check input: ', email, password)
//   //   try {
//   //     const data = await dispatch(loginAuthentication({email, password})).unwrap();
//   //     console.log('data:', data);
//   //   } catch (error) {
//   //     console.error("Unexpected error:", error);

//   //   }
//   // }
//   async function handleLoginSuccess(
//   account: UserData,
//   rememberUser: boolean,
//   ) {
//     const data = await dispatch(
//       setLogin({
//         rememberUser,
//         data: account,
//       }),
//     ).unwrap();
//     console.log('data: ', data)
//     const roleCodes = account.roles.map((role) => role.code);

//     const fallback = isAdminRole(roleCodes)
//       ? APP_ROUTES.admin
//       : APP_ROUTES.home;

//     const next = getSafeNextPath(
//       searchParams.get("next"),
//       fallback,
//     );

//     router.replace(next);
//   }
//   const isSuccess = done && (mode === "forgot" || mode === "reset" || mode === "register" || mode === "verify");
//   return <main className={`auth-page ${admin ? "auth-admin-page" : ""}`}>
//     <section className={`auth-showcase ${admin ? "auth-admin-showcase" : ""}`}>
//       <Link className="brand-lockup" href={admin ? "/admin/login" : "/"}><span className="brand-symbol"><Sparkles size={20} /></span><span><span className="brand-word">pulse</span><span className="brand-caption">{admin ? "community control room" : "a little space for you"}</span></span></Link>
//       <div className="auth-copy">
//         <div className="eyebrow">{admin ? "Community care, at scale" : "Less noise. More meaning."}</div>
//         <h1>{admin ? <>A healthier community starts <span>here.</span></> : <>Find your people.<br /><span>Keep your pace.</span></>}</h1>
//         <p>{admin ? "Review what matters, care for your members, and keep the space thoughtful with a clear view of your community." : "A social space for the things that move you — creative ideas, everyday wins, and conversations that leave you feeling a little more connected."}</p>
//         <div className="auth-feature-list"><span><CheckCircle2 size={16} /> {admin ? "Clear moderation workflows" : "A feed shaped around your interests"}</span><span><CheckCircle2 size={16} /> {admin ? "Permission-aware admin tools" : "People-first conversations"}</span><span><CheckCircle2 size={16} /> {admin ? "Auditable actions and clear context" : "More intention, less endless scrolling"}</span></div>
//       </div>
//       <div className="auth-footer"><span>© 2026 Pulse Social</span><span>{admin ? "Built for community care" : "A little space for everyone"}</span></div>
//     </section>
//     <section className="auth-panel"><div className="auth-form-wrap">
//       <Link className="brand-lockup auth-mobile-brand" href={admin ? "/admin/login" : "/"}><span className="brand-symbol"><Sparkles size={18} /></span><span className="brand-word">pulse</span></Link>
//       {isSuccess ? <div className="auth-success-state"><div className="auth-success-icon"><CheckCircle2 size={29} /></div><h2>{mode === "forgot" ? "Check your inbox" : mode === "reset" ? "Password updated" : mode === "register" ? "You’re on your way" : "You’re all set"}</h2><p>{mode === "forgot" ? "If an account matches that email, reset instructions are on their way. This message doesn’t reveal whether an account exists." : mode === "reset" ? "Your password reset flow completed in this preview. Use your new password when you sign in." : mode === "register" ? "Your registration request was handled in demo mode. Connect the real registration endpoint and email verification service to complete the account flow." : "Email verification is simulated here. Connect the verification endpoint to check the real token."}</p><Button onClick={() => router.push(mode === "register" || mode === "reset" ? "/login" : admin ? "/admin/login" : "/login")}>{mode === "register" || mode === "reset" ? "Back to sign in" : "Return to sign in"}<ArrowRight size={15} /></Button></div> : <>
//         <div className="auth-form-heading"><div className="eyebrow">{admin ? "Admin workspace" : "Welcome to Pulse"}</div><h2>{admin && mode === "login" ? "Welcome back, admin" : content.heading}</h2><p className="auth-form-intro">{admin && mode === "login" ? "Sign in with your organization’s administrator account." : content.intro}</p></div>
//         {mode === "verify" ? <div className="verify-email-card"><div className="verify-icon"><Mail size={25} /></div><strong>One small step left</strong><p>We’ve sent a verification link to <b>{email || "your email address"}</b>. Open that message, follow the link, and come back here.</p><div className="field" style={{ marginTop: 17 }}><label htmlFor="verify-email">Email address</label><input id="verify-email" className="input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div><Button className="verify-main-action" onClick={() => setDone(true)}>{content.button}<CheckCircle2 size={15} /></Button><button className="verify-resend" onClick={() => toast("Verification resend needs a connected email service.", "info")}>Resend verification email</button></div> : <form className="auth-form"
//         //  onSubmit={onSubmit} 
//         noValidate>
//           {mode === "register" && <div className="field"><label htmlFor="displayName">Display name</label><input id="displayName" className="input" value={displayName} onChange={(event) => { setDisplayName(event.target.value); clearError("displayName"); }} placeholder="How people will know you" autoComplete="name" required />{fieldError("displayName")}</div>}
//           {(mode === "login" || mode === "register" || mode === "forgot") && <div className="field"><label htmlFor="email">Email address</label><input id="email" className="input" type="email" value={email} onChange={(event) => { setEmail(event.target.value); clearError("email"); }} placeholder="you@example.com" autoComplete="email" required />{fieldError("email")}</div>}
//           {(mode === "login" || mode === "register" || mode === "reset") && <div className="field"><label htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label><div className="password-field"><input id="password" className="input" type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); clearError("password"); }} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"} required /><button className="password-reveal" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{fieldError("password")}{(mode === "register" || mode === "reset") && <span className="field-hint"><ShieldCheck size={13} /> Use at least 8 characters.</span>}</div>}
//           {(mode === "register" || mode === "reset") && <div className="field"><label htmlFor="confirmPassword">Confirm password</label><div className="password-field"><input id="confirmPassword" className="input" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); clearError("confirmPassword"); }} autoComplete="new-password" placeholder="Enter your password again" required /><button className="password-reveal" type="button" aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowConfirm((value) => !value)}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{fieldError("confirmPassword")}</div>}
//           {mode === "login" && <div className="auth-inline"><label className="check-label"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Remember me</label><Link href="/forgot-password">Forgot password?</Link></div>}
//           {mode === "register" && <div><label className="check-label"><input type="checkbox" checked={termsAccepted} onChange={(event) => { setTermsAccepted(event.target.checked); clearError("termsAccepted"); }} /> I agree to the <Link href="/" onClick={(event) => { event.preventDefault(); toast("Terms page is not part of this starter yet.", "info"); }}>Terms of Service</Link> and Privacy Policy.</label>{fieldError("termsAccepted")}</div>}
//           {mode === "reset" && fieldError("token")}
//           <Button 
//             onClick={handleLoginSuccess}
//             type="submit" size="lg" 
//             disabled={loading}>{loading ? <span className="button-spinner" /> : null}{loading ? "Please wait…" : content.button}<ArrowRight size={15} 
//           /></Button>
//           <div className="flex items-center justify-center gap-4">
//             <FaFacebook size={20} className="cursor-pointer text-[#1877F2] hover:scale-125" />
//             <FcGoogle size={20} className="cursor-pointer hover:scale-125" />
//             <FaGithub size={20} className="cursor-pointer text-[#181717] hover:scale-125" />
//           </div>
//           {mode === "login" && !admin && <div className="auth-note"><Fingerprint size={17} /><span><strong>Local preview mode</strong><br />Any non-empty password is accepted here. This is only a UI prototype, not real authentication.</span></div>}
//           {mode === "login" && admin && <div className="auth-note admin-demo-note"><LockKeyhole size={17} /><span><strong>Development-only admin preview</strong><br />Use any valid email and a non-empty password. Never use this mock login for deployment.</span></div>}
//         </form>}
//         {mode === "login" && <p className="auth-switch">New around here? <Link href="/register">Create an account</Link></p>}
//         {mode === "register" && <p className="auth-switch">Already part of Pulse? <Link href="/login">Sign in</Link></p>}
//         {(mode === "forgot" || mode === "reset" || mode === "verify") && <p className="auth-switch"><Link href={admin ? "/admin/login" : "/login"}><ArrowLeft size={12} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} /> Back to sign in</Link></p>}
//         {admin && <p className="auth-switch"><Link href="/">Return to the community</Link></p>}
//       </>}
//       <div className="auth-bottom-note"><HeartHandshake size={15} /><span>{admin ? "Access should be limited to trusted roles." : "Be kind. Stay curious. Leave room for others."}</span></div>
//     </div></section>
//   </main>;
// }



"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Fingerprint, HeartHandshake, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { register, requestPasswordReset, resetPassword } from "@/lib/services/auth.service";
import { useAppDispatch } from "@/lib/redux/hooks";
import { loginAuthentication } from "@/lib/redux/features/slices/auth/login.slice";
import { setLogin } from "@/lib/redux/features/slices/account/account.slice";
import type { UserData } from "@/lib/types/account";

import { isAdminRole } from "@/lib/auth/permissions";

type AuthMode = "login" | "register" | "forgot" | "reset" | "verify";
type Props = { mode: AuthMode; admin?: boolean };

const emailSchema = z.string().trim().email("Enter a valid email address.");
const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password.") });
const registerSchema = z.object({ displayName: z.string().trim().min(2, "Use at least 2 characters.").max(60, "Use 60 characters or fewer."), email: emailSchema, password: z.string().min(8, "Use at least 8 characters.") });

const titles: Record<AuthMode, { heading: string; intro: string; button: string }> = {
  login: { heading: "Welcome back", intro: "Your people and your little corner are right where you left them.", button: "Sign in to Pulse" },
  register: { heading: "Make room for you", intro: "Create an account and start building a more thoughtful feed.", button: "Create my account" },
  forgot: { heading: "Forgot your password?", intro: "It happens. Add your email and we’ll help you find your way back.", button: "Send reset instructions" },
  reset: { heading: "Choose a new password", intro: "Choose something strong that you don’t use anywhere else.", button: "Update password" },
  verify: { heading: "Check your inbox", intro: "A quick email check helps keep your account safe and yours.", button: "I’ve verified my email" },
};

export function AuthPage({ mode, admin = false }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const content = titles[mode];
  const resetToken = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") ?? "" : "";

  function clearError(name: string) { setErrors((current) => ({ ...current, [name]: "" })); }
  function fieldError(name: string) { return errors[name] ? <span className="form-error" role="alert">{errors[name]}</span> : null; }



  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const nextErrors: Record<string, string> = {};

    // 1. Validate form
    if (mode === "login") {
      const result = loginSchema.safeParse({
        email,
        password,
      });
      console.log('Validate login : ', result)
      if (!result.success) {
        for (const issue of result.error.issues) {
          nextErrors[String(issue.path[0])] = issue.message;
        }
      }
    }

    if (mode === "register") {
      const result = registerSchema.safeParse({
        displayName,
        email,
        password,
      });

      if (!result.success) {
        for (const issue of result.error.issues) {
          nextErrors[String(issue.path[0])] = issue.message;
        }
      }

      if (password !== confirmPassword) {
        nextErrors.confirmPassword = "Passwords don’t match.";
      }

      if (!termsAccepted) {
        nextErrors.termsAccepted =
          "Please accept the terms to continue.";
      }
    }

    if (mode === "forgot") {
      const result = emailSchema.safeParse(email);

      if (!result.success) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (mode === "reset") {
      if (!resetToken) {
        nextErrors.token =
          "This reset link is missing a token. Open the link from your email.";
      }

      if (password.length < 8) {
        nextErrors.password = "Use at least 8 characters.";
      }

      if (password !== confirmPassword) {
        nextErrors.confirmPassword = "Passwords don’t match.";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // 2. Call API
    try {
      setLoading(true);

      // LOGIN: authenticate with the API, persist the account, then navigate by role.
      if (mode === "login") {
        const result = await dispatch(
          loginAuthentication({
            email: email.trim(),
            password,
          })
        ).unwrap();
        console.log('admin login: ', result)
        const account = result.user as UserData | null;

        if (!account) {
          throw new Error("Đăng nhập thành công nhưng API không trả về thông tin tài khoản.");
        }

        const roleCodes = account.roles?.map((role) => role.code) ?? [];
        const userIsAdmin = isAdminRole(roleCodes);
        console.log('userIsAdmin: ',userIsAdmin)
        // The admin login page must not accept ordinary user accounts.
        if (admin && !userIsAdmin) {
          toast("Tài khoản này không có quyền truy cập trang quản trị.", "error");
          return;
        }

        // Save the account; the account slice decides session/local storage.
        await dispatch(
          setLogin({
            rememberUser: remember,
            data: account,
          })
        ).unwrap();

        toast("Đăng nhập thành công.", "success");

        // Let the Next.js proxy/middleware perform all route redirects.
        // Refresh the current route so it can read the newly written session cookies.
        router.refresh();
        return;
      }

      // REGISTER
      if (mode === "register") {
        await register({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        });

        setDone(true);

        toast(
          "Registration successful. Please check your email if verification is required.",
          "success"
        );

        return;
      }

      // FORGOT PASSWORD
      if (mode === "forgot") {
        await requestPasswordReset(email.trim());

        setDone(true);

        toast(
          "If the account exists, reset instructions will be sent.",
          "success"
        );

        return;
      }

      // RESET PASSWORD
      if (mode === "reset") {
        await resetPassword(resetToken, password);

        setDone(true);

        toast("Password updated successfully.", "success");

        return;
      }

      // VERIFY EMAIL
      if (mode === "verify") {
        setDone(true);

        toast(
          "Email verification has not been connected to the API yet.",
          "info"
        );
      }
    } catch (error: unknown) {
      console.error("Authentication error:", error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Something went wrong. Please try again.";

      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }



  const isSuccess = done && (mode === "forgot" || mode === "reset" || mode === "register" || mode === "verify");
  return <main className={`auth-page ${admin ? "auth-admin-page" : ""}`}>
    <section className={`auth-showcase ${admin ? "auth-admin-showcase" : ""}`}>
      <Link className="brand-lockup" href={admin ? "/admin/login" : "/"}><span className="brand-symbol"><Sparkles size={20} /></span><span><span className="brand-word">pulse</span><span className="brand-caption">{admin ? "community control room" : "a little space for you"}</span></span></Link>
      <div className="auth-copy">
        <div className="eyebrow">{admin ? "Community care, at scale" : "Less noise. More meaning."}</div>
        <h1>{admin ? <>A healthier community starts <span>here.</span></> : <>Find your people.<br /><span>Keep your pace.</span></>}</h1>
        <p>{admin ? "Review what matters, care for your members, and keep the space thoughtful with a clear view of your community." : "A social space for the things that move you — creative ideas, everyday wins, and conversations that leave you feeling a little more connected."}</p>
        <div className="auth-feature-list"><span><CheckCircle2 size={16} /> {admin ? "Clear moderation workflows" : "A feed shaped around your interests"}</span><span><CheckCircle2 size={16} /> {admin ? "Permission-aware admin tools" : "People-first conversations"}</span><span><CheckCircle2 size={16} /> {admin ? "Auditable actions and clear context" : "More intention, less endless scrolling"}</span></div>
      </div>
      <div className="auth-footer"><span>© 2026 Pulse Social</span><span>{admin ? "Built for community care" : "A little space for everyone"}</span></div>
    </section>
    <section className="auth-panel"><div className="auth-form-wrap">
      <Link className="brand-lockup auth-mobile-brand" href={admin ? "/admin/login" : "/"}><span className="brand-symbol"><Sparkles size={18} /></span><span className="brand-word">pulse</span></Link>
      {isSuccess ? <div className="auth-success-state"><div className="auth-success-icon"><CheckCircle2 size={29} /></div><h2>{mode === "forgot" ? "Check your inbox" : mode === "reset" ? "Password updated" : mode === "register" ? "You’re on your way" : "You’re all set"}</h2><p>{mode === "forgot" ? "If an account matches that email, reset instructions are on their way. This message doesn’t reveal whether an account exists." : mode === "reset" ? "Your password was updated successfully. Sign in with your new password." : mode === "register" ? "Your registration request was submitted. Check your inbox if email verification is required." : "Email verification is simulated here. Connect the verification endpoint to check the real token."}</p><Button onClick={() => router.push(mode === "register" || mode === "reset" ? "/login" : admin ? "/admin/login" : "/login")}>{mode === "register" || mode === "reset" ? "Back to sign in" : "Return to sign in"}<ArrowRight size={15} /></Button></div> : <>
        <div className="auth-form-heading"><div className="eyebrow">{admin ? "Admin workspace" : "Welcome to Pulse"}</div><h2>{admin && mode === "login" ? "Welcome back, admin" : content.heading}</h2><p className="auth-form-intro">{admin && mode === "login" ? "Sign in with your organization’s administrator account." : content.intro}</p></div>
        {mode === "verify" ? <div className="verify-email-card"><div className="verify-icon"><Mail size={25} /></div><strong>One small step left</strong><p>We’ve sent a verification link to <b>{email || "your email address"}</b>. Open that message, follow the link, and come back here.</p><div className="field" style={{ marginTop: 17 }}><label htmlFor="verify-email">Email address</label><input id="verify-email" className="input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div><Button className="verify-main-action" onClick={() => setDone(true)}>{content.button}<CheckCircle2 size={15} /></Button><button className="verify-resend" onClick={() => toast("Verification resend needs a connected email service.", "info")}>Resend verification email</button></div> : <form className="auth-form" onSubmit={onSubmit} noValidate>
          {mode === "register" && <div className="field"><label htmlFor="displayName">Display name</label><input id="displayName" className="input" value={displayName} onChange={(event) => { setDisplayName(event.target.value); clearError("displayName"); }} placeholder="How people will know you" autoComplete="name" required />{fieldError("displayName")}</div>}
          {(mode === "login" || mode === "register" || mode === "forgot") && <div className="field"><label htmlFor="email">Email address</label><input id="email" className="input" type="email" value={email} onChange={(event) => { setEmail(event.target.value); clearError("email"); }} placeholder="you@example.com" autoComplete="email" required />{fieldError("email")}</div>}
          {(mode === "login" || mode === "register" || mode === "reset") && <div className="field"><label htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label><div className="password-field"><input id="password" className="input" type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); clearError("password"); }} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"} required /><button className="password-reveal" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{fieldError("password")}{(mode === "register" || mode === "reset") && <span className="field-hint"><ShieldCheck size={13} /> Use at least 8 characters.</span>}</div>}
          {(mode === "register" || mode === "reset") && <div className="field"><label htmlFor="confirmPassword">Confirm password</label><div className="password-field"><input id="confirmPassword" className="input" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); clearError("confirmPassword"); }} autoComplete="new-password" placeholder="Enter your password again" required /><button className="password-reveal" type="button" aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowConfirm((value) => !value)}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{fieldError("confirmPassword")}</div>}
          {mode === "login" && <div className="auth-inline"><label className="check-label"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Remember me</label><Link href="/forgot-password">Forgot password?</Link></div>}
          {mode === "register" && <div><label className="check-label"><input type="checkbox" checked={termsAccepted} onChange={(event) => { setTermsAccepted(event.target.checked); clearError("termsAccepted"); }} /> I agree to the <Link href="/" onClick={(event) => { event.preventDefault(); toast("Terms page is not part of this starter yet.", "info"); }}>Terms of Service</Link> and Privacy Policy.</label>{fieldError("termsAccepted")}</div>}
          {mode === "reset" && fieldError("token")}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
          >
            {loading ? <span className="button-spinner" /> : null}
            {loading ? "Please wait…" : content.button}
            <ArrowRight size={15} />
          </Button>
          <div className="flex items-center justify-center gap-4">
            <FaFacebook size={20} className="cursor-pointer text-[#1877F2] hover:scale-125" />
            <FcGoogle size={20} className="cursor-pointer hover:scale-125" />
            <FaGithub size={20} className="cursor-pointer text-[#181717] hover:scale-125" />
          </div>
          {mode === "login" && !admin && <div className="auth-note"><Fingerprint size={17} /><span><strong>Account security</strong><br />Sign in with your account credentials. Your role determines which areas you can access.</span></div>}
          {mode === "login" && admin && <div className="auth-note admin-demo-note"><LockKeyhole size={17} /><span><strong>Administrator access</strong><br />Use a valid account with an administrator role to continue.</span></div>}
        </form>}
        {mode === "login" && <p className="auth-switch">New around here? <Link href="/register">Create an account</Link></p>}
        {mode === "register" && <p className="auth-switch">Already part of Pulse? <Link href="/login">Sign in</Link></p>}
        {(mode === "forgot" || mode === "reset" || mode === "verify") && <p className="auth-switch"><Link href={admin ? "/admin/login" : "/login"}><ArrowLeft size={12} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} /> Back to sign in</Link></p>}
        {admin && <p className="auth-switch"><Link href="/">Return to the community</Link></p>}
      </>}
      <div className="auth-bottom-note"><HeartHandshake size={15} /><span>{admin ? "Access should be limited to trusted roles." : "Be kind. Stay curious. Leave room for others."}</span></div>
    </div></section>
  </main>;
}
