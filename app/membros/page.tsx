"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Eye,
  Filter,
  Landmark,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { AnimatedNumber } from "@/components/animated-number";
import { DeleteRecordDialog, PersonRecordDialog, PersonRecordValues } from "@/components/person-record-dialog";
import { toast } from "sonner";

type Member = {
  initials: string;
  name: string;
  email: string;
  ministry: string;
  ministryColor: "blue" | "green" | "gray" | "purple";
  cell: string;
  status: "Ativo" | "Inativo";
  baptism: "Batizado" | "Aguardando";
  date: string;
  isNew?: boolean;
};

const initialMembers: Member[] = [
  { initials: "AC", name: "Ana Clara Oliveira", email: "ana.clara@email.com", ministry: "Louvor", ministryColor: "blue", cell: "Célula Esperança", status: "Ativo", baptism: "Batizado", date: "15 Mai, 2021" },
  { initials: "MS", name: "Marcos Santos", email: "marcos.santos@email.com", ministry: "Missões", ministryColor: "green", cell: "Célula Graça", status: "Ativo", baptism: "Batizado", date: "10 Jan, 2020" },
  { initials: "JP", name: "Julia Pereira", email: "julia.p@email.com", ministry: "Nenhum", ministryColor: "gray", cell: "Sem célula", status: "Inativo", baptism: "Aguardando", date: "22 Ago, 2023" },
  { initials: "RM", name: "Ricardo Mendes", email: "mendes.r@email.com", ministry: "Acolhimento", ministryColor: "purple", cell: "Célula Família", status: "Ativo", baptism: "Batizado", date: "05 Abr, 2019" },
  { initials: "BL", name: "Beatriz Lima", email: "bia.lima@email.com", ministry: "Infantil", ministryColor: "purple", cell: "Célula Esperança", status: "Ativo", baptism: "Batizado", date: "18 Fev, 2022", isNew: true },
  { initials: "GS", name: "Gabriel Souza", email: "gabriel.s@email.com", ministry: "Louvor", ministryColor: "blue", cell: "Célula Jovens", status: "Ativo", baptism: "Aguardando", date: "03 Mar, 2024", isNew: true },
  { initials: "CM", name: "Carla Martins", email: "carla.m@email.com", ministry: "Missões", ministryColor: "green", cell: "Célula Graça", status: "Ativo", baptism: "Batizado", date: "11 Set, 2018" },
  { initials: "PH", name: "Paulo Henrique", email: "paulo.h@email.com", ministry: "Acolhimento", ministryColor: "purple", cell: "Célula Família", status: "Inativo", baptism: "Batizado", date: "29 Jun, 2017" },
  { initials: "LF", name: "Larissa Freitas", email: "larissa.f@email.com", ministry: "Infantil", ministryColor: "purple", cell: "Célula Jovens", status: "Ativo", baptism: "Aguardando", date: "07 Mai, 2024", isNew: true },
  { initials: "DR", name: "Daniel Rocha", email: "daniel.r@email.com", ministry: "Louvor", ministryColor: "blue", cell: "Célula Esperança", status: "Ativo", baptism: "Batizado", date: "14 Nov, 2020" },
  { initials: "MT", name: "Mariana Teixeira", email: "mariana.t@email.com", ministry: "Nenhum", ministryColor: "gray", cell: "Sem célula", status: "Ativo", baptism: "Aguardando", date: "23 Abr, 2024", isNew: true },
  { initials: "FC", name: "Felipe Costa", email: "felipe.c@email.com", ministry: "Missões", ministryColor: "green", cell: "Célula Graça", status: "Inativo", baptism: "Batizado", date: "17 Jul, 2016" },
  { initials: "ES", name: "Eduarda Silva", email: "eduarda.s@email.com", ministry: "Acolhimento", ministryColor: "purple", cell: "Célula Família", status: "Ativo", baptism: "Batizado", date: "09 Out, 2021" },
  { initials: "RA", name: "Rafael Alves", email: "rafael.a@email.com", ministry: "Louvor", ministryColor: "blue", cell: "Célula Jovens", status: "Ativo", baptism: "Aguardando", date: "28 Mai, 2024", isNew: true },
  { initials: "NC", name: "Natália Cardoso", email: "natalia.c@email.com", ministry: "Infantil", ministryColor: "purple", cell: "Célula Esperança", status: "Ativo", baptism: "Batizado", date: "12 Dez, 2019" },
  { initials: "VC", name: "Vinícius Carvalho", email: "vinicius.c@email.com", ministry: "Nenhum", ministryColor: "gray", cell: "Sem célula", status: "Inativo", baptism: "Aguardando", date: "06 Jan, 2023" },
  { initials: "IS", name: "Isabela Santos", email: "isabela.s@email.com", ministry: "Missões", ministryColor: "green", cell: "Célula Graça", status: "Ativo", baptism: "Batizado", date: "19 Ago, 2022" },
  { initials: "HO", name: "Henrique Oliveira", email: "henrique.o@email.com", ministry: "Acolhimento", ministryColor: "purple", cell: "Célula Família", status: "Ativo", baptism: "Aguardando", date: "02 Mai, 2024", isNew: true },
];

