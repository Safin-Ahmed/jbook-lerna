import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import { OnChange } from "@monaco-editor/react";
import Resizable from "./resizeable";
import { Cell } from "../state";
import { useAction } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import "./code-cell.css";
import { useCumulativeCode } from "../hooks/useCumulativeCode";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useAction();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);
  console.log(cumulativeCode);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  const handleEditorChange: OnChange = (value = "", event) => {
    updateCell(cell.id, value);
    console.log("here is the current model value:", value);
  };
  return (
    <div>
      <Resizable direction="vertical">
        <div
          style={{
            height: "calc(100% - 10px)",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Resizable direction="horizontal">
            <CodeEditor
              onChange={handleEditorChange}
              initialValue={cell.content}
            />
          </Resizable>
          <div className="progress-wrapper">
            {!bundle || bundle.loading ? (
              <div className="progress-cover">
                <progress className="progress is-small is-primary" max="100">
                  Loading
                </progress>
              </div>
            ) : (
              <Preview code={bundle.code} err={bundle.err} />
            )}
          </div>
        </div>
      </Resizable>
    </div>
  );
};

export default CodeCell;
