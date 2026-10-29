"use client";

/**
 * NGO Digital Management & Transparency System — Data store.
 *
 * No backend / no SQLite. All records live in memory and are persisted to
 * localStorage. Every figure (totals, balance, charts) is computed from the
 * stored records — nothing is hardcoded.
 */

import type { Role } from "./auth";

export type Donation = {
  id: string;
  date: string; // ISO date
  donorName: string;
  donorOrganisation?: string;
  source: "cash" | "cheque" | "bank-transfer" | "upi" | "other";
  amount: number; // INR
  purpose: string; // restricted fund / purpose
  paymentMethod: string;
  transactionReference?: string;
  receiptNumber?: string;
  receiptFile?: string; // uploaded file name
  status: "pending" | "verified" | "rejected";
  remarks?: string;
  recordedBy: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  relatedEvent?: string;
  vendor?: string;
  paymentMethod: string;
  reference?: string;
  invoiceFile?: string;
  submittedBy: string;
  reviewedBy?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  auditNote?: string;
  createdAt: string;
  updatedAt?: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  venue: string;
  objective: string;
  budget: number;
  status: "planned" | "upcoming" | "completed" | "archived";
  actualExpenses: number; // computed from linked expenses
  assignedVolunteers: string[]; // volunteer ids
  attendance: { volunteerId: string; present: boolean; date?: string }[];
  photos: string[];
  documents: string[];
  createdAt: string;
  updatedAt?: string;
};

export type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  availability: string;
  assignedEvents: string[]; // event ids
  attendanceHistory: { eventId: string; present: boolean; date: string }[];
  createdAt: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantityReceived: number;
  quantityDistributed: number;
  stockBalance: number; // computed
  relatedEvent?: string;
  supportingRecord?: string;
  createdAt: string;
};

export type AuditEntry = {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  timestamp: string;
  action: string;
  recordType: string;
  recordId: string;
  previousValues?: string;
  updatedValues?: string;
};

type Store = {
  donations: Donation[];
  expenses: Expense[];
  events: Event[];
  volunteers: Volunteer[];
  inventory: InventoryItem[];
  audit: AuditEntry[];
  openingBalance: number;
};

const STORAGE_KEY = "ngo_demo_store";

function emptyStore(): Store {
  return {
    donations: [],
    expenses: [],
    events: [],
    volunteers: [],
    inventory: [],
    audit: [],
    openingBalance: 0,
  };
}

let store: Store = emptyStore();
let hydrated = false;

function hydrate() {
  if (typeof window === "undefined") return;
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Retired demo-CEP key cleanup (real CEP data now ships with the app)
      if (parsed && typeof parsed === "object" && "cepResponses" in parsed) {
        delete parsed.cepResponses;
      }
      store = { ...emptyStore(), ...parsed };
    }
    seedIfEmpty();
  } catch {
    seedIfEmpty();
  }
}

