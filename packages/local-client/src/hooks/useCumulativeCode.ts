import { useTypedSelector } from "./useTypedSelector";

export const useCumulativeCode = (cellId: string) => {
  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    const showFunc = `
      import _React from "react";
      import _ReactDOM from "react-dom";
      var show = (input) => {
        const root = document.getElementById("root");
        if(typeof(input) === 'object') {
          if (input.$$typeof && input.props) {
            _ReactDOM.render(input, root);
          }
          else {
            root.innerHTML = JSON.stringify(input);
          }
          
          return;
        }
        root.innerHTML = input;
      }  
    `;

    const showFuncNoOp = "var show = () => {}";
    const cumulativeCode = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoOp);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }

    return cumulativeCode;
  });

  return cumulativeCode.join("\n");
};
