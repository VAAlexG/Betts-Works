import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}
