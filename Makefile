dk-build:
	docker build -f Dockerfile.users --tag users-service:latest --network host --compress .
	docker build -f Dockerfile.roles --tag roles-service:latest --network host --compress .
	docker build -f Dockerfile.nginx --tag proxy-service:latest --network host --compress .

dk-run:
	docker run --name users-service -p 3000:3000 --restart always --env-file ./services/users/.env -d users-service:latest
	docker run --name roles-service -p 3001:3001 --restart always --env-file ./services/roles/.env -d roles-service:latest
	docker run --name proxy-service -p 80:80 --restart always --link users-service --link  roles-service -d proxy-service:latest