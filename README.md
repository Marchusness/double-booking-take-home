## Folder Structure

/apps/api - Express server

/apps/frontend - Next.js frontend

/packages/common - Shared types and utilities

## Important Assumptions

- I didn't want to deploy anything to the cloud for a take home so kept everything local. (assume everything stored in memory or locally would have been deployed to the cloud)
  - Each route in the express server would have been deployed to a lambda function.
  - I would have deployed a postgres db to something like RDS.
  - The checkout queue would be a real queue like sqs.
  - the checkout sessions would be stored in a key value store like dynamo.

## How to Run

- `pnpm install`
- `pnpm dev`
- api should be running on `http://localhost:3001`
- frontend should be running on `http://localhost:3000`

## The "Why"

- When a user is selecting their seat, they mark it as reserved until the end of their checkout process. If they don't complete the checkout, the seat is released and made available to other users.
- Only one user can reserve a seat at a time. If a user tries to reserve a seat that is already reserved, they will be shown an error message.
- When a user completed their checkout process, their seat is marked as booked.

## Trade-offs

- Because this was a take home, I didn't want to spend too much time making it too complex and tried to keep to 6 hours of work.

- I would have added a ORM like drizzle to the database layer for better type safety and to reduce the amount of boilerplate code. but didn't include it in this take home as I didn't want to take up some of the 6 hour time limit on learning an ORM.

- If I were to build this for a real production system, i would have integrated with a payment provider such as Stripe and use Stripe checkout sessions and Stripe webhooks to handle the updating of the seat status (to booked if payment is successful or available if payment failed).
- I would have added a caching layer to the api to reduce the number of compute intensive operations on the database. For example adding a Reddis cache for:
  - The seating selections - 10 seconds cache. (A small update to the code would be required. The attempt claim seat will need to always return the seat and the frontend would have to use that seat in the seating plan.)
  - Event details - 10 minutes cache.
- Add rate limiting to the api to prevent abuse.

- Right now the system rate limits the number of users in the checkout process to 1 users per second (so it can be tested locally). If more than 1 user tries to checkout at the same time, they will be put in a queue.

  - The rate limit is for the whole system. so if there's a popular event the whole system will be rate limited.

- Add testing to identify issues before they arise.
- Add monitoring and logging to the system so when errors arise, they are logged and can be investigated.