const pageSize = 6;

export default function MembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [ministry, setMinistry] = useState("all");
  const [status, setStatus] = useState("all");
  const [baptism, setBaptism] = useState("all");
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const ministries = [...new Set(members.map((member) => member.ministry))];
  const filteredMembers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return members.filter((member) => {
      const matchesSearch = !term || `${member.name} ${member.email} ${member.cell}`.toLocaleLowerCase("pt-BR").includes(term);
      return matchesSearch
        && (ministry === "all" || member.ministry === ministry)
        && (status === "all" || member.status === status)
        && (baptism === "all" || member.baptism === baptism);
    });
  }, [baptism, members, ministry, search, status]);

  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const start = filteredMembers.length ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, filteredMembers.length);

  function updateFilter(action: () => void) {
    action();
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setMinistry("all");
    setStatus("all");
    setBaptism("all");
    setPage(1);
  }

  function saveMember(values: PersonRecordValues) {
    const member: Member = {
      initials: initialsFrom(values.name),
      name: values.name,
      email: values.email,
      ministry: values.ministry,
      ministryColor: ministryColor(values.ministry),
      cell: selectedMember?.cell ?? "Sem célula",
      status: values.status === "Inativo" ? "Inativo" : "Ativo",
      baptism: values.baptismDate ? "Batizado" : "Aguardando",
      date: selectedMember?.date ?? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()).replace(".", ""),
      isNew: selectedMember?.isNew ?? true,
    };
    setMembers((current) => dialogMode === "edit" && selectedMember
      ? current.map((item) => item.email === selectedMember.email ? member : item)
      : [member, ...current]);
    toast.success(dialogMode === "edit" ? "Membro alterado com sucesso" : "Membro cadastrado com sucesso");
    setDialogMode(null);
    setSelectedMember(null);
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setMembers((current) => current.filter((member) => member.email !== deleteTarget.email));
    toast.error("Membro excluído com sucesso");
    setDeleteTarget(null);
  }

  return (
    <DashboardShell title="Membros" searchValue={search} onSearchChange={(value) => updateFilter(() => setSearch(value))}>
      <main className="members-main">
        <section className="members-heading">
          <div><h2>Gestão de Membros</h2><p>Visualize, filtre e gerencie todos os membros da congregação.</p></div>
          <button className="primary-action" onClick={() => { setSelectedMember(null); setDialogMode("create"); }}><Plus />Novo Membro</button>
        </section>

        <section className="members-content">
          <div className="member-filters">
            <span className="filter-label"><Filter />Filtros Avançados</span>
            <select aria-label="Filtrar por ministério" value={ministry} onChange={(event) => updateFilter(() => setMinistry(event.target.value))}>
              <option value="all">Todos os Ministérios</option>
              {ministries.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Filtrar por status" value={status} onChange={(event) => updateFilter(() => setStatus(event.target.value))}>
              <option value="all">Status: Todos</option><option>Ativo</option><option>Inativo</option>
            </select>
            <select aria-label="Filtrar por batismo" value={baptism} onChange={(event) => updateFilter(() => setBaptism(event.target.value))}>
              <option value="all">Batismo: Todos</option><option>Batizado</option><option>Aguardando</option>
            </select>
            <label className="member-filter-search"><Search /><input value={search} onChange={(event) => updateFilter(() => setSearch(event.target.value))} placeholder="Filtrar por nome..." /></label>
            <button className="clear-filters" onClick={clearFilters}>Limpar Filtros</button>
          </div>

          <div className="members-table-card">
            <div className="members-table-scroll">
              <table className="members-table">
                <colgroup>
                  <col className="member-col-name" />
                  <col className="member-col-ministry" />
                  <col className="member-col-cell" />
                  <col className="member-col-status" />
                  <col className="member-col-baptism" />
                  <col className="member-col-date" />
                  <col className="member-col-actions" />
                </colgroup>
                <thead><tr><th>Nome</th><th>Ministério</th><th>Células</th><th>Status</th><th>Batismo</th><th>Data de Admissão</th><th>Ações</th></tr></thead>
                <tbody>
                  {visibleMembers.map((member) => (
                    <tr key={member.email}>
                      <td data-label="Nome"><div className="member-identity"><span className="member-avatar">{member.initials}</span><span><strong>{member.name}</strong><small>{member.email}</small></span></div></td>
                      <td data-label="Ministério"><span className={`ministry-tag ${member.ministryColor}`}>{member.ministry}</span></td>
                      <td data-label="Célula"><span className={`cell-tag ${member.cell === "Sem célula" ? "empty" : ""}`}>{member.cell}</span></td>
                      <td data-label="Status"><span className={`status-tag ${member.status === "Ativo" ? "is-active" : "is-inactive"}`}><i />{member.status}</span></td>
                      <td data-label="Batismo"><span className={`baptism-tag ${member.baptism === "Batizado" ? "is-baptized" : "is-waiting"}`}>{member.baptism}</span></td>
                      <td data-label="Admissão" className="admission-date">{member.date}</td>
                      <td data-label="Ações"><div className="member-actions"><button aria-label={`Visualizar ${member.name}`} onClick={() => toast.info(`${member.name} está ${member.status.toLowerCase()} em ${member.ministry}.`)}><Eye /></button><button aria-label={`Editar ${member.name}`} onClick={() => { setSelectedMember(member); setDialogMode("edit"); }}><Pencil /></button><button aria-label={`Excluir ${member.name}`} onClick={() => setDeleteTarget(member)}><Trash2 /></button></div></td>
                    </tr>
                  ))}
                  {!visibleMembers.length && <tr><td className="members-empty" colSpan={7}>Nenhum membro encontrado com esses filtros.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="members-pagination">
              <span>Mostrando {start}-{end} de {filteredMembers.length} membros</span>
              <div>
                <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Página anterior"><ChevronLeft /></button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button className={number === currentPage ? "current" : undefined} onClick={() => setPage(number)} key={number}>{number}</button>)}
                <button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} aria-label="Próxima página"><ChevronRight /></button>
              </div>
            </div>
          </div>

          <section className="member-stats" aria-label="Resumo de membros">
            <MemberStat label="Total ativos" value={members.filter((member) => member.status === "Ativo").length} icon={UserCheck} color="neutral" />
            <MemberStat label="Novos este mês" value={members.filter((member) => member.isNew).length} prefix="+" icon={Landmark} color="blue" />
            <MemberStat label="Aguardando batismo" value={members.filter((member) => member.baptism === "Aguardando").length} icon={Droplets} color="green" />
          </section>
        </section>
      </main>
      <PersonRecordDialog open={dialogMode !== null} mode={dialogMode ?? "create"} kind="member" initialValues={selectedMember ? { name: selectedMember.name, email: selectedMember.email, ministry: selectedMember.ministry, status: selectedMember.status, baptismDate: selectedMember.baptism === "Batizado" ? "2020-01-01" : "" } : undefined} onClose={() => { setDialogMode(null); setSelectedMember(null); }} onSubmit={saveMember} />
      <DeleteRecordDialog open={deleteTarget !== null} name={deleteTarget?.name ?? ""} kind="member" onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
    </DashboardShell>
  );
}

function initialsFrom(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function ministryColor(ministry: string): Member["ministryColor"] {
  if (ministry === "Louvor") return "blue";
  if (ministry === "Missões") return "green";
  if (ministry === "Nenhum") return "gray";
  return "purple";
}

function MemberStat({ label, value, prefix, icon: Icon, color }: { label: string; value: number; prefix?: string; icon: typeof UserCheck; color: string }) {
  return <article className="member-stat-card"><span className={`member-stat-icon ${color}`}><Icon /></span><span><small>{label}</small><strong><AnimatedNumber value={value} prefix={prefix} /></strong></span></article>;
}
