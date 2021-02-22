import React from "react"
import { Transformer } from "react-konva"

class TransformerWrap extends React.Component {
    componentDidMount() {
        this.checkNode();
    }
    componentDidUpdate() {
        this.checkNode();
    }

    checkNode() {
        const stage = this.transformer.getStage();

        const {selectedShapeName} = this.props;

        let selectedNode = stage.findOne("." + selectedShapeName);
        if (selectedNode === this.transformer.node()) {
            return;
        }
        if (selectedNode) {
            const type = selectedNode.getType();
            if (type != "Group") {
                selectedNode = selectedNode.findAncestor("Group");
            }
            this.transformer.attachTo(selectedNode);
        } else {
            this.transformer.detach();
        }
        this.transformer.getLayer().batchDraw();
    }
    render() {
        return (
            <Transformer
                ref={node => {
                    this.transformer = node;
                }}
            />
        );
    }
}

export default TransformerWrap