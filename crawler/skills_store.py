from pymongo import MongoClient
from datetime import datetime
from collections import Counter

# MongoDB connection
client = MongoClient("mongodb+srv://ananyaojha015:Anus1020@cluster0.mqcrhxj.mongodb.net/?appName=Cluster0")
db = client['job_intelligence']
jobs_collection = db['jobs']
skills_collection = db['skills']

def aggregate_skills():
    """Count how many jobs require each skill"""
    all_skills = []
    
    jobs = jobs_collection.find({'extracted_skills': {'$exists': True}})
    for job in jobs:
        all_skills.extend(job.get('extracted_skills', []))
    
    return Counter(all_skills)

def store_skills(counter):
    """Store each skill as its own document in skills collection"""
    updated = 0
    inserted = 0

    for skill, count in counter.items():
        existing = skills_collection.find_one({'skill_name': skill})

        if existing:
            # Update frequency and last seen date
            skills_collection.update_one(
                {'skill_name': skill},
                {'$set': {
                    'frequency': count,
                    'last_updated': datetime.now()
                }}
            )
            updated += 1
        else:
            # Insert new skill document
            skills_collection.insert_one({
                'skill_name': skill,
                'frequency': count,
                'first_seen': datetime.now(),
                'last_updated': datetime.now(),
                'trend_data': [
                    {
                        'date': datetime.now().strftime('%Y-%m-%d'),
                        'count': count
                    }
                ]
            })
            inserted += 1

    print(f"Skills stored — Inserted: {inserted} | Updated: {updated}")

def show_skills_collection():
    """Print all skills sorted by frequency"""
    skills = skills_collection.find().sort('frequency', -1)
    
    print("\nSkills collection:")
    print("─" * 40)
    for skill in skills:
        bar = "█" * skill['frequency']
        print(f"{skill['skill_name']:<20} {bar} ({skill['frequency']})")

# Run
if __name__ == '__main__':
    print("Aggregating skills from jobs...")
    counter = aggregate_skills()
    print(f"Found {len(counter)} unique skills")
    store_skills(counter)
    show_skills_collection()