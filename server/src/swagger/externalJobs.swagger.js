/**
 * @swagger
 * tags:
 *   name: ExternalJobs
 *   description: External job listings from third-party APIs (Arbeitnow)
 */

/**
 * @swagger
 * /api/v1/external-jobs:
 *   get:
 *     summary: Get external job listings
 *     tags: [ExternalJobs]
 *     description: Fetches job listings from external job boards (Arbeitnow API). Public endpoint, no authentication required.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successfully retrieved external jobs
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
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       slug:
 *                         type: string
 *                       title:
 *                         type: string
 *                       location:
 *                         type: string
 *                       jobTypes:
 *                         type: array
 *                         items:
 *                           type: string
 *                       description:
 *                         type: string
 *                       company:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           logo:
 *                             type: string
 *                             format: uri
 *                       remote:
 *                         type: boolean
 *                       url:
 *                         type: string
 *                         format: uri
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 links:
 *                   type: object
 *                   properties:
 *                     first:
 *                       type: string
 *                     last:
 *                       type: string
 *                     prev:
 *                       type: string
 *                     next:
 *                       type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     from:
 *                       type: integer
 *                     last_page:
 *                       type: integer
 *                     links:
 *                       type: array
 *                       items:
 *                         type: object
 *                     path:
 *                       type: string
 *                     per_page:
 *                       type: integer
 *                     to:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       502:
 *         description: Unable to load external jobs (external API error)
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
 *                   example: Unable to load external jobs at this time.
 */
