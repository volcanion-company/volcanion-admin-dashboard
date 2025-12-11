# Volcanion Admin Dashboard

> Modern Equipment Management Admin Dashboard built with Next.js 14, TypeScript, Material-UI, Redux Toolkit, and RTK Query with advanced RBAC & PBAC authorization and workflow-based business processes.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15-blue)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2-purple)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## 🌟 Features

### Authentication & Session Management
- ✅ JWT Access Token + Refresh Token authentication
- ✅ Secure token management (HTTPOnly cookies + localStorage)
- ✅ Automatic token refresh mechanism
- ✅ Protected routes with middleware
- ✅ Session persistence across page reloads

### Authorization (RBAC & PBAC)
- ✅ **Role-Based Access Control (RBAC)** - Assign roles to users
- ✅ **Permission-Based Access Control (PBAC)** - Fine-grained permissions
- ✅ **Policy-Based Access Control** - Advanced attribute-based policies
- ✅ UI component-level permission checks
- ✅ Route-level authorization
- ✅ Dynamic menu rendering based on permissions
- ✅ Extensible for ABAC (Attribute-Based Access Control)

### Equipment Management System
- ✅ **Equipment CRUD** - Complete equipment lifecycle management
- ✅ **Warehouse Management** - Import/Export tracking with transaction history
- ✅ **Assignment Workflow** - Status-based equipment assignment (Assigned → Returned/Lost)
- ✅ **Maintenance Workflow** - Request → Assign → Start → Complete/Cancel workflow
- ✅ **Liquidation Approval** - Manager approval workflow for equipment disposal
- ✅ **Audit Management** - Equipment audit and reconciliation
- ✅ **Status-based filtering** - Filter by equipment status, approval status, workflow state
- ✅ **Auto-warehouse integration** - Automatic warehouse transactions on state changes

### State Management
- ✅ Redux Toolkit for global state
- ✅ RTK Query for API management
- ✅ Automatic API endpoint generation from Postman Collection
- ✅ Optimistic updates and cache management
- ✅ Built-in loading and error states
- ✅ Tag-based cache invalidation for workflows

### API Integration
- ✅ Centralized API client with Axios
- ✅ Request/Response interceptors
- ✅ Automatic token injection
- ✅ Token refresh on 401 errors
- ✅ Global error handling
- ✅ TypeScript types for all endpoints
- ✅ Module-specific Postman collections

### UI/UX
- ✅ Material-UI v5 components
- ✅ Light/Dark theme toggle
- ✅ Responsive sidebar + header layout
- ✅ Breadcrumb navigation
- ✅ Professional login/register pages
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ Empty states with custom styling
- ✅ Mobile-responsive design
- ✅ Workflow-specific forms and modals

