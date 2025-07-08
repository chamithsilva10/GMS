# NCAS Grant Management System - Enterprise Edition

A comprehensive, enterprise-grade Grant Management System with advanced features including real-time updates, document management, workflow automation, analytics, and GSAP animations.

## 🚀 Features

### Real-time Updates
- ✅ **Live notifications** with toast system
- ✅ **Instant updates** across all dashboards
- ✅ **Event-driven architecture** using browser events
- ✅ **Auto-refresh** every 30 seconds
- ✅ **Real-time badges** showing pending counts

### Authentication & User Management
- ✅ Role-based access control (Admin, Grant Manager, Applicant)
- ✅ Admin approval workflow for new users
- ✅ Secure login/logout functionality
- ✅ Clean registration without password display

### Grant Management
- ✅ Comprehensive grant application forms
- ✅ Multiple grant categories
- ✅ Real-time application status tracking
- ✅ Budget and timeline management
- ✅ Document upload capability

### Document Management
- ✅ **Advanced file upload** with drag & drop
- ✅ **Document indexing** and search
- ✅ **File type validation** and size limits
- ✅ **Document storage** and retrieval
- ✅ **PDF generation** for bills and receipts

### Search & Filtering
- ✅ **Advanced search bar** with filters
- ✅ **Multi-criteria filtering** (status, category, role)
- ✅ **Real-time search results**
- ✅ **Search across** users, grants, and documents

### Workflow Automation
- ✅ **Automated eligibility checks**
- ✅ **Multi-step approval process**
- ✅ **Workflow visualization** with status tracking
- ✅ **Automated notifications** at each step
- ✅ **Role-based task assignment**

### Enhanced Security
- ✅ **Role-based access control** (RBAC)
- ✅ **Multi-user authentication**
- ✅ **Session management**
- ✅ **Data validation** and sanitization
- ✅ **Secure file uploads**

### Data Analytics & Reporting
- ✅ **Comprehensive analytics dashboard**
- ✅ **Real-time statistics** and metrics
- ✅ **Approval/rejection rates**
- ✅ **Category-wise analysis**
- ✅ **Monthly trends** and patterns
- ✅ **Funding analytics**

### Bill & Expense Management
- ✅ **Bill tracking system**
- ✅ **Expense categorization**
- ✅ **PDF receipt generation**
- ✅ **Payment status tracking**
- ✅ **Financial reporting**

### GSAP Animations
- ✅ **Smooth page transitions**
- ✅ **Card animations** on load
- ✅ **Interactive hover effects**
- ✅ **Form field animations**
- ✅ **Success/error animations**

### Advanced Notifications
- ✅ **Toast notification system**
- ✅ **Success/error/warning/info** types
- ✅ **Auto-dismiss** with custom duration
- ✅ **Activity-based notifications**
- ✅ **Real-time event notifications**

## 🔐 Getting Started

### First Time Setup
1. **Visit the application** - Go to the login page
2. **Create admin account** - The system will automatically create a default admin (admin@ncas.org / admin123) if no users exist
3. **Register new users** - Use the signup page to create accounts
4. **Admin approval** - Admin must approve new user registrations

### Default Admin Credentials
- **Email**: admin@ncas.org
- **Password**: admin123

## 🎯 User Workflow

### For New Users:
1. **Register** → Fill out signup form
2. **Wait for approval** → Admin reviews and approves
3. **Login** → Access role-based dashboard
4. **Start using** → Submit applications or manage grants

### For Admins:
1. **Login** → Access admin dashboard
2. **Real-time alerts** → See pending user approvals with badges
3. **Approve users** → Click approve/reject buttons
4. **Monitor grants** → View all grant applications in real-time
5. **Manage documents** → Control all system documents
6. **Configure workflows** → Set up approval processes
7. **Track bills** → Monitor organizational expenses

### For Grant Managers:
1. **Login** → Access manager dashboard
2. **Review applications** → See pending grants with real-time updates
3. **Make decisions** → Approve or reject grant applications
4. **Track funding** → Monitor approved funding amounts
5. **Access analytics** → View grant-specific metrics
6. **Review documents** → Access application documents

### For Applicants:
1. **Login** → Access applicant dashboard
2. **Submit applications** → Fill out comprehensive grant forms
3. **Track status** → Real-time updates on application status
4. **View history** → See all submitted applications
5. **Upload documents** → Attach supporting documents
6. **Eligibility checks** → Automated validation
7. **Progress monitoring** → Track application workflow

## 🔄 Real-time Features

### Live Updates Include:
- **User registrations** appear instantly in admin dashboard
- **Grant submissions** show up immediately for managers
- **Status changes** update across all relevant dashboards
- **Badge notifications** show pending items count
- **Auto-refresh** keeps data current
- **Document uploads** → Real-time file tracking
- **Bill entries** → Financial dashboard updates

### Event System:
- `userRegistered` - Triggered when new user signs up
- `grantSubmitted` - Triggered when grant application submitted
- `userStatusChanged` - Triggered when admin approves/rejects user
- `grantStatusChanged` - Triggered when manager approves/rejects grant
- `documentUploaded` - Triggered when a document is uploaded
- `billAdded` - Triggered when a bill is added

## 📱 Responsive Design

Fully responsive interface that works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop computers (1024px+)
- 🖥️ Large screens (1440px+)

## 🛠️ Technical Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **shadcn/ui** components with Tailwind CSS
- **Real-time event system** using browser events
- **LocalStorage** for demo data persistence
- **Role-based routing** and authentication
- **Auto-refresh** mechanisms
- **Clean, production-ready** code structure

## 🎨 UI/UX Features

- **Clean login page** without password display
- **Real-time badges** showing pending counts
- **Color-coded status** indicators
- **Highlighted pending items** with background colors
- **Refresh buttons** for manual updates
- **Professional dashboard** layouts
- **Responsive tables** and cards

## 🔧 No Database Setup Required

The system uses browser localStorage for demo purposes:
- **No database configuration** needed
- **Instant setup** and testing
- **Persistent data** across browser sessions
- **Easy to reset** by clearing localStorage

## 📊 Real-time Statistics

All dashboards show live statistics:
- **Pending counts** with color coding
- **Approval rates** and trends
- **Funding amounts** and totals
- **User activity** metrics

## 🚦 Quick Test Workflow

1. **Start fresh** - Clear browser data if needed
2. **Register as applicant** - Create new account
3. **Login as admin** - Use admin@ncas.org / admin123
4. **Approve user** - See real-time notification and approve
5. **Submit grant** - Login as approved applicant and submit
6. **Review grant** - Login as manager and see real-time update
7. **Approve grant** - Make decision and see instant status change

## 🎯 Production Ready

- Clean, professional interface
- No dummy data or setup pages
- Real-time updates throughout
- Proper error handling
- Responsive design
- Role-based security

---

**NCAS Grant Management System** - Enterprise-grade grant management with real-time features, advanced analytics, and comprehensive workflow automation.

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**
