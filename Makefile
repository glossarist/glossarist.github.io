SHELL := /bin/bash

all: _site

clean:
	rm -rf _site _concepts

_site: | bundle
	bundle exec jekyll build

bundle:
	bundle

serve:
	bundle exec jekyll serve

update-init:
	git submodule update --init

update-modules:
	git submodule foreach git pull origin master

.PHONY: bundle all open serve clean update-init update-modules
