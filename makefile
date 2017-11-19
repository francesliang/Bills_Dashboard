dev:
	python ./manage.py runserver

ui:
	npm run build

celery:
	celery -A billsdashboard  worker --loglevel=info -B
