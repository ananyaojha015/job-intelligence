from pymongo import MongoClient

client = MongoClient("mongodb+srv://ananyaojha015:Anus1020@cluster0.mqcrhxj.mongodb.net/?appName=Cluster0")
db = client['job_intelligence']
jobs_collection = db['jobs']

# Count total jobs
total = jobs_collection.count_documents({})
print(f"Total jobs in DB: {total}")

# Print 3 jobs cleanly
for job in jobs_collection.find().limit(3):
    print("---")
    print(f"Title:    {job['title']}")
    print(f"Company:  {job['company']}")
    print(f"Category: {job['category']}")
    print(f"Tags:     {job['tags']}")
    print(f"Location: {job['location']}")