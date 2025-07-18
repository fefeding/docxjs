import { Part } from "../common/part";
import { type ExtendedPropsDeclaration, parseExtendedProps } from "./extended-props";

export class ExtendedPropsPart extends Part {
    props: ExtendedPropsDeclaration = null as any;

    parseXml(root: Element) {
        this.props = parseExtendedProps(root, this._package.xmlParser);
    }
}