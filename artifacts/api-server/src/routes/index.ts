import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import servicesRouter from "./services";
import contentRouter from "./content";
import uploadRouter from "./upload";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(servicesRouter);
router.use(contentRouter);
router.use(uploadRouter);
router.use(contactRouter);

export default router;
