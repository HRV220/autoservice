const Router = require("express");
const clientController = require("../controllers/clientController");
const router = new Router();

router.post("/", clientController.create);
router.get("/", clientController.getAll);

// ============== НОВЫЙ РОУТ ==============
// Важно, чтобы он был после '/', иначе 'getOne' будет срабатывать на все.
// Хотя в данном случае неважно, но это хорошая практика.
router.get("/:id", clientController.getOne);

module.exports = router;
