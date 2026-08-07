# 1. Use an official lightweight Python base image
FROM python:3.10-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy just the requirements file first (good for Docker caching caching)
COPY requirements.txt .

# 4. Install the python packages
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of your backend code into the container
COPY . .

# 6. Run the script when the container starts
CMD ["python", "app.py"]
