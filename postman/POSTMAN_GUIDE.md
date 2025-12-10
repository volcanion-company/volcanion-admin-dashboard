# Postman Collection for Volcanion Auth Service

Complete Postman collection and environments for testing all API endpoints of Volcanion Auth Service.

## 📦 Files

- **Volcanion-Auth-Complete.postman_collection.json** - Complete API collection with all endpoints (⭐ Recommended)
- **Volcanion-Auth.postman_collection.json** - Legacy collection
- **Volcanion-Auth-Local.postman_environment.json** - Local development environment
- **Volcanion-Auth-Production.postman_environment.json** - Production environment

## 🚀 Quick Start

### 1. Import Collection

1. Open Postman
2. Click **Import** button
3. Select `Volcanion-Auth-Complete.postman_collection.json`
4. Collection will be imported with all folders and requests

### 2. Import Environment

1. Click **Import** again
2. Select `Volcanion-Auth-Local.postman_environment.json` (or Production)
3. Select the environment from the dropdown in top-right corner

### 3. Test the API

1. Navigate to **Authentication** → **Register User**
2. Click **Send** to create a new user
3. Navigate to **Authentication** → **Login**
4. Click **Send** - Access token will be automatically saved
5. All other requests will now use the token automatically

## 📁 Collection Structure

### 1. Authentication (3 requests)
- **POST Register User** - Create new user account
- **POST Login** - Authenticate and get JWT tokens
- **POST Logout** - Logout current user

### 2. User Profile (8 requests)
- **GET My Profile** - Get current user profile
- **GET User Context** - Get user context from HttpContext
- **GET User Info** - Get user info via attribute injection
- **GET My Permissions** - Get all user permissions
- **POST Set Custom Context** - Store custom context data
- **GET Custom Context** - Retrieve custom context by key
- **GET Check Permission** - Check specific permission
- **GET Check Role** - Check specific role

### 3. Roles (RBAC) (5 requests)
- **GET All Roles** - List all roles
- **GET Role By ID** - Get role details
- **POST Create Role** - Create new role
- **PUT Update Role** - Update existing role
- **DELETE Role** - Delete role

### 4. Permissions (RBAC) (4 requests)
- **GET All Permissions** - List all permissions
- **POST Create Permission** - Create new permission
- **POST Assign Permission to Role** - Link permission to role
- **DELETE Remove Permission from Role** - Unlink permission

### 5. User Roles (4 requests)
- **GET User Roles** - Get roles for specific user
- **GET User Permissions** - Get all user permissions
- **POST Assign Role to User** - Assign role to user
- **DELETE Remove Role from User** - Remove user role

### 6. Policies (PBAC) (6 requests)
- **GET All Policies** - List all policies
- **GET Policy By ID** - Get policy details
- **POST Create Policy** - Create new policy
- **PUT Update Policy** - Update existing policy
- **DELETE Policy** - Delete policy
- **POST Evaluate Policy** - Test policy evaluation

### 7. Authorization Check (1 request)
- **POST Check Authorization** - Combined RBAC + PBAC check

### 8. Health & Monitoring (2 requests)
- **GET Health Check** - API health status
- **GET Metrics** - Prometheus metrics

**Total: 33 API endpoints**

## 🔧 Environment Variables

The collection uses the following variables:

| Variable | Description | Example | Auto-saved |
|----------|-------------|---------|------------|
| `baseUrl` | API base URL | `http://localhost:5000` | ❌ |
| `accessToken` | JWT access token | `eyJhbGc...` | ✅ |
| `refreshToken` | JWT refresh token | `eyJhbGc...` | ✅ |
| `userId` | Current user ID | `uuid` | ✅ |
| `roleId` | Last created role ID | `uuid` | ✅ |
| `permissionId` | Last created permission ID | `uuid` | ✅ |
| `policyId` | Last created policy ID | `uuid` | ✅ |

## 📝 Common Workflows

### Workflow 1: Register and Setup User

```
1. POST Register User
2. POST Login (token auto-saved)
3. GET My Profile (verify login)
4. GET My Permissions (check permissions)
```

### Workflow 2: Create Role with Permissions

```
1. POST Create Role (roleId auto-saved)
2. POST Create Permission (permissionId auto-saved)
3. POST Assign Permission to Role
4. GET Role By ID (verify permissions added)
```

### Workflow 3: Assign Role to User

```
1. POST Assign Role to User
2. GET User Roles (verify role assigned)
3. GET User Permissions (verify permissions inherited)
4. GET Check Permission (test specific permission)
```

### Workflow 4: Policy-Based Authorization

```
1. POST Create Policy (define conditions)
2. POST Evaluate Policy (test with context)
3. POST Check Authorization (combined RBAC + PBAC)
```

## 🧪 Testing Examples

### Example 1: Create Admin User with Full Permissions

```json
// 1. Register User
POST /api/v1/authentication/register
{
  "email": "admin@volcanion.com",
  "password": "Admin@123456",
  "firstName": "Admin",
  "lastName": "User"
}

// 2. Login
POST /api/v1/authentication/login
{
  "email": "admin@volcanion.com",
  "password": "Admin@123456"
}

// 3. Create Admin Role
POST /api/v1/authorization/roles
{
  "name": "Admin",
  "description": "System Administrator",
  "isActive": true
}

// 4. Create Permission
POST /api/v1/authorization/permissions
{
  "resource": "users",
  "action": "create",
  "description": "Create new users"
}

// 5. Assign Permission to Role
POST /api/v1/authorization/roles/{{roleId}}/permissions/{{permissionId}}

// 6. Assign Role to User
POST /api/v1/authorization/users/{{userId}}/roles/{{roleId}}
```

### Example 2: Policy-Based Document Access

