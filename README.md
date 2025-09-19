# School Payments and Dashboard - Frontend

🎓 A responsive and user-friendly interface for managing school payments and transaction data.

## 🚀 Live Demo

- **Hosted App**: [Coming Soon - Deploy to Vercel/Netlify]
- **GitHub Repository**: [https://github.com/your-username/school-payment-frontend](https://github.com/your-username/school-payment-frontend)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Page Documentation](#page-documentation)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Core Features

- **📊 Transactions Overview**: Paginated and searchable transaction list with sorting
- **🔍 Advanced Filtering**: Multi-select filters for status and school IDs with date range filtering
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🎨 Dark Mode**: Toggle between light and dark themes
- **🔗 URL Persistence**: Filter states persist in URL for easy sharing and bookmarking
- **📄 Data Export**: Export filtered transactions to CSV
- **🎯 Real-time Search**: Debounced search with instant results
- **💫 Interactive Hover Effects**: Smooth animations and hover states on table rows

### Additional Features

- **🏫 School-specific Transactions**: Filter and view transactions by specific school ID
- **📋 Transaction Status Check**: Look up transaction status by custom order ID
- **💳 Payment Interface**: Generate payment links for new transactions
- **🔄 Auto-refresh**: Real-time data updates
- **📊 Data Visualization**: Transaction statistics and charts (optional)

## 🛠 Tech Stack

- **Frontend Framework**: React.js 18.2.0
- **Build Tool**: Vite 4.5.0
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Zustand 4.4.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **UI Components**: 
  - Radix UI primitives
  - Lucide React icons
  - Custom components with Tailwind
- **Utilities**: 
  - date-fns for date formatting
  - class-variance-authority for component variants
  - tailwind-merge for class merging

## 🚀 Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/school-payment-frontend.git
   cd school-payment-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.development` and `.env.production` files:
   ```bash
   # .env.development
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_ENVIRONMENT=development
   
   # .env.production
   VITE_API_BASE_URL=https://your-api-domain.com/api
   VITE_ENVIRONMENT=production
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) to view the application.

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

## 📄 Page Documentation

### 1. Dashboard (`/`)

**Purpose**: Main overview page with key metrics and recent transactions.

**Features**:
- Transaction statistics (total, success, pending, failed)
- Recent transactions list
- Quick navigation to other sections
- Real-time data updates

**Components Used**:
- `Dashboard.jsx`
- `TransactionTable.jsx`
- `Layout.jsx`

### 2. All Transactions (`/transactions`)

**Purpose**: Comprehensive transaction management with advanced filtering and sorting.

**Features**:
- **Pagination**: Navigate through large datasets with customizable page sizes (10, 25, 50, 100)
- **Search**: Real-time search across transaction fields with debouncing
- **Multi-select Filters**: 
  - Status: Success, Pending, Failed (multiple selection)
  - School IDs: Filter by one or multiple schools
  - Date Range: From/To date filtering
  - Payment Gateway: Filter by payment method
- **Column Sorting**: Sort by any column (ascending/descending)
- **URL Persistence**: All filters and pagination state stored in URL
- **Export**: Download filtered results as CSV
- **Interactive Table**: 
  - Hover effects with smooth animations
  - Row selection with bulk actions
  - Quick actions (view, copy, external link)

**Columns Displayed**:
- Collect ID
- School ID
- Gateway
- Order Amount
- Transaction Amount
- Status
- Payment Time
- Actions

**Components Used**:
- `Transactions.jsx`
- `TransactionTable.jsx`
- `TransactionRow.jsx`
- `TransactionFilters.jsx`

### 3. School Transactions (`/school-transactions`)

**Purpose**: View transactions filtered by specific school ID.

**Features**:
- School selection dropdown/search
- All filtering capabilities from main transactions page
- School-specific analytics
- Export school-specific data

**Components Used**:
- `SchoolTransactions.jsx`
- `TransactionTable.jsx`
- School selector component

