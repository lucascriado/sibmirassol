"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  Filter,
  Pencil,
  PartyPopper,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { AnimatedNumber } from "@/components/animated-number";
import { DeleteRecordDialog, PersonRecordDialog, PersonRecordValues } from "@/components/person-record-dialog";
import { toast } from "sonner";

type Visitor = {
  initials: string;
  name: string;
  email: string;
  date: string;
  invitedBy: string;
  status: "Aguardando Contato" | "Em Acompanhamento" | "Integrado";
  recent?: boolean;
};

const initialVisitors: Visitor[] = [
  { initials: "RL", name: "Ricardo Lima", email: "ricardo.lima@email.com", date: "15 Mai 2024", invitedBy: "Pr. Anderson", status: "Aguardando Contato", recent: true },
  { initials: "MS", name: "Mariana Souza", email: "mari.souza@email.com", date: "12 Mai 2024", invitedBy: "Espontâneo", status: "Em Acompanhamento", recent: true },
  { initials: "FB", name: "Fernando Borges", email: "fborges@email.com", date: "05 Mai 2024", invitedBy: "Lucas Santos", status: "Integrado", recent: true },
  { initials: "CP", name: "Clara Pereira", email: "clara.p@email.com", date: "15 Mai 2024", invitedBy: "Marta Oliveira", status: "Aguardando Contato", recent: true },
  { initials: "AM", name: "André Martins", email: "andre.m@email.com", date: "28 Abr 2024", invitedBy: "Paulo Henrique", status: "Em Acompanhamento" },
  { initials: "LC", name: "Letícia Costa", email: "leticia.c@email.com", date: "21 Abr 2024", invitedBy: "Ana Clara", status: "Integrado" },
  { initials: "JV", name: "João Vitor", email: "joao.v@email.com", date: "14 Abr 2024", invitedBy: "Espontâneo", status: "Aguardando Contato" },
  { initials: "BS", name: "Bianca Santos", email: "bianca.s@email.com", date: "07 Abr 2024", invitedBy: "Marcos Santos", status: "Em Acompanhamento" },
  { initials: "GM", name: "Gustavo Melo", email: "gustavo.m@email.com", date: "31 Mar 2024", invitedBy: "Ricardo Mendes", status: "Integrado" },
  { initials: "TA", name: "Tainá Alves", email: "taina.a@email.com", date: "24 Mar 2024", invitedBy: "Marta Oliveira", status: "Aguardando Contato" },
  { initials: "RB", name: "Renata Barbosa", email: "renata.b@email.com", date: "17 Mar 2024", invitedBy: "Pr. Anderson", status: "Em Acompanhamento" },
  { initials: "DN", name: "Diego Nunes", email: "diego.n@email.com", date: "10 Mar 2024", invitedBy: "Espontâneo", status: "Integrado" },
];

