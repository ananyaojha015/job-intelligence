TECHNICAL_SKILLS = [
    # Languages
    "python", "javascript", "typescript", "java", "c++", "c#",
    "ruby", "go", "rust", "php", "swift", "kotlin", "scala",
    "bash", "shell", "r",

    # Frontend
    "react", "angular", "vue", "html", "css", "sass", "redux",
    "next.js", "gatsby", "webpack", "tailwind",

    # Backend
    "node.js", "django", "flask", "fastapi", "spring", "express",
    "graphql", "rest", "api",

    # Databases
    "mongodb", "postgresql", "mysql", "sqlite", "redis",
    "elasticsearch", "firebase", "dynamodb",

    # Data & ML
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas",
    "numpy", "matplotlib", "spark", "hadoop",

    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "jenkins", "ci/cd", "linux", "git", "github",

    # Tools
    "figma", "jira", "tableau", "power bi",
]

SOFT_SKILLS = [
    "communication", "leadership", "teamwork", "problem solving",
    "project management", "agile", "scrum", "time management",
    "critical thinking", "adaptability",
]

# Combined for backward compatibility
SKILLS = TECHNICAL_SKILLS + SOFT_SKILLS

# Skill normalization map
SKILL_ALIASES = {
    "rest api": "api",
    "restful api": "api",
    "restful": "api",
    "apis": "api",
    "node.js": "node.js",
    "nodejs": "node.js",
    "node": "node.js",
    "react.js": "react",
    "reactjs": "react",
    "vue.js": "vue",
    "vuejs": "vue",
    "postgres": "postgresql",
    "mongo": "mongodb",
    "k8s": "kubernetes",
    "gcloud": "gcp",
    "google cloud": "gcp",
    "amazon web services": "aws",
    "ml": "machine learning",
    "ai": "machine learning",
    "deep learning": "deep learning",
    "dl": "deep learning",
}