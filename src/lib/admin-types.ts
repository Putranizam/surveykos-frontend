export type TestimonialStatus = "pending" | "approved" | "rejected";
export type FinanceType = "income" | "expense";

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number; // 1-5
  status: TestimonialStatus;
  createdAt: string;
  approvedAt?: string;
}

export interface Finance {
  id: string;
  type: FinanceType;
  description: string;
  amount: number;
  date: string;
  category?: string;
  notes?: string;
  createdAt: string;
}
