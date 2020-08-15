import { Application } from 'express';
import axios from 'axios';

const withValue = (value: string | undefined) => 
    (name: string) => `value="${name}"${ value === name ? ' selected' : ''}`;

export default function (app: Application) {
    app.get('/', async (req, res) => {
        const answer = req.query.answer as string | undefined;
        const query = req.query.query as string | undefined;
        const withOption = withValue(answer);
        let data: any[] | null | string = null;
        if (answer || query)
        try {
            const result = await axios.get('https://ruslan.library.spbstu.ru/rrs-web/db/BOOKS+SERIAL+ANALITS2005+ANALITS2009+AVD+SERETR+DISSER+EBOOKS+EDU+ERES+IVTOB+ICONOGRAPHY+TEU_AREF',
            {
                params: {
                    query: `cql.allIndexes all ${query}`,
                    queryType: 'cql',
                    startRecord: 1,
                    maximumRecords: 10,
                    recordSchema: 'gost-7.0.100-brief'
                }
            });
            data = result.data;
        } catch (error) {
            data = 'Ошибка запроса';
            console.log(error);
        }
        let table = '';
        if (data) {
            if (typeof(data) === "string") table = `<p>data</p>`;
            else {
                table = JSON.stringify(data);
            }
        }
        const template =
`<!DOCTYPE html>
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
            <option ${withOption('author')}>Author</option>
            <option ${withOption('title')}>Title</option>
            <option ${withOption('year')}>Year</option>
            <option ${withOption('bookID')}>BookID</option>
        </select>
        <input type="text" id="query" name="query"${query ? ` value="${query}"` : ''}>
        <input type="submit">
    </form>
    ${table}
</body>
</html>`;
        res.send(template);
    });
}