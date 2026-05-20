/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management operations - Optimized with database indexes and lean queries
 */

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     description: Creates a new user account. Email verification is required after registration.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account (minimum 6 characters)
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [student, recruiter, admin]
 *                 description: Role of the user in the system
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile avatar image file (optional)
 *             required:
 *               - fullname
 *               - email
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: User registered successfully. Verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Validation error (e.g. invalid email format, missing required fields) or user already exists
 *       429:
 *         description: Too many registration attempts from this IP, please try again after 15 minutes
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     description: Authenticates a user and returns a JWT token. Email verification is required - login will be rejected if email is not verified. A verification email will be sent automatically if the email is not verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *               role:
 *                 type: string
 *                 enum: [student, recruiter, admin]
 *                 description: Role of the user in the system
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error (e.g. missing credentials or invalid email)
 *       401:
 *         description: Incorrect password or account role mismatch
 *       403:
 *         description: Email not verified. A verification email has been sent to the user's email address.
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many login attempts from this IP, please try again after 15 minutes
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [User]
 *     description: Logs out the current user by clearing the authentication token.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Allows authenticated users to change their password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password of the user
 *               newPassword:
 *                 type: string
 *                 description: New password for the user (minimum 6 characters)
 *                 minLength: 6
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Bad request, current or new password not provided
 *       401:
 *         description: Unauthorized, current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/forget-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [User]
 *     description: Sends a password reset email to the user's registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found with this email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/reset-password/{token}:
 *   post:
 *     summary: Reset user's password using token
 *     tags: [User]
 *     description: Resets the user's password using a token received via email.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token sent via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password to be set (minimum 6 characters)
 *                 minLength: 6
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   post:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the authenticated user's profile information including photo and resume.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               bio:
 *                 type: string
 *                 description: Bio of the user
 *               skills:
 *                 type: string
 *                 description: Comma-separated list of skills
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile avatar image file (optional)
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume PDF file (optional)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/search-history:
 *   get:
 *     summary: Get user's search history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the authenticated user's search history. Optimized with indexed queries.
 *     responses:
 *       200:
 *         description: Successfully retrieved search history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 searchHistory:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Software Engineer", "React Developer", "Node.js"]
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/search-history/clear:
 *   delete:
 *     summary: Clear user's search history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Clears all search history for the authenticated user.
 *     responses:
 *       200:
 *         description: Search history cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Search history cleared successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/recommended-jobs:
 *   get:
 *     summary: Get recommended jobs for the user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns personalized job recommendations based on user's skills and search history. Optimized with parallel queries and batch processing.
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Filter by job title
 *         required: false
 *         schema:
 *           type: string
 *       - name: salaryMin
 *         in: query
 *         description: Minimum salary filter
 *         required: false
 *         schema:
 *           type: integer
 *       - name: salaryMax
 *         in: query
 *         description: Maximum salary filter
 *         required: false
 *         schema:
 *           type: integer
 *       - name: experienceLevel
 *         in: query
 *         description: Filter by experience level (0-5)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: location
 *         in: query
 *         description: Filter by job location
 *         required: false
 *         schema:
 *           type: string
 *       - name: jobType
 *         in: query
 *         description: Filter by job type
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         description: Sort jobs by a specific field
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Order of sorting (asc or desc)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Successfully retrieved recommended jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/search:
 *   get:
 *     summary: Get personalized search results based on user history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns job results based on the authenticated user's search history. If the search history is empty, it falls back to displaying the latest 50 job openings. Optimized with aggregation pipelines and indexed queries.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of results to return
 *         required: false
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs (based on history or latest fallback)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Explore our latest job openings.
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/verify-email:
 *   post:
 *     summary: Verify user email
 *     tags: [User]
 *     description: Verifies the user's email address using a token sent via email. Verification emails are automatically sent when a user attempts to login with an unverified email.
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         description: Email verification token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/read-content:
 *   post:
 *     summary: Extract key information from a user's documents
 *     tags: [User]
 *     description: Extracts text content from uploaded PDF documents using Google Gemini AI service.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: PDF file of the user's document
 *     responses:
 *       200:
 *         description: Successfully extracted content from the document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                 extractedContent:
 *                   type: object
 *                   description: JSON content extracted from the document
 *       400:
 *         description: No document file was uploaded
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/job-alerts:
 *   get:
 *     summary: Get user's job alert preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the authenticated user's job alert settings including enabled status, frequency, and saved filters.
 *     responses:
 *       200:
 *         description: Successfully retrieved job alert preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 jobAlerts:
 *                   type: object
 *                   properties:
 *                     enabled:
 *                       type: boolean
 *                     frequency:
 *                       type: string
 *                       enum: [daily, weekly]
 *                     savedFilters:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: User not found
 *   post:
 *     summary: Update user's job alert preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Updates job alert settings including enabled status, frequency (daily/weekly), and saved search filters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 description: Enable or disable job alerts
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly]
 *                 description: Frequency of job alert emails
 *               filters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     keywords:
 *                       type: array
 *                       items:
 *                         type: string
 *                     location:
 *                       type: string
 *                     jobType:
 *                       type: string
 *                     minSalary:
 *                       type: number
 *                     maxSalary:
 *                       type: number
 *                     experienceLevel:
 *                       type: number
 *                     companyIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                     limit:
 *                       type: number
 *     responses:
 *       200:
 *         description: Job alert preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Job alert preferences updated successfully.
 *                 jobAlerts:
 *                   type: object
 *       400:
 *         description: Invalid frequency value
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/user/saved-searches:
 *   get:
 *     summary: Get user's saved searches
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all saved job searches for the authenticated user.
 *     responses:
 *       200:
 *         description: Successfully retrieved saved searches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 savedSearches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedSearch'
 *       404:
 *         description: User not found
 *   post:
 *     summary: Create or update a saved search
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new saved search or updates an existing one. Users can save up to 20 searches.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchId:
 *                 type: string
 *                 description: ID of existing search to update (omit for new search)
 *               name:
 *                 type: string
 *                 description: Name for the saved search
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Search keywords (max 10)
 *               location:
 *                 type: string
 *               jobType:
 *                 type: string
 *               minSalary:
 *                 type: number
 *               maxSalary:
 *                 type: number
 *               experienceLevel:
 *                 type: number
 *               companyIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               limit:
 *                 type: number
 *                 description: Max results (1-50)
 *               alertEnabled:
 *                 type: boolean
 *                 description: Enable email alerts for this search
 *     responses:
 *       200:
 *         description: Saved search created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Saved search created successfully.
 *                 savedSearches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedSearch'
 *       400:
 *         description: Maximum saved searches limit reached (20)
 *       404:
 *         description: User or saved search not found
 */

