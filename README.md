# DIAMOND TRIM — Private Luxury Salon & Grooming Atelier

A generic, high-end private luxury salon and grooming atelier website built with **React**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**, inspired directly by [BlossoMe Salon](https://www.blossomesalon.com/).

---

## ✦ Core Design & Concept Inspiration

Inspired by the calm, dignified, and private ethos of **BlossoMe Salon**:
* **Brand Philosophy**: *"You matter. Precision grooming & beauty, in private."*
* **Core Differentiator**: Acoustic private VIP pods and individual treatment suites that replace loud, crowded salon floors with serene, unhurried calm.
* **Master Craftsmanship**: Certified master stylists, medical podology, Russian manicures, French balayage, beard sculpting, and clinical facials.
* **Clinical Purity**: Hospital-grade Class-B medical autoclave steam sterilization for all implements, opened directly in the guest's presence.
* **Artisanal Hospitality**: Complimentary ceremonial Japanese matcha, freshly brewed espresso, and cold botanicals served on brass trays.

---

## ✦ Complete Website Architecture

1. **Header & Navigation (`src/components/Header.tsx`)**
   * Fixed blur backdrop with subtle champagne gold borders
   * Brand emblem, smooth in-page navigation links, direct WhatsApp concierge, and mobile drawer menu.

2. **Hero Section (`src/components/HeroSection.tsx`)**
   * Blossome-inspired headline: *"You matter. Beauty & Grooming, in private."*
   * Narrative framing, quick CTAs (*"Book Your Visit"*, *"Explore Services"*, WhatsApp quick consultation), and verified stats strip (8+ Years Mastery, 28K+ Happy Clients, 100% Private Suites, 4.99 ★ Top Rated).

3. **About Diamond Trim (`src/components/AboutSection.tsx`)**
   * *"An atelier built around one idea — you."*
   * Architectural storytelling contrasting crowded open-floor salons with sound-dampened VIP pods and private suites.
   * 4 foundational pillars: Total Acoustic Privacy, Medical-Grade Sterilization, Master Artisans, and Artisanal Hospitality.

4. **Curated Treatment Menu (`src/components/ServicesSection.tsx`)**
   * Live category filtering (*Nails & Podology, Hair Artistry, Grooming & Beard, Facials & Skin, Body & Massage, Lashes & Brows*) + real-time search.
   * Transparent pricing, treatment durations, and top clinical benefits.
   * Dual actions per card: *"Details"* (opens in-depth treatment modal) and *"Book Now"* (pre-selects treatment in reservation system).

5. **Detailed Service Drawer/Modal (`src/components/ServiceDetailModal.tsx`)**
   * Treatment overview, autoclave sterilization guarantee, included steps, duration, and 1-click booking link.

6. **Why Diamond Trim (`src/components/WhyChooseUs.tsx`)**
   * Deep dive into the 4 core differentiators.
   * Interactive side-by-side comparison table: *Ordinary Open-Floor Salon vs Diamond Trim Private Atelier*.

7. **Visual Sanctuary Tour (`src/components/GallerySection.tsx`)**
   * Filterable gallery (*VIP Pods, Hair Studio, Private Suites, Artisanal Lounge, Client Results*).
   * Interactive lightbox modal for full-resolution inspection.
   * Blossome-inspired callout banner: *"Quiet Luxury, Made Just For You."*

8. **Client Testimonials (`src/components/TestimonialsSection.tsx`)**
   * Authentic, warm 5-star testimonials echoing genuine client experiences (tea/matcha service, Russian manicure durability, stress-free balayage, beard detailing).
   * Interactive carousel controls and aggregate rating badge (4.99 / 5.0 across 1,480+ visits).

9. **Questions, Answered / FAQ (`src/components/FAQSection.tsx`)**
   * Interactive smooth accordion answering key client questions (advance bookings, private pods, sterilization, consultations, unisex services, and professional product lines).
   * Direct link to WhatsApp chat for custom questions.

10. **Contact & Atelier Information (`src/components/ContactSection.tsx`)**
    * *"Let's plan your Diamond Trim moment."*
    * Working reservation/inquiry form with instant confirmation state and WhatsApp prefilled message generation.
    * Atelier address, valet parking notes, phone, hours, and direct WhatsApp concierge.

11. **Footer & VIP Guestlist (`src/components/Footer.tsx`)**
    * Brand statement, explore links, treatment directory, VIP newsletter sign-up with live confirmation, and smooth back-to-top button.

12. **Interactive Booking Engine (`src/components/BookingModal.tsx`)**
    * Multi-step reservation flow:
      * Step 1: Treatment selection, date & time slot selection, VIP pod vs private suite choice.
      * Step 2: Guest details (name, phone, email, hospitality notes).
      * Step 3: Instant confirmed booking voucher with reference code, summary card, and WhatsApp confirmation link.

13. **Floating Quick Actions (`src/components/FloatingActions.tsx`)**
    * Floating WhatsApp concierge badge & sticky "Book Private Suite" button for immediate access on both mobile and desktop.

---

## ✦ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
