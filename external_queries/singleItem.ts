import axios from "axios";

export type ItemMetainfo = {};

type ItemResponse = {
  info: ItemMetainfo
};

export const getItem = async (id: string): Promise<ItemMetainfo> => {
  // TODO: use request from postman
  const result = await axios.get<ItemResponse>(
    "https://ruslan.library.spbstu.ru/rrs-web/db/BOOKS+SERIAL+ANALITS2005+ANALITS2009+AVD+SERETR+DISSER+EBOOKS+EDU+ERES+IVTOB+ICONOGRAPHY+TEU_AREF",
    {
      params: {
        query: `cql.allIndexes all ${id}`,
        queryType: "cql",
        startRecord: 1,
        maximumRecords: 10,
        recordSchema: "gost-7.0.100-brief",
      },
    }
  );
  return result.data.info;
};
