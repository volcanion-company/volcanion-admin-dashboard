# Postman Collection Guide

> Hướng dẫn sử dụng Postman Collection cho Volcanion Auth API

## 📥 Import Collection

### Cách 1: Import từ File

1. Mở Postman
2. Click **Import** button (góc trên bên trái)
3. Chọn **File** tab
4. Kéo thả hoặc chọn file:
   - `Volcanion-Auth.postman_collection.json`
   - `Volcanion-Auth-Local.postman_environment.json`
   - `Volcanion-Auth-Production.postman_environment.json` (optional)
5. Click **Import**

### Cách 2: Import từ URL (nếu có)

1. Mở Postman
2. Click **Import** → **Link** tab
3. Paste URL của collection
4. Click **Continue** → **Import**

---

## ⚙️ Setup Environment

### Chọn Environment

1. Trong Postman, góc phải trên cùng, click dropdown **No Environment**
2. Chọn **Volcanion Auth - Local**
3. Verify các biến:
   - `baseUrl`: http://localhost:5000
   - `accessToken`: (empty - sẽ tự động fill sau login)
   - `refreshToken`: (empty - sẽ tự động fill sau login)
   - `userId`: (empty - sẽ tự động fill sau register)

### Chỉnh sửa Environment (nếu cần)

1. Click icon **Environments** (sidebar trái)
2. Chọn **Volcanion Auth - Local**
3. Sửa `baseUrl` nếu API chạy ở port khác:
   ```
   http://localhost:5001
   https://localhost:5001
   ```
4. Click **Save**

---

## 🚀 Quick Start - Testing Flow

### Step 1: Register User

1. Mở folder **Authentication**
2. Chọn request **Register User**
3. Xem request body (đã có sẵn):
   ```json
   {
     "email": "admin@example.com",
     "password": "SecurePassword123!",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```
4. Click **Send**
5. Kết quả:
   - Response: `201 Created`
   - Variable `userId` được tự động lưu vào environment

### Step 2: Login

1. Chọn request **Login**
2. Request body (same credentials):
   ```json
   {
     "email": "admin@example.com",
     "password": "SecurePassword123!"
   }
   ```
3. Click **Send**
4. Kết quả:
   - Response: `200 OK`
   - Variables `accessToken` và `refreshToken` được tự động lưu
   - Tất cả requests tiếp theo sẽ tự động sử dụng token này

### Step 3: Test Protected Endpoint

1. Chọn request **Get Current User** (trong folder **User Profile**)
2. Click **Send**
3. Kết quả:
   - Response: `200 OK`
   - Trả về thông tin user hiện tại từ JWT token

---

## 📋 Collection Structure

### 1. Authentication (4 requests)

| Request | Method | Description |
|---------|--------|-------------|
| Register User | POST | Tạo tài khoản mới |
| Login | POST | Đăng nhập, lấy JWT token |
| Refresh Token | POST | Refresh access token |
| Logout | POST | Logout và revoke token |

**Auto-saved variables:**
- `userId` (from Register)
- `accessToken` (from Login)
- `refreshToken` (from Login)

### 2. Permissions (4 requests)

| Request | Method | Description |
|---------|--------|-------------|
| Create Permission | POST | Tạo permission mới |
| Get All Permissions | GET | List tất cả permissions |
| Get Permission by ID | GET | Chi tiết 1 permission |
| Delete Permission | DELETE | Xóa permission |

**Auto-saved variables:**
- `permissionId` (from Create Permission)

**Common permissions to create:**
```json
{ "resource": "documents", "action": "read" }
{ "resource": "documents", "action": "write" }
{ "resource": "documents", "action": "delete" }
{ "resource": "users", "action": "manage" }
```

### 3. Roles (7 requests)

| Request | Method | Description |
|---------|--------|-------------|
| Create Role | POST | Tạo role mới |
| Get All Roles | GET | List tất cả roles |
| Get Role by ID | GET | Chi tiết 1 role |
| Update Role | PUT | Cập nhật role |
| Delete Role | DELETE | Xóa role |
| Assign Permission to Role | POST | Gán permission cho role |
| Remove Permission from Role | DELETE | Xóa permission khỏi role |

**Auto-saved variables:**
- `roleId` (from Create Role)

### 4. User-Role Management (4 requests)

