import { ItemMetainfo } from "../../external_queries/singleItem";

type RecordDescriptorType = {
  required: string[];
  optional: string[];
};
const records: Record<string, RecordDescriptorType> = {
  ARTICLE: {
    required: ["author", "title", "journal", "year"],
    optional: ["volume", "number", "pages", "month", "note", "key"],
  },
  BOOK: {
    required: ["author", "title", "publisher", "year"], // TODO: support author/editor as union
    optional: [
      "volume",
      "series",
      "address",
      "edition",
      "month",
      "note",
      "key",
      "pages",
    ],
  },
  BOOKLET: {
    required: ["title"],
    optional: [
      "author",
      "howpublished",
      "address",
      "month",
      "year",
      "note",
      "key",
    ],
  },
  INBOOK: {
    required: ["author", "title", "pages", "publisher", "year"], // TODO: support author/editor as union + chapter/pages 
    optional: [
      "volume",
      "series",
      "address",
      "edition",
      "month",
      "note",
      "key",
    ],
  },
  INCOLLECTION: {
    required: ["author", "title", "booktitle", "year"],
    optional: [
      "editor",
      "pages",
      "organization",
      "publisher",
      "address",
      "month",
      "note",
      "key",
    ],
  },
  INPROCEEDINGS: {
    required: ["author", "title", "booktitle", "year"],
    optional: [
      "editor",
      "series",
      "pages",
      "organization",
      "publisher",
      "address",
      "month",
      "note",
      "key",
    ],
  },
  MANUAL: {
    required: ["title"],
    optional: [
      "author",
      "organization",
      "address",
      "edition",
      "month",
      "year",
      "note",
      "key",
    ],
  },
  MASTERSTHESIS: {
    required: ["author", "title", "school", "year"],
    optional: ["address", "month", "note", "key"],
  },
  MISC: {
    required: [],
    optional: [
      "author",
      "title",
      "howpublished",
      "month",
      "year",
      "note",
      "key",
    ],
  },
  PHDTHESIS: {
    required: ["author", "title", "school", "year"],
    optional: ["address", "month", "note", "key"],
  },
  PROCEEDINGS: {
    required: ["title", "year"],
    optional: [
      "editor",
      "publisher",
      "organization",
      "address",
      "month",
      "note",
      "key",
    ],
  },
  TECHREPORT: {
    required: ["author", "title", "institution", "year"],
    optional: ["type", "number", "address", "month", "note", "key"],
  },
  UNPUBLISHED: {
    required: ["author", "title", "note"],
    optional: ["month", "year", "key"],
  },
};

const enum FieldTypes {
  address, // Адрес издателя (обычно просто город, но может быть полным адресом для малоизвестных издателей)
  annote, // (в JabRef — abstract): Аннотация для библиографической записи.
  author, // Имена авторов (если больше одного, то разделяются and)
  booktitle, // Наименование книги, содержащей данную работу.
  chapter, // Номер главы
  crossref, // Ключ кросс-ссылки (позволяет использовать другую библио-запись в качестве названия, например, сборника трудов)
  edition, // Издание (полная строка, например, «1-е, стереотипное»)
  editor, // Имена редакторов (оформление аналогично авторам)
  eprint, // A specification of an electronic publication, often a preprint or a technical report
  howpublished, // Способ публикации, если нестандартный
  institution, // Институт, вовлечённый в публикацию, необязательно издатель
  journal, // Название журнала, содержащего статью
  key, //Скрытое ключевое поле, задающее порядок сортировки (если «author» и «editor» не заданы).
  month, // Месяц публикации (может содержать дату). Если не опубликовано — создания.
  note, // Любые заметки
  number, // Номер журнала
  organization, // Организатор конференции
  pages, // Номера страниц, разделённые запятыми или двойным дефисом. Для книги — общее количество страниц.
  publisher, // Издатель
  school, // Институт, в котором защищалась диссертация.
  series, // Серия, в которой вышла книга.
  title, // Название работы
  type, // Тип отчёта, например «Заметки исследователя»
  url, // WWW-адрес
  volume, // Том журнала или книги.
  year, // Год публикации (если не опубликовано — создания)
}

const getBibtexName = (item: ItemMetainfo): string => {
  // TODO: implement
  return "";
};
const mapFields = (item: ItemMetainfo): Record<string, string> => {
  // TODO: implement
  /* should return record like this { address: "some address", annote: ... } */
  return {};
};

export function convert(item: ItemMetainfo): string {
  const recordName = getBibtexName(item);
  const descriptor = records[recordName];
  if (!descriptor) throw Error(`Unknown format: ${recordName}`);
  const fields = mapFields(item);

  const requiredFieldsFailures = descriptor.required.filter(
    (element) => !fields[element]
  );
  if (requiredFieldsFailures.length !== 0)
    throw Error(
      `Required field(s) not found: ${requiredFieldsFailures.join()}`
    );

  const fieldValuesMap: Record<string, string> = {};
  descriptor.required.forEach((name) => {
    fieldValuesMap[name] = fields[name];
  });
  descriptor.optional.forEach((name) => {
    const value = fields[name];
    if (value) fieldValuesMap[name] = value;
  });

  return `@${recordName}{tag,
    ${Object.entries(fieldValuesMap).map(([key, value]) => `${key} = ${value},\n`).join()}
    lang=ru\n}`;
}
