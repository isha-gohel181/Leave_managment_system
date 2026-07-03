# Crave Leave Management System
### NROLLED – IT Team Selection Assignment (Option 1)

Crave Leave is a modern, responsive, and feature-rich leave tracking portal built to streamline employee leave applications and admin approval workflows. This system features real-time notifications, personal dashboards, and a premium split-screen responsive user interface.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js (Vite compiler)
- **Styling**: Tailwind CSS v4 (Custom theme & variables configuration)
- **Animations**: Framer Motion (Page transitions, card transitions, drawer slides)
- **Icons**: Lucide React
- **Toast Engine**: Sonner (Interactive popups)
- **UI Base**: Headless Radix / Shadcn components (Dialog modals, badges, inputs, textareas)

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with custom role-based middleware
- **Process Manager**: Nodemon (Hot-reload)

---

## 🎨 Key Features & Functional Modules

### 1. Authentication & Role-Based Access
- Secure registration and login gateways.
- Toggle between **Employee** and **HR Admin** roles during account creation.
- Modern responsive split-screen login page with a centered form and brand vector artwork.

### 2. Employee Portal
- **Dashboard**: High-level overview of leave balances (Annual, Casual, Sick leaves), pending requests, and upcoming breaks.
- **Apply for Leave**: Simple form with leave type dropdown, date inputs, and text explanation area.
- **Leave History**: Filterable list of all previous applications, search bar with real-time text matching, and paginated request lists.

### 3. HR Admin Portal
- **Dashboard**: Unified metrics (Total users, active pending queue, processed approvals, and rejects).
- **Manage Requests**: Table of all employee leave submissions. Admin can approve or reject.
- **Rejection Modals**: Prompting the admin to provide release schedule conflicts or coverage gap reasons before rejecting.
- **Leave History**: Comprehensive historical log of all team actions.

### 4. Interactive Notifications
- Integrated sidebar-bound notifications bell.
- Unread counter, real-time message popups, and a "Mark all as read" control.

---

## 📸 Screenshots

### 🔑 Authentication
| Registration Page | Login Page |
| :---: | :---: |
| ![Registration Page](screenshots/registration_page.png) | ![Login Page](screenshots/login_page.png) |

### 👤 Employee Portal
| Employee Dashboard | Apply for Leave |
| :---: | :---: |
| ![Employee Dashboard](screenshots/dahboard_employee.png) | ![Apply for Leave](screenshots/apply_leave.png) |

| Leave History | Employee Profile |
| :---: | :---: |
| ![Leave History](screenshots/leave_history.png) | ![Employee Profile](screenshots/employee_profle.png) |

### 👑 HR Admin Portal
| Admin Dashboard | Manage Requests |
| :---: | :---: |
| ![Admin Dashboard](screenshots/admin_dashboard.png) | ![Manage Requests](screenshots/manage_request_admin.png) |

| Admin Profile |
| :---: |
| ![Admin Profile](screenshots/profile_admin.png) |

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Frontend (React + Vite)
        Login[Login / Register] --> Dashboard[Dashboard Router]
        Dashboard --> Employee[Employee Views]
        Dashboard --> Admin[Admin Views]
        Layout[Layout Wrapper] --> Sidebar[Sidebar Navigation]
        Layout --> NotifBell[Notifications Dropdown]
    end

    subgraph Backend (Express REST API)
        AuthRoute[Auth Router] --> RegisterCtrl[Register / Login Controller]
        LeaveRoute[Leave Router] --> LeaveCtrl[Apply / Approve / Reject Controller]
        DashRoute[Dashboard Router] --> DashCtrl[Metrics Calculator]
        AuthMW[Auth JWT Middleware] --> AuthRoute
        AuthMW --> LeaveRoute
    end

    subgraph Database
        Mongo[(MongoDB)]
        UserColl[(User Collection)]
        LeaveColl[(Leave Collection)]
        Mongo --> UserColl
        Mongo --> LeaveColl
    end

    Employee & Admin --> AuthMW
    RegisterCtrl & LeaveCtrl & DashCtrl --> Mongo
```

---

## 🤖 AI Tool Usage Report (Mandatory)

This project was built in collaboration with **Antigravity by Google DeepMind** (an advanced AI pair programming agent). 

### How AI was utilized:
1. **Rebranding Strategy**: Automated the full branding conversion from a template codebase (renaming `replicate` references to `crave`), modifying `index.html` headers, crafting a custom inline geometric SVG "C" logo for the navigation pane, and updating public favicon resources.
2. **Visual Asset Generation**: Used the AI's image generation capability to create `login_illustration.png` (a 3D-styled vector illustration showing user profile security) to fit the modern login layout.
3. **UI Layout Refinement**: Fixed padding offsets, aligned vertical icon positions in search inputs, and rounded active filter tabs to make the component structure clean.
4. **CSS Specificity Debugging**: Resolved a CSS variable specificity collision inside Tailwind CSS v4 where the base component's default `focus-visible` styles overrode custom border highlight classes. Overrode this globally via `--color-ring` in `index.css`.
5. **Git Version Control**: Structured logical branch checkout merges from `frontend` into the `main` branch.

---

## ⚙️ Installation & Local Setup

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (Running locally on `mongodb://127.0.0.1:27017` or a cloud MongoDB Atlas URI)

### Step 1: Database Setup
Make sure MongoDB is running locally:
```bash
# On Windows, start MongoDB Service if not running
net start MongoDB
```

### Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/leave_management
   JWT_SECRET=super_secret_token_123
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 📋 Assumptions & Specifications
- **Leave Limits**: Employees are assigned standard balances upon registration (e.g. 15 days Annual Leave, 10 days Casual Leave, 5 days Sick Leave). Applying for leave deducts from the balance *upon approval* by an admin.
- **Secure Token Storage**: Authentication tokens are stored in `localStorage` and sent inside the `Authorization: Bearer <token>` headers for backend API requests.
- **Git History**: Project commits are logged using separate development branches (`frontend`, `backend`) before being cleanly merged into `main`.
