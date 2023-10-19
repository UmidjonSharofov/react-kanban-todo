import {Route, Routes} from "react-router-dom";
import List from "./pages/List.jsx";
import Board from "./pages/Board.jsx";
import Header from "./components/Header/Header.jsx";

const App = () => {
  return (
    <>
      <Header/>
      <div className="container">
        <Routes>
          <Route path="/">
            <Route index element={<List/>}/>
            <Route path="board"  element={<Board/>}/>
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
