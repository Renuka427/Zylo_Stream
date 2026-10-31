# Zylo Stream: REST API Documentation

Official API specification for the **Zylo Stream** Subscription Management Platform.

## 1. Base URL & Common Conventions
- **Development Base URL**: `http://localhost:5000/api`
- **Frontend Proxy Base**: `/api` (configured via Vite)
- **Content Type**: `application/json`

### Standard Response Envelope
All API endpoints follow a consistent JSON envelope:

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | INTERNAL_ERROR",
    "message": "Human readable error description",
    "details": []
  }
}
```

### Authentication Header & Cookies
Protected endpoints accept authentication credentials via either:
1. **Bearer Token**: `Authorization: Bearer <jwt_token>`
2. **HTTP-only Cookie**: `token=<jwt_token>` (set automatically upon login/registration)

---

## 2. Authentication & Profile Endpoints (`/api/auth`)

### 2.1 Customer Registration
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Access**: Public
- **Role Assignment**: Guaranteed `customer`. (Any client-supplied `role` parameter is strictly stripped).
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "SecurePassword123!",
  "company": "Company Ltd"
}
```
- **Response** (201 Created):
```json
{
  "success": true,
  "message": "Account registered successfully",
  "data": {
    "user": {
      "id": "usr_c48f2190-...",
      "name": "Jane Doe",
      "email": "jane@company.com",
      "role": "customer",
      "company": "Company Ltd",
      "created_at": "2026-10-31T09:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

### 2.2 Customer Login
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "jane@company.com",
  "password": "SecurePassword123!"
}
```
- **Response** (200 OK): Returns user details and JWT token. Sets HTTP-only `token` cookie.

### 2.3 Administrator Login
- **Method**: `POST`
- **Route**: `/api/auth/admin-login`
- **Access**: Public endpoint, **strictly verified server-side**.
- **Security Rule**: Rejects non-admin users with `403 Forbidden` (`ADMIN_ACCESS_REQUIRED`).
- **Request Body**:
```json
{
  "email": "admin@zylostream.io",
  "password": "admin-super-pass-2026"
}
```
- **Response** (200 OK): Returns admin profile with `role: "admin"`.

### 2.4 Google OAuth Verification / SSO
- **Method**: `POST`
- **Route**: `/api/auth/google`
- **Access**: Public
- **Request Body**:
```json
{
  "google_id": "google_uid_123456",
  "email": "user@gmail.com",
  "name": "User Name"
}
```
- **Response** (200 OK / 201 Created): Generates JWT session for Google user.

### 2.5 Current Authenticated User
- **Method**: `GET`
- **Route**: `/api/auth/me`
- **Access**: Authenticated (`customer` or `admin`)
- **Response** (200 OK): Returns current user object (passwords are always excluded).

### 2.6 Update Profile
- **Method**: `PUT`
- **Route**: `/api/auth/profile`
- **Access**: Authenticated
- **Permitted Fields**: `name`, `company`.
- **Response** (200 OK): Returns updated user object.

### 2.7 Logout
- **Method**: `POST`
- **Route**: `/api/auth/logout`
- **Access**: Public / Authenticated
- **Response** (200 OK): Clears the HTTP-only auth cookie and invalidates session.

---

## 3. Public Subscription Plans Catalog (`/api/plans`)

### 3.1 List Active Plans
- **Method**: `GET`
- **Route**: `/api/plans`
- **Access**: Public
- **Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_starter_monthly",
      "name": "Starter Ledger",
      "description": "Essential recurring billing for growing teams.",
      "price": "49.00",
      "billing_cycle": "monthly",
      "status": "active",
      "features": ["Up to 25 Active Subscriptions", "Automated Dunning Emails"]
    }
  ]
}
```

---

## 4. Customer Endpoints (`/api/customer`)

All endpoints in this group require authentication and enforce **data ownership** (`user_id = req.user.id`).

### 4.1 Customer Dashboard Statistics
- **Method**: `GET`
- **Route**: `/api/customer/stats`
- **Access**: Authenticated `customer`
- **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "activeSubscriptions": 1,
    "monthlySpend": 149.00,
    "pendingInvoices": 1,
    "totalPaid": 149.00
  }
}
```

### 4.2 List Customer Subscriptions
- **Method**: `GET`
- **Route**: `/api/customer/subscriptions`
- **Access**: Authenticated `customer`
- **Response** (200 OK): Array of active/past subscriptions joined with plan details.