| Request | Method | Description |
|---------|--------|-------------|
| Assign Role to User | POST | Gán role cho user |
| Remove Role from User | DELETE | Xóa role khỏi user |
| Get User Roles | GET | Xem roles của user |
| Get User Permissions | GET | Xem permissions của user |

**Uses variables:**
- `userId` (from Register)
- `roleId` (from Create Role)

### 5. Policies (8 requests)

| Request | Method | Description |
|---------|--------|-------------|
| Create Policy - Ownership | POST | Policy dựa trên ownership |
| Create Policy - Time-based | POST | Policy dựa trên thời gian |
| Create Policy - Conditional | POST | Policy có điều kiện phức tạp |
| Create Policy - DENY | POST | Explicit DENY policy |
| Get All Policies | GET | List tất cả policies |
| Get Policy by ID | GET | Chi tiết 1 policy |
| Update Policy | PUT | Cập nhật policy |
| Delete Policy | DELETE | Xóa policy |

**Auto-saved variables:**
- `policyId` (from Create Policy)

**Policy examples included:**
- ✅ Ownership-based (edit own documents)
- ✅ Time-based (business hours only)
- ✅ Conditional (manager approval)
- ✅ Explicit DENY (contractor restrictions)

### 6. Authorization Check (2 requests)

| Request | Method | Description |
|---------|--------|-------------|
| Check Authorization - With Context | POST | RBAC + PBAC combined check |
| Check Authorization - Without Context | POST | RBAC only check |

**Important:** Demonstrates hybrid authorization flow

### 7. User Profile (8 requests)

| Request | Method | Description |
|---------|--------|-------------|
| Get Current User (Extension Methods) | GET | Method 1: Extension methods |
| Get User Context (HttpContext) | GET | Method 2: HttpContext extensions |
| Get User Info (Attribute) | GET | Method 3: Attribute injection |
| Get User Permissions (Service) | GET | Method 4: IUserContextService |
| Set Custom Context Data | POST | Store custom data in context |
| Get Custom Context Data | GET | Retrieve custom context data |
| Check Permission | GET | Check if user has permission |
| Check Role | GET | Check if user has role |

**Purpose:** Demonstrate 4 different methods to access user context

### 8. Health Check (3 requests)

| Request | Method | Auth | Description |
|---------|--------|------|-------------|
| Health Check | GET | No | Overall health |
| Readiness Check | GET | No | Ready to accept requests |
| Liveness Check | GET | No | Basic alive check |

**Note:** No authentication required

---

## 🔄 Complete Testing Workflow

### Scenario 1: Setup RBAC (Role-Based Access Control)

```
1. Register User → saves userId
2. Login → saves accessToken
3. Create Permission (documents:read)
4. Create Permission (documents:write)
5. Create Role (ContentEditor)
6. Assign Permission to Role (documents:read → ContentEditor)
7. Assign Permission to Role (documents:write → ContentEditor)
8. Assign Role to User (ContentEditor → User)
9. Get User Permissions → verify user has documents:read, documents:write
10. Check Authorization (without context) → should allow
```

### Scenario 2: Setup PBAC (Policy-Based Access Control)

```
1. Register User → saves userId
2. Login → saves accessToken
3. Create Policy - Ownership (CanEditOwnDocument)
4. Check Authorization (with context: ownerId matches userId) → ALLOW by policy
5. Check Authorization (with context: ownerId different) → DENY
```

### Scenario 3: Test Hybrid Authorization (RBAC + PBAC)

```
1. Login as User
2. Create DENY Policy (DenyContractorConfidential, priority 300)
3. Create ALLOW Policy (CanEditOwnDocument, priority 100)
4. Assign permission documents:edit to User via Role
5. Check Authorization scenarios:
   a. Context matches DENY policy → DENIED (policy overrides permission)
   b. Context matches ALLOW policy → ALLOWED by policy
   c. No context provided → Check permission → ALLOWED by RBAC
```

### Scenario 4: Test Time-based Policy

```
1. Create Policy - Time-based (BusinessHoursAccess)
   Conditions: 09:00-18:00
2. Check Authorization:
   - During business hours → ALLOWED
   - Outside business hours → DENIED
```

---

## 🔐 Authentication

### Collection-level Authentication

Collection đã được cấu hình với **Bearer Token** authentication:

```
Authorization: Bearer {{accessToken}}
```

Tất cả requests (trừ Authentication folder) sẽ tự động sử dụng token.

