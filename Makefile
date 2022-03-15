#!make
include .env

$(eval export $(shell sed -ne 's/ *#.*$//; /./ s/=.*$$// p' .env))

identity-migration-create:
	MIGRATION_NAME=$(MIGRATION_NAME) CONNECTION_NAME=identity npm run typeorm:create

identity-migration-generate:
	MIGRATION_NAME=$(MIGRATION_NAME) CONNECTION_NAME=identity npm run typeorm:generate

organization-migration-generate:
	MIGRATION_NAME=$(MIGRATION_NAME) CONNECTION_NAME=organization npm run typeorm:generate

