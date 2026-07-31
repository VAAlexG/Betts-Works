import type { Metadata } from "next";
import { chatGPTSignInPath } from "@/app/chatgpt-auth";
import { getAdminPrincipal } from "@/lib/auth";
import { getAdminDashboard } from "@/lib/data";
import { AdminShell } from "./AdminShell";
import { AdminDashboard } from "./AdminDashboard";
export const dynamic="force-dynamic";export const metadata:Metadata={title:"Administration",robots:{index:false,follow:false},referrer:"no-referrer"};
export default async function AdminPage(){const admin=await getAdminPrincipal();if(!admin)return <AdminShell><div className="auth-card"><p className="eyebrow">Restricted area</p><h1>Administrator sign-in required</h1><p>There is no public registration. Access requires secure identity-provider sign-in and an email listed in the server-side ADMIN_EMAILS configuration. Multi-factor authentication is managed by the identity provider.</p><a className="button" href={chatGPTSignInPath("/admin")}>Sign in securely</a><p className="muted">Sign-in attempts are rate-limited and access errors do not reveal whether an account exists. For local development only, set DEV_ADMIN_EMAIL and add the same address to ADMIN_EMAILS.</p></div></AdminShell>;const dashboard=await getAdminDashboard();return <AdminShell email={admin.email}><AdminDashboard initialVehicles={dashboard.vehicles} initialEnquiries={dashboard.enquiries} counts={dashboard.counts}/></AdminShell>}
