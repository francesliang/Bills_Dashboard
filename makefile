dev:
	python manage.py collectstatic
	python ./manage.py runserver 0.0.0.0:8000

ui:
	npm run build

celery:
	# redis-server --daemonize yes
	celery -A billsdashboard  worker --loglevel=info -B