### 4. Transaction Status Check (`/transaction-status`)

**Purpose**: Look up individual transaction status using custom order ID.

**Features**:
- Search by custom order ID
- Display detailed transaction information
- Status history timeline
- Quick actions (refresh, export details)

**Components Used**:
- `TransactionStatus.jsx`
- `StatusCheck.jsx`
- Status display components

### 5. Payment Interface (`/pay`)

**Purpose**: Generate new payment links for transactions.

**Features**:
- Payment form with validation
- Multiple payment methods (UPI, Card, Netbanking)
- Payment link generation
- Integration with payment gateways

**Components Used**:
- `Payment.jsx`
- Form components (Input, Select, Button)

## 🔌 API Integration

### Base Configuration

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Key Endpoints

| Endpoint | Method | Purpose | Parameters |
|----------|--------|---------|------------|
| `/transactions` | GET | Fetch transactions | `page`, `limit`, `status[]`, `school_id[]`, `date_from`, `date_to`, `search`, `sort`, `order` |
| `/transactions/:school_id` | GET | School-specific transactions | `school_id`, pagination, filters |
| `/check-status` | POST | Check transaction status | `custom_order_id` |
| `/payment/create-payment` | POST | Create payment link | `name`, `school_id`, `amount`, `method` |

### Custom Hooks

- `useApi.js`: Centralized API calling logic
- `useTransactions.js`: Transaction-specific API calls
- `usePagination.js`: Pagination state management
- `useDebounce.js`: Debounced search functionality
- `useUrlFilters.js`: URL state persistence

## 🎨 UI Components

### Design System

**Color Palette**:
- Primary: Blue (#3b82f6)
- Secondary: Amber (#f59e0b)
- Success: Green (#22c55e)
- Danger: Red (#ef4444)
- Muted: Gray variants

**Typography**:
- Font Family: Inter (system fonts fallback)
- Headings: Bold weights with appropriate sizing
- Body: Regular weight with high readability

### Interactive Elements

**Hover Effects** (as specified in requirements):
- Table rows: Subtle elevation with transform and shadow
- Buttons: Color transitions and scaling
- Cards: Border and shadow changes
- Interactive elements: Smooth color transitions

## 🌐 Deployment

### Deploy to Vercel

1. **Connect GitHub repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure build settings**
   ```bash
   # Build Command
   npm run build
   
   # Output Directory
   dist
   
   # Install Command
   npm install
   ```

3. **Environment Variables**
   Add production environment variables in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-api-domain.com/api
   VITE_ENVIRONMENT=production
   ```

### Deploy to Netlify

1. **Connect repository**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git

2. **Build settings**
   ```bash
   # Build command
   npm run build
   
   # Publish directory
   dist
   ```

3. **Environment Variables**
   Add in Netlify dashboard under Site Settings → Environment Variables

### Deploy to AWS Amplify

1. **Connect repository**
   - AWS Amplify Console
   - Connect app from GitHub

2. **Build specification**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

## 📸 Screenshots

### Desktop View

**Dashboard - Light Mode**
![Dashboard Light](./screenshots/dashboard-light.png)

**Transactions Page - Dark Mode**
![Transactions Dark](./screenshots/transactions-dark.png)

**Advanced Filters**
![Filters](./screenshots/filters.png)

### Mobile View

**Responsive Design**
![Mobile View](./screenshots/mobile-view.png)

### Interactive Features

**Hover Effects**
![Hover Effects](./screenshots/hover-effects.gif)

**Multi-select Filters**
![Multi-select](./screenshots/multi-select.png)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 Development Guidelines

- Follow React best practices
- Use TypeScript for type safety (migration in progress)
- Write clean, self-documenting code
- Add proper error handling
- Test components thoroughly
- Follow the existing code style

## 🐛 Known Issues

- [ ] TypeScript migration in progress
- [ ] Unit tests to be added
- [ ] E2E tests with Playwright
- [ ] Performance optimization for large datasets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for efficient school payment management**