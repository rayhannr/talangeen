# Talangeen

Talangeen is a small client-side app to track shared expenses and automatically compute how much each person in a group owes or is owed. It's useful for trips, dinners, or any shared cost scenario where different people pay for different transactions.

What the app does

- Let you define group members.
- Record transactions: payer, amount, description and which members are included (split).
- Compute per-member net balances (what each person paid minus what they owe).
- Show a summary of who should pay whom to settle debts (simplified settlement view).

How it models things (high level)

- Member: a person in the group.
- Transaction: an expense with a payer, an amount, optional description and a set of participants who share the cost.
- Balances: for each member, sum(payments they made) − sum(share of costs they owe). The app computes these sums and derives settlement suggestions.

Tech stack

- React
- TypeScript
- Vite

Run locally

1. Install dependencies: npm install
2. Start the dev server: npm run dev (some projects may also support `npm start`; if `npm start` is configured it works as well)
3. Open the app in your browser (Vite defaults to a different port than 3000, commonly 5173). Check the console output for the exact URL.

Project structure (typical)

- src/
  - components/ — UI components (member list, transaction form, summary)
  - pages/ — main views
  - hooks/ — reusable logic
  - types/ — shared TypeScript types (Member, Transaction, Balance)
  - utils/ — calculation helpers (net balance, settlement algorithm)

Development notes

- Core logic is the balance calculation for members and the settlement suggestion algorithm — look for utilities that sum payer amounts and split transactions among participants.
- If you change data models (Transaction/Member), update corresponding types and calculation helpers.
- Tests (if present) are helpful around the balance and settlement logic.

Contributing

- Open an issue or a PR describing the change and why it's needed.
- Keep changes focused and add tests for calculation logic where applicable.
