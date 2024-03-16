FROM python:3.12-slim
EXPOSE 8000
COPY . /backend
WORKDIR /backend
RUN pip install -r requirements.txt
CMD uvicorn --host 0.0.0.0 app:app