function seedIfEmpty() {
  if (store.donations.length > 0) return;
  const now = new Date().toISOString();
  const addDays = (d: Date, n: number) => {
    const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10);
  };
  const today = new Date().toISOString().slice(0, 10);

  // Seed donations (demo data — clearly labelled)
  store.donations = [
    {
      id: "d-1",
      date: addDays(new Date(), -40),
      donorName: "Ananya Kulkarni",
      donorOrganisation: "Kulkarni Trust",
      source: "bank-transfer",
      amount: 50000,
      purpose: "Water & sanitation programme",
      paymentMethod: "Bank transfer",
      transactionReference: "NEFT-2026-001",
      receiptNumber: "RCV-1001",
      status: "verified",
      remarks: "Core funding for borewell restoration.",
      recordedBy: "finance@sahyog.example.org",
      createdAt: addDays(new Date(), -40),
    },
    {
      id: "d-2",
      date: addDays(new Date(), -28),
      donorName: "Rohan Mehta",
      source: "upi",
      amount: 12000,
      purpose: "General fund",
      paymentMethod: "UPI",
      transactionReference: "UPI-9912",
      receiptNumber: "RCV-1002",
      status: "verified",
      remarks: "Monthly contribution.",
      recordedBy: "finance@sahyog.example.org",
      createdAt: addDays(new Date(), -28),
    },
    {
      id: "d-3",
      date: addDays(new Date(), -15),
      donorName: "Vaidya & Sons Trust",
      donorOrganisation: "Vaidya & Sons Trust",
      source: "cheque",
      amount: 200000,
      purpose: "Health camp programme",
      paymentMethod: "Cheque",
      transactionReference: "CHQ-44812",
      receiptNumber: "RCV-1003",
      status: "pending",
      remarks: "Awaiting bank clearance.",
      recordedBy: "finance@sahyog.example.org",
      createdAt: addDays(new Date(), -15),
    },
    {
      id: "d-4",
      date: addDays(new Date(), -5),
      donorName: "Priya Nair",
      source: "cash",
      amount: 3000,
      purpose: "Children's education",
      paymentMethod: "Cash",
      status: "verified",
      remarks: "Cash donation at field office.",
      recordedBy: "manager@sahyog.example.org",
      createdAt: addDays(new Date(), -5),
    },
  ];

  // Seed expenses
  store.expenses = [
    {
      id: "e-1",
      date: addDays(new Date(), -35),
      category: "Infrastructure",
      amount: 18000,
      description: "PVC pipes and fittings for Nandur borewell",
      relatedEvent: "evt-1",
      vendor: "Rural Agro Suppliers",
      paymentMethod: "Bank transfer",
      reference: "REF-2001",
      invoiceFile: "inv-nandur-pipes.pdf",
      submittedBy: "manager@sahyog.example.org",
      reviewedBy: "finance@sahyog.example.org",
      approvalStatus: "approved",
      auditNote: "Approved against project budget.",
      createdAt: addDays(new Date(), -35),
      updatedAt: addDays(new Date(), -34),
    },
    {
      id: "e-2",
      date: addDays(new Date(), -20),
      category: "Medical supplies",
      amount: 8500,
      description: "First-aid kits for health camp",
      relatedEvent: "evt-2",
      vendor: "City Pharmacy",
      paymentMethod: "UPI",
      reference: "REF-2005",
      invoiceFile: "inv-firstaid.pdf",
      submittedBy: "volunteer@sahyog.example.org",
      approvalStatus: "pending",
      createdAt: addDays(new Date(), -20),
    },
    {
      id: "e-3",
      date: addDays(new Date(), -10),
      category: "Transport",
      amount: 4200,
      description: "Fuel for mobile unit to Beed",
      relatedEvent: "evt-2",
      vendor: "Beed Fuel Station",
      paymentMethod: "Cash",
      reference: "REF-2009",
      submittedBy: "manager@sahyog.example.org",
      reviewedBy: "finance@sahyog.example.org",
      approvalStatus: "approved",
      createdAt: addDays(new Date(), -10),
      updatedAt: addDays(new Date(), -9),
    },
    {
      id: "e-4",
      date: addDays(new Date(), -2),
      category: "Stationery",
      amount: 1500,
      description: "Printed registers for volunteer attendance",
      vendor: "Office Depot",
      paymentMethod: "Cash",
      submittedBy: "volunteer@sahyog.example.org",
      approvalStatus: "rejected",
      auditNote: "Missing invoice — resubmit with receipt.",
      createdAt: addDays(new Date(), -2),
    },
  ];

  // Seed events
  store.events = [
    {
      id: "evt-1",
      title: "Nandur Water Audit Day",
      date: addDays(new Date(), 14),
      venue: "Nandur Cluster Community Hall, Nashik",
      objective: "Record pump-yield readings across 22 borewells.",
      budget: 45000,
      status: "upcoming",
      actualExpenses: 0,
      assignedVolunteers: ["v-1", "v-2"],
      attendance: [],
      photos: [],
      documents: [],
      createdAt: addDays(new Date(), -60),
    },
    {
      id: "evt-2",
      title: "Monthly Health Camp — Pune",
      date: addDays(new Date(), -8),
      venue: "Pune City Civic Centre",
      objective: "Free health check-ups and medicine distribution.",
      budget: 32000,
      status: "completed",
      actualExpenses: 12700,
      assignedVolunteers: ["v-1", "v-3"],
      attendance: [
        { volunteerId: "v-1", present: true, date: addDays(new Date(), -8) },
        { volunteerId: "v-3", present: true, date: addDays(new Date(), -8) },
      ],
      photos: ["health-camp-1.jpg"],
      documents: [],
      createdAt: addDays(new Date(), -45),
      updatedAt: addDays(new Date(), -7),
    },
    {
      id: "evt-3",
      title: "Othathanwadi Study Circle Launch",
      date: addDays(new Date(), 30),
      venue: "Othathanwadi Village School",
      objective: "Evening literacy classes for adults.",
      budget: 18000,
      status: "planned",
      actualExpenses: 0,
      assignedVolunteers: ["v-3"],
      attendance: [],
      photos: [],
      documents: [],
      createdAt: addDays(new Date(), -12),
    },
  ];

  // Seed volunteers
  store.volunteers = [
    {
      id: "v-1",
      name: "Meera Raghunathan",
      email: "volunteer@sahyog.example.org",
      phone: "+91 98765 43210",
      skills: ["Field survey", "Data entry", "Community liaison"],
      availability: "Weekends",
      assignedEvents: ["evt-1", "evt-2"],
      attendanceHistory: [
        { eventId: "evt-2", present: true, date: addDays(new Date(), -8) },
      ],
      createdAt: addDays(new Date(), -90),
    },
    {
      id: "v-2",
      name: "Arjun Patel",
      email: "arjun@example.org",
      phone: "+91 91234 56780",
      skills: ["Plumbing basics", "Local language (Marathi)"],
      availability: "Flexible",
      assignedEvents: ["evt-1"],
      attendanceHistory: [],
      createdAt: addDays(new Date(), -60),
    },
    {
      id: "v-3",
      name: "Sita Desai",
      email: "sita@example.org",
      phone: "+91 99887 76655",
      skills: ["Teaching", "Health camp usher"],
      availability: "Weekdays",
      assignedEvents: ["evt-2", "evt-3"],
      attendanceHistory: [
        { eventId: "evt-2", present: true, date: addDays(new Date(), -8) },
      ],
      createdAt: addDays(new Date(), -45),
    },
  ];

  // Seed inventory
  store.inventory = [
    {
      id: "inv-1",
      name: "First-aid kits",
      category: "Medical supplies",
      quantityReceived: 40,
      quantityDistributed: 12,
      stockBalance: 28,
      relatedEvent: "evt-2",
      supportingRecord: "e-2",
      createdAt: addDays(new Date(), -30),
    },
    {
      id: "inv-2",
      name: "PVC pipes (100mm)",
      category: "Infrastructure",
      quantityReceived: 60,
      quantityDistributed: 45,
      stockBalance: 15,
      relatedEvent: "evt-1",
      supportingRecord: "e-1",
      createdAt: addDays(new Date(), -40),
    },
    {
      id: "inv-3",
      name: "Notebooks & pens",
      category: "Education",
      quantityReceived: 200,
      quantityDistributed: 0,
      stockBalance: 200,
      createdAt: addDays(new Date(), -10),
    },
  ];

  store.openingBalance = 100000;
  persist();
  addAudit("system", "System", "super-admin", "Seed data loaded", "system", "all", undefined, "Demo seed records created");
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

