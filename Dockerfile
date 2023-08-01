# Base image for Python dependencies
FROM python:3.8 as python-base

# Set working directory
WORKDIR /app

# ARG SECRET_KEY

# ARG DATABASE_URL

# ARG MAIL_SERVER
# ARG MAIL_PORT
# ARG MAIL_PASSWORD

# ARG AWS_REGION_NAME
# ARG AWS_ACCESS_KEY_ID
# ARG AWS_SECRET_ACCESS_KEY
# ARG AWS_BUCKET_NAME

ARG PORT=8080
ENV PORT=8080

ENV FLASK_APP=app
ENV FLASK_ENV=production

COPY server/requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y ffmpeg --fix-missing

COPY server/ server/

WORKDIR /app/server

RUN flask --app ${FLASK_APP} db init
RUN flask --app ${FLASK_APP} db migrate
RUN flask --app ${FLASK_APP} db upgrade


# Base image for Node.js dependencies
FROM node:14-alpine as node-base

# Set working directory
WORKDIR /app

# Copy webpack configuration file
COPY client/package.json .

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY client/ .

RUN npm run build

# Merge Python and Node.js base images
FROM python-base as final-python
COPY --from=node-base /app/dist/static /app/server/app/static
COPY --from=node-base /app/dist/templates /app/server/app/templates

# Expose the Flask application port
EXPOSE ${PORT}

# Start the Flask application
CMD flask --app ${FLASK_APP} run --host 0.0.0.0 --port ${PORT}