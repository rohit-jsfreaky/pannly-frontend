/**
 * Typed wrapper for POST /v1/contact. Mirrors backend/pannly/schemas/contact.py.
 */

import { apiPost } from "@/lib/api-client";

export type InquiryType = "support" | "partnership" | "feature" | "refund";

export interface ContactRequest {
  name: string;
  email: string;
  inquiry_type: InquiryType;
  message: string;
}

export interface ContactResponse {
  sent: boolean;
}

export const sendContactMessage = (body: ContactRequest) =>
  apiPost<ContactResponse>("/v1/contact", body);
