import React from "react"
import { Transformer } from "react-konva"

class TransformerWrap extends React.Component {
    // コンポーネントがクリックされたかチェックする
    componentDidMount() {
        this.checkNode();
    }
    componentDidUpdate() {
        this.checkNode();
    }

    // クリックされたかを検知する
    checkNode() {
        // stageの変更を感知する
        const stage = this.transformer.getStage();

        // 親からもらったClassNameを受け継ぐ
        const {selectedShapeName} = this.props;

        // もしClassNameが同じであれば、動かせるようにする
        var selectedNode = stage.findOne("." + selectedShapeName);
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