export function getStore(): Store {
  if (typeof window !== "undefined") hydrate();
  return store;
}

export function addAudit(
  userId: string,
  userName: string,
  userRole: Role,
  action: string,
  recordType: string,
  recordId: string,
  previousValues?: string,
  updatedValues?: string
) {
  const entry: AuditEntry = {
    id: `audit-${Date.now()}`,
    userId,
    userName,
    userRole,
    timestamp: new Date().toISOString(),
    action,
    recordType,
    recordId,
    previousValues,
    updatedValues,
  };
  store.audit.unshift(entry);
  persist();
  return entry;
}

/* ---------- Donations ---------- */
export type DonationInput = Omit<Donation, "id" | "createdAt">;

export function addDonation(input: DonationInput) {
  const d: Donation = { ...input, id: `d-${Date.now()}`, createdAt: new Date().toISOString() };
  store.donations.push(d);
  addAudit(input.recordedBy, input.recordedBy, "finance", "Created donation", "donation", d.id, undefined, JSON.stringify({ amount: d.amount, purpose: d.purpose }));
  persist();
  return d;
}

export function updateDonation(id: string, patch: Partial<Donation>) {
  const idx = store.donations.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  const prev = { ...store.donations[idx] };
  store.donations[idx] = { ...prev, ...patch };
  persist();
  addAudit("system", "System", "super-admin", "Updated donation", "donation", id, JSON.stringify(prev), JSON.stringify(store.donations[idx]));
  return store.donations[idx];
}

export function deleteDonation(id: string) {
  const idx = store.donations.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  const prev = store.donations[idx];
  store.donations.splice(idx, 1);
  addAudit("system", "System", "super-admin", "Deleted donation", "donation", id, JSON.stringify(prev), undefined);
  persist();
  return true;
}

/* ---------- Expenses ---------- */
export type ExpenseInput = Omit<Expense, "id" | "createdAt" | "updatedAt">;

export function addExpense(input: ExpenseInput, submittedBy: string) {
  const e: Expense = {
    ...input,
    id: `e-${Date.now()}`,
    submittedBy,
    createdAt: new Date().toISOString(),
  };
  store.expenses.push(e);
  addAudit(submittedBy, submittedBy, "finance", "Created expense", "expense", e.id, undefined, JSON.stringify({ amount: e.amount, category: e.category, status: e.approvalStatus }));
  persist();
  return e;
}

