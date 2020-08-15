import { Application } from "express";
import { getItems } from "../external_queries/itemsList";

const withValue = (value: string | undefined) => (name: string) =>
  `value="${name}"${value === name ? " selected" : ""}`;

export default function (app: Application) {
  app.get("/", async (req, res) => {
    const answer = req.query.answer as string | undefined;
    const query = req.query.query as string | undefined;
    // TODO: validation
    const withOption = withValue(answer);
    let data: any | null = null;
    let error: string | null = null;
    if (answer || query) {
      try {
        data = await getItems(answer, query);
      } catch (err) {
        error = `Ошибка: ${JSON.stringify(err)}`;
        console.log(err);
      }
    }
    let table = "";
    if (error) {
      table = `<p style="color: red">${error}</p>`;
    } else if (data) {
      // TODO: add row rendering
      table = JSON.stringify(data);
    }
    const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ELIB-bibConverter</title>
</head>
<body>
    <h1>ELIB-bibConverter</h1>
    <form>
        <select id="answer" name="answer">
            <option></option>
            <option ${withOption("author")}>Author</option>
            <option ${withOption("title")}>Title</option>
            <option ${withOption("year")}>Year</option>
            <option ${withOption("bookID")}>BookID</option>
        </select>
        <input type="text" id="query" name="query"${
          query ? ` value="${query}"` : ""
        }>
        <input type="submit">
    </form>
    ${table}
</body>
</html>`;
    res.send(template);
  });
}
