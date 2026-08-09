import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Cpu,
  Plus,
  Save,
  UserRound,
  X,
} from "lucide-react";


import type {
  CreateFreelancerInvitePayload,
  FreelancerCourseOption,
  FreelancerDeviceOption,
  FreelancerInviteType,
  FreelancerInviteTypeData,
  FreelancerProfessionalOption,
  UpdateFreelancerInvitePayload,
} from "../types/freelancerInvite.types";


interface FreelancerInviteFormProps {
  professionals: FreelancerProfessionalOption[];
  devices: FreelancerDeviceOption[];
  courses: FreelancerCourseOption[];

  editingInvite: FreelancerInviteTypeData | null;

  creating: boolean;
  updatingInviteId: number | null;

  onCreate: (
    data: CreateFreelancerInvitePayload,
  ) => Promise<FreelancerInviteTypeData | null>;

  onUpdate: (
    inviteId: number,
    data: UpdateFreelancerInvitePayload,
  ) => Promise<FreelancerInviteTypeData | null>;

  onCancelEdit: () => void;
}

type ProfessionalMode =
  | "registered"
  | "external";

export default function FreelancerInviteForm({
  professionals,
  devices,
  courses,
  editingInvite,
  creating,
  updatingInviteId,
  onCreate,
  onUpdate,
  onCancelEdit,
}: FreelancerInviteFormProps) {
  const [professionalMode, setProfessionalMode] =
    useState<ProfessionalMode>("registered");

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [professionalName, setProfessionalName] =
    useState("");

  const [professionalEmail, setProfessionalEmail] =
    useState("");

  const [opportunity, setOpportunity] =
    useState("");

  const [inviteType, setInviteType] =
    useState<FreelancerInviteType>(
      "freelancer",
    );

  const [deviceId, setDeviceId] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [deadline, setDeadline] =
    useState("");




const selectedProfessional =
  useMemo(
    () =>
      professionals.find(
        (professional) =>
          professional.id ===
          Number(selectedUserId),
      ),
    [
      professionals,
      selectedUserId,
    ],
  );

  function resetForm() {
    setProfessionalMode("registered");
    setSelectedUserId("");

    setProfessionalName("");
    setProfessionalEmail("");

    setOpportunity("");
    setInviteType("freelancer");

    setDeviceId("");
    setCourseId("");

    setMessage("");
    setDeadline("");
  }

  function toDateTimeLocal(
    value?: string | null,
  ) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value
        .replace(" ", "T")
        .slice(0, 16);
    }

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      date.getDate(),
    ).padStart(2, "0");

    const hours = String(
      date.getHours(),
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function toMysqlDateTime(
    value: string,
  ) {
    if (!value) {
      return null;
    }

    return `${value.replace(
      "T",
      " ",
    )}:00`;
  }

  useEffect(() => {
    if (!editingInvite) {
      return;
    }

    if (
      editingInvite.profissional_user_id
    ) {
      setProfessionalMode(
        "registered",
      );

      setSelectedUserId(
        String(
          editingInvite.profissional_user_id,
        ),
      );

      setProfessionalName("");
      setProfessionalEmail("");
    } else {
      setProfessionalMode("external");

      setSelectedUserId("");

      setProfessionalName(
        editingInvite.profissional_nome,
      );

      setProfessionalEmail(
        editingInvite.profissional_email,
      );
    }

    setOpportunity(
      editingInvite.oportunidade,
    );

    setInviteType(
      editingInvite.tipo_convite,
    );

    setDeviceId(
      editingInvite.dispositivo_id
        ? String(
            editingInvite.dispositivo_id,
          )
        : "",
    );

    setCourseId(
      editingInvite.curso_certificacao_id
        ? String(
            editingInvite.curso_certificacao_id,
          )
        : "",
    );

    setMessage(
      editingInvite.mensagem ?? "",
    );

    setDeadline(
      toDateTimeLocal(
        editingInvite.prazo_resposta_em,
      ),
    );
  }, [editingInvite]);

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (
      professionalMode ===
        "registered" &&
      !selectedProfessional
    ) {
      return;
    }

    const basePayload = {
      oportunidade:
        opportunity.trim(),

      tipoConvite:
        inviteType,

      dispositivoId:
        deviceId
          ? Number(deviceId)
          : null,

      cursoCertificacaoId:
        courseId
          ? Number(courseId)
          : null,

      mensagem:
        message.trim() || null,

      prazoRespostaEm:
        toMysqlDateTime(
          deadline,
        ),
    };

    const professionalPayload =
      professionalMode ===
      "registered"
        ? {
            profissionalUserId:
              selectedProfessional!.id,

            profissionalNome:
              undefined,

            profissionalEmail:
              undefined,
          }
        : {
            profissionalUserId:
              null,

            profissionalNome:
              professionalName.trim(),

            profissionalEmail:
              professionalEmail
                .trim()
                .toLowerCase(),
          };

    if (editingInvite) {
      const result =
        await onUpdate(
          editingInvite.id,
          {
            ...basePayload,
            ...professionalPayload,
          },
        );

      if (result) {
        resetForm();
        onCancelEdit();
      }

      return;
    }

    const result =
      await onCreate({
        ...basePayload,
        ...professionalPayload,
      });

    if (result) {
      resetForm();
    }
  }

  const saving =
    creating ||
    updatingInviteId ===
      editingInvite?.id;

  return (
    <form
  onSubmit={handleSubmit}
  className="
    w-full
    max-w-[760px]
    mx-auto

    2xl:max-w-none
    2xl:mx-0
    2xl:sticky
    2xl:top-6

    rounded-3xl
    border
    border-gray-200
    dark:border-white/10
    bg-white
    dark:bg-[#0d2238]
    p-4
    sm:p-5
    lg:p-6
  "
>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className="
              w-11
              h-11
              rounded-2xl
              bg-blue-500/10
              text-blue-600
              dark:text-blue-400
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            {editingInvite ? (
              <Save size={20} />
            ) : (
              <Plus size={20} />
            )}
          </div>

          <div>
            <h2 className="font-bold text-[#080E2F] dark:text-white">
              {editingInvite
                ? "Editar Convite"
                : "Novo Convite"}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {editingInvite
                ? "Atualize o rascunho selecionado."
                : "Crie uma nova oportunidade profissional."}
            </p>
          </div>
        </div>

        {editingInvite && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              onCancelEdit();
            }}
            className="
              rounded-xl
              p-2
              text-gray-400
              hover:bg-gray-100
              dark:hover:bg-white/10
              transition-all
            "
            title="Cancelar edição"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <div className="space-y-5">

        {/* PROFISSIONAL */}
        <div>
          <label className="text-sm font-semibold text-[#080E2F] dark:text-white">
            Profissional
          </label>

          <div
            className="
              grid
              grid-cols-2
              gap-2
              mt-2
              rounded-xl
              bg-gray-100
              dark:bg-white/5
              p-1
            "
          >
            <button
              type="button"
              onClick={() =>
                setProfessionalMode(
                  "registered",
                )
              }
              className={`
                rounded-lg
                px-3
                py-2.5
                text-sm
                font-semibold
                transition-all
                ${
                  professionalMode ===
                  "registered"
                    ? `
                      bg-white
                      dark:bg-[#14304a]
                      text-blue-600
                      dark:text-blue-400
                      shadow-sm
                    `
                    : `
                      text-gray-500
                      dark:text-gray-400
                    `
                }
              `}
            >
              Cadastrado
            </button>

            <button
              type="button"
              onClick={() =>
                setProfessionalMode(
                  "external",
                )
              }
              className={`
                rounded-lg
                px-3
                py-2.5
                text-sm
                font-semibold
                transition-all
                ${
                  professionalMode ===
                  "external"
                    ? `
                      bg-white
                      dark:bg-[#14304a]
                      text-blue-600
                      dark:text-blue-400
                      shadow-sm
                    `
                    : `
                      text-gray-500
                      dark:text-gray-400
                    `
                }
              `}
            >
              Externo
            </button>
          </div>
        </div>

        {professionalMode ===
        "registered" ? (
          <div>
            <div className="relative">
              <UserRound
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  pointer-events-none
                "
              />

              <select
                required
                value={selectedUserId}
                onChange={(event) =>
                  setSelectedUserId(
                    event.target.value,
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  dark:border-white/10
                  bg-white
                  dark:bg-[#0d2238]
                  pl-10
                  pr-3
                  py-3
                  text-sm
                  text-[#080E2F]
                  dark:text-white
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value="">
                  Selecione um profissional
                </option>

                {professionals.map(
                (professional) => (
                  <option
                    key={professional.id}
                    value={professional.id}
                  >
                    {professional.name} —{" "}
                    {professional.email}
                  </option>
                ),
              )}
              </select>
            </div>

            {selectedProfessional && (
              <div
                className="
                  mt-2
                  rounded-xl
                  bg-blue-500/5
                  border
                  border-blue-500/10
                  p-3
                "
              >
                <p className="text-sm font-semibold text-[#080E2F] dark:text-white">
                  {
                    selectedProfessional.name
                  }
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {
                    selectedProfessional.email
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <Field
              label="Nome"
              value={professionalName}
              onChange={
                setProfessionalName
              }
              placeholder="Nome do profissional"
              required
            />

            <Field
              label="E-mail"
              type="email"
              value={professionalEmail}
              onChange={
                setProfessionalEmail
              }
              placeholder="profissional@email.com"
              required
            />
          </>
        )}

        {/* OPORTUNIDADE */}
        <Field
          label="Oportunidade"
          value={opportunity}
          onChange={setOpportunity}
          placeholder="Ex: Instalação Sirros S1"
          required
        />

        {/* TIPO */}
        <div>
          <label className="text-sm font-semibold text-[#080E2F] dark:text-white">
            Tipo de oportunidade
          </label>

          <div className="relative mt-2">
            <BriefcaseBusiness
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <select
              value={inviteType}
              onChange={(event) =>
                setInviteType(
                  event.target
                    .value as FreelancerInviteType,
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
                bg-white
                dark:bg-[#0d2238]
                pl-10
                pr-3
                py-3
                text-sm
                text-[#080E2F]
                dark:text-white
                outline-none
                focus:border-blue-500
              "
            >
              <option value="freelancer">
                Freelancer
              </option>

              <option value="contratacao">
                Contratação
              </option>

              <option value="parceria">
                Parceria
              </option>
            </select>
          </div>
        </div>

        {/* DISPOSITIVO */}
        <div>
          <label className="text-sm font-semibold text-[#080E2F] dark:text-white">
            Dispositivo
          </label>

          <div className="relative mt-2">
            <Cpu
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <select
              value={deviceId}
              onChange={(event) =>
                setDeviceId(
                  event.target.value,
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
                bg-white
                dark:bg-[#0d2238]
                pl-10
                pr-3
                py-3
                text-sm
                text-[#080E2F]
                dark:text-white
                outline-none
                focus:border-blue-500
              "
            >
              <option value="">
                Nenhum dispositivo
              </option>

              {devices.map(
                (device) => (
                  <option
                    key={device.id}
                    value={device.id}
                  >
                    {device.nome}
                    {device.modelo
                      ? ` — ${device.modelo}`
                      : ""}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* CERTIFICAÇÃO */}
        <div>
          <label className="text-sm font-semibold text-[#080E2F] dark:text-white">
            Certificação exigida
          </label>

          <div className="relative mt-2">
            <Award
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <select
              value={courseId}
              onChange={(event) =>
                setCourseId(
                  event.target.value,
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
                bg-white
                dark:bg-[#0d2238]
                pl-10
                pr-3
                py-3
                text-sm
                text-[#080E2F]
                dark:text-white
                outline-none
                focus:border-blue-500
              "
            >
              <option value="">
                Nenhuma certificação
              </option>

              {courses.map(
                  (course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.titulo}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* PRAZO */}
        <div>
          <label className="text-sm font-semibold text-[#080E2F] dark:text-white">
            Prazo para resposta
          </label>

          <div className="relative mt-2">
            <CalendarDays
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
              "
            />

            <input
              type="datetime-local"
              value={deadline}
              onChange={(event) =>
                setDeadline(
                  event.target.value,
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
                bg-white
                dark:bg-[#0d2238]
                pl-10
                pr-3
                py-3
                text-sm
                text-[#080E2F]
                dark:text-white
                outline-none
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* MENSAGEM */}
        <div>
          <label className="text-sm font-semibold text-[#080E2F] dark:text-white">
            Mensagem
          </label>

          <textarea
            rows={5}
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value,
              )
            }
            placeholder="Descreva a oportunidade, local, atividades e demais informações..."
            className="
              w-full
              mt-2
              rounded-xl
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-[#0d2238]
              px-3
              py-3
              text-sm
              text-[#080E2F]
              dark:text-white
              outline-none
              resize-none
              focus:border-blue-500
            "
          />
        </div>

        {/* AÇÃO */}
        <div
          className={`
            grid
            gap-2
            pt-1
            ${
              editingInvite
                ? "grid-cols-2"
                : "grid-cols-1"
            }
          `}
        >
          {editingInvite && (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
              className="
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-600
                dark:text-gray-300
                hover:bg-gray-50
                dark:hover:bg-white/5
                disabled:opacity-50
                transition-all
              "
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-3
              text-sm
              font-bold
              text-white
              hover:bg-blue-700
              disabled:opacity-60
              transition-all
            "
          >
            {editingInvite ? (
              <Save size={18} />
            ) : (
              <Plus size={18} />
            )}

            {saving
              ? "Salvando..."
              : editingInvite
                ? "Salvar alterações"
                : "Criar rascunho"}
          </button>
        </div>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;

  type?: string;
  required?: boolean;

  onChange: (
    value: string,
  ) => void;
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#080E2F] dark:text-white">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        className="
          w-full
          mt-2
          rounded-xl
          border
          border-gray-200
          dark:border-white/10
          bg-white
          dark:bg-[#0d2238]
          px-3
          py-3
          text-sm
          text-[#080E2F]
          dark:text-white
          outline-none
          focus:border-blue-500
        "
      />
    </div>
  );
}