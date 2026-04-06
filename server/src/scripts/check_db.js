const mongoose = require('mongoose');
require('dotenv').config();

const Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal');
        console.log('Connected to MongoDB');
        
        const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }));
        const jobCount = await Job.countDocuments();
        console.log(`Total Jobs: ${jobCount}`);
        
        const jobs = await Job.find().limit(5);
        console.log('Sample Jobs:', JSON.stringify(jobs, null, 2));
        
        const Company = mongoose.model('Company', new mongoose.Schema({}, { strict: false }));
        const companyCount = await Company.countDocuments();
        console.log(`Total Companies: ${companyCount}`);
        
        const companies = await Company.find().limit(5);
        console.log('Sample Companies:', JSON.stringify(companies.map(c => ({ name: c.companyName, userId: c.userId })), null, 2));

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const userCount = await User.countDocuments();
        console.log(`Total Users: ${userCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

Connection();
