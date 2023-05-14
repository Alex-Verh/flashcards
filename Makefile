up:
	docker-compose up -d
down:
	docker-compose down && docker network prune --force
init migrations:
	cd server && flask --app app db init && cd ..
migrate:
	cd server && flask --app app db migrate && flask --app app db upgrade && cd ..
run:
	flask --debug --app server.app run --host localhost --port 5000 
