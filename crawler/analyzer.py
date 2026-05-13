from pymongo import MongoClient
from collections import Counter, defaultdict
from datetime import datetime

# MongoDB connection
client = MongoClient("mongodb+srv://ananyaojha015:Anus1020@cluster0.mqcrhxj.mongodb.net/?appName=Cluster0")
db = client['job_intelligence']
jobs_collection = db['jobs']
skills_collection = db['skills']
insights_collection = db['insights']

# ── 1. TOP SKILLS OVERALL ─────────────────────
def top_skills_overall(limit=10):
    skills = skills_collection.find().sort('frequency', -1).limit(limit)
    
    print("\n📊 Top Skills Overall:")
    print("─" * 40)
    result = []
    for skill in skills:
        bar = "█" * skill['frequency']
        print(f"{skill['skill_name']:<20} {bar} ({skill['frequency']})")
        result.append({
            'skill': skill['skill_name'],
            'frequency': skill['frequency']
        })
    return result

# ── 2. SKILLS BY CATEGORY ─────────────────────
def skills_by_category():
    categories = jobs_collection.distinct('category')
    
    print("\n📂 Skills by Category:")
    print("─" * 40)
    
    category_skills = {}
    for category in categories:
        jobs = jobs_collection.find({
            'category': category,
            'extracted_skills': {'$exists': True}
        })
        
        all_skills = []
        for job in jobs:
            all_skills.extend(job.get('extracted_skills', []))
        
        if all_skills:
            top = Counter(all_skills).most_common(5)
            category_skills[category] = top
            print(f"\n{category}:")
            for skill, count in top:
                print(f"  {skill:<20} ({count})")
    
    return category_skills

# ── 3. SKILLS THAT APPEAR TOGETHER ────────────
def skills_cooccurrence():
    print("\n🔗 Skills that appear together most:")
    print("─" * 40)
    
    pairs = Counter()
    jobs = jobs_collection.find({'extracted_skills': {'$exists': True}})
    
    for job in jobs:
        skills = job.get('extracted_skills', [])
        # Generate all pairs from this job's skills
        for i in range(len(skills)):
            for j in range(i + 1, len(skills)):
                pair = tuple(sorted([skills[i], skills[j]]))
                pairs[pair] += 1
    
    print("Top skill combinations:")
    for pair, count in pairs.most_common(8):
        print(f"  {pair[0]} + {pair[1]:<20} ({count} jobs)")
    
    return pairs.most_common(8)

# ── 4. DEMAND SCORE ───────────────────────────
def calculate_demand_score():
    """Score each skill based on frequency + how many categories it appears in"""
    print("\n🏆 Skill Demand Score:")
    print("─" * 40)
    
    skill_categories = defaultdict(set)
    jobs = jobs_collection.find({'extracted_skills': {'$exists': True}})
    
    for job in jobs:
        category = job.get('category', 'unknown')
        for skill in job.get('extracted_skills', []):
            skill_categories[skill].add(category)
    
    scores = []
    for skill, categories in skill_categories.items():
        freq_doc = skills_collection.find_one({'skill_name': skill})
        frequency = freq_doc['frequency'] if freq_doc else 0
        
        # Score = frequency * number of categories it appears in
        score = frequency * len(categories)
        scores.append({
            'skill': skill,
            'frequency': frequency,
            'categories_count': len(categories),
            'demand_score': score
        })
    
    # Sort by demand score
    scores.sort(key=lambda x: x['demand_score'], reverse=True)
    
    for s in scores[:10]:
        print(f"{s['skill']:<20} score: {s['demand_score']} (freq: {s['frequency']}, categories: {s['categories_count']})")
    
    return scores

# ── 5. SAVE INSIGHTS TO MONGODB ───────────────
def save_insights(top_skills, category_skills, demand_scores):
    insight = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'generated_at': datetime.now(),
        'top_skills': top_skills,
        'skills_by_category': {
            k: [{'skill': s, 'count': c} for s, c in v]
            for k, v in category_skills.items()
        },
        'demand_scores': demand_scores[:10]
    }
    
    # Replace today's insight if it exists
    insights_collection.update_one(
        {'date': insight['date']},
        {'$set': insight},
        upsert=True
    )
    print("\n✅ Insights saved to MongoDB")

# ── RUN ALL ───────────────────────────────────
if __name__ == '__main__':
    print("🚀 Running Trend Analyzer...")
    top = top_skills_overall()
    cat_skills = skills_by_category()
    skills_cooccurrence()
    scores = calculate_demand_score()
    save_insights(top, cat_skills, scores)