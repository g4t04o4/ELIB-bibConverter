import { Application } from "express";
import { getItems, ListItem } from "../external_queries/itemsList";

const withValue = (value: string | undefined) => (name: string) =>
  `value="${name}"${value === name ? " selected" : ""}`;

const renderFilter = (answer: string | undefined, query: string | undefined): string => {
  const withOption = withValue(answer);
  return `<form>
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
</form>`
} 

const renderRow = (item: ListItem) => {
  // TODO: improve row rendering
  return `<div class="row">${JSON.stringify(item)}</div>`;
}

const renderTable = (items: ListItem[] | null, error: string | null): string => {
  if (error) {
    return `<p style="color: red">${error}</p>`;
  } else if (items) {
    return items.map(renderRow).join('');
  } else {
    return "";
  }
}

const renderPage = (answer: string | undefined, query: string | undefined, items: ListItem[] | null, error: string | null) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ELIB-bibConverter</title>
  <style>
  .row { margin: 1em; }
  </style>
</head>
<body>
  <h1>ELIB-bibConverter</h1>
  ${renderFilter(answer, query)}
  ${renderTable(items, error)}
</body>
</html>`;

export default function (app: Application) {
  app.get("/", async (req, res) => {
    const answer = req.query.answer as string | undefined;
    const query = req.query.query as string | undefined;
    // TODO: validation
    let data: ListItem[] | null = null;
    let error: string | null = null;
    if (answer || query) {
      try {
        data = await getItems(answer, query);
      } catch (err) {
        error = `Ошибка: ${JSON.stringify(err)}`;
        console.log(err);
      }
    }
    const page = renderPage(answer, query, data, error);
    res.send(page);
  });
}
