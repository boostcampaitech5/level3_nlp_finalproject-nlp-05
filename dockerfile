# Base image
FROM pytorch/pytorch

# Set working directory
WORKDIR /code

# Update packages and install dependencies
RUN apt-get update && apt-get install -y init
COPY requirement.txt /code/requirement.txt
COPY setup.sh /code/setup.sh

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