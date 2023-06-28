# Base image for Python dependencies
FROM python:3.9-alpine as python-base

# Set working directory
WORKDIR /app

ARG SECRET_KEY

ARG DB_URL

ARG MAIL_SERVER
ARG MAIL_PORT
ARG MAIL_PASSWORD

ARG AWS_REGION_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_BUCKET_NAME

ARG PORT

ENV FLASK_APP=app
ENV FLASK_ENV=production

COPY server/requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY server .


# Base image for Node.js dependencies
FROM node:14-alpine as node-base

# Set working directory
WORKDIR /app

# Copy webpack configuration file
COPY webpack.config.js .

# Copy frontend source code
COPY frontend/ frontend/

# Install frontend dependencies
RUN npm install --prefix frontend


# Merge Python and Node.js base images
FROM python-base as final-python
COPY --from=node-base /app/frontend /app/frontend

# Expose the Flask application port
EXPOSE 5000

# Start the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]