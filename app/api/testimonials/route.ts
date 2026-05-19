import { NextRequest, NextResponse } from "next/server";
import { createTestimonial, listTestimonials } from "@/src/lib/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, quote, rating } = body;

    if (!name || !location || !quote) {
      return NextResponse.json(
        { error: "Name, location, and quote are required" },
        { status: 400 }
      );
    }

    const newTestimonial = await createTestimonial({
      name,
      location,
      quote,
      rating: typeof rating === "number" ? Math.min(5, Math.max(1, rating)) : 5,
      status: "approved", // Default status, or you can make it "pending"
    });

    return NextResponse.json(
      { message: "Testimonial submitted successfully", data: newTestimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const testimonials = await listTestimonials();

    // Return only approved testimonials
    const approved = testimonials.filter((t) => t.status === "approved");

    return NextResponse.json(approved);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
