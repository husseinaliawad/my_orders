export type User = { _id: string; name: string; email: string; avatar?: string; role: "user" | "admin"; isBlocked?: boolean; isEmailVerified?: boolean; createdAt?: string };
export type Category = { _id: string; name: string; icon: string; description: string };
export type Review = { _id: string; item: string; user: User; rating: number; comment: string; createdAt: string };
export type Item = { _id: string; title: string; description: string; images: string[]; category: Category; pricePerDay: number; location: string; owner: User; rating: number; isAvailable: boolean; status: "pending" | "approved" | "rejected"; createdAt: string; reviews?: Review[] };
export type CartItem = { item: Item; startDate: string; endDate: string; days: number; total: number };
export type RentalRequest = { _id: string; item: Item; renter: User; owner: User; startDate: string; endDate: string; totalAmount: number; status: "pending" | "approved" | "rejected" | "completed"; createdAt: string };
