# Express Microservices

Example simple setup miroservices nodejs, using express framework + typescript + mongodb, if you want to deploy this app into your docker hub registry with your account, you must log in before push image into docker registry, typing in your terminal like this `docker login` and put your username and password, after login success, you must build this app into docker image, after build image container success, you can push this image into docker hub registry with your account, if you need free cloud database check here [Clever Cloud](https://www.clever-cloud.com).

<img src="Untitled Diagram.jpg"/>

## App Lifecycle Command

- **Single Install Dependency App Roles, Users Or Shared Libs**
```sh
$ npm run install:roles | npm run install:users | npm run install:shared
```

- **Single Build App Roles, Users Or Shared Libs**
```sh
$ npm run build:roles | npm run build:users | npm run build:shared
```

- **Single Run App Roles Or Users**
```sh
$ npm run dev:roles | npm run dev:users
```

- **Multiple Install Dependency App**
```sh
$ npm run install
```

- **Multiple Build App**
```sh
$ npm run build
```

- **Multiple Run App**
```sh
$ npm run dev
```

## Docker Lifecycle Command

- **Compose Up Container**
```sh
$ make dc-up
```

- **Compose Down Container**
```sh
$ make dc-down
```

- **Build Docker Image**
```sh
$ make dk-build
```

- **Deploy Docker Image**
```sh
$ make dk-deploy
```

## Kubernetes Lifecycle Command

- **Create Pod And Service**
```sh
$ make kb-create
```

- **Apply Ingress**
```sh
$ make kb-apply
```

- **Remove Pod And Service**
```sh
$ make dk-remove
```
