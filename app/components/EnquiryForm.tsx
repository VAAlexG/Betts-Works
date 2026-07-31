"use client";

import { FormEvent, useId, useState } from "react";

type FieldName = "name" | "email" | "phone" | "stateOrPostcode" | "preferredContactMethod" | "message" | "consent";
type FieldErrors = Partial<Record<FieldName, string>>;
type FormState = { status: "idle" | "submitting" | "success" | "error"; message?: string; reference?: string; errors?: FieldErrors };

function validate(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const stateOrPostcode = String(formData.get("stateOrPostcode") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!name) errors.name = "Enter your full name.";
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone) errors.phone = "Enter your phone number.";
  else if (!/^[+()\-\s\d]{8,30}$/.test(phone)) errors.phone = "Enter a valid phone number.";
  if (!stateOrPostcode) errors.stateOrPostcode = "Enter your Australian state or postcode.";
  else if (!/^(?:ACT|NSW|NT|QLD|SA|TAS|VIC|WA|\d{4})$/i.test(stateOrPostcode)) errors.stateOrPostcode = "Use a state abbreviation or four-digit postcode.";
  if (!message) errors.message = "Tell us how we can help.";
  if (formData.get("consent") !== "on") errors.consent = "Please acknowledge the privacy notice.";
  return errors;
}

export function EnquiryForm({ vehicleId, vehicleLabel, sourcePage = "/contact" }: { vehicleId?: string; vehicleLabel?: string; sourcePage?: string }) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const formId = useId().replaceAll(":", "");

  function clearError(field: FieldName) {
    if (!state.errors?.[field]) return;
    setState((current) => ({ ...current, status: "idle", message: undefined, errors: { ...current.errors, [field]: undefined } }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const errors = validate(formData);
    if (Object.keys(errors).length) {
      setState({ status: "error", message: "Please check the highlighted information.", errors });
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setState({ status: "submitting" });
    const payload = {
      vehicleId: vehicleId || null,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      stateOrPostcode: formData.get("stateOrPostcode"),
      preferredContactMethod: formData.get("preferredContactMethod"),
      message: formData.get("message"),
      company: formData.get("company") || "",
      consent: formData.get("consent") === "on",
      marketingConsent: formData.get("marketingConsent") === "on",
      sourcePage,
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
      if (!response.ok || !result.ok) {
        const serverErrors = Object.fromEntries(Object.entries(result.errors || {}).map(([field, messages]) => [field, messages[0]])) as FieldErrors;
        setState({ status: "error", message: result.message || "Please check the form and try again.", errors: serverErrors });
        requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
        return;
      }
      form.reset();
      setState({ status: "success", message: result.message, reference: result.reference });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "We could not submit your enquiry." });
    }
  }

  if (state.status === "success") {
    return (
      <div className="form-success-panel" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">Enquiry received</p>
        <h2>Thanks for getting in touch.</h2>
        <p>{state.message}</p>
        {state.reference && <p><strong>Reference:</strong> {state.reference}</p>}
        <p>Tyson will review your enquiry and contact you using your preferred method.</p>
      </div>
    );
  }

  const error = (field: FieldName) => state.errors?.[field];
  const inputProps = (field: FieldName) => ({
    "aria-invalid": Boolean(error(field)),
    "aria-describedby": error(field) ? `${formId}-${field}-error` : undefined,
    onChange: () => clearError(field),
  });

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate aria-label={vehicleLabel ? `Enquire about ${vehicleLabel}` : "Contact Betts Works"}>
      {vehicleLabel && <div className="vehicle-interest"><span>Vehicle of interest</span><strong>{vehicleLabel}</strong></div>}
      <div className="form-grid">
        <label htmlFor={`${formId}-name`}>Full name<input id={`${formId}-name`} name="name" autoComplete="name" required maxLength={100} {...inputProps("name")} />{error("name") && <span id={`${formId}-name-error`} className="field-error">{error("name")}</span>}</label>
        <label htmlFor={`${formId}-email`}>Email<input id={`${formId}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...inputProps("email")} />{error("email") && <span id={`${formId}-email-error`} className="field-error">{error("email")}</span>}</label>
        <label htmlFor={`${formId}-phone`}>Phone<input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" required maxLength={30} {...inputProps("phone")} />{error("phone") && <span id={`${formId}-phone-error`} className="field-error">{error("phone")}</span>}</label>
        <label htmlFor={`${formId}-state`}>State or postcode<input id={`${formId}-state`} name="stateOrPostcode" autoComplete="postal-code" required maxLength={20} placeholder="e.g. QLD or 4000" {...inputProps("stateOrPostcode")} />{error("stateOrPostcode") && <span id={`${formId}-stateOrPostcode-error`} className="field-error">{error("stateOrPostcode")}</span>}</label>
        <label htmlFor={`${formId}-preferred`}>Preferred contact<select id={`${formId}-preferred`} name="preferredContactMethod" defaultValue="phone" {...inputProps("preferredContactMethod")}><option value="phone">Phone</option><option value="email">Email</option></select></label>
        <label className="span-2" htmlFor={`${formId}-message`}>Message<textarea id={`${formId}-message`} name="message" rows={5} required maxLength={2000} placeholder="Tell us what you’d like to know." {...inputProps("message")} />{error("message") && <span id={`${formId}-message-error`} className="field-error">{error("message")}</span>}</label>
        <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" /></label>
      </div>
      <label className="check"><input name="consent" type="checkbox" required {...inputProps("consent")} /> <span>I acknowledge that Betts Works will use my details to respond to this enquiry. See the <a href="/privacy">privacy policy</a>.{error("consent") && <span id={`${formId}-consent-error`} className="field-error">{error("consent")}</span>}</span></label>
      <label className="check"><input name="marketingConsent" type="checkbox" /> <span>I would also like occasional stock updates (optional).</span></label>
      <button className="button" type="submit" disabled={state.status === "submitting"}>{state.status === "submitting" ? "Sending…" : "Send enquiry"} <span aria-hidden="true">→</span></button>
      <p className={`form-status ${state.status}`} role="status" aria-live="polite">{state.message}</p>
    </form>
  );
}
