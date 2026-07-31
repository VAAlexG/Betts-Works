"use client";

import { FormEvent, useState } from "react";

type FormState = { status: "idle" | "submitting" | "success" | "error"; message?: string; reference?: string };

export function EnquiryForm({ vehicleId, vehicleLabel, sourcePage = "/contact" }: { vehicleId?: string; vehicleLabel?: string; sourcePage?: string }) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState({ status: "submitting" });
    const payload = {
      vehicleId: vehicleId || null,
      name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone"), stateOrPostcode: formData.get("stateOrPostcode"),
      preferredContactMethod: formData.get("preferredContactMethod"), message: formData.get("message"), company: formData.get("company") || "",
      consent: formData.get("consent") === "on", marketingConsent: formData.get("marketingConsent") === "on", sourcePage,
    };
    try {
      const csrfResponse = await fetch("/api/enquiries/csrf", { cache: "no-store", credentials: "same-origin" });
      if (!csrfResponse.ok) throw new Error("We could not secure this submission. Please refresh and try again.");
      const { token } = await csrfResponse.json() as { token?: string };
      if (!token) throw new Error("We could not secure this submission. Please refresh and try again.");
      const response = await fetch("/api/enquiries", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
          "X-CSRF-Token": token,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok?: boolean; message?: string; reference?: string; errors?: Record<string, string[]> };
      if (!response.ok || !result.ok) throw new Error(result.message || Object.values(result.errors || {}).flat()[0] || "Please check the form and try again.");
      form.reset();
      setState({ status: "success", message: result.message, reference: result.reference });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "We could not submit your enquiry." });
    }
  }
  return (
    <form className="enquiry-form" onSubmit={submit} noValidate aria-label={vehicleLabel ? `Enquire about ${vehicleLabel}` : "Contact Betts Works"}>
      {vehicleLabel && <div className="vehicle-interest"><span>Vehicle of interest</span><strong>{vehicleLabel}</strong></div>}
      <div className="form-grid">
        <label>Full name<input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="tel" required maxLength={30} /></label>
        <label>State or postcode<input name="stateOrPostcode" autoComplete="postal-code" required maxLength={20} placeholder="e.g. QLD or 4000" /></label>
        <label>Preferred contact<select name="preferredContactMethod" defaultValue="phone"><option value="phone">Phone</option><option value="email">Email</option></select></label>
        <label className="span-2">Message<textarea name="message" rows={5} required maxLength={2000} placeholder="Tell us what you’d like to know." /></label>
        <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="check"><input name="consent" type="checkbox" required /> I acknowledge that Betts Works will use my details to respond to this enquiry. See the <a href="/privacy">privacy policy</a>.</label>
      <label className="check"><input name="marketingConsent" type="checkbox" /> I would also like occasional stock updates (optional).</label>
      <button className="button" type="submit" disabled={state.status === "submitting"}>{state.status === "submitting" ? "Sending…" : "Send enquiry"} <span aria-hidden="true">→</span></button>
      <p className={`form-status ${state.status}`} role="status" aria-live="polite">{state.message}{state.reference ? ` Reference: ${state.reference}.` : ""}</p>
    </form>
  );
}
