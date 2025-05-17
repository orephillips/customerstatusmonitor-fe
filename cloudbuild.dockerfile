# This is a wrapper Dockerfile for Cloud Build
# It simply copies everything from the current directory to /frontend
# and then runs the actual Dockerfile from there

FROM alpine as builder
WORKDIR /
COPY . /frontend/
WORKDIR /frontend
# This file will be used by Cloud Build to build your application