### Reusable Components
- ✅ Server-side DataTable with pagination, sorting, filtering
- ✅ Modal component
- ✅ Drawer component
- ✅ Permission Guard components
- ✅ Auth Guard components
- ✅ Common form inputs with Formik + Yup validation
- ✅ Loading spinners
- ✅ Empty state placeholders
- ✅ Status chips with color coding
- ✅ Workflow-specific action buttons

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **API Layer**: RTK Query
- **HTTP Client**: Axios
- **Form Management**: Formik + Yup validation
- **Date Handling**: date-fns
- **Notifications**: React Toastify
- **Authentication**: JWT (Access + Refresh Tokens)
- **Styling**: MUI Emotion + CSS-in-JS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- API backend running (see Postman collection)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd volcanion-admin-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Volcanion Admin Dashboard
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
volcanion-admin-dashboard/
├── public/                      # Static files
├── postman/                     # Postman collections & environments
│   ├── Assignment-Management-API.postman_collection.json
│   ├── Audit-Management-API.postman_collection.json
│   ├── Equipment-Management-API-Complete.postman_collection.json
│   ├── Liquidation-Management-API.postman_collection.json
│   ├── Maintenance-Management-API.postman_collection.json
│   ├── Warehouse-Management-API.postman_collection.json
│   └── Volcanion-Auth-Complete.postman_collection.json
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── dashboard/           # Dashboard pages
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── profile/         # User profile
│   │   │   ├── users/           # User management
│   │   │   ├── roles/           # Roles management
│   │   │   ├── permissions/     # Permissions management
│   │   │   ├── policies/        # Policies management
│   │   │   ├── equipments/      # Equipment CRUD
│   │   │   ├── warehouses/      # Warehouse management
│   │   │   ├── assignments/     # Assignment workflow
│   │   │   ├── maintenances/    # Maintenance workflow
│   │   │   ├── liquidations/    # Liquidation approval
│   │   │   ├── audits/          # Audit management
│   │   │   └── layout.tsx       # Dashboard layout wrapper
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles
│   │   └── page.tsx             # Home redirect
│   ├── components/              # React components
│   │   ├── auth/                # Auth-related components
│   │   │   ├── AuthGuard.tsx    # Route protection
│   │   │   └── PermissionGuard.tsx # Permission checks
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── DataTable.tsx    # Server-side table
│   │   │   ├── Drawer.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── assignment/          # Assignment workflow components
│   │   │   ├── AssignmentForm.tsx
│   │   │   ├── AssignmentDetail.tsx
│   │   │   └── ReturnAssignmentForm.tsx
│   │   ├── maintenance/         # Maintenance workflow components
│   │   │   ├── MaintenanceForm.tsx
│   │   │   ├── MaintenanceDetail.tsx
│   │   │   └── MaintenanceWorkflowForms.tsx
│   │   ├── liquidation/         # Liquidation workflow components
│   │   │   ├── LiquidationForm.tsx
│   │   │   ├── LiquidationDetail.tsx
│   │   │   └── LiquidationWorkflowForms.tsx
│   │   └── Providers.tsx        # Redux + MUI providers
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── usePermission.ts     # Permission checking hook
│   │   └── useUI.ts             # UI state hooks
│   ├── lib/                     # Core libraries
│   │   ├── api-client.ts        # Axios instance + interceptors
│   │   ├── constants.ts         # App constants (status, permissions, etc.)
│   │   ├── emotion-cache.tsx    # Emotion cache configuration
│   │   └── theme.ts             # MUI theme configuration
│   ├── store/                   # Redux store
│   │   ├── api/                 # RTK Query APIs
│   │   │   ├── authApi.ts       # Auth endpoints
│   │   │   ├── userApi.ts       # User profile endpoints
│   │   │   ├── usersApi.ts      # Users management
│   │   │   ├── rolesApi.ts      # Roles CRUD
│   │   │   ├── permissionsApi.ts # Permissions CRUD
│   │   │   ├── policiesApi.ts   # Policies CRUD
│   │   │   ├── authorizationApi.ts # Authorization checks
│   │   │   ├── equipmentsApi.ts # Equipment management
│   │   │   ├── warehousesApi.ts # Warehouse management
│   │   │   ├── assignmentsApi.ts # Assignment workflow
│   │   │   ├── maintenancesApi.ts # Maintenance workflow
│   │   │   ├── liquidationsApi.ts # Liquidation workflow
│   │   │   └── auditsApi.ts     # Audit management
│   │   ├── slices/              # Redux slices
│   │   │   ├── authSlice.ts     # Auth state
│   │   │   └── uiSlice.ts       # UI state (theme, sidebar)
│   │   ├── serviceBaseQuery.ts  # Base query configs
│   │   └── index.ts             # Store configuration
│   ├── types/                   # TypeScript types
│   │   ├── index.ts             # Core type definitions
│   │   └── equipment.types.ts   # Equipment module types
│   ├── utils/                   # Utility functions
│   │   ├── cookie.ts            # Cookie helpers
│   │   ├── date.ts              # Date formatting
│   │   ├── formatters.ts        # General formatters
│   │   ├── jwt.ts               # JWT helpers
│   │   └── permission.ts        # Permission checking
│   └── middleware.ts            # Next.js middleware (route protection)
├── .env.example                 # Environment template
├── .env.local                   # Local environment (gitignored)
├── .eslintrc.json              # ESLint config
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── ARCHITECTURE.md             # Architecture documentation
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## 🔑 Key Features Explained

### 1. Authentication Flow

```typescript
// Login → Get Tokens → Store in Cookie/LocalStorage
// Access Token: Short-lived (15min), used for API requests
// Refresh Token: Long-lived (7days), used to get new access token

// Automatic refresh on 401
// Middleware protects routes
// AuthGuard component for page-level protection
```

### 2. Permission System

```typescript
// Check permission in components
import { usePermission } from '@/hooks/usePermission';

const { hasPermission } = usePermission();

if (hasPermission('users:create')) {
  // Show create button
}

// Or use PermissionGuard
<PermissionGuard permissions={['users:create']}>
  <CreateButton />
</PermissionGuard>
```

### 3. API Calls with RTK Query

```typescript
// Auto-generated hooks
import { useGetAllRolesQuery, useCreateRoleMutation } from '@/store/api/rolesApi';

const { data, isLoading } = useGetAllRolesQuery({});
const [createRole] = useCreateRoleMutation();

// Automatic caching, refetching, optimistic updates
```

### 4. Equipment Management Workflows

#### Assignment Workflow
```typescript
// Status-based: Assigned (1) → Returned (2) / Lost (3)
// Auto-export from warehouse on create
// Auto-import to warehouse on return
// needsMaintenance flag updates equipment status

const [returnAssignment] = useReturnAssignmentMutation();
await returnAssignment({
  assignmentId,
  returnNotes,
  returnedBy,
  needsMaintenance: true // Equipment → Repairing
});
```

