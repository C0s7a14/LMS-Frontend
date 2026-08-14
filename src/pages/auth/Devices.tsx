import {
  ArrowRight,
  Cpu,
  Grid3X3,
  List,
  Plus,
  Search,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  api,
} from "../../services/api";

import DeviceModal from "../../components/modals/DeviceModal";

interface DeviceType {
  id: number;
  nome: string;

  modelo?: string;
  tipo?: string;
  descricao?: string;

  imagem_url?: string;
  criado_em?: string;

  course_id?: number | null;
}

export default function Device() {
  const navigate =
    useNavigate();

  const [
    devices,
    setDevices,
  ] = useState<DeviceType[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    viewMode,
    setViewMode,
  ] = useState<
    "grid" | "list"
  >("grid");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const storedUser =
    localStorage.getItem(
      "user",
    );

  const user =
    storedUser
      ? JSON.parse(
          storedUser,
        )
      : null;

  const userRole =
    user?.role;

  const isAdmin =
    userRole === "admin";

  const isClient =
    userRole === "client" ||
    userRole === "cliente";

  async function getDevices() {
    try {
      setLoading(true);

      const endpoint =
        isClient
          ? "/client/devices"
          : "/devices";

      const response =
        await api.get<
          DeviceType[]
        >(endpoint);

      setDevices(
        response.data,
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Erro ao buscar dispositivos",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void getDevices();
  }, []);

  const searchLower =
    search
      .trim()
      .toLowerCase();

  const filteredDevices =
    devices.filter(
      (device) => {
        if (!searchLower) {
          return true;
        }

        return (
          device.nome
            ?.toLowerCase()
            .includes(
              searchLower,
            ) ||
          device.modelo
            ?.toLowerCase()
            .includes(
              searchLower,
            ) ||
          device.tipo
            ?.toLowerCase()
            .includes(
              searchLower,
            ) ||
          device.descricao
            ?.toLowerCase()
            .includes(
              searchLower,
            )
        );
      },
    );

  const pageTitle =
    isClient
      ? "Meus Dispositivos"
      : "Dispositivos";

  const pageSubtitle =
    isClient
      ? "Acesse os dispositivos vinculados à sua empresa."
      : "Gerencie os dispositivos cadastrados na plataforma.";

  const emptyTitle =
    searchLower
      ? "Nenhum dispositivo encontrado"
      : isClient
        ? "Nenhum dispositivo vinculado"
        : "Nenhum dispositivo cadastrado";

  const emptyDescription =
    searchLower
      ? "Nenhum dispositivo corresponde à busca realizada."
      : isClient
        ? "Nenhum dispositivo foi vinculado à sua conta ainda."
        : "Cadastre dispositivos para eles aparecerem aqui.";

  function handleOpenDevice(
    device: DeviceType,
  ) {
    if (isClient) {
      navigate(
        `/devices/${device.id}`,
      );

      return;
    }

    /*
      Mantém o comportamento
      legado do Admin por enquanto.
    */
    if (device.course_id) {
      navigate(
        `/courses/${device.course_id}`,
      );

      return;
    }

    navigate(
      "/Dashboard",
    );
  }

  return (
    <main
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          flex-col

          gap-5
          lg:gap-6

          xl:flex-row
          xl:items-end
          xl:justify-between
        "
      >
        <div className="min-w-0">
          <h1
            className="
              text-2xl
              sm:text-3xl
              lg:text-4xl

              font-bold

              text-[#080E2F]
              dark:text-white

              leading-tight
            "
          >
            {pageTitle}
          </h1>

          <p
            className="
              mt-2

              max-w-3xl

              text-sm
              sm:text-base
              lg:text-lg

              text-gray-500
              dark:text-gray-400

              leading-relaxed
            "
          >
            {pageSubtitle}
          </p>

          <div
            className="
              mt-4

              inline-flex
              items-center

              gap-2

              rounded-2xl

              border
              border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

              bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

              px-4
              py-2

              text-sm
              font-semibold

              text-[var(--company-primary)]
            "
          >
            <Cpu
              size={18}
              className="shrink-0"
            />

            {filteredDevices.length}{" "}
            dispositivo
            {filteredDevices.length !==
            1
              ? "s"
              : ""}
          </div>
        </div>

        <div
          className="
            w-full

            flex
            flex-col

            gap-3

            sm:flex-row
            sm:items-center

            xl:w-auto
          "
        >
          {/* BUSCA */}
          <div
            className="
              relative

              w-full

              sm:flex-1
              xl:w-[360px]

              rounded-2xl

              shadow-2xl
              dark:shadow-sm
            "
          >
            <Search
              size={20}
              className="
                absolute

                left-4
                top-1/2

                -translate-y-1/2

                text-gray-400

                pointer-events-none
              "
            />

            <input
              type="search"
              placeholder="Buscar dispositivos..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              className="
                w-full
                min-w-0

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                py-3.5
                sm:py-4

                pl-12
                pr-4

                text-sm
                sm:text-base

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                outline-none

                focus:border-[var(--company-primary)]

                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* NOVO DISPOSITIVO - ADMIN */}
          {isAdmin && (
            <button
              type="button"
              onClick={() =>
                setModalOpen(
                  true,
                )
              }
              className="
                min-h-[52px]

                rounded-2xl

                bg-gradient-to-r
                from-[var(--company-primary)]
                to-[var(--company-secondary)]

                px-5

                flex
                items-center
                justify-center

                gap-2

                font-semibold

                text-white

                shadow-2xl
                dark:shadow-sm

                transition-all

                hover:opacity-95
              "
            >
              <Plus size={20} />

              Novo Dispositivo
            </button>
          )}

          {/* VISUALIZAÇÃO */}
          <div
            className="
              hidden
              sm:flex

              shrink-0

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-1

              shadow-2xl
              dark:shadow-sm
            "
          >
            <button
              type="button"
              onClick={() =>
                setViewMode(
                  "grid",
                )
              }
              aria-label="Visualizar dispositivos em grade"
              className={`
                w-11
                h-11

                lg:w-12
                lg:h-12

                rounded-xl

                flex
                items-center
                justify-center

                transition-all

                ${
                  viewMode ===
                  "grid"
                    ? `
                        bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                        text-[var(--company-primary)]
                      `
                    : `
                        text-gray-500
                        dark:text-gray-400

                        hover:bg-gray-100
                        dark:hover:bg-white/5
                      `
                }
              `}
            >
              <Grid3X3
                size={21}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode(
                  "list",
                )
              }
              aria-label="Visualizar dispositivos em lista"
              className={`
                w-11
                h-11

                lg:w-12
                lg:h-12

                rounded-xl

                flex
                items-center
                justify-center

                transition-all

                ${
                  viewMode ===
                  "list"
                    ? `
                        bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                        text-[var(--company-primary)]
                      `
                    : `
                        text-gray-500
                        dark:text-gray-400

                        hover:bg-gray-100
                        dark:hover:bg-white/5
                      `
                }
              `}
            >
              <List size={23} />
            </button>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div
          className="
            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-10

            text-center

            text-gray-500
            dark:text-gray-400

            shadow-2xl
            dark:shadow-sm

            animate-pulse
          "
        >
          Carregando
          dispositivos...
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        filteredDevices.length ===
          0 && (
          <div
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              px-5
              py-10
              sm:p-12

              text-center

              shadow-2xl
              dark:shadow-sm
            "
          >
            <div
              className="
                w-16
                h-16

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                flex
                items-center
                justify-center

                mx-auto
                mb-4
              "
            >
              <Cpu
                size={34}
                className="
                  text-[var(--company-primary)]
                "
              />
            </div>

            <h2
              className="
                text-lg
                sm:text-xl

                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              {emptyTitle}
            </h2>

            <p
              className="
                mt-2

                max-w-lg
                mx-auto

                text-sm
                sm:text-base

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              {emptyDescription}
            </p>
          </div>
        )}

      {/* DEVICES */}
      {!loading &&
        filteredDevices.length >
          0 && (
          <div
            className={
              viewMode === "grid"
                ? `
                    grid
                    grid-cols-1

                    lg:grid-cols-2
                    2xl:grid-cols-3

                    gap-5
                    sm:gap-6
                    2xl:gap-7
                  `
                : `
                    flex
                    flex-col

                    gap-5
                  `
            }
          >
            {filteredDevices.map(
              (device) => (
                <article
                  key={device.id}
                  className={`
                    w-full
                    min-w-0

                    overflow-hidden

                    rounded-2xl
                    sm:rounded-3xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-white
                    dark:bg-[#091a2c]

                    shadow-2xl
                    dark:shadow-sm

                    transition-all
                    duration-200

                    hover:border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]

                    ${
                      viewMode ===
                      "list"
                        ? `
                            flex
                            flex-col

                            xl:flex-row
                          `
                        : ""
                    }
                  `}
                >
                  {/* IMAGEM */}
                  <div
                    className={`
                      relative

                      shrink-0

                      overflow-hidden

                      bg-gray-100
                      dark:bg-[#0d2238]

                      ${
                        viewMode ===
                        "list"
                          ? `
                              h-56
                              sm:h-64

                              xl:h-auto
                              xl:min-h-[260px]
                              xl:w-[320px]
                            `
                          : `
                              h-52
                              sm:h-60
                              xl:h-64
                            `
                      }
                    `}
                  >
                    {/* TIPO */}
                    <div
                      className="
                        absolute

                        top-3
                        left-3

                        sm:top-5
                        sm:left-5

                        z-10

                        inline-flex
                        items-center

                        gap-2

                        rounded-xl

                        border
                        border-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                        bg-[color-mix(in_srgb,var(--company-primary)_12%,white)]

                        dark:bg-[color-mix(in_srgb,var(--company-primary)_15%,#091a2c)]

                        px-3
                        py-2

                        text-xs
                        sm:text-sm

                        font-semibold

                        text-[var(--company-primary)]

                        shadow-lg
                      "
                    >
                      <Cpu
                        size={15}
                      />

                      {device.tipo ||
                        "Dispositivo"}
                    </div>

                    {/* FUNDO */}
                    <div
                      className="
                        absolute
                        inset-0

                        flex
                        items-center
                        justify-center
                      "
                    >
                      <div
                        className="
                          w-40
                          h-40

                          sm:w-44
                          sm:h-44

                          rounded-full

                          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                          blur-sm
                        "
                      />
                    </div>

                    {/* IMAGEM */}
                    <div
                      className="
                        relative

                        z-10

                        h-full

                        flex
                        items-center
                        justify-center

                        p-5
                        sm:p-6
                      "
                    >
                      {device.imagem_url ? (
                        <img
                          src={
                            device.imagem_url
                          }
                          alt={
                            device.nome
                          }
                          className="
                            max-h-44
                            max-w-[90%]

                            object-contain

                            drop-shadow-xl
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-28
                            h-28

                            sm:w-36
                            sm:h-36

                            rounded-3xl

                            bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Cpu
                            size={62}
                            className="
                              text-[var(--company-primary)]
                            "
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CONTEÚDO */}
                  <div
                    className="
                      min-w-0
                      flex-1

                      p-4
                      sm:p-5
                      lg:p-6

                      flex
                      flex-col
                    "
                  >
                    <h2
                      className="
                        text-xl
                        sm:text-2xl

                        font-bold

                        text-[#080E2F]
                        dark:text-white

                        leading-tight
                        break-words
                      "
                    >
                      {device.nome}
                    </h2>

                    <p
                      className="
                        mt-3

                        text-sm
                        sm:text-base

                        text-gray-500
                        dark:text-gray-400

                        leading-relaxed
                        break-words
                      "
                    >
                      {device.descricao ||
                        "Dispositivo disponível para treinamentos e suporte técnico da plataforma."}
                    </p>

                    {device.modelo && (
                      <div
                        className="
                          mt-4

                          inline-flex
                          items-center

                          gap-2

                          w-fit
                          max-w-full

                          rounded-xl

                          bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                          px-3
                          py-2

                          text-sm
                          font-medium

                          text-[var(--company-primary)]
                        "
                      >
                        <span>
                          Modelo:
                        </span>

                        <span
                          className="
                            break-all
                            font-semibold
                          "
                        >
                          {
                            device.modelo
                          }
                        </span>
                      </div>
                    )}

                    {/* AÇÃO */}
                    <div
                      className="
                        mt-auto
                        pt-5
                      "
                    >
                      <div
                        className="
                          border-t
                          border-gray-200
                          dark:border-white/10

                          pt-4
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDevice(
                              device,
                            )
                          }
                          className="
                            w-full

                            min-h-[48px]

                            rounded-xl

                            bg-gradient-to-r
                            from-[var(--company-primary)]
                            to-[var(--company-secondary)]

                            px-4
                            py-3

                            flex
                            items-center
                            justify-between

                            gap-3

                            font-bold

                            text-white

                            shadow-xl

                            transition-all

                            hover:opacity-95
                          "
                        >
                          <span>
                            {isClient
                              ? "Acessar dispositivo"
                              : "Abrir dispositivo"}
                          </span>

                          <ArrowRight
                            size={20}
                            className="shrink-0"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}

      {/* MODAL ADMIN */}
      {isAdmin && (
        <DeviceModal
          isOpen={
            modalOpen
          }
          onClose={() =>
            setModalOpen(false)
          }
          onSuccess={
            getDevices
          }
        />
      )}
    </main>
  );
}