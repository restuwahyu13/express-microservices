dk-build:
	docker build -f ./docker/Dockerfile.users --tag users-service:latest --network host --compress .
	docker build -f ./docker/Dockerfile.roles --tag roles-service:latest --network host --compress .
	docker build -f ./docker/Dockerfile.nginx --tag proxy-service:latest --network host --compress .
	docker tag users-service:latest 705471/users-service:latest
	docker tag roles-service:latest 705471/roles-service:latest
	docker tag proxy-service:latest 705471/proxy-service:latest

dk-deploy:
	docker push 705471/users-service:latest
	docker push 705471/roles-service:latest
	docker push 705471/proxy-service:latest

dk-run:
	docker run --name users-service -p 3000:3000 --restart always --env-file ./services/users/.env -d 705471/users-service:latest
	docker run --name roles-service -p 3001:3001 --restart always --env-file ./services/roles/.env -d 705471/roles-service:latest
	docker run --name proxy-service -p 80:80 --restart always --link users-service --link  roles-service -d 705471/proxy-service:latest

dc-up:
	docker-compose up -d --remove-orphans --build

dc-down:
	docker-compose down

kb-create:
	kubectl create -f ./kubernetes/service.yml

kb-apply:
	kubectl apply -f ./kubernetes/ingress.yml

kb-delete:
	kubectl delete -f ./kubernetes/service.yml