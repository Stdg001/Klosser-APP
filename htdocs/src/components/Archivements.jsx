export default function Logros({ logros }) {
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <h3 className="font-bold text-blue-800">🏆 Logros Desbloqueados</h3>
      <ul className="mt-2 space-y-2">
        {logros.map((logro, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2">🌟</span>
            {logro.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}