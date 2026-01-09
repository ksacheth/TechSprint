FROM python:3.11-slim

# Install system dependencies for OpenCV and MediaPipe
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY drowning_v2/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY drowning_v2/ .

RUN mkdir -p videos

CMD ["python", "main.py"]
