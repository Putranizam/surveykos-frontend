import { db } from "./firebase-admin";
import type { Testimonial, TestimonialStatus, Finance } from "./admin-types";

// ==========================================
// TESTIMONIALS SECTION
// ==========================================

export async function listTestimonials(): Promise<Testimonial[]> {
  try {
    const snapshot = await db.collection("testimonials").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
  } catch (error) {
    console.error("❌ Error listing testimonials from Firebase:", error);
    return [];
  }
}

export async function createTestimonial(data: Omit<Testimonial, "id" | "createdAt">): Promise<Testimonial> {
  try {
    const testimonialData = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("testimonials").add(testimonialData);
    return { id: docRef.id, ...testimonialData } as Testimonial;
  } catch (error) {
    console.error("❌ Error creating testimonial in Firebase:", error);
    throw error;
  }
}

export async function updateTestimonialStatus(id: string, status: TestimonialStatus): Promise<Testimonial | null> {
  try {
    const docRef = db.collection("testimonials").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return null;

    const updates = {
      status,
      approvedAt: status === "approved" ? new Date().toISOString() : null,
    };

    await docRef.update(updates);
    return { id, ...doc.data(), ...updates } as Testimonial;
  } catch (error) {
    console.error(`❌ Error updating testimonial status (ID: ${id}):`, error);
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const docRef = db.collection("testimonials").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return false;
    
    await docRef.delete();
    return true;
  } catch (error) {
    console.error(`❌ Error deleting testimonial (ID: ${id}):`, error);
    throw error;
  }
}

// ==========================================
// FINANCES SECTION
// ==========================================

export async function listFinances(): Promise<Finance[]> {
  try {
    const snapshot = await db.collection("finances").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Finance));
  } catch (error) {
    console.error("❌ Error listing finances from Firebase:", error);
    return [];
  }
}

export async function createFinance(data: Omit<Finance, "id" | "createdAt">): Promise<Finance> {
  try {
    const financeData = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("finances").add(financeData);
    return { id: docRef.id, ...financeData } as Finance;
  } catch (error) {
    console.error("❌ Error creating finance in Firebase:", error);
    throw error;
  }
}

export async function updateFinance(id: string, data: Partial<Omit<Finance, "id" | "createdAt">>): Promise<Finance | null> {
  try {
    const docRef = db.collection("finances").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    await docRef.update(data);
    return { id, ...doc.data(), ...data } as Finance;
  } catch (error) {
    console.error(`❌ Error updating finance (ID: ${id}):`, error);
    throw error;
  }
}

export async function deleteFinance(id: string): Promise<boolean> {
  try {
    const docRef = db.collection("finances").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) return false;
    
    await docRef.delete();
    return true;
  } catch (error) {
    console.error(`❌ Error deleting finance (ID: ${id}):`, error);
    throw error;
  }
}

export async function getFinanceSummary() {
  try {
    const all = await listFinances();
    const income = all.filter((f) => f.type === "income").reduce((sum, f) => sum + f.amount, 0);
    const expense = all.filter((f) => f.type === "expense").reduce((sum, f) => sum + f.amount, 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    };
  } catch (error) {
    console.error("❌ Error calculating finance summary:", error);
    return { totalIncome: 0, totalExpense: 0, netBalance: 0 };
  }
}