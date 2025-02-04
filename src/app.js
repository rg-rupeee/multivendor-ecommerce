const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const contextService = require("request-context");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/errorController");
const apiRouter = require("./api/index");

const app = express();

// CORS
app.use(cors());
app.options("*", cors());

// Set security HTTP headers
app.use(helmet());

// logging
app.use(morgan("dev"));

// Limit requests from same API
const limiter = rateLimit({
  max: 3600,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// wrap requests in the 'request' namespace
app.use(contextService.middleware("request"));

// ROUTES
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