#### Maintenance Workflow
```typescript
// Workflow: Pending (1) → InProgress (2) → Completed (3) / Cancelled (4)
// Assign technician → Start work → Complete/Cancel
// Equipment status changes based on workflow state

const [assignTechnician] = useAssignTechnicianMutation();
const [startMaintenance] = useStartMaintenanceMutation();
const [completeMaintenance] = useCompleteMaintenanceMutation();

// Pending → Assign → InProgress → Complete
```

#### Liquidation Approval Workflow
```typescript
// Manager approval required
// isApproved: null (Pending) → true (Approved) / false (Rejected)
// Equipment → Liquidated on approval
// Auto-export from warehouse

const [approveLiquidation] = useApproveLiquidationMutation();
await approveLiquidation({
  liquidationRequestId,
  approvedBy: managerId,
  liquidationValue,
  approvalNotes
});
```

## 🔒 Security Features

- ✅ HTTPOnly cookies for tokens (production-ready)
- ✅ XSS protection through React
- ✅ CSRF protection through SameSite cookies
- ✅ Token expiration handling
- ✅ Automatic logout on token expiry
- ✅ Route protection via middleware
- ✅ Component-level permission checks

## 📚 API Endpoints

All API endpoints are organized by module with dedicated Postman Collections:

### Authentication & Authorization
- **Authentication**: Login, Register, Logout, Refresh Token
- **User Profile**: Get profile, permissions, roles, context
- **Users**: User management CRUD
- **Roles**: CRUD operations for roles
- **Permissions**: CRUD operations for permissions
- **Policies**: CRUD operations for policies
- **Authorization**: Check user authorization, assign roles/permissions

### Equipment Management Modules
- **Equipments**: CRUD with status management (New, Used, Repairing, Available, Assigned, Liquidated)
- **Warehouses**: Warehouse management with import/export transactions
- **Assignments**: Assignment workflow (Create → Return, with auto-warehouse integration)
- **Maintenances**: Maintenance workflow (Request → Assign → Start → Complete/Cancel)
- **Liquidations**: Approval workflow (Request → Approve/Reject)
- **Audits**: Equipment audit and reconciliation

### Workflow Endpoints
- **Assignment**: 
  - GET all (with filters: equipmentId, userId, status)
  - GET by user (activeOnly param)
  - POST create (auto-export from warehouse)
  - PUT return (auto-import to warehouse, needsMaintenance flag)
  
- **Maintenance**:
  - GET pending requests
  - GET by technician (activeOnly param)
  - PUT assign technician
  - PUT start work (Equipment → Repairing)
  - PUT complete (Equipment → New or Repairing based on stillNeedsMaintenance)
  - PUT cancel
  
- **Liquidation**:
  - GET pending approvals
  - PUT approve (Equipment → Liquidated, auto-export)
  - PUT reject (Equipment status unchanged)

See individual Postman collections in `/postman` directory for complete API documentation.

## 🎨 Theme Customization

The app supports light/dark theme switching. Customize in `src/lib/theme.ts`:

```typescript
// Modify colors, typography, spacing, etc.
const lightTheme = createTheme({ ... });
const darkTheme = createTheme({ ... });
```

## 🧪 Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📖 Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Detailed architecture explanation
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- **Postman Collections** - Module-specific API documentation:
  - `/postman/Assignment-Management-API.postman_collection.json`
  - `/postman/Maintenance-Management-API.postman_collection.json`
  - `/postman/Liquidation-Management-API.postman_collection.json`
  - `/postman/Equipment-Management-API-Complete.postman_collection.json`
  - `/postman/Warehouse-Management-API.postman_collection.json`
  - `/postman/Audit-Management-API.postman_collection.json`

## 🔄 Equipment Status Flow

```
┌─────────────────────────────────────────────────────────┐
│                 Equipment Status Lifecycle               │
└─────────────────────────────────────────────────────────┘

New (1) ──────────────────────────────────────────────────┐
  │                                                        │
  ├──► Used (2)                                           │
  │                                                        │
  ├──► Repairing (3) ──► Maintenance ──► Completed ──────┤
  │         ▲                                              │
  │         └──── Return Assignment (needsMaintenance)    │
  │                                                        │
  ├──► Available (4) ──► Assignment ──► Returned ─────────┤
  │         │                    │                         │
  │         │                    └──► Lost (3) ────────────┤
  │         │                                              │
  │         └──► Assigned (5)                              │
  │                                                        │
  └──► Liquidated (6) ◄──── Approved Liquidation         │
                                                           │
  All paths can reach ───────────────────────────────────┘

Transaction Triggers:
- Create Assignment: Auto-export from warehouse
- Return Assignment: Auto-import to warehouse
- Approve Liquidation: Auto-export from warehouse
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- **Volcanion Company** - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Material-UI team for the beautiful components
- Redux team for state management tools
- All contributors and supporters

## 📞 Support

For support, email support@volcanion.com or open an issue in the repository.

---

**Built with ❤️ by Volcanion Company**
