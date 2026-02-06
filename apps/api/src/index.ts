import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.middleware';

// Route Imports
import { listEventsRouter } from './routes/list-events';
import { eventDetailsRouter } from './routes/event-details';
import { tryEnterCheckoutRouter } from './routes/try-enter-checkout';
import { attemptClaimSeatRouter } from './routes/attempt-claim-seat';
import { checkoutRouter } from './routes/checkout';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Simulated Auth Middleware
app.use(authMiddleware);

// Routes
app.use('/api/events', listEventsRouter);
app.use('/api/event-details', eventDetailsRouter);
app.use('/api/try-enter-checkout', tryEnterCheckoutRouter);
app.use('/api/attempt-claim-seat', attemptClaimSeatRouter);
app.use('/api/checkout', checkoutRouter);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
