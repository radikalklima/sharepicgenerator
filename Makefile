up:
	docker-compose up -d

stop:
	docker-compose stop

build:
	docker-compose up --build -d &&	chmod 777 code/dist/log/ code/dist/persistent/user/ code/dist/tmp/ code/dist/tenants/federal/gallery/img/

install:
	docker-compose run node sh -c 'npm install'

node-shell:
	docker-compose exec node bash

compile:
	docker-compose exec node npm run build:dev

log:
	docker-compose logs -f --tail 20 node

shell:
	docker-compose exec webserver bash

down:
	docker-compose down

test:
	cd tests && URL=http://webserver LOCAL=true python3 test.py

test-live:
	cd tests && URL=https://sharepicgenerator.de LOCAL=true python3 test.py

test-develop:
	cd tests && URL=https://develop.sharepicgenerator.de LOCAL=true python3 test.py

doc:
	docker-compose exec mkdocs mkdocs build

checkstyle:
	phpcs -s code/dist/

fixstyle:
	phpcbf code/dist/

phplint:
	docker run -it --rm overtrue/phplint:latest

composer-install:
	composer install

deploy-develop:
	php vendor/bin/dep deploy develop

deploy-production:
	php vendor/bin/dep deploy production

rollback:
	php vendor/bin/dep rollback production

clean:
	rm code/dist/tmp/* -rf

eslint:
	cd code && npx eslint build --ext .js,.jsx,.ts,.tsx

log-get:
	rsync sharepic:/var/www/sharepicgenerator.de/shared/log/logs/log.db code/dist/log/logs/log.db

log-read:
	docker-compose exec webserver sqlite3 dist/log/logs/log.db
