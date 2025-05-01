const express = require("express");
const designController=require("../controller/design-controller")
const router = express.Router();
const authenticatedRequest = require("../src/middleware/design-service");

router.use(authenticatedRequest);

router.get("/", designController.getUserDesigns);

router.get("/:id", designController.getUserDesignsByID);

router.post('/', designController.saveDesign);
router.delete("/:id", designController.deleteDesign);

module.exports = router;

