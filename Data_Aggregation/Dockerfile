FROM python:3
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY processor.py /usr/src/app/
RUN pip install pymongo
CMD [ "python", "./processor.py" ]