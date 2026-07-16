"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { ProfileField } from "./profile-field";
import { useTabForm } from "./use-tab-form";
import { TAB_TO_SECTION } from "@/lib/profile-mappers";
import type {
  PrivacyLevel,
  ProfileGeneral,
  ProfileSocial,
  ProfileContact,
  ProfileProfessional,
  ProfilePersonal,
} from "@/data/edit-profile/types";
import {
  PRIVACY_OPTIONS,
  MESES,
  DIAS,
  RELACIONAMENTO_OPTIONS,
  PAISES,
  INTERESSADO_EM_OPTIONS,
  INTERESSADO_EM_NAMORO_OPTIONS,
  FILHOS_OPTIONS,
  ETNIA_OPTIONS,
  RELIGIAO_OPTIONS,
  VISAO_POLITICA_OPTIONS,
  ORIENTACAO_SEXUAL_OPTIONS,
  HUMOR_OPTIONS,
  ESTILO_OPTIONS,
  FUMO_OPTIONS,
  BEBO_OPTIONS,
  ANIMAIS_OPTIONS,
  MORO_OPTIONS,
  COR_OLHOS_OPTIONS,
  COR_CABELO_OPTIONS,
  TIPO_FISICO_OPTIONS,
  APARENCIA_OPTIONS,
  ARTE_CORPO_OPTIONS,
  O_QUE_ME_ATRAI_OPTIONS,
  DO_QUE_MAIS_GOSTO_OPTIONS,
  ESCOLARIDADE_OPTIONS,
  IDIOMAS_OPTIONS,
} from "@/data/edit-profile/constants";

type Tab = "geral" | "social" | "contato" | "profissional" | "pessoal";

const TABS: { key: Tab; label: string }[] = [
  { key: "geral", label: "geral" },
  { key: "social", label: "social" },
  { key: "contato", label: "contato" },
  { key: "profissional", label: "profissional" },
  { key: "pessoal", label: "pessoal" },
];

const DEFAULT_PRIVACY: PrivacyLevel = "EVERYONE";

const INITIAL_GENERAL: ProfileGeneral = {
  firstName: "",
  lastName: "",
  gender: "",
  relationshipStatus: "não há resposta",
  birthMonth: "",
  birthDay: "",
  birthDatePrivacy: DEFAULT_PRIVACY,
  birthYear: "",
  birthYearPrivacy: DEFAULT_PRIVACY,
  city: "",
  state: "",
  zipCode: "",
  country: "Brasil",
  languages: [""],
  languagesPrivacy: DEFAULT_PRIVACY,
  highSchool: "",
  highSchoolPrivacy: DEFAULT_PRIVACY,
  college: "",
  collegePrivacy: DEFAULT_PRIVACY,
  company: "",
  companyPrivacy: DEFAULT_PRIVACY,
  interestedIn: [],
  datingPreference: "homens",
};

const INITIAL_SOCIAL: ProfileSocial = {
  children: "não há resposta",
  ethnicity: "não há resposta",
  religion: "sem resposta",
  politicalView: "sem resposta",
  sexualOrientation: "sem resposta",
  sexualOrientationPrivacy: DEFAULT_PRIVACY,
  humor: [],
  style: [],
  smoking: "não",
  drinking: "não",
  pets: "não gosto de animais de estimação",
  livingWith: "não há resposta",
  hometown: "",
  website: "",
  aboutMe: "",
  passions: "",
  sports: "",
  activities: "",
  books: "",
  music: "",
  tvShows: "",
  movies: "",
  cuisines: "",
};

const INITIAL_CONTACT: ProfileContact = {
  primaryEmail: "",
  primaryEmailPrivacy: DEFAULT_PRIVACY,
  secondaryEmails: [],
  im1: "",
  im1Privacy: DEFAULT_PRIVACY,
  im2: "",
  im2Privacy: DEFAULT_PRIVACY,
  homePhone: "",
  homePhonePrivacy: DEFAULT_PRIVACY,
  mobilePhone: "",
  mobilePhonePrivacy: DEFAULT_PRIVACY,
  address1: "",
  address2: "",
  addressCity: "",
  addressState: "",
  addressZipCode: "",
  addressCountry: "Brasil",
};

