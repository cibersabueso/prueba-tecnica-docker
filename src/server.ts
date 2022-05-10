import http from "http";

import express from "express"

import logging from "./config/logging";
import config from "./config/config";
import { startConnection } from "./config/database";
import { exchangeRequestRoutes, userRoutes } from "./api/routes";

const NAMESPACE = "Server TipoCambio";
const router = express();

//initializa DB
startConnection();

//------------------

/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );
  
    res.on("finish", () => {
      /** Log the res */
      logging.info(
        NAMESPACE,
        `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
      );
    });
  
    next();
  });

  /** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Rules of our API */
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //TODO: cambiar luego
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  
    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
  
    next();
  });

//Fin de rules---------------------

//---------------------Routes------------------
router.use("/user", userRoutes);
router.use("/exchange_request", exchangeRequestRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error("Not found");
  
    res.status(404).json({
      message: error.message,
    });
  });

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => {
    logging.info(
      NAMESPACE,
      `Server is running ${config.server.hostname}:${config.server.port}`
    );
  });