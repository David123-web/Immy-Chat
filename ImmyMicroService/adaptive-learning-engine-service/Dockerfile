FROM python:3.10.13
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y --no-install-recommends ffmpeg
EXPOSE 4000
CMD python py_server.py