export function updateExpense(id: string, patch: Partial<Expense>) {
  const idx = store.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const prev = { ...store.expenses[idx] };
  store.expenses[idx] = { ...prev, ...patch, updatedAt: new Date().toISOString() };
  addAudit("system", "System", "super-admin", "Updated expense", "expense", id, JSON.stringify(prev), JSON.stringify(store.expenses[idx]));
  persist();
  return store.expenses[idx];
}

export function deleteExpense(id: string) {
  const idx = store.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  const prev = store.expenses[idx];
  store.expenses.splice(idx, 1);
  addAudit("system", "System", "super-admin", "Deleted expense", "expense", id, JSON.stringify(prev), undefined);
  persist();
  return true;
}

/* ---------- Events ---------- */
export type Status = "planned" | "upcoming" | "completed" | "archived";

export type EventInput = Omit<Partial<Event>, "id" | "createdAt" | "actualExpenses"> & {
  title: string;
  date: string;
  venue: string;
  objective: string;
  budget: number;
  status: Status;
};

export function addEvent(input: EventInput) {
  const e: Event = {
    ...input,
    id: `evt-${Date.now()}`,
    assignedVolunteers: input.assignedVolunteers ?? [],
    attendance: input.attendance ?? [],
    photos: input.photos ?? [],
    documents: input.documents ?? [],
    actualExpenses: 0,
    createdAt: new Date().toISOString(),
  };
  store.events.push(e);
  addAudit("system", "System", "super-admin", "Created event", "event", e.id, undefined, JSON.stringify({ title: e.title, budget: e.budget, status: e.status }));
  persist();
  return e;
}

export function updateEvent(id: string, patch: Partial<Event>) {
  const idx = store.events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const prev = { ...store.events[idx] };
  store.events[idx] = { ...prev, ...patch, updatedAt: new Date().toISOString() };
  recomputeEventExpenses(id);
  addAudit("system", "System", "super-admin", "Updated event", "event", id, JSON.stringify(prev), JSON.stringify(store.events[idx]));
  persist();
  return store.events[idx];
}

export function archiveEvent(id: string) {
  const e = updateEvent(id, { status: "archived" });
  addAudit("system", "System", "super-admin", "Archived event", "event", id, undefined, "status=archived");
  return e;
}

export function deleteEvent(id: string) {
  const idx = store.events.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  const prev = store.events[idx];
  store.events.splice(idx, 1);
  addAudit("system", "System", "super-admin", "Deleted event", "event", id, JSON.stringify(prev), undefined);
  persist();
  return true;
}

export function recomputeEventExpenses(eventId: string) {
  const event = store.events.find((e) => e.id === eventId);
  if (!event) return;
  const total = store.expenses
    .filter((e) => e.relatedEvent === eventId && e.approvalStatus === "approved")
    .reduce((sum, e) => sum + e.amount, 0);
  event.actualExpenses = total;
  persist();
}

export function markAttendance(eventId: string, volunteerId: string, present: boolean) {
  const event = store.events.find((e) => e.id === eventId);
  if (!event) return;
  const existing = event.attendance.find((a) => a.volunteerId === volunteerId);
  if (existing) {
    existing.present = present;
    existing.date = new Date().toISOString().slice(0, 10);
  } else {
    event.attendance.push({ volunteerId, present, date: new Date().toISOString().slice(0, 10) });
  }
  // volunteer history
  const vol = store.volunteers.find((v) => v.id === volunteerId);
  if (vol) {
    const h = vol.attendanceHistory.find((h) => h.eventId === eventId);
    if (h) h.present = present;
    else vol.attendanceHistory.push({ eventId, present, date: new Date().toISOString().slice(0, 10) });
  }
  persist();
  addAudit("system", "System", "super-admin", "Marked attendance", "event", eventId, undefined, `volunteer=${volunteerId} present=${present}`);
}

/* ---------- Volunteers ---------- */
export type VolunteerInput = Omit<Volunteer, "id" | "createdAt">;

export function addVolunteer(input: VolunteerInput) {
  const v: Volunteer = {
    ...input,
    id: `v-${Date.now()}`,
    attendanceHistory: input.attendanceHistory ?? [],
    createdAt: new Date().toISOString(),
  };
  store.volunteers.push(v);
  persist();
  return v;
}

export function updateVolunteer(id: string, patch: Partial<Volunteer>) {
  const idx = store.volunteers.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  store.volunteers[idx] = { ...store.volunteers[idx], ...patch };
  persist();
  return store.volunteers[idx];
}