### 4.3 Create Subscription
- **Method**: `POST`
- **Route**: `/api/customer/subscriptions`
- **Access**: Authenticated `customer`
- **Request Body**:
```json
{
  "plan_id": "plan_pro_monthly"
}
```
- **Behavior**: Uses transaction to create the subscription record AND automatically generate the initial billing invoice for the plan's exact price.
- **Response** (201 Created): Returns new subscription and generated invoice.

### 4.4 Cancel Subscription
- **Method**: `DELETE`
- **Route**: `/api/customer/subscriptions/:id`
- **Access**: Authenticated `customer` (enforces subscription ownership)
- **Response** (200 OK): Returns cancelled subscription with `status: "cancelled"`.

### 4.5 List Customer Invoices
- **Method**: `GET`
- **Route**: `/api/customer/invoices`
- **Access**: Authenticated `customer`
- **Response** (200 OK): Array of customer's invoices with invoice numbers, amounts, due dates, and payment statuses.

### 4.6 List Customer Payment History
- **Method**: `GET`
- **Route**: `/api/customer/payments`
- **Access**: Authenticated `customer`
- **Response** (200 OK): Array of past payments including transaction references and timestamps.

### 4.7 Settle Invoice / Record Payment
- **Method**: `POST`
- **Route**: `/api/customer/payments`
- **Access**: Authenticated `customer`
- **Request Body**:
```json
{
  "invoice_id": "inv_002",
  "payment_method": "Credit Card"
}
```
- **Behavior**: Updates invoice status to `'Paid'`, generates a transaction reference, logs activity, and records payment.
- **Response** (201 Created): Returns payment confirmation details.

---

## 5. Administrator Endpoints (`/api/admin`)

Every administrator endpoint is strictly guarded by the `requireRole('admin')` server-side middleware. Non-admin users receive `403 Forbidden`.

### 5.1 Executive Overview & Platform Statistics
- **Method**: `GET`
- **Route**: `/api/admin/stats`
- **Access**: `admin`
- **Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalCustomers": 4,
    "activeSubscriptions": 3,
    "totalSubscriptions": 3,
    "cancelledSubscriptions": 0,
    "pastDueSubscriptions": 0,
    "totalRevenue": 697.00,
    "mrr": 697.00,
    "arr": 8364.00,
    "revenueTrends": [
      { "month": "May", "revenue": 12450 },
      { "month": "Jun", "revenue": 15800 }
    ],
    "statusDistribution": [
      { "name": "Active", "value": 3, "color": "#C41E3A" },
      { "name": "Cancelled", "value": 0, "color": "#82766F" }
    ],
    "upcomingRenewals": [],
    "recentActivity": []
  }
}
```

### 5.2 Customer Directory
- **Method**: `GET`
- **Route**: `/api/admin/customers`
- **Query Params**: `?search=query`
- **Access**: `admin`
- **Response** (200 OK): List of all registered customers with subscription count and lifetime spend.

### 5.3 Customer Detail
- **Method**: `GET`
- **Route**: `/api/admin/customers/:id`
- **Access**: `admin`
- **Response** (200 OK): Detailed customer view with subscriptions and invoices history.

### 5.4 All Platform Subscriptions
- **Method**: `GET`
- **Route**: `/api/admin/subscriptions`
- **Access**: `admin`
- **Response** (200 OK): Complete list of platform subscriptions across all customers.

### 5.5 All Platform Invoices
- **Method**: `GET`
- **Route**: `/api/admin/invoices`
- **Access**: `admin`
- **Response** (200 OK): Complete list of all invoices issued.

### 5.6 Create Subscription Plan Tier
- **Method**: `POST`
- **Route**: `/api/admin/plans`
- **Access**: `admin`
- **Request Body**:
```json
{
  "name": "Custom Corporate Tier",
  "description": "High throughput dedicated plan",
  "price": 899.00,
  "billing_cycle": "monthly",
  "features": ["Dedicated Account Exec", "Custom Webhooks"]
}
```
- **Response** (201 Created): Returns newly created plan tier.

### 5.7 Update / Deactivate Subscription Plan
- **Method**: `PUT`
- **Route**: `/api/admin/plans/:id`
- **Access**: `admin`
- **Request Body**: Partial update (`status: "archived"`, `name`, `price`, etc.)
- **Response** (200 OK): Returns modified plan object.

### 5.8 Platform Audit Logs
- **Method**: `GET`
- **Route**: `/api/admin/activity`
- **Access**: `admin`
- **Response** (200 OK): Paginated activity log entries of system events.
