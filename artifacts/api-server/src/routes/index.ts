import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import servicesRouter from "./services";
import contentRouter from "./content";
import uploadRouter from "./upload";
import contactRouter from "./contact";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(servicesRouter);
router.use(contentRouter);
router.use(uploadRouter);
router.use(contactRouter);
router.use("/ai", aiRouter);

export default router;
