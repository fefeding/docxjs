import { Part } from "../common/part";
import { type FontDeclaration, parseFonts } from "./fonts";

export class FontTablePart extends Part {
    fonts: FontDeclaration[] = [];

    parseXml(root: Element) {
        this.fonts = parseFonts(root, this._package.xmlParser);
    }
}