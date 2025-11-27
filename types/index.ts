export interface User {
  email: string;
  name?: string;
  isAdmin?: boolean;
  createdAt: Date;
}

export interface Initiative {
  id: string;
  name: string;
  description: string;
  requiredAmount: number;
  status: "active" | "completed";
  suggestedFee: number;
  tentativeHouses: number;
  photos: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contribution {
  id: string;
  initiativeId: string;
  contributorEmail: string;
  contributorName: string;
  contributorLastName: string;
  houseNumber: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InitiativeStatus = "active" | "completed";

