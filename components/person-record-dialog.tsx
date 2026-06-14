"use client";

import { FormEvent, useEffect, useState } from "react";
import { Camera, Church, MapPin, Save, Trash2, TriangleAlert, UserRound, X } from "lucide-react";

export type PersonKind = "member" | "visitor";

export type PersonRecordValues = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  civilStatus: string;
  cpf: string;
  zipCode: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  role: string;
  ministry: string;
  baptismDate: string;
  status: string;
  notes: string;
  invitedBy: string;
};

const emptyValues: PersonRecordValues = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  civilStatus: "",
  cpf: "",
  zipCode: "",
  address: "",
  neighborhood: "",
  city: "",
  state: "São Paulo",
  role: "Membro Comum",
  ministry: "Nenhum",
  baptismDate: "",
  status: "Ativo",
  notes: "",
  invitedBy: "",
};

export function PersonRecordDialog({
  open,
  mode,
  kind,
  initialValues,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  kind: PersonKind;
  initialValues?: Partial<PersonRecordValues>;
  onClose: () => void;
  onSubmit: (values: PersonRecordValues) => void;
}) {
  const [values, setValues] = useState<PersonRecordValues>({ ...emptyValues, ...initialValues });

  useEffect(() => {
    if (open) setValues({ ...emptyValues, ...initialValues });
  }, [initialValues, open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open) return null;

  const isMember = kind === "member";
  const label = isMember ? "membro" : "visitante";

  function update(field: keyof PersonRecordValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="record-dialog-layer" role="dialog" aria-modal="true" aria-label={`${mode === "create" ? "Novo cadastro" : "Editar registro"} de ${label}`}>
      <div className="record-dialog-top">
        <div>
          <strong>{mode === "create" ? "Novo Cadastro" : "Editar Registro"}</strong>
          <span>{mode === "create" ? `Cadastre um novo ${label}` : `Atualize os dados de ${values.name}`}</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar formulário"><X /></button>
      </div>

      <form className="record-form" onSubmit={submit}>
        <aside className="record-photo-card">
          <span className="record-photo-placeholder"><Camera /></span>
          <strong>Foto do Perfil</strong>
          <small>PNG ou JPG até 5MB</small>
          <button type="button">Alterar Imagem</button>
        </aside>

        <FormSection title="Informações Pessoais" icon={<UserRound />} className="record-personal">
          <Field label="Nome Completo" wide><input required value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Ex: João da Silva Santos" /></Field>
          <Field label="Data de Nascimento"><input type="date" value={values.birthDate} onChange={(event) => update("birthDate", event.target.value)} /></Field>
          <Field label="Sexo"><select value={values.gender} onChange={(event) => update("gender", event.target.value)}><option value="">Selecione</option><option>Feminino</option><option>Masculino</option><option>Outro</option></select></Field>
          <Field label="Estado Civil"><select value={values.civilStatus} onChange={(event) => update("civilStatus", event.target.value)}><option value="">Selecione</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Viúvo(a)</option></select></Field>
          <Field label="CPF"><input value={values.cpf} onChange={(event) => update("cpf", event.target.value)} placeholder="000.000.000-00" /></Field>
        </FormSection>

        <FormSection title="Contato e Endereço" icon={<MapPin />} className="record-contact">
          <Field label="E-mail" wide><input required type="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="contato@exemplo.com.br" /></Field>
          <Field label="Telefone/WhatsApp"><input value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder="(00) 0 0000-0000" /></Field>
          <Field label="CEP"><input value={values.zipCode} onChange={(event) => update("zipCode", event.target.value)} placeholder="00000-000" /></Field>
          <Field label="Logradouro" wide><input value={values.address} onChange={(event) => update("address", event.target.value)} placeholder="Rua, Avenida, etc." /></Field>
          <Field label="Bairro"><input value={values.neighborhood} onChange={(event) => update("neighborhood", event.target.value)} /></Field>
          <Field label="Cidade"><input value={values.city} onChange={(event) => update("city", event.target.value)} /></Field>
          <Field label="Estado"><select value={values.state} onChange={(event) => update("state", event.target.value)}><option>São Paulo</option><option>Minas Gerais</option><option>Paraná</option></select></Field>
        </FormSection>

        <FormSection title={isMember ? "Informações Eclesiásticas" : "Informações da Visita"} icon={<Church />} className="record-church">
          {isMember ? (
            <>
              <Field label="Cargo/Função"><select value={values.role} onChange={(event) => update("role", event.target.value)}><option>Membro Comum</option><option>Líder</option><option>Pastor</option></select></Field>
              <Field label="Ministério Principal"><select value={values.ministry} onChange={(event) => update("ministry", event.target.value)}><option>Nenhum</option><option>Louvor</option><option>Missões</option><option>Acolhimento</option><option>Infantil</option></select></Field>
              <Field label="Data de Batismo"><input type="date" value={values.baptismDate} onChange={(event) => update("baptismDate", event.target.value)} /></Field>
              <Field label="Situação"><select value={values.status} onChange={(event) => update("status", event.target.value)}><option>Ativo</option><option>Inativo</option></select></Field>
            </>
          ) : (
            <>
              <Field label="Quem convidou"><input value={values.invitedBy} onChange={(event) => update("invitedBy", event.target.value)} placeholder="Ex: Pr. Anderson" /></Field>
              <Field label="Status de acompanhamento"><select value={values.status} onChange={(event) => update("status", event.target.value)}><option>Aguardando Contato</option><option>Em Acompanhamento</option><option>Integrado</option></select></Field>
            </>
          )}
          <Field label="Observações / Histórico" wide><textarea value={values.notes} onChange={(event) => update("notes", event.target.value)} placeholder={`Algum detalhe relevante sobre ${isMember ? "o membro" : "o visitante"}...`} /></Field>
        </FormSection>

        <footer className="record-form-actions">
          <button type="button" className="record-cancel" onClick={onClose}>Cancelar</button>
          <button type="submit" className="record-save"><Save />{mode === "create" ? "Salvar Registro" : "Alterar"}</button>
        </footer>
      </form>
    </div>
  );
}

function FormSection({ title, icon, className, children }: { title: string; icon: React.ReactNode; className: string; children: React.ReactNode }) {
  return <section className={`record-form-section ${className}`}><h3>{icon}{title}</h3><div className="record-form-grid">{children}</div></section>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? "record-field wide" : "record-field"}><span>{label}</span>{children}</label>;
}

export function DeleteRecordDialog({
  open,
  name,
  kind,
  onClose,
  onConfirm,
}: {
  open: boolean;
  name: string;
  kind: PersonKind;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="delete-dialog-layer" onPointerDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="delete-dialog-body">
          <span className="delete-warning"><TriangleAlert /></span>
          <div><h2 id="delete-title">Excluir Registro <small>AÇÃO CRÍTICA</small></h2><p>Tem certeza que deseja excluir o registro de <strong>{name}</strong>? Esta ação não poderá ser desfeita e removerá permanentemente todos os dados históricos e vínculos {kind === "member" ? "ministeriais" : "de acompanhamento"}.</p></div>
        </div>
        <footer><button onClick={onClose}>Cancelar</button><button className="delete-confirm" onClick={onConfirm}><Trash2 />Confirmar Exclusão</button></footer>
      </section>
    </div>
  );
}
