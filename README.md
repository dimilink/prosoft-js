# Helm-chart для деплоя веб-приложения на Javascript (Задание №3)


## 🚀 Быстрый старт

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/dimilink/prosoft-js.git
cd prosoft-js
```

2. **Сборка образов:**
```bash
docker build \
  --target production \
  --no-cache \
  -t localhost/frontend:latest \
  ./frontend
```
```bash
docker build \
  --target production \
  --no-cache \
  -t localhost/backend:latest \
  ./backend
```

3. **Для локального кластера (например minikube) загрузите образы::**
```bash
minikube image load localhost/frontend:latest
minikube image load localhost/backend:latest
```
Или переключиться на контекст Docker в minikube:
```bash
eval $(minikube docker-env)
```
затем выполнить команды сборки образов.
> В реальном проекте у Kubernetes должен быть доступ к внешнему контейнерному реестру, например
> Docker Hub, GitHub Container Registry, Yandex Container Registry, Harbor, GitLab Registry и т.д.
В таком случае лучше не использовать тег `latest`, протегируйте образы, например следующим образом:
> 
`docker tag localhost/frontend:latest registry.example.com/project/frontend:v1.0.0`

 `docker tag localhost/backend:latest registry.example.com/project/backend:v1.0.0`
> 
> Отправьте в реестр
> 
 `docker push registry.example.com/project/frontend:v1.0.0`

 `docker push registry.example.com/project/backend:v1.0.0`
>Сделайте необходимые изменения в файле `values.yaml`

3. **Установка Helm-chart:**
* Базовая установка
```bash
helm install my-js-app ./javascript-chart \
  --set backend.cookieSecret="your-secret-value"
```
* C доступом через NodePort (например для отладки)
```bash
helm install my-js-app ./javascript-chart \
  --set nginx.nodePort.enabled=true \
  --set frontend.nodePort.enabled=true \
  --set backend.nodePort.enabled=true \
  --set backend.cookieSecret="your-secret-value"
```
> В реальном проекте для доступа к сервисам используется Ingress + TLS и вместо `cookieSecret` в values Kubernetes Secret + envFrom

4. **Проверка статуса подов:**
```bash
kubectl get pods -l app=my-js-app-nginx

kubectl get pods -l app=my-js-app-frontend

kubectl get pods -l app=my-js-app-backend
```
Все поды должны иметь статус RUNNING, READY 1/1 (по умолчанию).

5. **Удаление релиза приложения:**
```bash
helm uninstall my-js-app
```