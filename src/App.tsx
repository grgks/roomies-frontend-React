import AppRouter from "@/routes/AppRouter.tsx";
import OfflineOverlay from "@/components/OfflineOverlay.tsx";


function App()  {
  return (
      <>
          <OfflineOverlay />
          <AppRouter />
      </>
  )
}

export default App;