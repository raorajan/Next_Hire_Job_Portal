/**
 * @swagger
 * tags:
 *   name: Job
 *   description: Job management operations - Optimized with database indexes and lean queries
 */

/**
 * @swagger
 * /api/v1/job/post:
 *   post:
 *     summary: Create a new job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: New job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job created successfully
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error (e.g. missing required fields, invalid format)
 *       404:
 *         description: Company not found
 *       403:
 *         description: Unauthorized to post jobs for this company
 */

/**
 * @swagger
 * /api/v1/job/get:
 *   get:
 *     summary: Get all jobs with filtering, sorting, and pagination
 *     tags: [Job]
 *     description: Returns a paginated list of jobs with optional filters. Optimized with database indexes for faster queries.
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Job title to search for (uses indexed search)
 *         required: false
 *         schema:
 *           type: string
 *       - name: salary
 *         in: query
 *         description: Salary filter
 *         required: false
 *         schema:
 *           type: string
 *       - name: experienceLevel
 *         in: query
 *         description: Experience level filter (0-5)
 *         required: false
 *         schema:
 *           type: number
 *       - name: location
 *         in: query
 *         description: Job location to filter (uses indexed search)
 *         required: false
 *         schema:
 *           type: string
 *       - name: jobType
 *         in: query
 *         description: Type of job (full-time, part-time, contract, internship)
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by (title, salary, createdAt, etc.)
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Sort order (asc or desc)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: number
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of jobs per page
 *         required: false
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 currentPage:
 *                   type: number
 *                   example: 1
 *                 totalPages:
 *                   type: number
 *                   example: 5
 *                 totalJobs:
 *                   type: number
 *                   example: 50
 *                 limit:
 *                   type: number
 *                   example: 10
 *       404:
 *         description: Jobs Not Found
 */

/**
 * @swagger
 * /api/v1/job/carousel:
 *   get:
 *     summary: Get unique jobs for carousel (one per title)
 *     tags: [Job]
 *     description: Returns the most recent job for each unique job title, useful for featured or carousel views. Optimized with aggregation pipeline.
 *     responses:
 *       200:
 *         description: Unique title jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Unique title jobs retrieved successfully.
 *       500:
 *         description: Internal server error while fetching jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error while fetching jobs.
 */

/**
 * @swagger
 * /api/v1/job/filters:
 *   get:
 *     summary: Get job filter options (location, job type, salary ranges)
 *     tags: [Job]
 *     description: Returns distinct filter values for jobs. Optimized with aggregation pipeline.
 *     responses:
 *       200:
 *         description: List of filter options for jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filterData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filterType:
 *                         type: string
 *                         example: Location
 *                       array:
 *                         type: array
 *                         items:
 *                           type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/get/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Job]
 *     description: Returns a single job by its ID. Optimized with lean query for better performance.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job Not Found
 */

/**
 * @swagger
 * /api/v1/adminjobs:
 *   get:
 *     summary: Get jobs posted by authenticated admin/recruiter
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all jobs posted by the authenticated user. Optimized with lean queries.
 *     responses:
 *       200:
 *         description: List of admin jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: Jobs Not Found
 */

/**
 * @swagger
 * /api/v1/job/update/{id}:
 *   put:
 *     summary: Update an existing job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     description: Updates a job by its ID. Only the job creator can update. Optimized with lean queries.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the job to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job updated successfully
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       403:
 *         description: Unauthorized to update this job
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/delete/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a job by its ID. Only the job creator can delete. Optimized with lean queries.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job deleted successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/{id}/similar:
 *   get:
 *     summary: Get similar jobs based on title and location
 *     tags: [Job]
 *     description: Returns jobs similar to the given job ID based on title and location matching. Optimized with indexed queries.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID to find similar jobs for
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Number of similar jobs to return
 *         required: false
 *         schema:
 *           type: number
 *           default: 5
 *     responses:
 *       200:
 *         description: List of similar jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 totalJobs:
 *                   type: number
 *                   example: 5
 *       404:
 *         description: No similar jobs found
 *       500:
 *         description: Internal server error
 */

