[How to Run](#how-to-run)

- `pnpm install`
- `pnpm dev`
- api should be running on `http://localhost:3001`
- frontend should be running on `http://localhost:3000`

[The "Why"](#the-why): Explain your concurrency strategy and why you chose it.

- When a user is selecting their seat, they mark it as reserved for 2 minutes. If they don't complete the checkout process within 2 minutes, the seat is released and made available to other users.
- Only one user can reserve a seat at a time. If a user tries to reserve a seat that is already reserved, they will be shown an error message.
- When a user completed their checkout process, their seat is marked as booked.

[Trade-offs](#trade-offs): Briefly mention what you would improve if this were a real production system.

- Because this was a take home, I didn't want to spend too much time making it too complex.

- If I were to build this for a real production system, i would have integrated with a payment provider such as Stripe and use Stripe checkout sessions and Stripe webhooks to handle the updating of the seat status (to booked if payment is successful or available if payment failed).
- I would have added a caching layer to the api to reduce the number of compute intensive operations on the database. For example adding a Reddis cache for:
  - The seating selections and make it update every 10 seconds. (The system already handles latency between when the frontend makes a request and the user selecting their seat)
  - Event details and make it update every 10 minutes.
- Add testing to identify issues before they arise.
- Add monitoring and logging to the system so when errors arise, they are logged and can be investigated.
