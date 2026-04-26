import prisma from "../lib/prisma";

export async function getDatasets(
    req: any,
    res: any
) {
    res.json([
        { label: "Dataset 1", value: "set1" },
        { label: "Dataset 2", value: "set2" }
    ]);
}

export async function getItems(
    req: any,
    res: any
) {

    const dataset =
        req.query.dataset as string;

    const items =
        await prisma.item.findMany({
            where: dataset
                ? { datasetType: dataset }
                : {},
            orderBy: {
                id: "desc"
            }
        });

    res.json(items);

}

export async function addItem(
    req: any,
    res: any
) {

    const {
        title,
        description,
        datasetType
    } = req.body;

    const item =
        await prisma.item.create({
            data: {
                title,
                description,
                datasetType
            }
        });

    res.json(item);

}