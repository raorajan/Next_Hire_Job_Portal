/**
 * @swagger
 * tags:
 *   name: Application
 *   description: Job application management operations - Optimized with database indexes, lean queries, and non-blocking notifications
 */

/**
 * @swagger
 * /api/v1/application/apply/{jobId}:
 *   post:
 *     summary: Apply for a job
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Submits a job application. Email notifications are sent in the background without blocking the response. Optimized with lean queries.
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of the job to apply for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicantId:
 *                 type: string
 *                 description: The ID of the applicant
 *             required:
 *               - applicantId
 *     responses:
 *       201:
 *         description: Job applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job applied successfully.
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad Request - Application already exists or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden - Only students can apply for jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /api/v1/application/get:
 *   get:
 *     summary: Get applied jobs for the authenticated user
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all jobs that the authenticated user has applied for. Optimized with lean queries and selective field population.
 *     responses:
 *       200:
 *         description: List of applied jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       job:
 *                         $ref: '#/components/schemas/Job'
 *                       status:
 *                         type: string
 *                         enum: [applied, interview, offered, rejected]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No applications found
 */

/**
 * @swagger
 * /api/v1/application/{jobId}/applicants:
 *   get:
 *     summary: Get applicants for a job
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all applicants who have applied for a specific job. Only the job creator can view applicants. Optimized with lean queries and selective field population.
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of the job to get applicants for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applicants for the job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       applicant:
 *                         $ref: '#/components/schemas/Applicant'
 *                       status:
 *                         type: string
 *                         enum: [applied, interview, offered, rejected]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Job not found or no applicants found
 *       403:
 *         description: Unauthorized to view applicants for this job
 */

/**
 * @swagger
 * /api/v1/application/status/{applicationId}/update:
 *   post:
 *     summary: Update application status
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the status of a job application. Email notifications are sent in the background. Optimized with parallel queries and lean operations.
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         description: ID of the application to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shortlisted, interviewed, offered, accepted, rejected]
 *                 description: New status for the application
 *               note:
 *                 type: string
 *                 description: Optional note about the status change
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status updated successfully.
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad Request - Invalid status or application already in this status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       404:
 *         description: Application not found
 *       403:
 *         description: Unauthorized to update this application
 */

/**
 * @swagger
 * /api/v1/application/{applicationId}/timeline:
 *   get:
 *     summary: Get application status timeline
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the complete status history timeline for a job application. Only the applicant or recruiter can view this.
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         description: ID of the application
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved application timeline
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
 *                 application:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     jobTitle:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     currentStatus:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 timeline:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       note:
 *                         type: string
 *                       changedBy:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fullname:
 *                             type: string
 *                           role:
 *                             type: string
 *                       changedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Application ID is required
 *       403:
 *         description: Not authorized to view this timeline
 *       404:
 *         description: Application not found
 */


/**
 * @swagger
 * /api/v1/application/{applicationId}/ai-score:
 *   get:
 *     summary: Get AI score for a job application
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Evaluates an applicant's resume against the job description using Google Gemini AI to return a match score and analysis.
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the application
 *     responses:
 *       200:
 *         description: AI score generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 score:
 *                   type: integer
 *                   description: Match score out of 100
 *                 analysis:
 *                   type: string
 *                   description: Detailed analysis from the AI
 *       403:
 *         description: AI quota exceeded or user not authorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error (AI service failure)
 */

/**
 * @swagger
 * /api/v1/application/{applicationId}/interview-questions:
 *   get:
 *     summary: Generate interview questions using AI
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Generates tailored interview questions for a specific applicant based on their resume and the job description using Google Gemini AI.
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the application
 *     responses:
 *       200:
 *         description: Interview questions generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: string
 *       403:
 *         description: AI quota exceeded or user not authorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error (AI service failure)
 */

/**
 * @swagger
 * /api/v1/application/{applicationId}/email-draft:
 *   post:
 *     summary: Generate an AI email draft
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Generates a professional email draft (e.g., rejection, offer, interview invite) tailored to the applicant using Google Gemini AI.
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailType:
 *                 type: string
 *                 enum: [interview, offer, rejection, update]
 *                 description: The type of email to generate
 *               additionalNotes:
 *                 type: string
 *                 description: Any specific details to include in the email
 *             required:
 *               - emailType
 *     responses:
 *       200:
 *         description: Email draft generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 subject:
 *                   type: string
 *                 body:
 *                   type: string
 *       400:
 *         description: Invalid email type
 *       403:
 *         description: AI quota exceeded or user not authorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error (AI service failure)
 */

/**
 * @swagger
 * /api/v1/application/{applicationId}/send-email:
 *   post:
 *     summary: Send an email to the applicant
 *     tags: [Application]
 *     security:
 *       - bearerAuth: []
 *     description: Sends a formulated email (usually AI-generated) directly to the applicant's email address.
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 description: Email subject line
 *               body:
 *                 type: string
 *                 description: Email body content
 *             required:
 *               - subject
 *               - body
 *     responses:
 *       200:
 *         description: Email sent successfully
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
 *                   example: Email sent successfully to applicant.
 *       400:
 *         description: Subject and body are required
 *       403:
 *         description: User not authorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Failed to send email
 */
