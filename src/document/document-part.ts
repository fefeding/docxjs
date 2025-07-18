import { OpenXmlPackage } from "../common/open-xml-package";
import { Part } from "../common/part";
import { DocumentParser } from "../document-parser";
import type { DocumentElement } from "./document";

export class DocumentPart extends Part {
    private _documentParser: DocumentParser;

    constructor(pkg: OpenXmlPackage, path: string, parser: DocumentParser) {
        super(pkg, path);
        this._documentParser = parser;
    }
    
    body: DocumentElement = null as any;

    parseXml(root: Element) {
        this.body = this._documentParser.parseDocumentFile(root);
    }
}