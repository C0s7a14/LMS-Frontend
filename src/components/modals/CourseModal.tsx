import {
  BookOpen,
  Check,
  Cpu,
  Loader2,
  Plus,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";


import { api } from "../../services/api";
import toast from "react-hot-toast";

interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
}

interface CourseFormData {
  titulo: string;
  descricao: string;
  thumbnail: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CourseModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [creating, setCreating] =
    useState(false);

  const [devices, setDevices] =
    useState<DeviceType[]>([]);

  const [
    selectedDevices,
    setSelectedDevices,
  ] = useState<number[]>([]);

  const [formData, setFormData] =
    useState<CourseFormData>({
      titulo: "",
      descricao: "",
      thumbnail: "",
    });

  async function getDevices() {
  try {
    const response =
      await api.get<DeviceType[]>(
        "/devices",
      );

    setDevices(response.data);
  } catch (error) {
    console.log(error);

    toast.error(
      "Erro ao carregar dispositivos.",
    );
  }
}

  useEffect(() => {
    if (isOpen) {
      void getDevices();
    }
  }, [isOpen]);

  function toggleDevice(
    deviceId: number,
  ) {
    setSelectedDevices(
      (current) =>
        current.includes(deviceId)
          ? current.filter(
              (id) =>
                id !== deviceId,
            )
          : [...current, deviceId],
    );
  }

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!formData.titulo.trim()) {
      alert(
        "O título do curso é obrigatório",
      );
      return;
    }

    try {
      setCreating(true);

      const user =
        JSON.parse(
          localStorage.getItem(
            "user",
          ) || "{}",
        );

      if (!user?.id) {
        alert(
          "Usuário logado não encontrado",
        );
        return;
      }

    const response =
  await api.post(
    "/courses",
    {
      titulo:
        formData.titulo.trim(),

      descricao:
        formData.descricao.trim(),

      thumbnail:
        formData.thumbnail.trim(),

      criado_por:
        user.id,
    },
  );

      const courseId =
        response.data.courseId ||
        response.data.cursoId ||
        response.data.id;

      if (
        courseId &&
        selectedDevices.length > 0
      ) {
       await Promise.all(
        selectedDevices.map(
          (deviceId) =>
            api.post(
              `/devices/courses/${courseId}/devices/${deviceId}`,
            ),
        ),
      );
            }

      setFormData({
        titulo: "",
        descricao: "",
        thumbnail: "",
      });

      setSelectedDevices([]);

      onSuccess();
      onClose();
   } catch (error: any) {
  console.log(error);

  toast.error(
    error.response?.data?.error ||
      error.response?.data?.message ||
      "Erro ao cadastrar curso.",
  );
} finally {
      setCreating(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-[110]

        flex
        items-center
        justify-center

        bg-black/60
        backdrop-blur-[2px]

        p-3 sm:p-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-course-title"
        className="
          w-full
          max-w-3xl

          max-h-[calc(100dvh-24px)]

          overflow-y-auto
          overscroll-contain

          bg-white
          dark:bg-[#091a2c]

          rounded-2xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky top-0 z-10

            flex
            items-start
            justify-between

            gap-4

            bg-white/95
            dark:bg-[#091a2c]/95

            backdrop-blur-xl

            border-b
            border-gray-200
            dark:border-white/10

            px-4 sm:px-6
            py-4 sm:py-5
          "
        >
          <div
            className="
              min-w-0
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                w-10 h-10
                sm:w-12 sm:h-12

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                text-[var(--company-primary)]

                flex
                items-center
                justify-center

                shrink-0
              "
            >
              <BookOpen size={24} />
            </div>

            <div className="min-w-0">
              <h2
                id="new-course-title"
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Novo Curso
              </h2>

              <p
                className="
                  mt-1
                  text-sm

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Cadastre um curso e, se necessário, associe dispositivos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            aria-label="Fechar modal"
            className="
              w-10 h-10

              rounded-xl

              flex
              items-center
              justify-center

              text-gray-500

              hover:bg-red-500/10
              hover:text-red-500

              transition-all

              disabled:opacity-60

              shrink-0
            "
          >
            <X size={23} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            p-4
            sm:p-6

            grid
            grid-cols-1
            sm:grid-cols-2

            gap-4
            sm:gap-5
          "
        >
          {/* TÍTULO */}
          <div
            className="
              sm:col-span-2

              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-course-name"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              Título do Curso
            </label>

            <input
              id="new-course-name"
              type="text"
              value={formData.titulo}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  titulo:
                    event.target.value,
                })
              }
              placeholder="Ex: Instalação e configuração de gateway"
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                rounded-2xl

                px-4 py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* DESCRIÇÃO */}
          <div
            className="
              sm:col-span-2

              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-course-description"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              Descrição
            </label>

            <textarea
              id="new-course-description"
              value={
                formData.descricao
              }
              onChange={(event) =>
                setFormData({
                  ...formData,
                  descricao:
                    event.target.value,
                })
              }
              placeholder="Descrição do curso..."
              rows={4}
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                rounded-2xl

                px-4 py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                resize-none

                transition-all
              "
            />
          </div>

          {/* THUMBNAIL */}
          <div
            className="
              sm:col-span-2

              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-course-thumbnail"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              URL da Thumbnail
            </label>

            <input
              id="new-course-thumbnail"
              type="text"
              value={
                formData.thumbnail
              }
              onChange={(event) =>
                setFormData({
                  ...formData,
                  thumbnail:
                    event.target.value,
                })
              }
              placeholder="https://imagem.com/curso.png"
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                rounded-2xl

                px-4 py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* PREVIEW */}
          {formData.thumbnail && (
            <div
              className="
                sm:col-span-2

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                p-3 sm:p-4
              "
            >
              <p
                className="
                  mb-3

                  text-sm
                  font-semibold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Prévia da imagem
              </p>

              <div
                className="
                  rounded-2xl

                  bg-gray-100
                  dark:bg-[#0d2238]

                  overflow-hidden
                "
              >
                <img
                  src={formData.thumbnail}
                  alt="Prévia do curso"
                  className="
                    w-full
                    max-h-64
                    object-contain
                  "
                />
              </div>
            </div>
          )}

          {/* DISPOSITIVOS */}
          <div
            className="
              sm:col-span-2
              mt-2
            "
          >
            <div
              className="
                flex
                items-center
                gap-2

                mb-3
              "
            >
              <Cpu
                size={20}
                className="
                  text-[var(--company-primary)]
                "
              />

              <h3
                className="
                  text-[#080E2F]
                  dark:text-white

                  font-semibold
                "
              >
                Dispositivos relacionados
              </h3>
            </div>

            <p
              className="
                mb-4

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              O vínculo é opcional. Cursos gerais podem ser criados
              sem selecionar nenhum dispositivo.
            </p>

            {devices.length === 0 ? (
              <div
                className="
                  bg-gray-50
                  dark:bg-[#0d2238]

                  border
                  border-gray-200
                  dark:border-white/10

                  rounded-2xl

                  p-4

                  text-sm

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Nenhum dispositivo cadastrado.
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2

                  gap-3
                "
              >
                {devices.map(
                  (device) => {
                    const selected =
                      selectedDevices.includes(
                        device.id,
                      );

                    return (
                      <button
                        key={device.id}
                        type="button"
                        onClick={() =>
                          toggleDevice(
                            device.id,
                          )
                        }
                        className={`
                          min-w-0

                          text-left

                          rounded-2xl

                          border

                          p-4

                          flex
                          items-center
                          gap-3

                          transition-all

                          ${
                            selected
                              ? `
                                  bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                                  border-[var(--company-primary)]
                                `
                              : `
                                  bg-gray-50
                                  dark:bg-[#0d2238]

                                  border-gray-200
                                  dark:border-white/10

                                  hover:border-[color-mix(in_srgb,var(--company-primary)_45%,transparent)]
                                `
                          }
                        `}
                      >
                        <div
                          className={`
                            w-10 h-10

                            rounded-xl

                            flex
                            items-center
                            justify-center

                            shrink-0

                            ${
                              selected
                                ? `
                                    bg-[var(--company-primary)]
                                    text-white
                                  `
                                : `
                                    bg-white
                                    dark:bg-white/5
                                    text-[var(--company-primary)]
                                  `
                            }
                          `}
                        >
                          {selected ? (
                            <Check
                              size={19}
                            />
                          ) : (
                            <Cpu
                              size={19}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              font-semibold

                              text-[#080E2F]
                              dark:text-white

                              break-words
                            "
                          >
                            {device.nome}
                          </p>

                          <span
                            className="
                              text-sm

                              text-gray-500
                              dark:text-gray-400

                              break-words
                            "
                          >
                            {device.modelo ||
                              device.tipo ||
                              "Dispositivo"}
                          </span>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* AÇÕES */}
          <div
            className="
              sm:col-span-2

              grid
              grid-cols-1
              sm:grid-cols-2

              gap-3

              mt-2
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="
                w-full

                px-5 py-3

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                text-gray-600
                dark:text-gray-300

                font-semibold

                hover:bg-gray-100
                dark:hover:bg-white/5

                transition-all

                disabled:opacity-60
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={creating}
              className="
                w-full

                px-6 py-3

                rounded-2xl

                bg-gradient-to-r
                from-[var(--company-primary)]
                to-[var(--company-secondary)]

                text-white
                font-semibold

                flex
                items-center
                justify-center
                gap-2

                shadow-lg

                hover:brightness-105

                transition-all

                active:scale-[0.99]

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {creating ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Cadastrando...
                </>
              ) : (
                <>
                  <Plus size={18} />

                  Cadastrar Curso
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}