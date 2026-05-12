import requests
import time
import logging
from pymongo import MongoClient
from bs4 import BeautifulSoup
from datetime import datetime

# ── Logging setup ──────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ── MongoDB connection ──────────────────────────
client = MongoClient("mongodb+srv://ananyaojha015:Anus1020@cluster0.mqcrhxj.mongodb.net/?appName=Cluster0")
db = client['job_intelligence']
jobs_collection = db['jobs']

# ── Categories to crawl ────────────────────────
CATEGORIES = [
    "software-dev",
    "data",
    "devops-sysadmin",
    "machine-learning",
    "finance",
]

# ── Clean HTML description ─────────────────────
def clean_description(html_text):
    soup = BeautifulSoup(html_text, 'html.parser')
    return soup.get_text(separator=' ').strip()

# ── Fetch jobs with retry logic ────────────────
def fetch_jobs(category, retries=3):
    url = f"https://remotive.com/api/remote-jobs?category={category}&limit=50"
    
    for attempt in range(retries):
        try:
            logger.info(f"Fetching category: {category} (attempt {attempt + 1})")
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                jobs = response.json()['jobs']
                logger.info(f"Got {len(jobs)} jobs from {category}")
                return jobs
            else:
                logger.warning(f"Bad status {response.status_code} for {category}")
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {e}")
        
        # Wait before retrying
        time.sleep(2)
    
    logger.error(f"Failed to fetch {category} after {retries} attempts")
    return []

# ── Save jobs to MongoDB ───────────────────────
def save_jobs(jobs):
    saved = 0
    skipped = 0

    for job in jobs:
        if jobs_collection.find_one({'job_id': job['id']}):
            skipped += 1
            continue

        clean_job = {
            'job_id': job['id'],
            'title': job['title'],
            'company': job['company_name'],
            'category': job['category'],
            'tags': job['tags'],
            'job_type': job['job_type'],
            'location': job['candidate_required_location'],
            'salary': job.get('salary', 'Not specified'),
            'description': clean_description(job['description']),
            'url': job['url'],
            'date_posted': job['publication_date'],
            'date_scraped': datetime.now()
        }

        jobs_collection.insert_one(clean_job)
        saved += 1

    return saved, skipped

# ── Main pipeline ──────────────────────────────
def run_crawler():
    logger.info("Starting crawler...")
    total_saved = 0
    total_skipped = 0

    for category in CATEGORIES:
        # Fetch jobs for this category
        jobs = fetch_jobs(category)
        
        if jobs:
            saved, skipped = save_jobs(jobs)
            total_saved += saved
            total_skipped += skipped
            logger.info(f"{category}: saved {saved}, skipped {skipped}")
        
        # Rate limiting — wait 2 seconds between categories
        time.sleep(2)

    logger.info(f"Crawler done! Total saved: {total_saved} | Total skipped: {total_skipped}")

# ── Run ────────────────────────────────────────
if __name__ == '__main__':
    run_crawler()