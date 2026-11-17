"use client";

import { useId, useRef, useState, useTransition } from "react";
import Icon from "@/components/ui/Icon";
import { TAX_TERMS, WORK_AUTH } from "@/data/jobs";
import { startApplication, finishApplication } from "@/lib/applications";
import { createPublicClient } from "@/lib/supabase/public";
import Turnstile from "@/components/careers/Turnstile";

const MAX_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = /\.(pdf|docx?)$/i;
// Order = focus order when the form has errors.
const REQUIRED = ["resume", "name", "email", "phone", "auth", "consent"];

function validateField(name, form, file) {
  const v = (n) => String(form.elements[n]?.value ?? "").trim();
  switch (name) {
    case "resume":
      if (!file) return "Attach your résumé";
      if (!RESUME_TYPES.test(file.name)) return "Use a PDF or Word file";
      if (file.size > MAX_BYTES) return "File is over 5 MB";
      return "";
    case "name":
      return v("name") ? "" : "Enter your full name";
    case "email":
      if (!v("email")) return "Enter your email";
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email")) ? "" : "Enter a valid email";
    case "phone":
      return v("phone").replace(/\D/g, "").length >= 10 ? "" : "Enter a 10-digit phone number";
    case "auth":
      return v("auth") ? "" : "Select your work authorization";
    case "consent":
      return form.elements.consent.checked ? "" : "Please agree so we can contact you";
    default:
      return "";
  }
}