/**
 * @swagger
 * /api/v1/user/saved-searches/{searchId}:
 *   delete:
 *     summary: Delete a saved search
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Removes a saved search by ID.
 *     parameters:
 *       - name: searchId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the saved search to delete
 *     responses:
 *       200:
 *         description: Saved search removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Saved search removed successfully.
 *                 savedSearches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedSearch'
 *       400:
 *         description: Invalid saved search ID
 *       404:
 *         description: User or saved search not found
 */

/**
 * @swagger
 * /api/v1/user/profile/skill-gap:
 *   get:
 *     summary: Get skill gap insights for a specific job
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Analyzes the user's skills against a job's requirements and suggests learning resources for missing skills.
 *     parameters:
 *       - name: jobId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to analyze skill gap for
 *     responses:
 *       200:
 *         description: Successfully retrieved skill gap insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 job:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     location:
 *                       type: string
 *                 userSkills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 matchedSkills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 missingSkills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 recommendedResources:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PrepResource'
 *       400:
 *         description: Valid jobId query parameter is required
 *       404:
 *         description: User or job not found
 */

/**
 * @swagger
 * /api/v1/user/profile/completion:
 *   get:
 *     summary: Get profile completion score
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the user's profile completion percentage and pending tasks to complete their profile.
 *     responses:
 *       200:
 *         description: Successfully retrieved profile completion data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 score:
 *                   type: integer
 *                   description: Completion percentage (0-100)
 *                   example: 60
 *                 completedTasks:
 *                   type: integer
 *                   example: 3
 *                 totalTasks:
 *                   type: integer
 *                   example: 5
 *                 pendingTasks:
 *                   type: array
 *                   items:
 *                     type: string
 *                 pendingTasksDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                       label:
 *                         type: string
 *                       completed:
 *                         type: boolean
 *                 templatesCount:
 *                   type: integer
 *                   description: Number of quick apply templates
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/user/templates:
 *   get:
 *     summary: Get user's quick apply templates
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all quick apply templates saved by the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 templates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuickTemplate'
 *       404:
 *         description: User not found
 *   post:
 *     summary: Create a quick apply template
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new quick apply template with cover letter and optional resume reference.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Template title
 *               coverLetter:
 *                 type: string
 *                 description: Cover letter content
 *               resumeId:
 *                 type: string
 *                 description: Reference to a saved resume
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Quick apply template created successfully.
 *                 templates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuickTemplate'
 *       400:
 *         description: Template title is required
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/user/templates/{templateId}:
 *   put:
 *     summary: Update a quick apply template
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Updates an existing quick apply template.
 *     parameters:
 *       - name: templateId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the template to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               resumeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Quick apply template updated successfully.
 *                 templates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuickTemplate'
 *       404:
 *         description: User or template not found
 *   delete:
 *     summary: Delete a quick apply template
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a quick apply template by ID.
 *     parameters:
 *       - name: templateId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the template to delete
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Quick apply template deleted successfully.
 *                 templates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuickTemplate'
 *       404:
 *         description: User or template not found
 */


/**
 * @swagger
 * /api/v1/user/profile/upgrade:
 *   post:
 *     summary: Upgrade user profile to Pro
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Upgrades the authenticated user's account to a Pro subscription.
 *     responses:
 *       200:
 *         description: Profile upgraded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile upgraded to Pro successfully.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/profile/recruiter-stats:
 *   get:
 *     summary: Get dashboard statistics for recruiters
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns key metrics for a recruiter's dashboard, such as total jobs posted, active jobs, and total applications received.
 *     responses:
 *       200:
 *         description: Recruiter statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalJobs:
 *                       type: integer
 *                     activeJobs:
 *                       type: integer
 *                     totalApplications:
 *                       type: integer
 *       403:
 *         description: User is not a recruiter
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/profile/search-candidates:
 *   get:
 *     summary: Search for candidates
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Allows recruiters to search the user database for potential candidates based on skills, experience, or keywords.
 *     parameters:
 *       - name: keyword
 *         in: query
 *         description: Search keyword (skills, name, bio)
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of candidates per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Candidates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 candidates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *       403:
 *         description: User is not a recruiter
 *       500:
 *         description: Internal server error
 */
