import express from "express"
import { deleteRequest, getAllRequests, getRequest, postRequest } from "../controllers";
import { jwtVerify } from "../middlewares/jwtVerify";

const router = express.Router();

router.get("/", jwtVerify, getAllRequests);
router.get("/:idRequest", jwtVerify, getRequest);
router.post("/", jwtVerify, postRequest);
router.delete("/:idRequest", jwtVerify, deleteRequest);

//router.get("/:patient", getAppointmentsByUser);

export default router;