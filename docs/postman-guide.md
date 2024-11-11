## EffiBuild Pro API Testing Guide

### Initial Setup

1. **Install Postman**
   - Download and install Postman from [postman.com](https://www.postman.com/downloads/)
   - Create a free account if you don't have one

2. **Create a New Collection**
   - Click "New" > "Collection"
   - Name it "EffiBuild Pro API"
   - Click "Create"

3. **Set Up Environment Variables**
   - Click the "Environments" tab
   - Create a new environment called "EffiBuild Pro Local"
   - Add these variables:
     ```
     BASE_URL: http://localhost:5173/api
     AUTH_TOKEN: (leave empty for now)
     ```

### Authentication

Before testing protected routes, you need to authenticate:

1. **Login Request**
   - Method: POST
   - URL: {{BASE_URL}}/auth/login
   - Body (raw JSON):
     ```json
     {
       "email": "admin@effibuildpro.com",
       "password": "Mattox$14"
     }
     ```
   - Save the returned token in the AUTH_TOKEN environment variable

2. **Set Up Authorization**
   - For all requests, add this header:
     ```
     Authorization: Bearer {{AUTH_TOKEN}}
     ```

### Testing User Management Endpoints

#### 1. Create User (POST /users)

**Request:**
- Method: POST
- URL: {{BASE_URL}}/users
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer {{AUTH_TOKEN}}
  ```
- Body:
  ```json
  {
    "email": "john.doe@example.com",
    "name": "John Doe",
    "password": "SecurePass123!",
    "role": "project_manager",
    "clientId": "optional-client-id"
  }
  ```

**Expected Responses:**
- 201 Created:
  ```json
  {
    "id": "generated-uuid",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "project_manager",
    "clientId": "optional-client-id",
    "createdAt": "2023-11-08T...",
    "updatedAt": "2023-11-08T..."
  }
  ```
- 400 Bad Request: Missing required fields
- 409 Conflict: Email already exists
- 403 Forbidden: Insufficient permissions

#### 2. Get All Users (GET /users)

**Request:**
- Method: GET
- URL: {{BASE_URL}}/users
- Optional Query Parameters:
  ```
  ?role=project_manager
  ?clientId=client-uuid
  ```

**Expected Response:**
- 200 OK:
  ```json
  [
    {
      "id": "user-uuid-1",
      "email": "user1@example.com",
      "name": "User One",
      "role": "project_manager",
      "clientId": "client-uuid",
      "createdAt": "2023-11-08T...",
      "updatedAt": "2023-11-08T..."
    },
    // ... more users
  ]
  ```

#### 3. Get Single User (GET /users/:id)

**Request:**
- Method: GET
- URL: {{BASE_URL}}/users/user-uuid

**Expected Responses:**
- 200 OK: Single user object
- 404 Not Found: User doesn't exist

#### 4. Update User (PUT /users/:id)

**Request:**
- Method: PUT
- URL: {{BASE_URL}}/users/user-uuid
- Body:
  ```json
  {
    "name": "John Doe Updated",
    "role": "admin",
    "clientId": "new-client-id"
  }
  ```

**Expected Responses:**
- 200 OK: Updated user object
- 404 Not Found: User doesn't exist
- 409 Conflict: Email already exists (if updating email)

#### 5. Delete User (DELETE /users/:id)

**Request:**
- Method: DELETE
- URL: {{BASE_URL}}/users/user-uuid

**Expected Responses:**
- 204 No Content: Successful deletion
- 404 Not Found: User doesn't exist
- 403 Forbidden: Attempting to delete master admin

### Testing Tips

1. **Response Status Codes**
   - 2xx: Successful operation
   - 4xx: Client error (bad request, unauthorized, etc.)
   - 5xx: Server error

2. **Error Handling**
   - All error responses include:
     ```json
     {
       "error": "Error message description"
     }
     ```

3. **Request Headers**
   - Always include:
     ```
     Content-Type: application/json
     Authorization: Bearer {{AUTH_TOKEN}}
     ```

4. **Testing Workflow**
   1. Start with authentication
   2. Create a test user
   3. Retrieve the user list
   4. Update the test user
   5. Delete the test user
   6. Verify deletion

### Common Issues and Solutions

1. **Authentication Errors (401)**
   - Check if AUTH_TOKEN is set correctly
   - Token might be expired; re-authenticate

2. **Permission Errors (403)**
   - Verify user role has necessary permissions
   - Check PermissionGate requirements in routes

3. **Validation Errors (400)**
   - Check request body matches schema
   - Verify all required fields are present

4. **Not Found Errors (404)**
   - Verify user ID exists
   - Check URL parameters

### Best Practices

1. **Create Test Cases**
   - Test both valid and invalid inputs
   - Test edge cases (empty strings, null values)
   - Test permission restrictions

2. **Environment Management**
   - Use environment variables for base URL
   - Don't hardcode sensitive data
   - Keep test data separate from production

3. **Response Validation**
   - Check response status codes
   - Verify response body structure
   - Validate data types and formats

4. **Security Testing**
   - Test without authentication
   - Test with wrong permissions
   - Test with malformed tokens