from skills import TECHNICAL_SKILLS, SOFT_SKILLS, SKILL_ALIASES
from pymongo import MongoClient
import re

client = MongoClient("mongodb://ananyaojha015:Anus1020@ac-9f8rhel-shard-00-00.mqcrhxj.mongodb.net:27017,ac-9f8rhel-shard-00-01.mqcrhxj.mongodb.net:27017,ac-9f8rhel-shard-00-02.mqcrhxj.mongodb.net:27017/job_intelligence?ssl=true&replicaSet=atlas-6us131-shard-0&authSource=admin&appName=Cluster0")
db = client['job_intelligence']
jobs_collection = db['jobs']

def normalize_text(text):
    """Apply skill aliases before matching"""
    text_lower = text.lower()
    for alias, canonical in SKILL_ALIASES.items():
        text_lower = re.sub(r'\b' + re.escape(alias) + r'\b', canonical, text_lower)
    return text_lower

def extract_skills(text, skill_list):
    """Extract skills from text using exact word boundary matching"""
    if not text:
        return []
    
    normalized = normalize_text(text)
    found = []

    for skill in skill_list:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, normalized):
            found.append(skill)

    return found

def process_all_jobs():
    jobs = jobs_collection.find({})
    updated = 0

    for job in jobs:
        text = f"{job.get('title', '')} {job.get('description', '')} {' '.join(job.get('tags', []))}"
        
        # Separate technical and soft skills
        technical = extract_skills(text, TECHNICAL_SKILLS)
        soft = extract_skills(text, SOFT_SKILLS)

        jobs_collection.update_one(
            {'_id': job['_id']},
            {'$set': {
                'extracted_skills': technical + soft,
                'technical_skills': technical,
                'soft_skills': soft,
            }}
        )
        updated += 1

    print(f"Processed {updated} jobs")

def show_sample():
    jobs = jobs_collection.find({'technical_skills': {'$exists': True}}).limit(3)
    for job in jobs:
        print("---")
        print(f"Title:     {job['title']}")
        print(f"Technical: {job.get('technical_skills', [])}")
        print(f"Soft:      {job.get('soft_skills', [])}")

if __name__ == '__main__':
    print("Extracting skills...")
    process_all_jobs()
    print("\nSample:")
    show_sample()