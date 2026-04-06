/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the job
 *         title:
 *           type: string
 *           description: Job title
 *         description:
 *           type: string
 *           description: Job description
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           description: List of job requirements
 *         salary:
 *           type: number
 *           description: Job salary
 *         location:
 *           type: string
 *           description: Job location
 *         jobType:
 *           type: string
 *           enum: [full-time, part-time, contract, internship]
 *           description: Type of job
 *         experienceLevel:
 *           type: number
 *           description: Required experience level (0-5)
 *         position:
 *           type: string
 *           description: Job position
 *         company:
 *           type: string
 *           description: Company ID reference
 *         companyId:
 *           type: string
 *           description: Company ID (alternative field)
 *         created_by:
 *           type: string
 *           description: User ID who created the job
 *         applications:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of application IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Job creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Job last update timestamp
 *       required:
 *         - title
 *         - description
 *         - requirements
 *         - salary
 *         - location
 *         - jobType
 *         - experienceLevel
 *         - position
 *         - companyId
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password for the user account
 *           minLength: 6
 *         role:
 *           type: string
 *           enum: [student, recruiter, admin]
 *           description: Role of the user in the system
 *         profile:
 *           type: object
 *           properties:
 *             profilePhoto:
 *               type: object
 *               properties:
 *                 public_id:
 *                   type: string
 *                   description: Public ID for the profile photo
 *                 url:
 *                   type: string
 *                   description: URL of the profile photo
 *             bio:
 *               type: string
 *               description: Bio of the user
 *             skills:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of skills of the user
 *             resume:
 *               type: object
 *               properties:
 *                 public_id:
 *                   type: string
 *                   description: Public ID for the resume
 *                 url:
 *                   type: string
 *                   description: URL of the resume
 *                 resumeOriginalName:
 *                   type: string
 *                   description: Original name of the resume file
 *             company:
 *               type: string
 *               description: Associated company ID (for recruiters)
 *         isVerified:
 *           type: boolean
 *           description: Indicates whether the user's email is verified
 *         profileCompleted:
 *           type: boolean
 *           description: Indicates whether the user's profile is complete
 *         verificationToken:
 *           type: string
 *           description: Email verification token
 *         searchHistory:
 *           type: array
 *           items:
 *             type: string
 *           description: User's job search history
 *         jobRecommendations:
 *           type: array
 *           items:
 *             type: string
 *           description: Recommended job IDs
 *         jobAlerts:
 *           type: object
 *           properties:
 *             enabled:
 *               type: boolean
 *             frequency:
 *               type: string
 *               enum: [daily, weekly]
 *             savedFilters:
 *               type: array
 *               items:
 *                 type: object
 *             lastSentAt:
 *               type: string
 *               format: date-time
 *         savedSearches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SavedSearch'
 *         quickTemplates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuickTemplate'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last update to the user information
 *       required:
 *         - fullname
 *         - email
 *         - password
 *         - role
 *
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the company
 *         companyName:
 *           type: string
 *           description: Name of the company
 *         description:
 *           type: string
 *           description: Company description
 *         website:
 *           type: string
 *           format: uri
 *           description: Company website URL
 *         location:
 *           type: string
 *           description: Company location
 *         logo:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               description: Public ID for the company logo
 *             url:
 *               type: string
 *               description: URL of the company logo
 *         userId:
 *           type: string
 *           description: User ID who owns the company
 *         stats:
 *           type: object
 *           description: Company statistics
 *           properties:
 *             averageResponseDays:
 *               type: number
 *             decisionsCount:
 *               type: integer
 *             applicationsCount:
 *               type: integer
 *             hiresCount:
 *               type: integer
 *             hiresLast90Days:
 *               type: integer
 *             lastCalculatedAt:
 *               type: string
 *               format: date-time
 *         badges:
 *           type: array
 *           items:
 *             type: string
 *           description: Company achievement badges (e.g., "Fast Hiring", "Responsive Recruiter")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Company creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Company last update timestamp
 *       required:
 *         - companyName
 *         - userId
 *
 *     Application:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the application
 *         job:
 *           type: string
 *           description: ID of the job the application is for
 *         applicant:
 *           type: string
 *           description: ID of the applicant
 *         status:
 *           type: string
 *           enum: [pending, shortlisted, interviewed, offered, accepted, rejected]
 *           description: Current status of the application
 *         coverLetter:
 *           type: string
 *           description: Cover letter content
 *         resumeId:
 *           type: string
 *           description: Reference to template resume ID
 *         statusHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               note:
 *                 type: string
 *               changedBy:
 *                 type: string
 *               changedAt:
 *                 type: string
 *                 format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the application was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the application was last updated
 *       required:
 *         - job
 *         - applicant
 *
 *     Applicant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the applicant
 *         fullname:
 *           type: string
 *           description: Full name of the applicant
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the applicant
 *         profile:
 *           type: object
 *           description: Profile information of the applicant
 *           properties:
 *             profilePhoto:
 *               type: object
 *               properties:
 *                 public_id:
 *                   type: string
 *                 url:
 *                   type: string
 *             resume:
 *               type: object
 *               properties:
 *                 public_id:
 *                   type: string
 *                 url:
 *                   type: string
 *                 resumeOriginalName:
 *                   type: string
 *       required:
 *         - _id
 *         - fullname
 *         - email
 *
 *     Highlight:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the highlight
 *         type:
 *           type: string
 *           enum: [company, job]
 *           description: Type of highlight
 *         title:
 *           type: string
 *           description: Highlight title
 *         subtitle:
 *           type: string
 *           description: Highlight subtitle
 *         description:
 *           type: string
 *           description: Highlight description
 *         company:
 *           type: string
 *           description: Associated company ID reference
 *         job:
 *           type: string
 *           description: Associated job ID reference
 *         imageUrl:
 *           type: string
 *           description: Highlight image URL
 *         order:
 *           type: number
 *           description: Display order
 *           default: 0
 *         isActive:
 *           type: boolean
 *           description: Whether the highlight is active
 *           default: true
 *         createdBy:
 *           type: string
 *           description: User ID who created the highlight
 *         updatedBy:
 *           type: string
 *           description: User ID who last updated the highlight
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Highlight creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Highlight last update timestamp
 *       required:
 *         - title
 *
 *     PrepResource:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the resource
 *         title:
 *           type: string
 *           description: Resource title
 *         category:
 *           type: string
 *           description: Resource category (e.g., "Technical Interview", "Behavioral", "System Design")
 *         content:
 *           type: string
 *           description: Resource content/text
 *         url:
 *           type: string
 *           format: uri
 *           description: External resource URL
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for categorization and search
 *         createdBy:
 *           type: string
 *           description: User ID who created the resource
 *         updatedBy:
 *           type: string
 *           description: User ID who last updated the resource
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Resource creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Resource last update timestamp
 *       required:
 *         - title
 *         - category
 *
 *     SavedSearch:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the saved search
 *         name:
 *           type: string
 *           description: Name of the saved search
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *           description: Search keywords (max 10)
 *         location:
 *           type: string
 *           description: Location filter
 *         jobType:
 *           type: string
 *           description: Job type filter
 *         minSalary:
 *           type: number
 *           description: Minimum salary filter
 *         maxSalary:
 *           type: number
 *           description: Maximum salary filter
 *         experienceLevel:
 *           type: number
 *           description: Experience level filter
 *         companyIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Company IDs to filter by
 *         limit:
 *           type: number
 *           description: Max results (1-50)
 *         alertEnabled:
 *           type: boolean
 *           description: Whether email alerts are enabled for this search
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     QuickTemplate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the template
 *         title:
 *           type: string
 *           description: Template title
 *         coverLetter:
 *           type: string
 *           description: Cover letter content
 *         resumeId:
 *           type: string
 *           description: Reference to a saved resume
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - title
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         status:
 *           type: number
 *           example: 400
 *         message:
 *           type: string
 *           example: Error message
 */

