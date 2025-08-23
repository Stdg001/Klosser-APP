import UserPicture from '../../assets/icons/Default_pfp.svg';

export default function SidebarUser() {
  return (
    <div className="flex items-center gap-3 border theme-border p-2 rounded-md">
      {/* Foto de usuario */}
      <img src={UserPicture} alt="user" className="h-10 w-10 rounded-full" />

      {/* Información de usuario */}
      <div className="flex flex-col theme-text">
        <span className="font-medium">User</span>
        <span className="text-sm text-gray-400">Lvl 2</span>
      </div>
    </div>
  );
}
