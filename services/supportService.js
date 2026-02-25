import api from "../utils/api";

// ── AI Chat (auth required) ───────────────────────────────────────────────────
export async function sendChatMessage(messages) {
  const res = await api.post("/support/chat", { messages });
  return res.data.data.reply;
}

// ── Tickets (auth required) ───────────────────────────────────────────────────
export async function fetchTickets(page = 1) {
  const res = await api.get(`/support/tickets?page=${page}`);
  return res.data.data;
}

export async function fetchTicket(id) {
  const res = await api.get(`/support/tickets/${id}`);
  return res.data.data;
}

export async function createTicket({ subject, category, message, priority = "normal", attachment }) {
  const form = new FormData();
  form.append("subject",  subject);
  form.append("category", category);
  form.append("message",  message);
  form.append("priority", priority);
  if (attachment) form.append("attachment", attachment);

  const res = await api.post("/support/tickets", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function replyToTicket(id, { message, attachment }) {
  const form = new FormData();
  form.append("message", message);
  if (attachment) form.append("attachment", attachment);

  const res = await api.post(`/support/tickets/${id}/reply`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

// ── Guest ticket (no auth) ────────────────────────────────────────────────────
// Returns { reference } so the guest can quote it in follow-ups
export async function createGuestTicket({ name, email, subject, category, message, attachment }) {
  const form = new FormData();
  form.append("name",     name);
  form.append("email",    email);
  form.append("subject",  subject);
  form.append("category", category);
  form.append("message",  message);
  if (attachment) form.append("attachment", attachment);

  const res = await api.post("/support/tickets/guest", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // { success, message, reference }
  return res.data;
}

// ── FAQs (public) ─────────────────────────────────────────────────────────────
export async function fetchFaqs() {
  const res = await api.get("/support/faqs");
  return res.data.data; // { account: [...], payment: [...], ... }
}