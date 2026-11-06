"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import {
  ContactFormValues,
  ContactFormErrors,
  ProjectType,
  PROJECT_TYPES,
  validateContactForm,
  submitContact,
  saveContactDraft,
  loadContactDraft,
  clearContactDraft,
  SubmitStatus,
} from "@/lib/contact";

interface ContactFormProps {
  onBack: () => void;
  openedAt: number;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onBack, openedAt }) => {
  const [values, setValues] = useState<ContactFormValues>(() => {
    const draft = loadContactDraft();
    return {
      name: draft.name || "",
      email: draft.email || "",
      company: draft.company || "",
      project_type: draft.project_type || "",
      message: draft.message || "",
      botcheck: "",
      openedAt: openedAt || Date.now(),
    };
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<string>("");

  const isDemoMode =
    typeof window !== "undefined" && (window as unknown as { __WEB3FORMS_KEY__?: string }).__WEB3FORMS_KEY__
      ? false
      : !process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim();

  const formRef = useRef<HTMLFormElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const companyInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const rubySweepRef = useRef<HTMLDivElement | null>(null);

  // Update openedAt if passed prop changes
  useEffect(() => {
    if (openedAt) {
      setValues((prev) => ({ ...prev, openedAt }));
    }
  }, [openedAt]);

  // Initial focus on first input and animate underlines
  useEffect(() => {
    if (status === "success") return;

    // Focus first input on mount
    const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);

    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isReducedMotion && formRef.current) {
      const lines = formRef.current.querySelectorAll<HTMLElement>(".contact-draw-line");
      gsap.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          transformOrigin: "left center",
        }
      );
    }

    return () => clearTimeout(timer);
  }, [status]);

  // Success sweep animation and focus management
  useEffect(() => {
    if (status === "success") {
      setLiveStatus("Message sent successfully. Thanks. We'll be in touch soon.");
      const isReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!isReducedMotion && rubySweepRef.current) {
        gsap.fromTo(
          rubySweepRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.inOut",
            transformOrigin: "left center",
          }
        );
      }

      const timer = setTimeout(() => {
        successHeadingRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Save draft whenever user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      saveContactDraft(next);
      return next;
    });

    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setGeneralError(null);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentValidation = validateContactForm(values);
    if (currentValidation[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: currentValidation[name as keyof ContactFormErrors],
      }));
    }
  };

  // Radio group chip click
  const handleSelectProjectType = (type: ProjectType) => {
    setValues((prev) => {
      const next = { ...prev, project_type: type };
      saveContactDraft(next);
      return next;
    });
    setTouched((prev) => ({ ...prev, project_type: true }));
    setErrors((prev) => ({ ...prev, project_type: undefined }));
    setGeneralError(null);
  };

  // Arrow key navigation for radio chips
  const handleChipKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % PROJECT_TYPES.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + PROJECT_TYPES.length) % PROJECT_TYPES.length;
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleSelectProjectType(PROJECT_TYPES[index]);
      return;
    }

    if (nextIndex !== -1) {
      const targetType = PROJECT_TYPES[nextIndex];
      handleSelectProjectType(targetType);
      chipRefs.current[nextIndex]?.focus();
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setGeneralError(null);

    // Run client validation
    const validationErrors = validateContactForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        email: true,
        company: true,
        project_type: true,
        message: true,
      });

      // Move focus to first invalid field
      if (validationErrors.name) {
        nameInputRef.current?.focus();
      } else if (validationErrors.email) {
        emailInputRef.current?.focus();
      } else if (validationErrors.project_type) {
        chipRefs.current[0]?.focus();
      } else if (validationErrors.company) {
        companyInputRef.current?.focus();
      } else if (validationErrors.message) {
        messageInputRef.current?.focus();
      }

      setLiveStatus("Form has errors. Please correct the highlighted fields.");
      return;
    }

    setStatus("submitting");
    setLiveStatus("Sending your message...");

    const result = await submitContact(values);

    if (result.success) {
      setStatus("success");
      setLiveStatus("Message sent. Thanks. We'll be in touch soon.");
    } else {
      setStatus("failure");
      setGeneralError(result.message);
      setLiveStatus(result.message);
    }
  };

  if (status === "success") {
    return (
      <div className="relative w-full py-4 text-left">
        {/* Ruby sweep line along bottom of card */}
        <div
          ref={rubySweepRef}
          aria-hidden="true"
          className="absolute -bottom-6 md:-bottom-10 -left-6 md:-left-10 -right-6 md:-right-10 h-[3px] bg-[#D1122F] origin-left"
        />

        <div className="max-w-xl">
          <h3
            ref={successHeadingRef}
            tabIndex={-1}
            className="text-heading-xl text-black font-bold uppercase tracking-tight mb-4 outline-none"
          >
            Message sent.
          </h3>
          <p className="text-body-md text-black mb-6 leading-relaxed">
            Thanks. We&apos;ll be in touch soon.
          </p>

          {/* Automated Response Receipt */}
          <div className="border border-black p-4 mb-8 bg-gray-50/50 space-y-2.5 text-xs uppercase font-mono tracking-wider">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-bold">Status</span>
              <span className="font-bold text-black">✓ Logged &amp; Dispatched</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-bold">Inquiry Type</span>
              <span className="font-bold text-black">{values.project_type || "General"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-bold">Confirmation Sent To</span>
              <span className="font-bold text-black lowercase">{values.email}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-gray-500 font-bold">Expected Response</span>
              <span className="font-bold text-black">&lt; 24 Hours</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-button text-black underline underline-offset-4 hover:opacity-70 transition-opacity font-bold uppercase cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            ← Back to contact info
          </button>
        </div>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="relative w-full text-left">
      {/* Live region for accessibility announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveStatus}
      </div>

      {/* Top row: Back link */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to contact details"
          className="inline-flex items-center gap-2 text-label text-black font-bold uppercase tracking-wider hover:opacity-70 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer py-1"
        >
          ← Back
        </button>
      </div>

      {/* Heading */}
      <h2
        id="contact-form-title"
        className="text-heading-lg text-black uppercase font-bold tracking-tight mb-1"
      >
        Send a message
      </h2>
      <p className="text-body-sm text-gray-700 uppercase font-medium tracking-wider mb-6">
        Tell us about your startup or project
      </p>

      {/* Demo mode banner if Web3Forms key is missing */}
      {isDemoMode && (
        <div
          role="status"
          className="mb-6 p-4 bg-gray-50 border-l-4 border-black text-black text-sm"
        >
          <p className="font-bold uppercase text-xs tracking-wider mb-1">Demo Mode</p>
          <p className="text-body-sm text-gray-800">
            Contact form is running in demo mode. Submissions are paused until an access key is added.
          </p>
        </div>
      )}

      {/* General error / failure banner */}
      {generalError && (
        <div
          role="alert"
          className="mb-6 p-4 bg-[#D1122F]/10 border-l-4 border-[#D1122F] text-black text-sm"
        >
          <p className="font-bold text-[#D1122F] uppercase text-xs mb-1">Notice</p>
          <p>{generalError}</p>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="contact-form-title"
        className="space-y-6"
      >
        {/* Honeypot field (hidden from real users, caught by bots) */}
        <div
          className="absolute opacity-0 -z-10 pointer-events-none w-0 h-0 overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="botcheck-field">Do not fill this field</label>
          <input
            id="botcheck-field"
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            value={values.botcheck || ""}
            onChange={handleChange}
          />
        </div>

        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="flex flex-col relative">
            <label
              htmlFor="contact-name"
              className="text-label text-black font-bold uppercase tracking-wider mb-1.5"
            >
              Name *
            </label>
            <input
              ref={nameInputRef}
              id="contact-name"
              name="name"
              type="text"
              required
              disabled={isSubmitting}
              autoComplete="name"
              enterKeyHint="next"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  emailInputRef.current?.focus();
                }
              }}
              aria-required="true"
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className="w-full bg-transparent text-[16px] md:text-body-md text-black border-b border-black pb-2 rounded-none outline-none focus:border-[#D1122F] focus:border-b-2 focus-visible:outline-none transition-colors"
            />
            <div
              aria-hidden="true"
              className="contact-draw-line h-[1px] bg-black w-full"
            />
            {touched.name && errors.name && (
              <p
                id="contact-name-error"
                role="alert"
                className="text-xs text-[#D1122F] mt-1 font-medium"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col relative">
            <label
              htmlFor="contact-email"
              className="text-label text-black font-bold uppercase tracking-wider mb-1.5"
            >
              Email *
            </label>
            <input
              ref={emailInputRef}
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              required
              disabled={isSubmitting}
              autoComplete="email"
              enterKeyHint="next"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  companyInputRef.current?.focus();
                }
              }}
              aria-required="true"
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className="w-full bg-transparent text-[16px] md:text-body-md text-black border-b border-black pb-2 rounded-none outline-none focus:border-[#D1122F] focus:border-b-2 focus-visible:outline-none transition-colors"
            />
            <div
              aria-hidden="true"
              className="contact-draw-line h-[1px] bg-black w-full"
            />
            {touched.email && errors.email && (
              <p
                id="contact-email-error"
                role="alert"
                className="text-xs text-[#D1122F] mt-1 font-medium"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Company */}
        <div className="flex flex-col relative">
          <label
            htmlFor="contact-company"
            className="text-label text-black font-bold uppercase tracking-wider mb-1.5"
          >
            Company (Optional)
          </label>
          <input
            ref={companyInputRef}
            id="contact-company"
            name="company"
            type="text"
            disabled={isSubmitting}
            autoComplete="organization"
            enterKeyHint="next"
            value={values.company}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                chipRefs.current[0]?.focus();
              }
            }}
            aria-invalid={touched.company && !!errors.company}
            aria-describedby={errors.company ? "contact-company-error" : undefined}
            className="w-full bg-transparent text-[16px] md:text-body-md text-black border-b border-black pb-2 rounded-none outline-none focus:border-[#D1122F] focus:border-b-2 focus-visible:outline-none transition-colors"
          />
          <div
            aria-hidden="true"
            className="contact-draw-line h-[1px] bg-black w-full"
          />
          {touched.company && errors.company && (
            <p
              id="contact-company-error"
              role="alert"
              className="text-xs text-[#D1122F] mt-1 font-medium"
            >
              {errors.company}
            </p>
          )}
        </div>

        {/* Row 3: What do you need? Radio Group with selectable chips */}
        <div
          role="radiogroup"
          aria-labelledby="project-type-legend"
          aria-required="true"
          className="flex flex-col"
        >
          <span
            id="project-type-legend"
            className="text-label text-black font-bold uppercase tracking-wider mb-2 block"
          >
            What do you need? *
          </span>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map((type, idx) => {
              const isSelected = values.project_type === type;
              return (
                <button
                  key={type}
                  ref={(el) => {
                    chipRefs.current[idx] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={
                    isSelected
                      ? 0
                      : values.project_type === "" && idx === 0
                      ? 0
                      : -1
                  }
                  disabled={isSubmitting}
                  onClick={() => handleSelectProjectType(type)}
                  onKeyDown={(e) => handleChipKeyDown(e, idx)}
                  className={`border border-black rounded-none uppercase font-bold text-xs md:text-sm py-2 px-3.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D1122F] focus-visible:outline-offset-2 ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-transparent text-black hover:bg-black/5"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
          {touched.project_type && errors.project_type && (
            <p
              id="contact-project-type-error"
              role="alert"
              className="text-xs text-[#D1122F] mt-1 font-medium"
            >
              {errors.project_type}
            </p>
          )}
        </div>

        {/* Row 4: Message Textarea */}
        <div className="flex flex-col relative">
          <label
            htmlFor="contact-message"
            className="text-label text-black font-bold uppercase tracking-wider mb-1.5"
          >
            Message *
          </label>
          <textarea
            ref={messageInputRef}
            id="contact-message"
            name="message"
            required
            rows={4}
            disabled={isSubmitting}
            enterKeyHint="done"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            aria-required="true"
            aria-invalid={touched.message && !!errors.message}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className="w-full bg-transparent text-[16px] md:text-body-md text-black border-b border-black pb-2 rounded-none outline-none focus:border-[#D1122F] focus:border-b-2 focus-visible:outline-none transition-colors resize-y min-h-[90px]"
          />
          <div
            aria-hidden="true"
            className="contact-draw-line h-[1px] bg-black w-full"
          />
          {touched.message && errors.message && (
            <p
              id="contact-message-error"
              role="alert"
              className="text-xs text-[#D1122F] mt-1 font-medium"
            >
              {errors.message}
            </p>
          )}
        </div>

        {/* Row 5: Action Button & Disclaimers */}
        <div className="pt-2 flex flex-col items-start gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-button text-black bg-white border-2 border-black hover:bg-black hover:text-white transition-colors duration-200 px-6 py-3 font-bold uppercase tracking-wider inline-flex items-center gap-3 cursor-pointer rounded-none focus-visible:outline-2 focus-visible:outline-[#D1122F] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "SENDING..." : "SEND MESSAGE →"}
          </button>

          <p className="text-label text-gray-600 uppercase tracking-wider mt-2">
            Concept project. Your message goes to its builder, John, through Web3Forms.
          </p>
        </div>
      </form>
    </div>
  );
};
