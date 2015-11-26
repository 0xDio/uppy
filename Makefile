SHELL          := /usr/bin/env bash
ghpages_repo   := "transloadit/uppy"
ghpages_branch := "gh-pages"

.PHONY: all
all: install build deploy

.PHONY: install
install:
	@echo "--> Installing dependencies.."
	cd website && npm install

.PHONY: build-site
build-site:
	@echo "--> Building site.."
	cd website && ./node_modules/.bin/hexo generate

.PHONY: build
build: build-site
	@echo "--> Building all.."
	@echo "Done :)"

.PHONY: pull
pull:
	@echo "--> Running pull.."
	@git pull

.PHONY: preview
preview: install build
	@echo "--> Running preview.."
	cd website && ./node_modules/.bin/hexo server

.PHONY: deploy
deploy: pull build
	@echo "--> Deploying to GitHub pages.."
	@mkdir -p /tmp/deploy-$(ghpages_repo)

	# Custom steps
	@rsync \
    --archive \
    --delete \
    --exclude=.git* \
    --exclude=node_modules \
    --exclude=lib \
    --itemize-changes \
    --checksum \
    --no-times \
    --no-group \
    --no-motd \
    --no-owner \
	./website/public/ /tmp/deploy-$(ghpages_repo)

	@echo 'This branch is just a deploy target. Do not edit. You changes will be lost.' > /tmp/deploy-$(ghpages_repo)/README.md

	@cd /tmp/deploy-$(ghpages_repo) \
	  && git init && git checkout -B $(ghpages_branch) && git add --all . \
	  && git commit -nm "Update $(ghpages_repo) _site by $${USER}" \
	  && (git remote add origin git@github.com:$(ghpages_repo).git || true)  \
	  && git push origin $(ghpages_branch):refs/heads/$(ghpages_branch) --force

	@rm -rf /tmp/deploy-$(ghpages_repo)
