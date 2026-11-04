# EnziVolt Service Platform — Version Release Notes

## Release train

- v1.1 Customer Portal: Supabase Auth registration/login, customer profile, new service requests, request history and current status.
- v1.2 Technician Portal: registration/login, technician profile, assigned jobs, assignment acceptance/decline, status updates and work history.
- v1.3 Administration Dashboard: request intake, technician approval and assignment, request review and operational oversight.
- v1.4 Work Tracking: assignment acknowledgements, status history and technician completion reports.
- v1.5 Communication: request-scoped customer/technician messages, notifications and administrator monitoring.
- v2.0 Integrated Service Management Platform: end-to-end release after all five versions pass acceptance tests.

## Non-regression policy

The currently approved live version remains unchanged. Work is developed on a separate feature branch. No production database migration, merge to the default branch, or live deployment is permitted until isolated validation and acceptance checks pass. Existing EnziVolt branding, Lighting Bold Cat logo, homepage, and unrelated modules must remain intact.

## Current implementation evidence

- Existing Customer, Technician and Administration routes already load a shared Supabase-backed portal.
- Existing database includes customer and technician profiles, service requests, technician assignments, service messages, admin memberships, audit log and an automation outbox.
- Existing RLS policies enforce authenticated ownership/participant checks and administrator access for core request workflows.
- Added a draft additive SQL migration for technician work reports and per-user notifications, including participant-scoped read access and database-generated notification events for assignment and message/status changes.
- Migration is committed on `feature/service-platform-v1-1` and is not applied to production.

## Validation still required

1. Create an isolated Supabase development branch and apply the migration there.
2. Run Supabase security/performance advisors and verify all grants, RLS policies, triggers and Realtime publication membership.
3. Finish portal UI integration for customer profile management, technician work reports/history, notification inbox and administrator message monitoring.
4. Run end-to-end tests with separate customer, technician and admin test accounts; verify cross-account data isolation.
5. Confirm the GitHub Pages preview and all workflows.
6. Only after sign-off, merge and publish the version; retain rollback commit and prior live version.

## Known release blocker

Supabase development branch creation requires the account's organization ID and cost confirmation. Until an isolated database is available, the new migration must remain a draft and must not be applied to the live project.
