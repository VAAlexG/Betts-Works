import Link from "next/link";
import { BrandMark } from "@/app/components/BrandMark";
export function AdminShell({children,email}:{children:React.ReactNode;email?:string}){return <div className="admin-shell"><header className="admin-header"><div className="shell"><BrandMark/><nav className="admin-actions" aria-label="Administration"><Link href="/admin">Dashboard</Link><Link href="/admin/vehicles/new">New vehicle</Link><Link href="/" target="_blank">View website ↗</Link>{email&&<span>{email}</span>}</nav></div></header><main className="admin-main shell">{children}</main></div>}
