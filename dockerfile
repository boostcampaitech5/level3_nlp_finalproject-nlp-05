# Base image
FROM ubuntu:20.04
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Update packages and install dependencies
RUN apt-get update -y
RUN pip install --upgrade pip
COPY requirement.txt /app/requirement.txt
RUN pip3 install -r requirement.txt

# Set python alias
RUN touch /root/.bash_aliases
RUN if ! grep -q PYTHON_ALIAS_ADDED /root/.bash_aliases; then \
    echo "# PHTHON_ALIAS_ADDED" >> /root/.bash_aliases; \
    echo "alias python='python3'" >> /root/.bash_aliases; \
fi

# Expose port
EXPOSE 8000

# Start container
CMD ["/bin/bash"]