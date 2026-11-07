# Web3Forms Email Template & Delivery Setup

This guide details how notification emails from the `identity` studio contact form are structured, how Web3Forms renders them on the Free tier, and how to manage email delivery settings.

---

## 1. How Web3Forms Formats Emails (Free Tier)

On the Web3Forms Free plan, notification emails are rendered using Web3Forms' built-in single-column responsive HTML layout.

### Built-in Layout & Characteristics
- **Structure**: A clean, single-column tabular design with strong label-to-value hierarchy.
- **Labels & Values**: Web3Forms converts each custom key in the submitted JSON payload into a table row header and its corresponding value.
- **Message Area**: The `Message` field preserves line breaks with pre-wrap styling, giving ample room for multi-line project briefs without clipping.
- **Email Client Compatibility**: Minimal styling without heavy graphics ensures high readability across desktop, tablet, and mobile clients (including Gmail, Apple Mail, Outlook), with clean appearance in both light and dark mode.
- **Spam Compliance**: Includes RFC-compliant headers with SPF/DKIM verification handled directly by Web3Forms infrastructure.

---

## 2. Field Keys and Payload Structure

The submission payload is constructed client-side in `lib/contact.ts` with clean display labels in exact insertion order:

| Field Key | Source / Format | Behavior |
| :--- | :--- | :--- |
| `access_key` | Public key from `NEXT_PUBLIC_WEB3FORMS_KEY` | Delivery routing (hidden from email body) |
| `subject` | `New message from <name> - <project type>` | Clean header, newlines stripped, max 100 chars |
| `from_name` | `identity contact form` | Sender label in email client |
| `replyto` | Visitor's email address | Allows clicking "Reply" directly in inbox |
| `botcheck` | `""` (empty string) | Silent spam honeypot (hidden from email body) |
| `Name` | Sanitized visitor name (2–80 chars) | First table row |
| `Email` | Sanitized visitor email address | Second table row |
| `Company` | Sanitized company name | Included only if provided; omitted when empty |
| `Project type` | Selected project type | Third / fourth table row |
| `Message` | Sanitized & normalized message text | Multi-line formatted message body |
| `Sent from` | `https://studio-identity.vercel.app` | Canonical site origin reference |
| `Sent at` | Current time in `Asia/Kolkata` (IST) | Formatted timestamp (e.g. `07 Nov 2026, 17:18 IST`) |

---

## 3. Web3Forms Free Tier vs. Paid (Pro) Features

### Free Tier Capabilities (Utilized)
- Direct JSON submissions (`https://api.web3forms.com/submit`)
- Unlimited custom fields with automatic table formatting
- Custom email subject line (`subject`)
- Custom sender name (`from_name`)
- Direct reply-to address routing (`replyto`)
- Built-in honeypot spam protection (`botcheck`)
- Full UTF-8 international character support
- Responsive, dark-mode friendly email notifications

### Paid / Pro Tier Features
- Custom HTML email template editor (uploading custom MJML or HTML designs)
- File attachment uploads (`attachment` parameter)
- Multi-recipient routing and CC addresses (`ccemail`)
- Custom autoresponder emails delivered to the submitter
- Webhooks integration for forwarding submissions to external APIs / CRMs
- Removal of Web3Forms footer branding in notification emails

---

## 4. How to Manage Settings in the Web3Forms Dashboard

When an access key is generated, Web3Forms sends a confirmation email containing a management link for your key.

To view or manage delivery settings:

1. **Locate Key Management Email**:
   - Check your inbox for the initial confirmation email from Web3Forms when the key was created.
   - Click the key management link provided in that email.

2. **Notification Settings**:
   - Verify that email notifications are active and routed to your primary inbox.
   - Ensure the sender filter is not marking notifications as promotions or spam.

3. **Spam Filtering Options**:
   - Web3Forms includes automated machine-learning spam filtering.
   - If desired, reCAPTCHA / hCaptcha can be toggled in the Web3Forms dashboard (note: the `identity` site uses a zero-dependency client honeypot to keep client bundle size minimal and privacy-friendly).

4. **Updating the Access Key**:
   - If you ever regenerate your Web3Forms access key, update the `NEXT_PUBLIC_WEB3FORMS_KEY` environment variable in your `.env.local` file (for local development) and in your Vercel project settings (Production and Preview environments).
