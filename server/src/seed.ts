import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Cart } from "./models/Cart.js";
import { Category } from "./models/Category.js";
import { Item } from "./models/Item.js";
import { RentalRequest } from "./models/RentalRequest.js";
import { User } from "./models/User.js";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/900/650`;

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Category.deleteMany(), Item.deleteMany(), RentalRequest.deleteMany(), Cart.deleteMany()]);

  const [admin, maya, omar] = await User.create([
    { name: "Admin", email: "admin@shareinstead.com", password: "password123", role: "admin", avatar: img("admin") },
    { name: "Maya Haddad", email: "maya@example.com", password: "password123", avatar: img("maya") },
    { name: "Omar Saleh", email: "omar@example.com", password: "password123", avatar: img("omar") }
  ]);

  const categories = await Category.create([
    { name: "Tools", icon: "Wrench", description: "Power tools, ladders, and workshop essentials." },
    { name: "Cameras", icon: "Camera", description: "Cameras, lenses, lighting, and creator gear." },
    { name: "Books", icon: "BookOpen", description: "Textbooks, novels, and references." },
    { name: "Equipment", icon: "Briefcase", description: "Camping, sports, and event equipment." },
    { name: "Electronics", icon: "Laptop", description: "Devices, accessories, and smart gadgets." }
  ]);

  const [tools, cameras, books, equipment, electronics] = categories;
  const items = await Item.create([
    { title: "Bosch Cordless Drill Kit", description: "Reliable drill with bits, two batteries, and hard case. Perfect for weekend projects.", images: [img("drill")], category: tools._id, pricePerDay: 12, location: "Damascus", owner: maya._id, rating: 4.9, status: "approved" },
    { title: "Sony A7 III Camera", description: "Full-frame camera with 50mm lens and shoulder strap. Great for events and shoots.", images: [img("camera")], category: cameras._id, pricePerDay: 45, location: "Aleppo", owner: omar._id, rating: 4.8, status: "approved" },
    { title: "Portable Projector", description: "Bright 1080p projector with HDMI cable and compact tripod.", images: [img("projector")], category: electronics._id, pricePerDay: 24, location: "Homs", owner: maya._id, rating: 4.7, status: "approved" },
    { title: "Mountain Camping Set", description: "Tent, two sleeping bags, and cooking kit for a comfortable trip.", images: [img("camping")], category: equipment._id, pricePerDay: 30, location: "Latakia", owner: omar._id, rating: 4.9, status: "approved" },
    { title: "Architecture Book Bundle", description: "Five design and architecture books in excellent condition.", images: [img("books")], category: books._id, pricePerDay: 6, location: "Damascus", owner: maya._id, rating: 4.6, status: "approved" },
    { title: "DJI Gimbal Stabilizer", description: "Smooth mobile video stabilizer with charger and carry case.", images: [img("gimbal")], category: cameras._id, pricePerDay: 18, location: "Tartus", owner: omar._id, rating: 4.8, status: "pending" }
  ]);

  await RentalRequest.create([
    { item: items[1]._id, renter: maya._id, owner: omar._id, startDate: new Date("2026-06-05"), endDate: new Date("2026-06-08"), totalAmount: 149, status: "pending" },
    { item: items[0]._id, renter: omar._id, owner: maya._id, startDate: new Date("2026-06-01"), endDate: new Date("2026-06-03"), totalAmount: 27, status: "approved" }
  ]);

  console.log("Seeded Share Instead demo data");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
