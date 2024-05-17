FROM python:3.12-slim
EXPOSE 8000
RUN pip install poetry
COPY . /backend
WORKDIR /backend
RUN poetry install --no-root
CMD poetry run uvicorn --host 0.0.0.0 app:app