function formatBytes(n) {
  return n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// Application form. `job` is null for talent-network sign-ups.
export default function ApplyForm({ job, onSubmitted }) {
  const uid = useId();
  const id = (n) => `${uid}-${n}`;
  const formRef = useRef(null);
  const turnstile = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [pending, startTransition] = useTransition();

  // aria wiring for a field + its error message
  const a11y = (n) => ({
    id: id(n),
    name: n,
    "aria-invalid": errors[n] ? true : undefined,
    "aria-describedby": errors[n] ? id(`${n}-err`) : undefined,
  });
  const err = (n) =>
    errors[n] ? (
      <p className="cr-ferr" id={id(`${n}-err`)}>
        {errors[n]}
      </p>
    ) : null;

  function pickFile(f) {
    setFile(f ?? null);
    if (errors.resume) setErrors((e) => ({ ...e, resume: validateField("resume", formRef.current, f) }));
  }

  // Re-check a field as the user fixes it (only once it has shown an error).
  function onChange(e) {
    const n = e.target.name;
    if (n && n !== "resume" && errors[n]) setErrors((prev) => ({ ...prev, [n]: validateField(n, formRef.current, file) }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    const next = {};
    for (const n of REQUIRED) {
      const msg = validateField(n, form, file);
      if (msg) next[n] = msg;
    }
    setErrors(next);
    setSubmitError("");
    const firstBad = REQUIRED.find((n) => next[n]);
    if (firstBad) {
      document.getElementById(id(firstBad))?.focus();
      return;
    }
    const data = new FormData(form);
    if (job) data.set("jobId", job.id);
    startTransition(async () => {
      const fail = (msg) => {
        setSubmitError(msg ?? "Something went wrong. Please try again.");
        turnstile.current?.reset();
      };
      try {
        // 1. Server checks Turnstile/honeypot and issues a one-time upload URL.
        const start = await startApplication({
          fileName: file.name,
          fileSize: file.size,
          turnstileToken: turnstile.current?.getToken() ?? "",
          honeypot: String(data.get("company_website") ?? ""),
        });
        if (!start.ok) return fail(start.error);
        if (!start.bot) {
          // 2. Résumé goes straight to the private bucket.
          const { error: upErr } = await createPublicClient()
            .storage.from("resumes")
            .uploadToSignedUrl(start.path, start.token, file, { contentType: file.type || undefined });
          if (upErr) return fail();
          // 3. Server verifies the upload and saves the application.
          data.set("resumePath", start.path);
          data.set("resumeName", file.name);
          const res = await finishApplication(data);
          if (!res.ok) return fail(res.error);
        }
        onSubmitted(String(data.get("name")).trim().split(/\s+/)[0]);
        form.reset();
        setFile(null);
        turnstile.current?.reset();
      } catch {
        fail();
      }
    });
  }

  return (
    <form ref={formRef} className="cr-form" noValidate onSubmit={onSubmit} onChange={onChange}>
      <p className="cr-fhint">
        Fields marked <span className="cr-req">*</span> are required. Takes about 2 minutes.
      </p>

      {/* Résumé first — the highest-intent step, and where autofill will hook in later. */}
      <div className="cr-field">
        <label className="cr-label" htmlFor={id("resume")}>
          Résumé<span className="cr-req">*</span>
        </label>
        <div
          className={`cr-drop${file ? " has" : ""}${dragging ? " drag" : ""}${errors.resume ? " err" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
        >
          <input
            {...a11y("resume")}
            type="file"
            accept=".pdf,.doc,.docx"
            className="cr-file-input"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          <Icon name={file ? "file" : "upload"} strokeWidth={1.8} />
          {file ? (
            <span>
              <b className="cr-fname">{file.name}</b>
              <span className="cr-drop-sub">
                {formatBytes(file.size)} · <u>Replace file</u>
              </span>
            </span>
          ) : (
            <span>
              <b>Upload your résumé</b>
              <span className="cr-drop-sub">Drag &amp; drop or browse · PDF or Word · max 5 MB</span>
            </span>
          )}
        </div>
        {err("resume")}
      </div>

      <div className="cr-frow">
        <div className="cr-field">
          <label className="cr-label" htmlFor={id("name")}>
            Full name<span className="cr-req">*</span>
          </label>
          <input {...a11y("name")} className="cr-input" autoComplete="name" placeholder="Jordan Rivera" />
          {err("name")}
        </div>
        <div className="cr-field">
          <label className="cr-label" htmlFor={id("email")}>
            Email<span className="cr-req">*</span>
          </label>
          <input {...a11y("email")} className="cr-input" type="email" autoComplete="email" placeholder="you@email.com" />
          {err("email")}
        </div>
      </div>

      <div className="cr-frow">
        <div className="cr-field">
          <label className="cr-label" htmlFor={id("phone")}>
            Phone<span className="cr-req">*</span>
          </label>
          <input {...a11y("phone")} className="cr-input" type="tel" autoComplete="tel" placeholder="(555) 123-4567" />
          {err("phone")}
        </div>
        <div className="cr-field">
          <label className="cr-label" htmlFor={id("auth")}>
            Work authorization<span className="cr-req">*</span>
          </label>
          <select {...a11y("auth")} className="cr-input cr-select" defaultValue="">
            <option value="" disabled>
              Select status…
            </option>
            {WORK_AUTH.map((w) => (
              <option key={w.code} value={w.code}>
                {w.label}
              </option>
            ))}
          </select>
          {err("auth")}
        </div>
      </div>

      <div className="cr-frow">
        <div className="cr-field">
          <label className="cr-label" htmlFor={id("location")}>
            Current location<span className="cr-optional">optional</span>
          </label>
          <input id={id("location")} name="location" className="cr-input" placeholder="City, State" />
        </div>
        <div className="cr-field">
          <label className="cr-label" htmlFor={id("years")}>
            Years of experience<span className="cr-optional">optional</span>
          </label>
          <input id={id("years")} name="years" className="cr-input" type="number" inputMode="numeric" min="0" max="50" placeholder="e.g. 5" />
        </div>
      </div>

      <fieldset className="cr-field cr-fieldset">
        <legend className="cr-label">
          Preferred tax term<span className="cr-optional">optional</span>
        </legend>
        <div className="cr-seg">
          {TAX_TERMS.map((t) => (
            <label key={t}>
              <input type="radio" name="taxTerm" value={t} defaultChecked={t === "Any"} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="cr-field">
        <label className="cr-label" htmlFor={id("link")}>
          LinkedIn / portfolio<span className="cr-optional">optional</span>
        </label>
        <input id={id("link")} name="link" className="cr-input" inputMode="url" autoComplete="url" placeholder="linkedin.com/in/…" />
      </div>

      <div className="cr-field">
        <label className="cr-label" htmlFor={id("note")}>
          Anything we should know?<span className="cr-optional">optional</span>
        </label>
        <textarea id={id("note")} name="note" className="cr-input cr-textarea" placeholder="Availability, rate expectations, roles you’re targeting…" />
      </div>

      {/* Honeypot: hidden from people, filled by bots. Checked in submitApplication. */}
      <div className="cr-hp" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="cr-field">
        <label className={`cr-consent${errors.consent ? " err" : ""}`}>
          <input {...a11y("consent")} type="checkbox" />
          <span>
            I agree to be contacted by DG-ALLEN about roles and to the handling of my information for recruiting.
            <span className="cr-req">*</span>
          </span>
        </label>
        {err("consent")}
      </div>

      <Turnstile ref={turnstile} />

      {submitError && (
        <p className="cr-ferr" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="btn btn-red cr-submit" disabled={pending}>
        {pending ? "Sending…" : job ? "Submit application" : "Join the network"}
      </button>
      <p className="cr-trust">
        <Icon name="shieldCheck" strokeWidth={1.8} />
        DG-ALLEN never charges candidates a fee. Your résumé is only shared with your consent.
      </p>
    </form>
  );
}
