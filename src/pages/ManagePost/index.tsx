import NavigationBar from "@/components/NavigationBar"

function ManagePost() {
    return (
        <>
            <NavigationBar />
            <div className="absolute top-0 bottom-0 right-0 min-h-screen w-4/5 flex items-center justify-center p-8">
                <main className="w-full h-full bg-black rounded-3xl shadow-black/60 shadow-900 shadow-2xl p-16">
                    <code className="text-4xl text-neutral-200 text-extrabold">Gerenciar Posts</code>
                </main>
            </div>
        </>
    )
}

export default ManagePost