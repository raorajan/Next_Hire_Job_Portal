/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Email sending operations
 */

/**
 * @swagger
 * /api/v1/send-email:
 *   post:
 *     summary: Send contact form email
 *     tags: [Email]
 *     description: Sends an email from the contact form with user information and message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - phone
 *               - service
 *               - message
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: User's first name
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 description: User's last name
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *               service:
 *                 type: string
 *                 enum: [FullStack, Frontend, Backend]
 *                 description: Selected service type
 *                 example: "FullStack"
 *               message:
 *                 type: string
 *                 description: User's message/content
 *                 example: "I would like to discuss a project..."
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
 *                   example: "Email sent successfully"
 *       400:
 *         description: Bad request - validation error
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
 *                   example: "All fields are required"
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to send email. Please try again later."
 *                 statusCode:
 *                   type: number
 *                   example: 500
 */

