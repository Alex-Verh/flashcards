up:
	docker-compose up -d
down:
	docker-compose down && docker network prune --force
init migrations:
	cd server && flask --app app db init && cd ..
migrate:
	cd server && pipenv run flask --app app db migrate && pipenv run flask --app app db upgrade && cd ..
backend:
	cd server && pipenv run flask --debug --app app run --host localhost --port 5000 && cd ..
frontend:
	cd client && npm run build:flask:dev && cd ..
run:
	make backend & make frontend