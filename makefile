dev:
	python ./manage.py runserver

ui:
	npm run build

celery:
	# redis-server --daemonize yes
	celery -A billsdashboard  worker --loglevel=info -B
