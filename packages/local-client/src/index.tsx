import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from "./state";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import CellList from "./components/cell-list";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
