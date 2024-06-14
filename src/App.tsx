import Map from "./Map";
import logo from "./assets/images/logo.png";
function App() {
  return (
    <>
      <div className="absolute z-10 top-0 left-0 w-1/5">
        <div className="flex flex-col p-2 gap-2">
          <div className="bg-white p-4 rounded-lg card">
            <div className="flex gap-3 items-center">
              <img src={logo} alt="Jotihunt Tracker" className="w-12" />
              <div>
                <h1 className="text-xl font-bold">Jotihunt Tracker</h1>
                <h2>Scouting Scherpenzeel e.o.</h2>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg card">
            <h1 className="text-lg font-bold">Lagen</h1>
            
          </div>
        </div>
      </div>

      <Map />
    </>
  );
}

export default App;