```json
// 1. Create Document Owner Policy
POST /api/v1/authorization/policies
{
  "name": "DocumentOwnerPolicy",
  "description": "Allow users to edit their own documents",
  "resource": "documents",
  "action": "edit",
  "effect": "Allow",
  "conditions": {
    "userIdEquals": "{{userId}}"
  }
}

// 2. Evaluate Policy
POST /api/v1/authorization/evaluate
{
  "userId": "{{userId}}",
  "resource": "documents",
  "action": "edit",
  "context": {
    "documentOwnerId": "{{userId}}",
    "department": "Engineering"
  }
}
```

### Example 3: Check User Authorization

```json
POST /api/v1/authorization/check
{
  "userId": "{{userId}}",
  "resource": "documents",
  "action": "read",
  "context": {
    "department": "Engineering",
    "ipAddress": "192.168.1.100",
    "time": "2025-12-10T10:00:00Z"
  }
}
```

## 🔍 Auto-Save Features

The collection includes automatic variable saving through test scripts:

- **POST Login**: Saves `accessToken`, `refreshToken`, `userId`
- **POST Register User**: Saves `userId`
- **POST Create Role**: Saves `roleId`
- **POST Create Permission**: Saves `permissionId`
- **POST Create Policy**: Saves `policyId`

These values are automatically saved to both collection and environment variables.

## 🛠️ Pre-request Scripts

The collection includes global pre-request scripts for:

- Token refresh preparation (optional)
- Environment variable validation
- Request logging

## ✅ Test Scripts

### Global Tests

Every request runs these global tests:

```javascript
// Verify no server errors
pm.test('Status code is not 500', function () {
    pm.expect(pm.response.code).to.not.equal(500);
});

// Log response time
console.log('Response time:', pm.response.responseTime, 'ms');
```

### Request-Specific Tests

Individual requests include:
- Variable extraction and auto-save
- Response structure validation
- Status code verification
- Data integrity checks

## 🏃 Running Collections

### Run Entire Collection

1. Click the **...** menu on the collection
2. Select **Run collection**
3. Configure options:
   - Iterations: 1
   - Delay: 0ms
   - Data file: (optional)
4. Click **Run Volcanion Auth Service**

### Run Specific Folder

1. Right-click on a folder (e.g., "Authentication")
2. Select **Run folder**
3. View results in Collection Runner

## 📚 Additional Resources

- **API Documentation**: [Swagger UI](http://localhost:5000/swagger)
- **Architecture Guide**: [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- **Getting Started**: [../docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md)
- **RBAC Guide**: [../docs/RBAC_GUIDE.md](../docs/RBAC_GUIDE.md)
- **PBAC Guide**: [../docs/PBAC_GUIDE.md](../docs/PBAC_GUIDE.md)
- **API Reference**: [../docs/API_REFERENCE.md](../docs/API_REFERENCE.md)

## 🐛 Troubleshooting

### 401 Unauthorized

**Problem**: Getting 401 errors on authenticated endpoints

**Solutions**:
- Make sure you've logged in first
- Check if `accessToken` variable is set
- Verify environment is selected in top-right dropdown
- Re-login if token expired

### 400 Bad Request

**Problem**: Request fails with validation errors

**Solutions**:
- Check request body format (must be valid JSON)
- Verify all required fields are present
- Check variable values ({{userId}}, {{roleId}}, etc.)
- Review field data types (UUID, string, boolean)

### 404 Not Found

**Problem**: Endpoint not found

**Solutions**:
- Verify the API is running: http://localhost:5000/health
- Check `baseUrl` in environment variables
- Ensure endpoint path is correct (check for typos)
- Verify API version in path (`/api/v1/...`)

### Variables Not Saving

**Problem**: Variables not auto-saving after requests

**Solutions**:
- Check if test scripts are enabled in Settings
- Verify you have write permissions to environment
- Try re-importing the collection
- Check Postman console for script errors

### Connection Refused

**Problem**: Cannot connect to API

**Solutions**:
- Start the API: `dotnet run` or `docker-compose up`
- Verify port is correct (default: 5000)
- Check firewall settings
- Ensure no other service is using port 5000

## 💡 Tips & Best Practices

1. **Use Environments**: Switch between Local and Production easily
2. **Check Console**: View auto-saved variables and execution logs
3. **Save Responses**: Use "Save Response" to create examples
4. **Organize Requests**: Use folders to group related endpoints
5. **Share Workspace**: Collaborate with team members
6. **Version Control**: Keep collections in Git repository
7. **Document Changes**: Update descriptions when modifying requests
8. **Test Automation**: Use Collection Runner for regression testing

## 🔐 Security Notes

⚠️ **Important Security Considerations**:

- ❌ Never commit production credentials to version control
- ✅ Use environment variables for sensitive data
- ✅ Rotate tokens regularly in production
- ✅ Keep refresh tokens secure
- ✅ Use HTTPS in production environments
- ✅ Enable 2FA for production accounts
- ✅ Review and limit API permissions

## 🆕 What's New

### Version 1.0.0 (December 2025)

- ✅ Complete collection with 33 endpoints
- ✅ 8 organized folders by feature
- ✅ Auto-save for all important variables
- ✅ Global test scripts
- ✅ Pre-request scripts support
- ✅ Detailed descriptions for all requests
- ✅ Example request bodies
- ✅ Health check and metrics endpoints

## 📞 Support

Need help? Check these resources:

- **GitHub Issues**: [Report bugs or request features](https://github.com/volcanion-company/auth-service/issues)
- **Documentation**: [Complete docs](../docs/)
- **Swagger UI**: [Interactive API docs](http://localhost:5000/swagger)
- **Email**: support@volcanion.company

---

**Happy Testing! 🚀**

*Volcanion Auth Service - Complete API Testing Suite*
