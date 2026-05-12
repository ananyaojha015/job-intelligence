import logging
from datetime import datetime

# Import all our modules
from crawler import run_crawler
from skill_extractor import process_all_jobs
from skills_store import aggregate_skills, store_skills
from analyzer import (
    top_skills_overall,
    skills_by_category,
    skills_cooccurrence,
    calculate_demand_score,
    save_insights
)

# ── Logging ───────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ── Master Pipeline ───────────────────────────
def run_pipeline():
    start = datetime.now()
    logger.info("=" * 50)
    logger.info("PIPELINE STARTED")
    logger.info("=" * 50)

    # Step 1 — Crawl jobs
    logger.info("STEP 1: Crawling jobs...")
    run_crawler()

    # Step 2 — Extract skills from jobs
    logger.info("\nSTEP 2: Extracting skills...")
    process_all_jobs()

    # Step 3 — Store skills in skills collection
    logger.info("\nSTEP 3: Storing skill frequencies...")
    counter = aggregate_skills()
    store_skills(counter)

    # Step 4 — Run trend analysis
    logger.info("\nSTEP 4: Running trend analysis...")
    top = top_skills_overall()
    cat_skills = skills_by_category()
    skills_cooccurrence()
    scores = calculate_demand_score()
    save_insights(top, cat_skills, scores)

    # Done
    end = datetime.now()
    duration = (end - start).seconds
    logger.info("=" * 50)
    logger.info(f"PIPELINE COMPLETE in {duration} seconds")
    logger.info("=" * 50)

run_pipeline()