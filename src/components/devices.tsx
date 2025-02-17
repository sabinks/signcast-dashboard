import { useAppContext } from "../hooks/appContext";

const Devices = () => {
    const { devices } = useAppContext()
    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Connected Devices</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.map((device) => (
                        <div key={device.id} className="max-w-sm rounded-lg p-2 overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300">
                            <h2 className="text-md mb-2">{device.id}</h2>
                            <div className="flex justify-between">
                                <h2 className="text-md mb-2">ScreenId: {device.screenId}</h2>
                                <p className="text-sm">
                                    Status: <span className={`font-semibold ${device.status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>{device.status}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Devices;