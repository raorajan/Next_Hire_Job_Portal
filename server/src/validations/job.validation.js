const { z } = require("zod");

const postJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    requirements: z.string().or(z.array(z.string())), // Can be string or array based on frontend structure
    salary: z.coerce.number().min(0, "Salary must be a positive number"),
    experienceLevel: z.coerce.number().min(0, "Experience level must be 0 or higher"),
    location: z.string().min(2, "Location must be provided"),
    jobType: z.string().min(2, "Job type must be provided"),
    position: z.coerce.number().min(1, "Position must be at least 1"),
    companyId: z.string().min(1, "Company ID is required"), // Assuming the controller expects companyId
  }).passthrough(),
});

module.exports = {
  postJobSchema,
};
