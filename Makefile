current_user  := $(shell id -u)
current_group := $(shell id -g)

BUILD_DIR     := $(PWD)
TMPDIR        := $(BUILD_DIR)/tmp
NPM_FLAGS     := --prefer-offline

NODE_IMAGE    := node:14

install:
	-mkdir -p $(TMPDIR)/home
	-echo "node:x:$(current_user):$(current_group)::/var/nodehome:/bin/bash" > $(TMPDIR)/passwd
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/data:delegated -w /data -v $(TMPDIR)/home:/var/nodehome:delegated -v $(TMPDIR)/passwd:/etc/passwd $(NODE_IMAGE) npm install $(NPM_FLAGS)

update:
	-mkdir -p $(TMPDIR)/home
	-echo "node:x:$(current_user):$(current_group)::/var/nodehome:/bin/bash" > $(TMPDIR)/passwd
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/data:delegated -v $(TMPDIR)/home:/var/nodehome:delegated -v $(TMPDIR)/passwd:/etc/passwd $(NODE_IMAGE) npm update $(NPM_FLAGS)

audit-fix:
	-mkdir -p $(TMPDIR)/home
	-echo "node:x:$(current_user):$(current_group)::/var/nodehome:/bin/bash" > $(TMPDIR)/passwd
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/data:delegated -w /data/skins/laika -v $(TMPDIR)/home:/var/nodehome:delegated -v $(TMPDIR)/passwd:/etc/passwd $(NODE_IMAGE) npm audit fix $(NPM_FLAGS)

build:
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/data:delegated -w /data/skins/laika -e NO_UPDATE_NOTIFIER=1 $(NODE_IMAGE) npm run build

ci:
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/code -w /code -e NO_UPDATE_NOTIFIER=1 $(NODE_IMAGE) npm run ci

.PHONY: install update audit-fix build ci