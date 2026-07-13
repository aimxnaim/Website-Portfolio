import campVenture from "../assets/project/MapCampVenture.png";
import gdgetuni from "../assets/project/gdgetuni.png";
import sentiment from "../assets/project/sentiment_websites.png";
import rytbank from "../assets/project/ryt-bank.png";
import ey from "../assets/project/ey.png";

export const HERO_CONTENT = `Full stack software engineer with hands-on experience building and maintaining production web applications, from designing reusable front-end libraries to developing secure, scalable backend systems. Driven by continuous learning and a genuine interest in solving real-world problems through clean, maintainable code.`;

export const ABOUT_TEXT = `I'm a Full Stack Developer at Ernst & Young, building secure compliance platforms with Angular, Node.js/Express, and TypeScript. I've designed reusable front-end libraries, delivered type-safe REST APIs with Prisma, and shipped full stack projects using the MERN stack — always with a focus on clean, maintainable code.`;

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
        description: `CGPA: 3.93/4.00 (First Class Honours)`,
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
            `Spearheading development of a dual-portal compliance submission platform for Malaysia's Consumer Credit Commission (CCC), built with Angular, Node.js/Express, and TypeScript.`,
            `Designed and published two reusable Angular libraries — a dynamic form engine and view renderer — now powering 20+ regulatory submission forms in production.`,
            `Implemented role-based access control, PDF generation, and email notification pipelines, and integrated Firebase Authentication with TOTP/MFA to strengthen account security.`
        ],
        technologies: ["Angular", "Node.js", "Express", "TypeScript", "Prisma", "TSOA", "Firebase Auth", "GCP", "RBAC", "CI/CD", "JIRA", "RESTful API"],
    },
    {
        image : rytbank,
        year: "September 2023 - March 2024",
        role: "Tech Intern, Software Development Testing",
        company: "Ryt Bank",
        description: [
            `Executed 50+ test cases via JIRA during UAT of a digital banking application, covering payment and transfer flows and reporting defects through to resolution.`,
            `Simulated end-to-end data encryption workflows using Alibaba Cloud KMS via CLI and SDK, building a Python Flask microservice to demonstrate secure server-client data exchange.`,
            `Provisioned and configured a web application environment on Alibaba Cloud using ECS, RDS, OSS, and SLB.`
        ],
        technologies: ["Digital Banking Experience", "Test Case Management", "Jira", "UAT Testing", "Python Flask", "ECS", "RDS", "OSS", "SLB", "Alibaba Cloud KMS"],
    },

];

export const PROJECTS = [
    {
        title: "Gadget Universe",
        subtitle: "MERN Stack E-Commerce Website",
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
        subtitle: "Full Stack Campground Web Application",
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
];

export const SMALL_PROJECTS = [
     {
        title: "SereneMinds",
        subtitle: "Sentiment Analysis Approach to University Student Mental Health",
        image: sentiment,
        // featured: true,
        description: [
            "Designed and developed a mental health website using Python Flask, HTML, CSS, and JavaScript, providing a secure and anonymous platform for university students to express their thoughts and feelings.",
            "Implemented a sentiment-analysis algorithm using Logistic Regression in Python to analyze user input text and determine if they exhibit symptoms of a mental health problem.",
            "Utilized Plotly and D3.js to create interactive charts and graphs, enhancing data representation of the sentiment analysis on the SereneMinds dashboard.",
            "Applied Bootstrap and custom CSS to ensure a mobile-first, responsive design, providing a seamless user experience across various devices."
        ],
        technologies: ["Data Science", "Python Flask", "Logistic Regression", "Sentiment Analysis", "Plotly", "D3.js", "Bootstrap"],
        githubLink: "https://github.com/aimxnaim/sentiment-analysis-approach-to-uni-student-mental-health"
    },
    {
        title: "Travelling Preferences Among Malaysian Citizens",
        subtitle: "Data Science Project",
        description: "My data science project during my university life. The system is designed to help travellers identify and plan their next vacation by suggesting destinations that match their individual preferences. ",
        technologies: ["Python", "Recommendation System", "Data Cleaning", "Data Visualization"],
        githubLink: "https://github.com/aimxnaim/Travelling-Preferences-in-Malaysia-",
    },
    {
        title: "Website Portfolio",
        subtitle: "Personal Portfolio Website",
        description: "My code for my website portfolio. Built using React, Tailwind CSS, Framer Motion and deployed on Vercel. Feel free to look.",
        technologies: ["HTML", "CSS", "Javascript", "React", "Tailwind CSS", "Node.js", "Vercel", "Framer Motion"],
        githubLink: "https://github.com/aimxnaim/Website-Portfolio"
    }
];