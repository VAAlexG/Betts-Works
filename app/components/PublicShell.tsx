import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <><a className="skip-link" href="#main-content">Skip to main content</a><Header /><main id="main-content" tabIndex={-1}>{children}</main><Footer /></>;
}
