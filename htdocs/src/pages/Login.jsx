

export default function Login() {
  return(
    <div className="flex flex-col px-5 justify-center gap-6 bg-gradient-to-br from-orange-500 to-orange-400 h-screen" > 
      <div className="grid border p-8 text-xl text-center gap-4 bg-blue-800">
        <img src="" alt="Klossio" />
        <button className="p-2 rounded-xl bg-blue-600 text-white">Vende Mas</button>
      </div>
      
      <button className="bg-blue-800 p-2 rounded-xl text-white">Crear Cuenta</button>
      <button className="bg-lime-600 p-2 rounded-xl">Ayuda</button>
    </div>
  )
}