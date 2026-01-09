FROM python:3.11-slim

WORKDIR /app

# Install required Python packages
RUN pip install --no-cache-dir requests python-dotenv

# Copy cron job code
COPY python_script/cron_job.py .

# Run the polling job
CMD ["python", "cron_job.py"]
