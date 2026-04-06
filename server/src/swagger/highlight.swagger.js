/**
 * @swagger
 * tags:
 *   name: Highlight
 *   description: Highlight management operations for featured companies and jobs on landing page
 */

/**
 * @swagger
 * /api/v1/highlight:
 *   get:
 *     summary: Get active highlights (public)
 *     tags: [Highlight]
 *     description: Returns all active highlights for the landing page. Can be filtered by type.
 *     parameters:
 *       - name: type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [company, job]
 *         description: Filter highlights by type
 *     responses:
 *       200:
 *         description: Successfully retrieved highlights
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
 *                 highlights:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Highlight'
 *   post:
 *     summary: Create a new highlight
 *     tags: [Highlight]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new highlight for the landing page. Only recruiters can create highlights.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [company, job]
 *                 default: company
 *                 description: Type of highlight
 *               title:
 *                 type: string
 *                 description: Highlight title
 *               subtitle:
 *                 type: string
 *                 description: Highlight subtitle
 *               description:
 *                 type: string
 *                 description: Highlight description
 *               companyId:
 *                 type: string
 *                 description: Associated company ID
 *               jobId:
 *                 type: string
 *                 description: Associated job ID
 *               imageUrl:
 *                 type: string
 *                 description: Highlight image URL
 *               order:
 *                 type: number
 *                 description: Display order
 *                 default: 0
 *               isActive:
 *                 type: boolean
 *                 description: Whether the highlight is active
 *                 default: true
 *     responses:
 *       201:
 *         description: Highlight created successfully
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
 *                   example: Highlight created successfully.
 *                 highlight:
 *                   $ref: '#/components/schemas/Highlight'
 *       400:
 *         description: Title is required
 *       403:
 *         description: Only recruiters/admins can create highlights
 */

/**
 * @swagger
 * /api/v1/highlight/{highlightId}:
 *   put:
 *     summary: Update a highlight
 *     tags: [Highlight]
 *     security:
 *       - bearerAuth: []
 *     description: Updates an existing highlight. Only recruiters can update highlights.
 *     parameters:
 *       - name: highlightId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the highlight to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [company, job]
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               companyId:
 *                 type: string
 *               jobId:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               order:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Highlight updated successfully
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
 *                   example: Highlight updated successfully.
 *                 highlight:
 *                   $ref: '#/components/schemas/Highlight'
 *       403:
 *         description: Only recruiters/admins can update highlights
 *       404:
 *         description: Highlight not found
 *   delete:
 *     summary: Delete a highlight
 *     tags: [Highlight]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a highlight by ID. Only recruiters can delete highlights.
 *     parameters:
 *       - name: highlightId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the highlight to delete
 *     responses:
 *       200:
 *         description: Highlight deleted successfully
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
 *                   example: Highlight deleted successfully.
 *       403:
 *         description: Only recruiters/admins can delete highlights
 *       404:
 *         description: Highlight not found
 */
