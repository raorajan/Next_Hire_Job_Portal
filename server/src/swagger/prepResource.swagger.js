/**
 * @swagger
 * tags:
 *   name: PrepResource
 *   description: Preparation resource management operations for interview prep materials
 */

/**
 * @swagger
 * /api/v1/prep-resource:
 *   get:
 *     summary: Get preparation resources (public)
 *     tags: [PrepResource]
 *     description: Returns a paginated list of preparation resources with optional filters. Public endpoint.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of resources per page (max 50)
 *       - name: category
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by category (case-insensitive exact match)
 *       - name: tags
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated or array)
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved preparation resources
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
 *                 resources:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PrepResource'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *   post:
 *     summary: Create a preparation resource
 *     tags: [PrepResource]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new preparation resource. Only recruiters can create resources.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Resource title
 *               category:
 *                 type: string
 *                 description: Resource category (e.g., "Technical Interview", "Behavioral", "System Design")
 *               content:
 *                 type: string
 *                 description: Resource content/text
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: External resource URL
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the resource (or comma-separated string)
 *     responses:
 *       201:
 *         description: Resource created successfully
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
 *                   example: Prep resource created successfully.
 *                 resource:
 *                   $ref: '#/components/schemas/PrepResource'
 *       400:
 *         description: Title, category and either content or url are required
 *       403:
 *         description: Only recruiters/admins can create resources
 */

/**
 * @swagger
 * /api/v1/prep-resource/{resourceId}:
 *   put:
 *     summary: Update a preparation resource
 *     tags: [PrepResource]
 *     security:
 *       - bearerAuth: []
 *     description: Updates an existing preparation resource. Only recruiters can update resources.
 *     parameters:
 *       - name: resourceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the resource to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: string
 *               url:
 *                 type: string
 *                 format: uri
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Resource updated successfully
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
 *                   example: Prep resource updated successfully.
 *                 resource:
 *                   $ref: '#/components/schemas/PrepResource'
 *       403:
 *         description: Only recruiters/admins can update resources
 *       404:
 *         description: Prep resource not found
 *   delete:
 *     summary: Delete a preparation resource
 *     tags: [PrepResource]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a preparation resource by ID. Only recruiters can delete resources.
 *     parameters:
 *       - name: resourceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the resource to delete
 *     responses:
 *       200:
 *         description: Resource deleted successfully
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
 *                   example: Prep resource deleted successfully.
 *       403:
 *         description: Only recruiters/admins can delete resources
 *       404:
 *         description: Prep resource not found
 */
