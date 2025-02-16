**Product Requirements Document (PRD) for Clapt**

## **1. Overview**

Clapt is a web-based platform designed to provide real-time communication, notifications, and authentication services. It will later expand to mobile applications for iOS and Android. The platform will be built using **Vite** for the frontend and **Express.js** for the backend, leveraging **PostgreSQL** as the primary database. The application will be hosted on **Hetzner** with the domain **clapt.de**.

## **2. Core Features**

### **2.1 Authentication**

- **NextAuth.js** for authentication
- Supports **Email/Password Authentication**
- **Google Login Integration**
- Secure session management

### **2.2 Email Functionality**

- Send authentication emails (password reset, verification, etc.)
- Send notification emails for important updates
- **Email provider: Resend**

### **2.3 Real-Time Features**

- **Chat System** (one-on-one and group chat)
- **Real-time notifications & updates**
- **WebSockets** (for real-time chat, live updates)
- **Upstash Redis Pub/Sub** (to distribute events between backend instances, ensuring scalability)
- **Push Notifications** for mobile and web using **Firebase Cloud Messaging (FCM)**

### **2.4 User Management**

- Profile management
- Role-based access control (Admin/User)
- Account settings (password change, email preferences)

## **3. Technology Stack**

### **3.1 Frontend**

- **Vite** (Fast build tool for modern frontend development)
- **Mantine** (UI component library for better user experience)
- **TypeScript** (for type safety and maintainability)

### **3.2 Backend**

- **Express.js** (Node.js framework for API handling)
- **PostgreSQL** (Primary database)
- **Prisma ORM** (for database interaction)
- **Redis (Upstash)** (For caching & real-time updates)
- **Firebase Cloud Messaging (FCM)** (For push notifications)

### **3.3 Hosting & Infrastructure**

- **Hetzner Cloud VPS** (For backend & database hosting)
- **Docker** (For containerized deployments)

## **4. Future Enhancements**

- **Mobile Apps (iOS & Android)**
- **Additional Auth Methods** (OAuth providers like GitHub, Apple)

## **5. Timeline & Milestones**

| Milestone | Task                                             | Estimated Completion |
| --------- | ------------------------------------------------ | -------------------- |
| Phase 1   | Set up Vite, Express, PostgreSQL, NextAuth.js   | 2 weeks              |
| Phase 2   | Implement chat & real-time notifications         | 4 weeks              |
| Phase 3   | Email notifications & authentication flows       | 3 weeks              |
| Phase 4   | Push notifications implementation (FCM)          | 2 weeks              |
| Phase 5   | Testing, security, and optimizations             | 3 weeks              |
| Phase 6   | Mobile app development                           | TBD                  |

## **6. Questions & Next Steps**

- Which email provider should we finalize? (**Using Resend**) ✅
- Should chat use WebSockets or a third-party service like Firebase? (**Using WebSockets + Upstash Redis Pub/Sub**) ✅
- Do we need role-based access control from the start?

---

This document will evolve as development progresses. Let me know if you'd like any modifications!

