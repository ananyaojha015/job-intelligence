from pymongo import MongoClient

uri = "mongodb+srv://ananyaojha015:Anus1020@cluster0.mqcrhxj.mongodb.net/?appName=Cluster0"

client = MongoClient(uri)
db = client['job_intelligence']
print('Connected successfully!')
print('Collections:', db.list_collection_names())