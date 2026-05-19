export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BookingRecord = {
  id: string;
  fullName: string;
  targetArea: string;
  surveyPackage: string;
  boardingName?: string;
  surveyDate: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export type BookingInput = {
  fullName: string;
  targetArea: string;
  surveyPackage: string;
  boardingName?: string;
  surveyDate: string;
  notes?: string;
};
