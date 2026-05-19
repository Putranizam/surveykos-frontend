import { db } from "./firebase-admin";
import type { Testimonial, TestimonialStatus, Finance, FinanceType } from "./admin-types";

// Testimonials
export async function listTestimonials(): Promise<Testimonial[]> {
  try {
    const snapshot = await db.collection("testimonials").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
  } catch (error) {
    console.error("Error listing testimonials from Firebase:", error);
    return [];
  }
}

export async function createTestimonial(data: Omit<Testimonial, "id" | "createdAt">): Promise<Testimonial> {
  const testimonialData = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  const docRef = await db.collection("testimonials").add(testimonialData);
  return { id: docRef.id, ...testimonialData } as Testimonial;
}

export async function updateTestimonialStatus(id: string, status: TestimonialStatus): Promise<Testimonial | null> {
  const docRef = db.collection("testimonials").doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) return null;

  const updates = {
    status,
    approvedAt: status === "approved" ? new Date().toISOString() : null, // Using null for Firestore instead of undefined
  };

  await docRef.update(updates);
  return { id, ...doc.data(), ...updates } as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const docRef = db.collection("testimonials").doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) return false;
  
  await docRef.delete();
  return true;
}

// Finances
export async function listFinances(): Promise<Finance[]> {
  try {
    const snapshot = await db.collection("finances").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Finance));
  } catch (error) {
    console.error("Error listing finances from Firebase:", error);
    return [];
  }
}

export async function createFinance(data: Omit<Finance, "id" | "createdAt">): Promise<Finance> {
  const financeData = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  const docRef = await db.collection("finances").add(financeData);
  return { id: docRef.id, ...financeData } as Finance;
}

export async function updateFinance(id: string, data: Partial<Omit<Finance, "id" | "createdAt">>): Promise<Finance | null> {
  const docRef = db.collection("finances").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return null;

  await docRef.update(data);
  return { id, ...doc.data(), ...data } as Finance;
}

export async function deleteFinance(id: string): Promise<boolean> {
  const docRef = db.collection("finances").doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) return false;
  
  await docRef.delete();
  return true;
}

export async function getFinanceSummary() {
  const all = await listFinances();
  const income = all.filter((f) => f.type === "income").reduce((sum, f) => sum + f.amount, 0);
  const expense = all.filter((f) => f.type === "expense").reduce((sum, f) => sum + f.amount, 0);

  return {
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense,
  };
}

