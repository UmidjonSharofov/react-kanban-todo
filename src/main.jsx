import ReactDOM from 'react-dom/client'
import App from './App'
import '../src/styles/main.scss'
import {BrowserRouter} from "react-router-dom";
import {store} from "./redux/store.js";
import {Provider} from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <App/>
      </Provider>
    </BrowserRouter>
  </>,
)
