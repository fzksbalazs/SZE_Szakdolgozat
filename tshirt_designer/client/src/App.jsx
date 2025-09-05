import Canvas from "./canvas"
import Customizer from "./pages/Customizer"
import Home from "./pages/home"

function App() {
  return (
    <main className="app trarnsition-all-ease-in">
      <Home></Home>
      <Canvas></Canvas>
      <Customizer></Customizer>

    </main>
  )
}

export default App
