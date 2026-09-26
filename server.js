const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler'); // ADDED: was missing entirely

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later' }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts, please try again later' }
});

app.use(cors());
app.use(express.json());
app.use(limiter);

// FIXED: loginLimiter now applied BEFORE authRoutes is mounted, so it actually
// intercepts /auth/login requests. Previously it was registered after authRoutes,
// which meant it never ran at all.
app.use('/auth/login', loginLimiter);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const companyRoutes = require('./routes/companyRoutes');
app.use('/companies', companyRoutes(io));

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// ADDED: centralized error handler — must be registered AFTER all routes,
// and BEFORE server.listen (order relative to listen doesn't matter, but
// it must come after every app.use(route) call above)
app.use(errorHandler);

// FIXED: moved to the true end of the file — was previously sandwiched in the
// middle, which happened to still work but made execution order confusing
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});