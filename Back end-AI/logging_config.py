import logging
import os

if not os.path.exists("logs"):
    os.makedirs("logs")

log_format = logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")


file_handler = logging.FileHandler("logs/chef_ai.log")
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(log_format)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(log_format)

logger = logging.getLogger("chef-ai")
logger.setLevel(logging.INFO)

logger.addHandler(file_handler)
logger.addHandler(console_handler)