const INITIAL_PROFESSIONAL: ProfileProfessional = {
  education: "sem resposta",
  school: "",
  college: "",
  course: "",
  degree: "",
  year: "",
  profession: "",
  sector: "",
  company: "",
  jobDescription: "",
  workPhone: "",
  professionalSkills: "",
  professionalInterests: "",
};

const INITIAL_PERSONAL: ProfilePersonal = {
  eyeColor: "sem resposta",
  hairColor: "sem resposta",
  height: "",
  bodyType: "não há resposta",
  appearance: "não há resposta",
  bodyArt: "não há resposta",
  perfectMatch: "",
  attractions: [],
  cantStand: "",
  idealFirstDate: "",
  pastRelationshipsLessons: "",
  whatStandsOut: "",
  favoriteBodyPart: "não há resposta",
  fiveEssentials: "",
  inMyRoom: "",
};

function EditTable({ children }: { children: React.ReactNode }) {
  return (
    <table className="orkut-edit-table" cellPadding={0} cellSpacing={0}>
      <colgroup>
        <col className="orkut-edit-col-label" />
        <col />
      </colgroup>
      <tbody>{children}</tbody>
    </table>
  );
}

function PrivacySelect({
  value,
  onChange,
}: {
  value: PrivacyLevel;
  onChange: (v: PrivacyLevel) => void;
}) {
  return (
    <span className="orkut-privacy-wrapper">
      <img src="/icons/i_key.gif" alt="" />
      <select
        className="orkut-privacy-select"
        value={value}
        onChange={(e) => onChange(e.target.value as PrivacyLevel)}
      >
        {PRIVACY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  );
}

function validateGeneral(data: ProfileGeneral): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.firstName.trim()) errors.firstName = "Este campo é obrigatório.";
  if (!data.lastName.trim()) errors.lastName = "Este campo é obrigatório.";
  if (!data.gender) errors.gender = "Este campo é obrigatório.";
  if (!data.country) errors.country = "Este campo é obrigatório.";
  return errors;
}

// ────────────────────────────────────────────────
// ABA GERAL
// ────────────────────────────────────────────────

