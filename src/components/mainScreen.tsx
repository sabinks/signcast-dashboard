import { useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { socket } from "./layout";
import { useAppContext } from "../hooks/appContext";
import { handleDeleteScreen } from "../api";

function MainScreen() {
    const navigate = useNavigate()
    const { screens, setScreens } = useAppContext()
    useEffect(() => {
        socket.on("list-screens", (screens) => {
            setScreens(screens)
        });
        return () => {
            socket.off("list-screens");
        };
    }, [])


    const handleShowScreen = (id: string) => {
        navigate(`edit?screenId=${id}&edit=false`)
    }

    const handleEditScreen = (id: string) => {
        const screen = screens.find(screen => screen?._id === id)
        navigate(`edit?screenId=${screen?.screenId}&edit=true`)
    }

    const deleteScreen = async (id: string) => {
        await handleDeleteScreen(id)
        socket.emit("get-all-screens", () => {
        });
        // socket.emit("delete-screen", { screenId: id });
    }

    const syncScreen = (screenId: string) => {
        socket.emit('sync-screen-with-devices', {
            screenId
        })
    }
    return (
        <div>

            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Screen List</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <article className='flex max-w-sm rounded-lg p-2 overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300'>
                        <img src="screen-image.png" alt="" className="mx-auto block h-24 sm:mx-0 sm:shrink-0" />
                        <div className="space-y-4 ml-4">
                            <div className="flex justify-end">
                                <button className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                                    onClick={() => navigate('new')}>Add Screen</button>
                            </div>
                            <p className="text-sm">Add new screen, if its does not exists</p>
                        </div>
                    </article>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {screens?.map((screen, index) => {
                            return <div key={index} className="max-w-sm rounded-lg p-2 overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300">
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">{screen.name}</h2>
                                    <p>Screen ID: {screen.screenId}</p>
                                    <button className=""
                                        onClick={() => screen._id && deleteScreen(screen._id)}><TrashIcon className='w-5 h-5 text-red-500' /></button>
                                </div>

                                <div className="flex justify-between">
                                    <button className=" bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                                        onClick={() => syncScreen(screen.screenId)}>SYNC</button>
                                    <div className="space-x-2">
                                        <button className="  bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                                            onClick={() => screen.screenId && handleShowScreen(screen.screenId)}>SHOW</button>
                                        <button className="  bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                                            onClick={() => screen._id && handleEditScreen(screen._id)}>EDIT</button>
                                    </div>
                                </div>
                            </div>
                        })
                        }
                    </div>
                </div>
            </main >
        </div >
    )
}

export default MainScreen
