import { Application } from "express";
import { getItem } from "../external_queries/singleItem";
import { convertFormat } from './formats'

export default function (app: Application) {
    app.get("/:id", async (req, res) => {
        const format = req.query.format as string;
        const id = req.params.id as string;
        // TODO: validation
        try {
            const item = await getItem(id);
            const bibliography = convertFormat(item, format);
            res.send(bibliography);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    });
}