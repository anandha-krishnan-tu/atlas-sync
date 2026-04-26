import express from "express";

import {
    getDatasets,
    getItems,
    addItem
}
    from "../controllers/item.controller";

const router =
    express.Router();

router.get(
    "/datasets",
    getDatasets
);

router.get(
    "/",
    getItems
);

router.post(
    "/",
    addItem
);

export default router;