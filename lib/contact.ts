export type ProjectType =
  | "Brand identity"
  | "Website"
  | "Brand and website"
  | "Something else";

export const PROJECT_TYPES: readonly ProjectType[] = [
  "Brand identity",
  "Website",
  "Brand and website",
  "Something else",
] as const;

export interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  project_type: ProjectType | "";
  message: string;
  botcheck?: string;
  openedAt: number;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  company?: string;
  project_type?: string;
  message?: string;
  general?: string;
}

export type SubmitStatus =
  | "idle"
  | "submitting"
  | "success"
  | "failure"
  | "not_configured"
  | "too_fast"
  | "cooldown"
  | "limit_reached";

export interface ContactSubmitResult {
  success: boolean;
  status: SubmitStatus;
  message: string;
}

const STORAGE_KEYS = {
  DRAFT: "identity_contact_draft_v1",
  LAST_SENT: "identity_contact_last_sent_v1",
  SEND_COUNT: "identity_contact_send_count_v1",
};

/**
 * Validates the contact form values client-side according to the specification.
 */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const company = (values.company || "").trim();
  const projectType = values.project_type;
  const message = values.message.trim();

  if (!name || name.length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  } else if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }

  // RFC-compliant email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (email.length > 254) {
    errors.email = "Email must be 254 characters or fewer.";
  }

  if (company.length > 100) {
    errors.company = "Company must be 100 characters or fewer.";
  }

  if (!projectType || !PROJECT_TYPES.includes(projectType as ProjectType)) {
    errors.project_type = "Please select what you need.";
  }

  if (!message || message.length < 10) {
    errors.message = "Please write a message (at least 10 characters).";
  } else if (message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}

/**
 * Saves form draft to sessionStorage, excluding honeypot and timestamps.
 */
export function saveContactDraft(values: {
  name: string;
  email: string;
  company: string;
  project_type: ProjectType | "";
  message: string;
}): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    const draft = {
      name: values.name,
      email: values.email,
      company: values.company,
      project_type: values.project_type,
      message: values.message,
    };
    sessionStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  } catch {
    // Gracefully ignore storage quota / sandbox errors
  }
}

/**
 * Retrieves the draft from sessionStorage if present.
 */
export function loadContactDraft(): Partial<ContactFormValues> {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return {};
    const raw = sessionStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      company: typeof parsed.company === "string" ? parsed.company : "",
      project_type: PROJECT_TYPES.includes(parsed.project_type) ? parsed.project_type : "",
      message: typeof parsed.message === "string" ? parsed.message : "",
    };
  } catch {
    return {};
  }
}

/**
 * Clears form draft from sessionStorage.
 */
export function clearContactDraft(): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    sessionStorage.removeItem(STORAGE_KEYS.DRAFT);
  } catch {
    // Gracefully ignore
  }
}

/**
 * Checks session cooldown (60s) and send limit (3 per session).
 */
export function checkSessionLimits(): { allowed: boolean; status?: SubmitStatus; message?: string } {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) {
      return { allowed: true };
    }

    const lastSentRaw = sessionStorage.getItem(STORAGE_KEYS.LAST_SENT);
    if (lastSentRaw) {
      const lastSentTime = parseInt(lastSentRaw, 10);
      const elapsed = Date.now() - lastSentTime;
      if (elapsed < 60000) {
        const remainingSec = Math.ceil((60000 - elapsed) / 1000);
        return {
          allowed: false,
          status: "cooldown",
          message: `Please wait ${remainingSec} seconds before sending another message.`,
        };
      }
    }

    const countRaw = sessionStorage.getItem(STORAGE_KEYS.SEND_COUNT);
    const sendCount = countRaw ? parseInt(countRaw, 10) : 0;
    if (sendCount >= 3) {
      return {
        allowed: false,
        status: "limit_reached",
        message: "Session limit reached. Please use one of the direct email addresses.",
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

/**
 * Records a successful submission in sessionStorage.
 */
function recordSubmissionSuccess(): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    sessionStorage.setItem(STORAGE_KEYS.LAST_SENT, String(Date.now()));
    const currentCount = parseInt(sessionStorage.getItem(STORAGE_KEYS.SEND_COUNT) || "0", 10);
    sessionStorage.setItem(STORAGE_KEYS.SEND_COUNT, String(currentCount + 1));
  } catch {
    // Gracefully ignore
  }
}