const pageSize = 4;
const tabs = ["Todos", "Recentes", "Pendentes"] as const;
type Tab = typeof tabs[number];

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("Todos");
  const [status, setStatus] = useState("all");
  const [invitedBy, setInvitedBy] = useState("all");
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Visitor | null>(null);

  const inviters = [...new Set(visitors.map((visitor) => visitor.invitedBy))];
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return visitors.filter((visitor) => {
      const matchesSearch = !term || `${visitor.name} ${visitor.email} ${visitor.invitedBy}`.toLocaleLowerCase("pt-BR").includes(term);
      const matchesTab = tab === "Todos" || (tab === "Recentes" ? visitor.recent : visitor.status === "Aguardando Contato");
      return matchesSearch
        && matchesTab
        && (status === "all" || visitor.status === status)
        && (invitedBy === "all" || visitor.invitedBy === invitedBy);
    });
  }, [invitedBy, search, status, tab, visitors]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const start = filtered.length ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, filtered.length);

  function changeTab(nextTab: Tab) {
    setTab(nextTab);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setInvitedBy("all");
    setTab("Todos");
    setPage(1);
  }

  function saveVisitor(values: PersonRecordValues) {
    const visitor: Visitor = {
      initials: initialsFrom(values.name),
      name: values.name,
      email: values.email,
      date: selectedVisitor?.date ?? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()).replace(".", ""),
      invitedBy: values.invitedBy || "Espontâneo",
      status: visitorStatus(values.status),
      recent: selectedVisitor?.recent ?? true,
    };
    setVisitors((current) => dialogMode === "edit" && selectedVisitor
      ? current.map((item) => item.email === selectedVisitor.email ? visitor : item)
      : [visitor, ...current]);
    toast.success(dialogMode === "edit" ? "Visitante alterado com sucesso" : "Visitante cadastrado com sucesso");
    setDialogMode(null);
    setSelectedVisitor(null);
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setVisitors((current) => current.filter((visitor) => visitor.email !== deleteTarget.email));
    toast.success("Visitante excluído com sucesso");
    setDeleteTarget(null);
  }

  return (
    <DashboardShell title="Visitantes" searchPlaceholder="Buscar visitantes..." searchValue={search} onSearchChange={(value) => { setSearch(value); setPage(1); }}>
      <main className="visitors-main">
        <section className="visitors-heading">
          <div><h2>Gestão de Visitantes</h2><p>Acompanhe e integre novas pessoas à nossa comunidade.</p></div>
          <button className="primary-action visitor-action" onClick={() => { setSelectedVisitor(null); setDialogMode("create"); }}><UserPlus />Novo Visitante</button>
        </section>

        <section className="visitor-stats" aria-label="Indicadores de visitantes">
          <VisitorStat label="Total de visitantes" value={128} detail={<><AnimatedNumber value={12} prefix="+" suffix="%" /></>} color="default" />
          <VisitorStat label="Aguardando contato" value={14} detail="Urgente" color="danger" />
          <VisitorStat label="Em acompanhamento" value={42} icon={<Users />} color="tracking" />
          <VisitorStat label="Integrados (mês)" value={26} icon={<PartyPopper />} color="success" />
        </section>

        <div className="member-filters visitor-filters">
          <span className="filter-label"><Filter />Filtros Avançados</span>
          <select aria-label="Filtrar por status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">Status: Todos</option>
            <option>Aguardando Contato</option><option>Em Acompanhamento</option><option>Integrado</option>
          </select>
          <select aria-label="Filtrar por responsável pelo convite" value={invitedBy} onChange={(event) => { setInvitedBy(event.target.value); setPage(1); }}>
            <option value="all">Quem convidou: Todos</option>
            {inviters.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="member-filter-search"><Search /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Filtrar visitante..." /></label>
          <button className="clear-filters" onClick={clearFilters}>Limpar Filtros</button>
        </div>

        <section className="visitors-table-card">
          <div className="visitor-table-toolbar">
            <div className="visitor-tabs">
              {tabs.map((item) => <button className={tab === item ? "active" : undefined} key={item} onClick={() => changeTab(item)}>{item}</button>)}
            </div>
            <div className="visitor-tools"><button aria-label="Filtrar"><Filter /></button><button aria-label="Exportar"><Download /></button></div>
          </div>
          <div className="visitors-table-scroll">
            <table className="visitors-table">
              <colgroup><col className="visitor-col-name" /><col className="visitor-col-date" /><col className="visitor-col-invited" /><col className="visitor-col-status" /><col className="visitor-col-actions" /></colgroup>
              <thead><tr><th>Nome do Visitante</th><th>Data da Visita</th><th>Quem Convidou</th><th>Status de Acompanhamento</th><th>Ações</th></tr></thead>
              <tbody>
                {visible.map((visitor, index) => (
                  <tr key={visitor.email}>
                    <td data-label="Visitante"><div className="visitor-identity"><span className={`visitor-avatar avatar-${index % 4}`}>{visitor.initials}</span><span><strong>{visitor.name}</strong><small>{visitor.email}</small></span></div></td>
                    <td data-label="Data">{visitor.date}</td>
                    <td data-label="Quem convidou"><span className="invited-by"><Users />{visitor.invitedBy}</span></td>
                    <td data-label="Status"><span className={`visitor-status ${statusClass(visitor.status)}`}><i />{visitor.status}</span></td>
                    <td data-label="Ações">
                      <div className="member-actions">
                        <button aria-label={`Visualizar ${visitor.name}`} onClick={() => toast.info(`${visitor.name}: ${visitor.status}.`)}><Eye /></button>
                        <button aria-label={`Editar ${visitor.name}`} onClick={() => { setSelectedVisitor(visitor); setDialogMode("edit"); }}><Pencil /></button>
                        <button aria-label={`Excluir ${visitor.name}`} onClick={() => setDeleteTarget(visitor)}><Trash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="visitor-pagination">
            <span>Mostrando {start}-{end} de {filtered.length} visitantes</span>
            <div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></button>{Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => <button className={number === currentPage ? "current" : undefined} key={number} onClick={() => setPage(number)}>{number}</button>)}<button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight /></button></div>
          </div>
        </section>

        <section className="visitor-followup">
          <article className="integration-guide"><h3>Próximos Passos na Integração</h3><p>Lembre-se que o primeiro contato deve ser feito em até 48h após a visita para garantir uma maior taxa de retenção.</p><button><ClipboardList />Ver Manual de Integração</button></article>
          <article className="reminders-card"><h3>Lembretes</h3><Reminder urgent title="Ligar para Ricardo Lima" detail="Vence hoje às 17:00" /><Reminder title="Visita Mariana Souza" detail="Agendado para Amanhã" /><button>Ver todos os lembretes</button></article>
        </section>
      </main>
      <PersonRecordDialog open={dialogMode !== null} mode={dialogMode ?? "create"} kind="visitor" initialValues={selectedVisitor ? { name: selectedVisitor.name, email: selectedVisitor.email, invitedBy: selectedVisitor.invitedBy, status: selectedVisitor.status } : { status: "Aguardando Contato" }} onClose={() => { setDialogMode(null); setSelectedVisitor(null); }} onSubmit={saveVisitor} />
      <DeleteRecordDialog open={deleteTarget !== null} name={deleteTarget?.name ?? ""} kind="visitor" onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
    </DashboardShell>
  );
}

function initialsFrom(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function visitorStatus(status: string): Visitor["status"] {
  return status === "Integrado" || status === "Em Acompanhamento" ? status : "Aguardando Contato";
}

function statusClass(status: Visitor["status"]) {
  return status === "Aguardando Contato" ? "waiting" : status === "Em Acompanhamento" ? "tracking" : "integrated";
}

function VisitorStat({ label, value, detail, icon, color }: { label: string; value: number; detail?: React.ReactNode; icon?: React.ReactNode; color: string }) {
  return <article className={`visitor-stat ${color}`}><small>{label}</small><div><strong><AnimatedNumber value={value} /></strong>{detail && <span>{detail}</span>}{icon && <i>{icon}</i>}</div></article>;
}

function Reminder({ title, detail, urgent }: { title: string; detail: string; urgent?: boolean }) {
  return <div className="visitor-reminder"><i className={urgent ? "urgent" : undefined} /><span><strong>{title}</strong><small>{detail}</small></span></div>;
}