export function deleteVolunteer(id: string) {
  const idx = store.volunteers.findIndex((v) => v.id === id);
  if (idx === -1) return false;
  store.volunteers.splice(idx, 1);
  persist();
  return true;
}

/* ---------- Inventory ---------- */
export type InventoryInput = Omit<InventoryItem, "id" | "createdAt" | "stockBalance">;

export function addInventory(input: InventoryInput) {
  const item: InventoryItem = {
    ...input,
    id: `inv-${Date.now()}`,
    stockBalance: input.quantityReceived - input.quantityDistributed,
    createdAt: new Date().toISOString(),
  };
  store.inventory.push(item);
  persist();
  return item;
}

export function updateInventory(id: string, patch: Partial<InventoryItem>) {
  const idx = store.inventory.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const prev = { ...store.inventory[idx] };
  store.inventory[idx] = {
    ...prev,
    ...patch,
    stockBalance: (patch.quantityReceived ?? prev.quantityReceived) - (patch.quantityDistributed ?? prev.quantityDistributed),
  };
  persist();
  return store.inventory[idx];
}

export function deleteInventory(id: string) {
  const idx = store.inventory.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  store.inventory.splice(idx, 1);
  persist();
  return true;
}

/* ---------- Computed analytics (always from records) ---------- */
export function totals() {
  const s = getStore();
  const totalDonations = s.donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = s.expenses.reduce((sum, e) => sum + e.amount, 0);
  const verifiedDonations = s.donations.filter((d) => d.status === "verified").reduce((sum, d) => sum + d.amount, 0);
  const pendingDonations = s.donations.filter((d) => d.status === "pending").reduce((sum, d) => sum + d.amount, 0);
  const approvedExpenses = s.expenses.filter((e) => e.approvalStatus === "approved").reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = s.expenses.filter((e) => e.approvalStatus === "pending").reduce((sum, e) => sum + e.amount, 0);
  const balance = s.openingBalance + totalDonations - totalExpenses;
  const verifiedBalance = s.openingBalance + verifiedDonations - approvedExpenses;
  return {
    totalDonations,
    totalExpenses,
    verifiedDonations,
    pendingDonations,
    approvedExpenses,
    pendingExpenses,
    balance,
    verifiedBalance,
    openingBalance: s.openingBalance,
    donationCount: s.donations.length,
    expenseCount: s.expenses.length,
    eventCount: s.events.length,
    volunteerCount: s.volunteers.length,
    upcomingEvents: s.events.filter((e) => e.status === "upcoming" || e.status === "planned").length,
    completedEvents: s.events.filter((e) => e.status === "completed").length,
  };
}

export function monthlySummary(months = 6) {
  const s = getStore();
  const now = new Date();
  const lines: { month: string; income: number; expense: number; balance: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toISOString().slice(0, 7); // YYYY-MM
    const income = s.donations
      .filter((x) => x.date.slice(0, 7) === monthKey)
      .reduce((sum, x) => sum + x.amount, 0);
    const expense = s.expenses
      .filter((x) => x.date.slice(0, 7) === monthKey)
      .reduce((sum, x) => sum + x.amount, 0);
    lines.push({ month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), income, expense, balance: income - expense });
  }
  return lines;
}

export function expensesByCategory() {
  const s = getStore();
  const map = new Map<string, number>();
  for (const e of s.expenses) {
    map.set(e.category, (map.get(e.category) || 0) + e.amount);
  }
  return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }));
}

export function unverifiedTransactions() {
  const s = getStore();
  return [
    ...s.donations.filter((d) => d.status !== "verified").map((d) => ({ id: d.id, type: "Donation", donor: d.donorName, amount: d.amount, status: d.status, date: d.date })),
    ...s.expenses.filter((e) => e.approvalStatus !== "approved").map((e) => ({ id: e.id, type: "Expense", donor: e.vendor || "—", amount: e.amount, status: e.approvalStatus, date: e.date })),
  ];
}

export function missingReceipts() {
  const s = getStore();
  return [
    ...s.donations.filter((d) => !d.receiptNumber).map((d) => ({ id: d.id, type: "Donation", donor: d.donorName, amount: d.amount, date: d.date })),
    ...s.expenses.filter((e) => !e.invoiceFile).map((e) => ({ id: e.id, type: "Expense", donor: e.vendor || "—", amount: e.amount, date: e.date })),
  ];
}

export function getAudit() {
  return getStore().audit;
}

export function setOpeningBalance(amount: number) {
  store.openingBalance = amount;
  persist();
}
