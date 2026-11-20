<div align="center">

# 🔧 FixMate — Home Appliance & Electronics Repair Platform

**A modern, full-stack service booking platform connecting customers with verified technicians for fast, reliable appliance and electronics repairs.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-fix--mate--client--ecru.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fix-mate-client-lac.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-94.7%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styled-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[View Live Site](https://fix-mate-client-lac.vercel.app/)

</div>

---

## 📖 Overview

**FixMate** streamlines the process of booking home appliance and electronics repair services. Whether a user needs urgent troubleshooting for a smartphone, laptop, AC, refrigerator, TV, washing machine, or household electrical system, FixMate provides a seamless booking experience backed by role-based dashboards and technician verification workflows.

---

## ✨ Key Features

- **🛠️ Multi-Category Repair Services:** Dedicated service flows for **Smartphones, Laptops & PCs, Air Conditioners, Refrigerators, Televisions, Washing Machines, and Electrical** repairs.
- **🔐 Secure Authentication:** Powered by **BetterAuth** with MongoDB adapter integration, supporting both credential login and **Google OAuth** sign-in.
- **👥 Role-Based Dashboards:** Tailored interfaces and permissions for **Customers**, **Technicians**, and **Administrators** (including technician application and approval workflows).
- **📅 Smart Service Booking:** Intuitive booking flow with issue descriptions, photo uploads via **ImgBB**, scheduling, and real-time status tracking.
- **🌓 Dark & Light Mode:** Built-in theme switching for comfortable viewing in any environment.
- **⚡ Responsive & Accessible UI:** Crafted with **shadcn/ui** and **Tailwind CSS** for a fast, mobile-first experience across all screen sizes.

---

## 🧰 Tech Stack

### Frontend (`FixMate_Client`)
| Technology | Purpose |
| :--- | :--- |
| **Next.js (App Router)** | React framework for routing, SSR/CSR, and performance optimization |
| **TypeScript** | End-to-end static type safety |
| **Tailwind CSS** | Utility-first styling and responsive design |
| **shadcn/ui & Lucide Icons** | Accessible, customizable UI components and crisp iconography |
| **BetterAuth** | Authentication & session management (`@better-auth/mongo-adapter` + Google OAuth) |

### Backend & Services
- **Node.js & Express.js** — RESTful API architecture
- **MongoDB** — Primary NoSQL database
- **ImgBB API** — Cloud image hosting for user profiles and appliance issue photos
- **Vercel** — Continuous deployment and edge hosting

---

## 📂 Project Structure

```bash
FixMate_Client/
├── public/                 # Static assets, icons, and images
├── src/
│   ├── app/                # Next.js App Router pages, layouts, and loading states
│   ├── components/         # Reusable UI components (shadcn/ui, ThemeToggle, forms)
│   ├── lib/                # Auth configuration, API helpers, and utilities
│   └── types/              # TypeScript interfaces and type definitions
├── .env.example            # Template for required environment variables
├── components.json         # shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript compiler configuration
