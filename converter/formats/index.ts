import { ItemMetainfo } from "../../external_queries/singleItem";
import { convert as apa } from './apa';
import { convert as bibtex } from './bibtex';
import { convert as csl } from './csl';
import { convert as harvard } from './harvard';
import { convert as ris } from './ris';

type Converter = (item: ItemMetainfo) => string;

const formats: Record<string, Converter> = {
    apa,
    bibtex,
    csl,
    harvard,
    ris
};

export function convertFormat(item: ItemMetainfo, format: string): string {
    const converter = formats[format];
    if (!converter) return "";
    const result = converter(item);
    return result;
}