import { GlobalProvider } from "./globalProvider";
import Home from "./components/home";
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
      <GlobalProvider>
        <div className="App">
            <Home/>
        </div>
      </GlobalProvider>
    </>
  );
}

export default App;
