import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AddScreen from './components/addScreen.tsx'
import { Layout } from './components/layout.tsx'
import EditScreen from './components/editScreen.tsx'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
const Loading = lazy(() => import('./components/loading.tsx'))
const NotFound = lazy(() => import('./components/notFound.tsx'))
const MainScreen = lazy(() => import('./components/mainScreen.tsx'))
const Devices = lazy(() => import('./components/devices.tsx'))

function App() {
    return (
        <div className='h-screen'>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index path="screens" element={<MainScreen />} />
                        <Route index path="screens/new" element={<AddScreen />} />
                        <Route index path="screens/edit" element={<EditScreen />} />
                        <Route path="devices" element={<Devices />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
            <ToastContainer />
        </div>

    )
}

export default App  