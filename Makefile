#!make
include .env

$(eval export $(shell sed -ne 's/ *#.*$//; /./ s/=.*$$// p' .env))

identity-migration-create:
	MIGRATION_NAME=$(MIGRATION_NAME) CONNECTION_NAME=identity npm run typeorm:create

identity-migration-generate:
	MIGRATION_NAME=$(MIGRATION_NAME) CONNECTION_NAME=identity npm run typeorm:generate

organization-writable-migration-generate:
	MIGRATION_NAME=$(MIGRATION_NAME) CONNECTION_NAME=organization-writable npm run typeorm:generate

organization-readable-migration-generate:
	MIGRATION_NAME=$(MIGRATION_NAME) CONNECTION_NAME=organization-readable npm run typeorm:generate
