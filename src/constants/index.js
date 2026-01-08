import campVenture from "../assets/project/MapCampVenture.png";
import gdgetuni from "../assets/project/gdgetuni.png";
import sentiment from "../assets/project/sentiment_websites.png";
import rytbank from "../assets/project/ryt-bank.png";
import ey from "../assets/project/ey.png";

export const HERO_CONTENT = `I am a recent graduate with a BSc in Computer Science (Hons.) with a first-class degree, passionate about full stack development and adept at crafting robust and scalable web applications. Driven by continuous learning and a collaborative spirit, I am committed to developing innovative solutions that elevate user experiences and drive business growth.`;

export const ABOUT_TEXT = `With nearly 2 years of hands-on programming experience during my university life, I thrive on the challenges of developing websites from scratch. I have honed my skills in front-end technologies like React.js, as well as back-end technologies including Node.js, Express.js, MongoDB, and PostgreSQL. `;

export const EDUCATION = [
    {
        year: "2020 - 2023",
        degree: "BSc in Computer Science (Hons.)",
        school: "UiTM Jasin, Melaka",
        description: `CGPA: 3.53/4.00 (first-class degree).`,
    },
    {
        year: "2018 - 2019",
        degree: "Matriculation",
        school: "Pahang Engineering Matriculation College",
        description: `CGPA: 3.92/4.00`,
    },
    {
        year: "2017 - 2018",
        degree: "SPM",
        school: "MRSM Imtiaz YT Ketengah, Terengganu",
        description: `8A 2B+`,
    },
];
export const EXPERIENCES = [
    {
        image : ey,
        year: "October 2024 - Current",
        role: "Full Stack Developer",
        company: "Ernst & Young",
        description: [
            `Currently engaged as a Full Stack Developer on a client project for CCOB Bank Negara, where I am responsible for the development, maintenance, and troubleshooting of CCOB’s web applications. Our tech stack includes Angular for frontend development; Node.js, Express, and Prisma for backend operations; Bootstrap for responsive design; GitHub for version control; JIRA for project management; Swagger for API documentation; and Jasmine as a testing framework.`
        ],
        technologies: ["Angular", "Node.js", "Express", "Prisma", "Bootstrap", "GitHub", "JIRA", "Swagger", "Jasmine", "TypeScript", "Javascript", "Postman", "RESTful API"],
    },
    {
        image : rytbank,
        year: "September 2023 - March 2024",
        role: "Tech Intern",
        company: "Ryt Bank",
        description: [
            `Conducted user acceptance testing (UAT) on a digital banking application utilizing Jira for test case management and bug reporting. Identified and reported inconsistencies in functionalities like low-risk and high-risk transfer relevant to digital banking operations.`,
            `Use Alibaba Cloud KMS to simulate data encryption by using two methods: Alibaba Cloud commandline interface (CLI) and SDK. In SDK mode, Flask, a microframework written in Python, is used to simulate a simple process of data encryption between server and client.`,
            `Set up a typical web application on Alibaba Cloud by using Alibaba Cloud services such as Elastic Compute Service (ECS), ApsaraDB for RDS (RDS), Object Storage Service (OSS), Server Load Balancer (SLB).`
        ],
        technologies: ["Digital Banking Experience", "Test Case Management", "Jira", "UAT Testing", "Python Flask", "ECS", "RDS", "OSS", "SLB", "Alibaba Cloud KMS"],
    },

];

export const PROJECTS = [
    {
        title: "Gadget Universe",
        image: gdgetuni,
        featured: true,
        description: [
            "Developed a comprehensive eCommerce platform using the MERN stack (MongoDB, Express.js, React.js, Node.js), featuring robust functionalities for product management, user authentication, authorization, and order processing that deployed on Render.",
            "Integrated the Stripe API for secure and efficient payment processing using card during checkout. Utilized Redux Toolkit for efficient state management across the application and reducing boilerplate code.",
            "Implemented secure user registration and login using bcrypt for password encryption and JSON Web Tokens (JWT) for session management, with tokens stored securely in HTTP Only cookies.",
            "Configured Nodemailer to handle email notifications, including sending reset password emails with dynamically generated tokens.",
            "Used MongoDB Atlas for scalable and reliable cloud-based database management, ensuring data persistence and security."
        ],
        technologies: ["MongoDB", "Express.js", "React.js", "Node,js", "Redux Toolkit", "Stripe API", "Nodemailer", "JWT", "bcrypt", "Render", "Cloudinary", "MongoDB Atlas", "Postman", "Bootstrap", "Framer Motion", "HTML", "CSS", "Javascript"],
        githubLink: "https://github.com/aimxnaim/GadgetUniverse",
        liveLink: "https://gadgetuniverse.onrender.com",
    },
    {
        title: "CampVenture",
        image: campVenture,
        featured: true,
        description: [
            "A website application where user can discover campgrounds through map, create, and review campgrounds, featuring secure user authentication with Passport.js and deployed the application on Heroku.",
            'Integrated Mapbox for interactive maps and geolocation features, Cloudinary for multiple image uploads per campground and use Unsplash API to fetch and generate beautiful random campground images for the website.',
            'Implemented data validation and sanitization with Joi, and secured the application against MongoDB injection and XSS attacks.'
        ],
        technologies: ["HTML", "CSS", "Javascript", "EJS", "Express.js", "React", "Node.js", "MongoDB", "Cloudinary", "Bootstrap", "Heroku", "Postman", "Mapbox", "Unsplash API", "Passport.js", "Joi", "Git Bash", "RESTful API"],
        githubLink: "https://github.com/aimxnaim/CampVenture",
        liveLink: "https://guarded-brook-77953-c2f2c375b2e1.herokuapp.com"
    },
    {
        title: "SereneMinds - Sentiment Analysis Approach to University Student Mental Health",
        image: sentiment,
        featured: true,
        description: [
            "Designed and developed a mental health website using Python Flask, HTML, CSS, and JavaScript, providing a secure and anonymous platform for university students to express their thoughts and feelings.",
            "Implemented a sentiment-analysis algorithm using Logistic Regression in Python to analyze user input text and determine if they exhibit symptoms of a mental health problem.",
            "Utilized Plotly and D3.js to create interactive charts and graphs, enhancing data representation of the sentiment analysis on the SereneMinds dashboard.",
            "Applied Bootstrap and custom CSS to ensure a mobile-first, responsive design, providing a seamless user experience across various devices."
        ],
        technologies: ["HTML", "CSS", "Javascript", "Python Flask", "Logistic Regression", "Sentiment Analysis", "Plotly", "D3.js", "Bootstrap"],
        githubLink: "https://github.com/aimxnaim/sentiment-analysis-approach-to-uni-student-mental-health"
    },
];

export const SMALL_PROJECTS = [
    {
        title: "Travelling Preferences Among Malaysian Citizens",
        description: "My data science project during my university life. The system is designed to help travellers identify and plan their next vacation by suggesting destinations that match their individual preferences. ",
        technologies: ["Python", "Recommendation System", "Data Cleaning", "Data Visualization"],
        githubLink: "https://github.com/aimxnaim/Travelling-Preferences-in-Malaysia-",
    },
    {
        title: "Website Portfolio",
        description: "My code for my website portfolio. Built using React, Tailwind CSS, Framer Motion and deployed on Vercel. Feel free to look.",
        technologies: ["HTML", "CSS", "Javascript", "React", "Tailwind CSS", "Node.js", "Vercel", "Framer Motion"],
        githubLink: "https://github.com/aimxnaim/Website-Portfolio"
    }
];