import axios from "axios";

export type ListItem = {
  // TODO: add type
};

type ItemsResponse = {
  numberOfRecords: number;
  records: {
    record: ListItem[];
  };
};

const answersToIndices = (answer: string | undefined): string => {
  switch (answer) {
    case "author":
      return "dc.creator";
    case "title":
      return "dc.title";
    case "year":
      return "bib.dateIssued";
    case "bookID":
      return "dc.identifier";
    default:
      return "cql.allIndexes";
  }
};

export const getItems = async (
  answer: string | undefined,
  query: string | undefined
): Promise<ListItem[]> => {
  // TODO: pagination
  const result = await axios.get<ItemsResponse>(
    "https://ruslan.library.spbstu.ru/rrs-web/db/BOOKS+SERIAL+ANALITS2005+ANALITS2009+AVD+SERETR+DISSER+EBOOKS+EDU+ERES+IVTOB+ICONOGRAPHY+TEU_AREF",
    {
      params: {
        query: `${answersToIndices(answer)} all ${query}`,
        queryType: "cql",
        startRecord: 1,
        maximumRecords: 10,
        recordSchema: "gost-7.0.100-brief",
      },
    }
  );
  return result.data.records && result.data.records.record
    ? result.data.records.record
    : [];
};
