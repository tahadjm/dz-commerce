# dz-commerce

**dz-commerce** is a modern full-stack e-commerce platform with an integrated admin dashboard. Built using the **Next.js 13 App Router**, it offers a seamless shopping experience for users and a powerful management interface for administrators.  

The platform provides features like product management, category handling, order tracking, and secure authentication — all wrapped in a clean and responsive UI.  

## ✨ Features
- 🛍️ Fully functional E-Commerce store with product pages and categories  
- 📦 Admin dashboard for managing products, categories, sizes, colors, and orders  
- 🔐 Secure authentication and authorization with Clerk  
- 💳 Stripe integration for payments and checkout  
- 🎨 Responsive UI with Tailwind CSS and dark mode support  
- ⚡ Built with modern technologies (Next.js 13 App Router, Prisma, PlanetScale/MySQL, MongoDB, NextAuth)  

## 🛠️ Tech Stack
- **Frontend:** Next.js 13 (App Router), React, Tailwind CSS  
- **Backend:** Prisma ORM, PlanetScale (MySQL), MongoDB  
- **Auth:** Clerk, NextAuth  
- **Payments:** Stripe  
- **Deployment:** Vercel  

## 📂 Project Structure
```
dz-commerce/
├── admin/          # Admin dashboard for product & order management
├── store/          # Frontend store with product pages
├── components/     # Reusable UI components
├── lib/            # Utilities and helpers
├── prisma/         # Prisma schema and migrations
├── public/         # Static assets
└── .env            # Environment variables
```

## 🚀 Installation
```bash
# Clone the repository
git clone https://github.com/your-username/dz-commerce.git

# Navigate into the project
cd dz-commerce

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

## ⚙️ Environment Variables
Create a `.env` file in the root with the following (adjust as needed):
```
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## ▶️ Usage
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎥 Demo
🚧 Coming soon...  

## 🤝 Contributing
Contributions are welcome! Please fork the repo and create a PR.  

## 📄 License
MIT License  
