import { Part } from "../common/part";
import { type CorePropsDeclaration, parseCoreProps } from "./core-props";

export class CorePropsPart extends Part {
    props: CorePropsDeclaration = null as any;

    parseXml(root: Element) {
        this.props = parseCoreProps(root, this._package.xmlParser);
    }
}