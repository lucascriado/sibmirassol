import Image from "next/image";
import { Bell, Menu, Search } from "lucide-react";

export function Header({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: {
  title: string;
  searchPlaceholder: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}) {
  return (
    <header className="topbar">
      <label className="icon-button menu-button" htmlFor="menu-toggle" aria-label="Abrir menu" data-sidebar-trigger>
        <Menu />
      </label>
      <h1>{title}</h1>
      <label className="search">
        <Search />
        <input
          type="search"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </label>
      <button className="icon-button" aria-label="Notificações"><Bell /></button>
      <span className="divider" />
      <div className="user">
        <span><strong>Pr. Renato</strong><small>Administrador</small></span>
        <Image src="/renato.png" alt="Pr. Renato" width={40} height={40} priority />
      </div>
    </header>
  );
}