### Override Authentication

Một số requests (Register, Login, Health Check) có `auth: noauth` để override collection auth.

### Token Expiration

- **Access Token**: 60 minutes
- **Refresh Token**: 7 days

Khi access token hết hạn:
1. Sử dụng request **Refresh Token**
2. Hoặc **Login** lại

---

## 📝 Variables Reference

### Collection Variables

| Variable | Auto-saved by | Description |
|----------|---------------|-------------|
| `userId` | Register User | Current user ID |
| `roleId` | Create Role | Last created role ID |
| `permissionId` | Create Permission | Last created permission ID |
| `policyId` | Create Policy | Last created policy ID |
| `accessToken` | Login, Refresh Token | JWT access token |
| `refreshToken` | Login, Refresh Token | Refresh token |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `baseUrl` | http://localhost:5000 | API base URL |

### Using Variables

Variables được sử dụng với syntax `{{variableName}}`:

**Example:**
```
GET {{baseUrl}}/api/v1/authorization/roles/{{roleId}}
Authorization: Bearer {{accessToken}}
```

---

## 🧪 Test Scripts

### Auto-save Response Data

Một số requests có **Test Scripts** để tự động lưu response vào variables:

**Register User:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.collectionVariables.set('userId', response.userId);
    console.log('User registered. UserId:', response.userId);
}
```

**Login:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set('accessToken', response.accessToken);
    pm.collectionVariables.set('refreshToken', response.refreshToken);
    console.log('Login successful. Token saved.');
}
```

### View Console Output

1. Mở **Postman Console** (View → Show Postman Console)
2. Send request
3. Xem console logs để verify variables được lưu

---

## 🎯 Tips & Best Practices

### 1. Test Order

Chạy requests theo thứ tự trong từng folder để ensure dependencies:
1. Authentication first (Register → Login)
2. Permissions before Roles
3. Roles before User-Role assignment
4. Policies independent

### 2. Multiple Users

Để test với nhiều users:
1. Duplicate environment (Volcanion Auth - User2)
2. Register với email khác
3. Switch environment để test as different user

### 3. Cleanup

Periodically reset database hoặc delete test data:
- Delete policies
- Remove roles from users
- Delete roles
- Delete permissions

### 4. Error Handling

Nếu request fails:
- Check `accessToken` còn valid không
- Verify `baseUrl` đúng
- Check console logs
- Review response body for error details

### 5. Batch Testing

Sử dụng **Collection Runner**:
1. Click **Run** button trên collection
2. Chọn folder hoặc entire collection
3. Click **Run Volcanion Auth**
4. View results summary

---

## 🐛 Troubleshooting

### Issue: "401 Unauthorized"

**Cause:** Missing or expired access token

**Solution:**
1. Chạy **Login** request lại
2. Verify `accessToken` variable có value
3. Check token expiration (60 minutes)

### Issue: "404 Not Found"

**Cause:** ID variable không tồn tại hoặc resource đã bị xóa

**Solution:**
1. Verify `{{userId}}`, `{{roleId}}`, etc. có value
2. Chạy lại request tạo resource (Create Role, Create Permission)
3. Copy ID từ response và paste trực tiếp vào URL

### Issue: "400 Bad Request - Validation Error"

**Cause:** Invalid request body

**Solution:**
1. Verify JSON syntax đúng
2. Check required fields
3. Review error message trong response body

### Issue: "Base URL not working"

**Cause:** API không chạy hoặc port khác

**Solution:**
1. Verify API đang chạy: `dotnet run`
2. Check port trong console output
3. Update `baseUrl` variable nếu cần
4. Test với browser: http://localhost:5000/health

---

## 📚 Additional Resources

- **API Documentation**: [API_REFERENCE.md](../docs/API_REFERENCE.md)
- **Getting Started**: [GETTING_STARTED.md](../docs/GETTING_STARTED.md)
- **RBAC Guide**: [RBAC_GUIDE.md](../docs/RBAC_GUIDE.md)
- **PBAC Guide**: [PBAC_GUIDE.md](../docs/PBAC_GUIDE.md)
- **Swagger UI**: http://localhost:5000/swagger

---

## 🔄 Version History

**v1.0.0** (2024-11-25)
- Initial release
- 50+ API requests
- Auto-save variables
- Test scripts
- 2 environments (Local, Production)

---

**Happy Testing! 🚀**