function GeneralTab({
  data,
  update,
  errors,
}: {
  data: ProfileGeneral;
  update: (key: keyof ProfileGeneral, value: ProfileGeneral[keyof ProfileGeneral]) => void;
  errors: Record<string, string>;
}) {
  return (
    <EditTable>
      <ProfileField type="text" label="nome" name="firstName" required value={data.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
      <ProfileField type="text" label="sobrenome" name="lastName" required value={data.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
      <ProfileField type="radio" label="gênero" name="gender" required value={data.gender} onChange={(v) => update("gender", v)} options={["feminino", "masculino", "não binário"]} error={errors.gender} />

      <ProfileField
        type="select"
        label="relacionamento"
        name="relationshipStatus"
        value={data.relationshipStatus}
        onChange={(v) => update("relationshipStatus", v)}
        options={RELACIONAMENTO_OPTIONS}
      />

      <tr>
        <td className="orkut-edit-label">nascimento:</td>
        <td className="orkut-edit-field">
          <PrivacySelect
            value={data.birthDatePrivacy}
            onChange={(v) => update("birthDatePrivacy", v)}
          />
          <select className="orkut-select" value={data.birthMonth} onChange={(e) => update("birthMonth", e.target.value)}>
            {MESES.map((m) => (
              <option key={m} value={m}>{m || "mês"}</option>
            ))}
          </select>
          {" "}
          <select className="orkut-select" value={data.birthDay} onChange={(e) => update("birthDay", e.target.value)}>
            {DIAS.map((d) => (
              <option key={d} value={d}>{d || "dia"}</option>
            ))}
          </select>
        </td>
      </tr>

      <tr>
        <td className="orkut-edit-label">ano de nascimento:</td>
        <td className="orkut-edit-field">
          <PrivacySelect
            value={data.birthYearPrivacy}
            onChange={(v) => update("birthYearPrivacy", v)}
          />
          <input
            type="text"
            className="orkut-input orkut-input-sm"
            value={data.birthYear}
            onChange={(e) => update("birthYear", e.target.value)}
            maxLength={4}
          />
        </td>
      </tr>

      <ProfileField type="text" label="cidade" name="city" value={data.city} onChange={(v) => update("city", v)} />
      <ProfileField type="text" label="estado" name="state" value={data.state} onChange={(v) => update("state", v)} />
      <ProfileField type="text" label="CEP" name="zipCode" value={data.zipCode} onChange={(v) => update("zipCode", v)} />
      <ProfileField type="select" label="país" name="country" required value={data.country} onChange={(v) => update("country", v)} options={PAISES} error={errors.country} />

      {data.languages.map((idioma, i) => (
        <tr key={i}>
          <td className="orkut-edit-label">{i === 0 ? "idiomas que falo:" : ""}</td>
          <td className="orkut-edit-field">
            {i === 0 && (
              <PrivacySelect
                value={data.languagesPrivacy}
                onChange={(v) => update("languagesPrivacy", v)}
              />
            )}
            <select
              className="orkut-select"
              value={idioma}
              onChange={(e) => {
                const next = [...data.languages];
                next[i] = e.target.value;
                update("languages", next);
              }}
            >
              <option value="">selecione</option>
              {IDIOMAS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {i > 0 && (
              <OrkutActionButton
                variant="edit"
                onClick={() => update("languages", data.languages.filter((_, j) => j !== i))}
              >
                remover
              </OrkutActionButton>
            )}
          </td>
        </tr>
      ))}
      <tr>
        <td className="orkut-edit-label">&nbsp;</td>
        <td className="orkut-edit-field">
          <OrkutActionButton variant="edit" onClick={() => update("languages", [...data.languages, ""]) }>
            adicionar outro idioma
          </OrkutActionButton>
        </td>
      </tr>

      <ProfileField
        type="text"
        label="escola (ensino médio)"
        name="highSchool"
        value={data.highSchool}
        onChange={(v) => update("highSchool", v)}
        privacy
        privacyValue={data.highSchoolPrivacy}
        onPrivacyChange={(v) => update("highSchoolPrivacy", v)}
      />
      <ProfileField
        type="text"
        label="faculdade"
        name="college"
        value={data.college}
        onChange={(v) => update("college", v)}
        privacy
        privacyValue={data.collegePrivacy}
        onPrivacyChange={(v) => update("collegePrivacy", v)}
      />
      <ProfileField
        type="text"
        label="empresa / organização"
        name="company"
        value={data.company}
        onChange={(v) => update("company", v)}
        privacy
        privacyValue={data.companyPrivacy}
        onPrivacyChange={(v) => update("companyPrivacy", v)}
      />

      <ProfileField
        type="checkbox"
        label="interessado(a) em"
        name="interestedIn"
        value={data.interestedIn}
        onChange={(v) => update("interestedIn", v)}
        options={INTERESSADO_EM_OPTIONS}
      />
      {data.interestedIn.includes("namoro") && (
        <ProfileField
          type="select"
          label="gostaria de namorar"
          name="datingPreference"
          value={data.datingPreference}
          onChange={(v) => update("datingPreference", v)}
          options={INTERESSADO_EM_NAMORO_OPTIONS}
        />
      )}
    </EditTable>
  );
}

// ────────────────────────────────────────────────
// ABA SOCIAL
// ────────────────────────────────────────────────

function SocialTab({
  data,
  update,
}: {
  data: ProfileSocial;
  update: (key: keyof ProfileSocial, value: ProfileSocial[keyof ProfileSocial]) => void;
}) {
  return (
    <EditTable>
      <ProfileField type="select" label="filhos" name="children" value={data.children} onChange={(v) => update("children", v)} options={FILHOS_OPTIONS} />
      <ProfileField type="select" label="etnia" name="ethnicity" value={data.ethnicity} onChange={(v) => update("ethnicity", v)} options={ETNIA_OPTIONS} />
      <ProfileField type="select" label="religião" name="religion" value={data.religion} onChange={(v) => update("religion", v)} options={RELIGIAO_OPTIONS} />
      <ProfileField type="select" label="visão política" name="politicalView" value={data.politicalView} onChange={(v) => update("politicalView", v)} options={VISAO_POLITICA_OPTIONS} />
      <ProfileField type="checkbox" label="humor" name="humor" value={data.humor} onChange={(v) => update("humor", v)} options={HUMOR_OPTIONS} />
      <ProfileField
        type="select"
        label="orientação sexual"
        name="sexualOrientation"
        value={data.sexualOrientation}
        onChange={(v) => update("sexualOrientation", v)}
        options={ORIENTACAO_SEXUAL_OPTIONS}
        privacy
        privacyValue={data.sexualOrientationPrivacy}
        onPrivacyChange={(v) => update("sexualOrientationPrivacy", v)}
      />
      <ProfileField type="checkbox" label="estilo" name="style" value={data.style} onChange={(v) => update("style", v)} options={ESTILO_OPTIONS} />
      <ProfileField type="select" label="fumo" name="smoking" value={data.smoking} onChange={(v) => update("smoking", v)} options={FUMO_OPTIONS} />
      <ProfileField type="select" label="bebo" name="drinking" value={data.drinking} onChange={(v) => update("drinking", v)} options={BEBO_OPTIONS} />
      <ProfileField type="select" label="animais de estimação" name="pets" value={data.pets} onChange={(v) => update("pets", v)} options={ANIMAIS_OPTIONS} />
      <ProfileField type="select" label="moro" name="livingWith" value={data.livingWith} onChange={(v) => update("livingWith", v)} options={MORO_OPTIONS} />
      <ProfileField type="text" label="cidade natal" name="hometown" value={data.hometown} onChange={(v) => update("hometown", v)} />
      <ProfileField type="text" label="página da web" name="website" value={data.website} onChange={(v) => update("website", v)} />
      <ProfileField type="textarea" label="quem sou eu" name="aboutMe" value={data.aboutMe} onChange={(v) => update("aboutMe", v)} />
      <ProfileField type="textarea" label="paixões" name="passions" value={data.passions} onChange={(v) => update("passions", v)} />
      <ProfileField type="textarea" label="esportes" name="sports" value={data.sports} onChange={(v) => update("sports", v)} />
      <ProfileField type="textarea" label="atividades" name="activities" value={data.activities} onChange={(v) => update("activities", v)} />
      <ProfileField type="textarea" label="livros" name="books" value={data.books} onChange={(v) => update("books", v)} />
      <ProfileField type="textarea" label="música" name="music" value={data.music} onChange={(v) => update("music", v)} />
      <ProfileField type="textarea" label="programas de tv" name="tvShows" value={data.tvShows} onChange={(v) => update("tvShows", v)} />
      <ProfileField type="textarea" label="cinema" name="movies" value={data.movies} onChange={(v) => update("movies", v)} />
      <ProfileField type="textarea" label="cozinhas" name="cuisines" value={data.cuisines} onChange={(v) => update("cuisines", v)} />
    </EditTable>
  );
}

// ────────────────────────────────────────────────
// ABA CONTATO
// ────────────────────────────────────────────────

function ContactTab({
  data,
  update,
}: {
  data: ProfileContact;
  update: (key: keyof ProfileContact, value: ProfileContact[keyof ProfileContact]) => void;
}) {
  return (
    <>
      <p className="px-2.5 py-2 text-[11px] text-[#333] leading-[1.4] bg-white">
        Digite todos os endereços de e-mail.
        <br />
        Quando os membros adicionam amigos, usamos os endereços de e-mail que você fornece para identificá-lo.
      </p>
      <EditTable>
        <ProfileField
          type="text"
          label="e-mail principal"
          name="primaryEmail"
          value={data.primaryEmail}
          onChange={(v) => update("primaryEmail", v)}
          privacy
          privacyValue={data.primaryEmailPrivacy}
          onPrivacyChange={(v) => update("primaryEmailPrivacy", v)}
        />

        {data.secondaryEmails.map((item, i) => (
          <tr key={i}>
            <td className="orkut-edit-label">{i === 0 ? "e-mails secundários:" : ""}</td>
            <td className="orkut-edit-field">
              <PrivacySelect
                value={item.privacy}
                onChange={(v) => {
                  const next = [...data.secondaryEmails];
                  next[i] = { ...next[i], privacy: v };
                  update("secondaryEmails", next);
                }}
              />
              <input
                type="text"
                className="orkut-input"
                value={item.email}
                onChange={(e) => {
                  const next = [...data.secondaryEmails];
                  next[i] = { ...next[i], email: e.target.value };
                  update("secondaryEmails", next);
                }}
              />
              {" "}
              <OrkutActionButton
                variant="edit"
                onClick={() => update("secondaryEmails", data.secondaryEmails.filter((_, j) => j !== i))}
              >
                remover
              </OrkutActionButton>
            </td>
          </tr>
        ))}
        <tr>
          <td className="orkut-edit-label">{data.secondaryEmails.length === 0 ? "e-mails secundários:" : ""}</td>
          <td className="orkut-edit-field">
            <OrkutActionButton
              variant="edit"
              onClick={() =>
                update("secondaryEmails", [
                  ...data.secondaryEmails,
                  { email: "", privacy: DEFAULT_PRIVACY },
                ])
              }
            >
              adicionar
            </OrkutActionButton>
          </td>
        </tr>

        <ProfileField
          type="text"
          label="Nome de usuário IM (1)"
          name="im1"
          value={data.im1}
          onChange={(v) => update("im1", v)}
          privacy
          privacyValue={data.im1Privacy}
          onPrivacyChange={(v) => update("im1Privacy", v)}
        />
        <ProfileField
          type="text"
          label="Nome de usuário IM (2)"
          name="im2"
          value={data.im2}
          onChange={(v) => update("im2", v)}
          privacy
          privacyValue={data.im2Privacy}
          onPrivacyChange={(v) => update("im2Privacy", v)}
        />
        <ProfileField
          type="text"
          label="telefone residencial"
          name="homePhone"
          value={data.homePhone}
          onChange={(v) => update("homePhone", v)}
          privacy
          privacyValue={data.homePhonePrivacy}
          onPrivacyChange={(v) => update("homePhonePrivacy", v)}
        />
        <ProfileField
          type="text"
          label="telefone celular"
          name="mobilePhone"
          value={data.mobilePhone}
          onChange={(v) => update("mobilePhone", v)}
          privacy
          privacyValue={data.mobilePhonePrivacy}
          onPrivacyChange={(v) => update("mobilePhonePrivacy", v)}
        />
        <ProfileField type="text" label="endereço 1" name="address1" value={data.address1} onChange={(v) => update("address1", v)} />
        <ProfileField type="text" label="endereço 2" name="address2" value={data.address2} onChange={(v) => update("address2", v)} />
        <ProfileField type="text" label="cidade" name="addressCity" value={data.addressCity} onChange={(v) => update("addressCity", v)} />
        <ProfileField type="text" label="estado" name="addressState" value={data.addressState} onChange={(v) => update("addressState", v)} />
        <ProfileField type="text" label="CEP" name="addressZipCode" value={data.addressZipCode} onChange={(v) => update("addressZipCode", v)} />
        <ProfileField type="select" label="país" name="addressCountry" value={data.addressCountry} onChange={(v) => update("addressCountry", v)} options={PAISES} />
      </EditTable>
    </>
  );
}

// ────────────────────────────────────────────────
// ABA PROFISSIONAL
// ────────────────────────────────────────────────

function ProfessionalTab({
  data,
  update,
}: {
  data: ProfileProfessional;
  update: (key: keyof ProfileProfessional, value: ProfileProfessional[keyof ProfileProfessional]) => void;
}) {
  return (
    <EditTable>
      <ProfileField type="select" label="escolaridade" name="education" value={data.education} onChange={(v) => update("education", v)} options={ESCOLARIDADE_OPTIONS} />
      <ProfileField type="text" label="escola" name="school" value={data.school} onChange={(v) => update("school", v)} />
      <ProfileField type="text" label="faculdade" name="college" value={data.college} onChange={(v) => update("college", v)} />
      <ProfileField type="text" label="curso" name="course" value={data.course} onChange={(v) => update("course", v)} />
      <ProfileField type="text" label="diploma" name="degree" value={data.degree} onChange={(v) => update("degree", v)} />
      <ProfileField type="text" label="ano" name="year" value={data.year} onChange={(v) => update("year", v)} />
      <ProfileField type="text" label="profissão" name="profession" value={data.profession} onChange={(v) => update("profession", v)} />
      <ProfileField type="text" label="setor" name="sector" value={data.sector} onChange={(v) => update("sector", v)} />
      <ProfileField type="text" label="empresa" name="company" value={data.company} onChange={(v) => update("company", v)} />
      <ProfileField type="textarea" label="descrição do trabalho" name="jobDescription" value={data.jobDescription} onChange={(v) => update("jobDescription", v)} />
      <ProfileField type="text" label="telefone do trabalho" name="workPhone" value={data.workPhone} onChange={(v) => update("workPhone", v)} />
      <ProfileField type="textarea" label="habilidades profissionais" name="professionalSkills" value={data.professionalSkills} onChange={(v) => update("professionalSkills", v)} />
      <ProfileField type="textarea" label="interesses profissionais" name="professionalInterests" value={data.professionalInterests} onChange={(v) => update("professionalInterests", v)} />
    </EditTable>
  );
}

// ────────────────────────────────────────────────
// ABA PESSOAL
// ────────────────────────────────────────────────

function PersonalTab({
  data,
  update,
}: {
  data: ProfilePersonal;
  update: (key: keyof ProfilePersonal, value: ProfilePersonal[keyof ProfilePersonal]) => void;
}) {
  return (
    <EditTable>
      <ProfileField type="select" label="cor dos olhos" name="eyeColor" value={data.eyeColor} onChange={(v) => update("eyeColor", v)} options={COR_OLHOS_OPTIONS} />
      <ProfileField type="select" label="cor do cabelo" name="hairColor" value={data.hairColor} onChange={(v) => update("hairColor", v)} options={COR_CABELO_OPTIONS} />
      <ProfileField type="text" label="altura" name="height" value={data.height} onChange={(v) => update("height", v)} />
      <ProfileField type="select" label="tipo físico" name="bodyType" value={data.bodyType} onChange={(v) => update("bodyType", v)} options={TIPO_FISICO_OPTIONS} />
      <ProfileField type="select" label="aparência" name="appearance" value={data.appearance} onChange={(v) => update("appearance", v)} options={APARENCIA_OPTIONS} />
      <ProfileField type="select" label="arte no corpo" name="bodyArt" value={data.bodyArt} onChange={(v) => update("bodyArt", v)} options={ARTE_CORPO_OPTIONS} />
      <ProfileField type="textarea" label="par perfeito" name="perfectMatch" value={data.perfectMatch} onChange={(v) => update("perfectMatch", v)} />
      <ProfileField type="checkbox" label="o que me atrai" name="attractions" value={data.attractions} onChange={(v) => update("attractions", v)} options={O_QUE_ME_ATRAI_OPTIONS} />
      <ProfileField type="textarea" label="o que não suporto" name="cantStand" value={data.cantStand} onChange={(v) => update("cantStand", v)} />
      <ProfileField type="textarea" label="primeiro encontro ideal" name="idealFirstDate" value={data.idealFirstDate} onChange={(v) => update("idealFirstDate", v)} />
      <ProfileField type="textarea" label={<>com os relacionamentos<br />anteriores aprendi</>} name="pastRelationshipsLessons" value={data.pastRelationshipsLessons} onChange={(v) => update("pastRelationshipsLessons", v)} />
      <ProfileField type="textarea" label={<>o que mais chama<br />atenção em mim</>} name="whatStandsOut" value={data.whatStandsOut} onChange={(v) => update("whatStandsOut", v)} />
      <ProfileField type="select" label="do que mais gosto em mim" name="favoriteBodyPart" value={data.favoriteBodyPart} onChange={(v) => update("favoriteBodyPart", v)} options={DO_QUE_MAIS_GOSTO_OPTIONS} />
      <ProfileField type="textarea" label={<>cinco coisas sem as quais<br />não consigo viver</>} name="fiveEssentials" value={data.fiveEssentials} onChange={(v) => update("fiveEssentials", v)} />
      <ProfileField type="textarea" label="no meu quarto você encontra" name="inMyRoom" value={data.inMyRoom} onChange={(v) => update("inMyRoom", v)} />
    </EditTable>
  );
}

// ────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ────────────────────────────────────────────────

function mergeWithDefaults<T extends Record<string, unknown>>(defaults: T, data: Record<string, unknown> | null): T {
  if (!data) return { ...defaults };
  const merged = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (data[key] !== undefined && data[key] !== null) {
      (merged as Record<string, unknown>)[key] = data[key];
    }
  }
  return merged;
}

export function EditProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("geral");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const generalForm = useTabForm<ProfileGeneral>(INITIAL_GENERAL);
  const socialForm = useTabForm<ProfileSocial>(INITIAL_SOCIAL);
  const contactForm = useTabForm<ProfileContact>(INITIAL_CONTACT);
  const professionalForm = useTabForm<ProfileProfessional>(INITIAL_PROFESSIONAL);
  const personalForm = useTabForm<ProfilePersonal>(INITIAL_PERSONAL);

  useEffect(() => {
    async function loadAllProfiles() {
      try {
        const sections = ["general", "social", "contact", "professional", "personal"] as const;
        const results = await Promise.all(
          sections.map((s) => fetch(`/api/profile/${s}`).then((r) => (r.ok ? r.json() : null)))
        );

        const [general, social, contact, professional, personal] = results;
        generalForm.reset(mergeWithDefaults(INITIAL_GENERAL, general));
        socialForm.reset(mergeWithDefaults(INITIAL_SOCIAL, social));
        contactForm.reset(mergeWithDefaults(INITIAL_CONTACT, contact));
        professionalForm.reset(mergeWithDefaults(INITIAL_PROFESSIONAL, professional));
        personalForm.reset(mergeWithDefaults(INITIAL_PERSONAL, personal));
      } catch {
        // keep defaults on error
      } finally {
        setLoading(false);
      }
    }
    loadAllProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTabSwitch(newTab: Tab) {
    if (newTab === activeTab) return;
    setErrors({});
    setActiveTab(newTab);
  }

  async function handleUpdate() {
    setErrors({});

    const generalErrors = validateGeneral(generalForm.data);
    if (Object.keys(generalErrors).length > 0) {
      setErrors(generalErrors);
      return;
    }

    const updates = [
      { section: "general", payload: generalForm.getDirtyPayload(), commit: generalForm.commit },
      { section: "social", payload: socialForm.getDirtyPayload(), commit: socialForm.commit },
      { section: "contact", payload: contactForm.getDirtyPayload(), commit: contactForm.commit },
      { section: "professional", payload: professionalForm.getDirtyPayload(), commit: professionalForm.commit },
      { section: "personal", payload: personalForm.getDirtyPayload(), commit: personalForm.commit },
    ] as const;

    const dirtyUpdates = updates.filter(({ payload }) => Object.keys(payload).length > 0);
    if (dirtyUpdates.length === 0) {
      return;
    }

    setSaving(true);
    try {
      const failedSection = await Promise.all(dirtyUpdates.map(async (update) => {
        const res = await fetch(`/api/profile/${update.section}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update.payload),
        });
        return res.ok ? null : update.section;
      }));

      if (failedSection.some(Boolean)) {
        throw new Error("save failed");
      }

      dirtyUpdates.forEach((update) => update.commit());
    } catch {
      setErrors({ _form: "Erro ao salvar. Tente novamente." });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setErrors({});
    generalForm.cancel();
    socialForm.cancel();
    contactForm.cancel();
    professionalForm.cancel();
    personalForm.cancel();
  }

  if (loading) {
    return (
      <div className="orkut-edit-page">
        <h2 className="orkut-title">Editar perfil</h2>
        <p className="px-2.5 py-4 text-[12px] text-[#666]">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="orkut-edit-page">
      <h2 className="orkut-title">Editar perfil</h2>
      <p className="orkut-breadcrumb">
        <Link href="/">Início</Link>
        <span className="orkut-breadcrumb-sep">&gt;</span>
        <Link href="/Profile">Meu perfil</Link>
        <span className="orkut-breadcrumb-sep">&gt;</span>
        Editar perfil
      </p>

      {/* aba navegação */}
      <div className="orkut-edit-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              activeTab === tab.key
                ? "orkut-edit-tab orkut-edit-tab-active"
                : "orkut-edit-tab"
            }
            onClick={() => handleTabSwitch(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* conteúdo da aba */}
      <div className="orkut-edit-body">
        {errors._form && (
          <p className="px-2.5 py-2 text-[12px] text-red-600 bg-red-50">{errors._form}</p>
        )}

        {activeTab === "geral" && <GeneralTab data={generalForm.data} update={generalForm.update} errors={errors} />}
        {activeTab === "social" && <SocialTab data={socialForm.data} update={socialForm.update} />}
        {activeTab === "contato" && <ContactTab data={contactForm.data} update={contactForm.update} />}
        {activeTab === "profissional" && <ProfessionalTab data={professionalForm.data} update={professionalForm.update} />}
        {activeTab === "pessoal" && <PersonalTab data={personalForm.data} update={personalForm.update} />}

        <div className="orkut-edit-buttons">
          <OrkutActionButton variant="edit" onClick={handleUpdate} disabled={saving}>
            {saving ? "salvando..." : "atualizar"}
          </OrkutActionButton>
          {" "}
          <OrkutActionButton variant="edit" onClick={handleCancel} disabled={saving}>
            cancelar
          </OrkutActionButton>
        </div>
      </div>

    </div>
  );
}
