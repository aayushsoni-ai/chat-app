import { Router } from "express";
import { getContactsForDmList, searchContacts ,getAllContacts} from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";

const contactRoutes = Router();

contactRoutes.post("/search",verifyToken,searchContacts);
contactRoutes.get("/get-contacts-for-dm",verifyToken,getContactsForDmList);
contactRoutes.get("/get-all-contacts",verifyToken,getAllContacts);

export default contactRoutes;