/**
 * Sanitizes header and single-line values to strip newlines and linebreaks.
 */
function sanitizeSingleLine(str: string): string {
  return str.replace(/[\r\n\t]+/g, " ").trim();
}

/**
 * Submits the contact form to Web3Forms JSON endpoint.
 */
export async function submitContact(values: ContactFormValues): Promise<ContactSubmitResult> {
  const accessKey =
    (typeof window !== "undefined" && (window as unknown as { __WEB3FORMS_KEY__?: string }).__WEB3FORMS_KEY__) ||
    process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim();

  // 1. Missing access key
  if (!accessKey) {
    return {
      success: false,
      status: "not_configured",
      message: "The contact form isn't available right now. Please use one of the email addresses on the first panel.",
    };
  }

  // 2. Honeypot check: If botcheck has any value, pretend success without calling network
  if (values.botcheck && values.botcheck.trim() !== "") {
    clearContactDraft();
    return {
      success: true,
      status: "success",
      message: "Message sent.",
    };
  }

  // 3. Minimum 3 seconds rule
  const durationOpen = Date.now() - (values.openedAt || 0);
  if (durationOpen < 3000) {
    return {
      success: false,
      status: "too_fast",
      message: "Please take a moment and try again.",
    };
  }

  // 4. Session limits (60s cooldown, max 3 sends)
  const sessionCheck = checkSessionLimits();
  if (!sessionCheck.allowed) {
    return {
      success: false,
      status: sessionCheck.status || "cooldown",
      message: sessionCheck.message || "Please wait a moment before sending another message.",
    };
  }

  // 5. Client validation
  const validationErrors = validateContactForm(values);
  if (Object.keys(validationErrors).length > 0) {
    return {
      success: false,
      status: "failure",
      message: "Please correct the highlighted fields.",
    };
  }

  const cleanName = sanitizeSingleLine(values.name);
  const cleanEmail = sanitizeSingleLine(values.email);
  const cleanCompany = sanitizeSingleLine(values.company || "");
  const cleanProjectType = sanitizeSingleLine(values.project_type);
  const cleanMessage = values.message.trim();

  const subjectLine = cleanCompany
    ? `[Studio Identity] ${cleanProjectType} Inquiry: ${cleanName} (${cleanCompany})`
    : `[Studio Identity] ${cleanProjectType} Inquiry: ${cleanName}`;

  const payload: Record<string, string> = {
    access_key: accessKey,
    subject: subjectLine,
    from_name: "Studio Identity",
    replyto: cleanEmail,
    name: cleanName,
    email: cleanEmail,
    company: cleanCompany || "Not specified",
    project_type: cleanProjectType,
    message: cleanMessage,
    site_origin: typeof window !== "undefined" ? window.location.origin : "https://studio-identity.vercel.app",
    botcheck: "",
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        success: false,
        status: "failure",
        message: "Something went wrong. Please try again in a moment, or use one of the email addresses on the first panel.",
      };
    }

    const data = await res.json().catch(() => null);

    if (data && data.success === true) {
      clearContactDraft();
      recordSubmissionSuccess();
      return {
        success: true,
        status: "success",
        message: "Message sent.",
      };
    }

    return {
      success: false,
      status: "failure",
      message: "Something went wrong. Please try again in a moment, or use one of the email addresses on the first panel.",
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    return {
      success: false,
      status: "failure",
      message: "Something went wrong. Please try again in a moment, or use one of the email addresses on the first panel.",
    };
  }
}
