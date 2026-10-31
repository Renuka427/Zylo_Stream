# API Documentation

## Overview
This document specifies the REST API endpoints exposed by the Express backend for the **Subscription Management System**.

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.yourdomain.com/api`

## Standard Response Format
All API endpoints follow a consistent JSON response envelope:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

In case of errors:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Detailed error message",
    "details": []
  }
}
```

## Planned API Domains
1. **Health Check**: `GET /api/health`
2. **Auth & Profile**: `/api/users`
3. **Customer Management**: `/api/customers`
4. **Catalog & Plans**: `/api/products`, `/api/plans`
5. **Subscription Lifecycle**: `/api/subscriptions`
6. **Quotations & Estimates**: `/api/quotations`
7. **Billing & Invoices**: `/api/invoices`
8. **Payment Processing**: `/api/payments`
9. **Promotions & Discounts**: `/api/discounts`
10. **Financial & Analytical Reports**: `/api/reports`

> Detailed request/response schemas, query parameters, and status codes will be documented here as module routes are implemented.
