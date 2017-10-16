# Use an official Python runtime as a parent image
FROM python:2.7

# Set the working directory to /app
RUN mkdir /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Run webpack config for the front-end
FROM node:latest
WORKDIR /app
COPY package.json /app/
COPY webpack.config.js /app/
RUN npm install
RUN npm install webpack
RUN npm run build

# Make port 80 available to the world outside this container
#EXPOSE 80

# Define environment variable
#ENV NAME World

# Run app.py when the container launches
#CMD ["python", "app.py"]
