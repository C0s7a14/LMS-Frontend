import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Cpu,
  Loader2,
  XCircle,
} from "lucide-react";

import {
  getPublicFreelancerInvite,
  respondPublicFreelancerInvite,
} from "../../services/freelancerInvitePublicService";

import type {
  PublicFreelancerInvite,
  PublicFreelancerInviteDecision,
} from "../../types/freelancerInvitePublic.types";


export default function FreelancerInvitePublicPage() {
  const {
    token,
  } = useParams();

  const [
    invite,
    setInvite,
  ] =
    useState<PublicFreelancerInvite | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    responding,
    setResponding,
  ] =
    useState<PublicFreelancerInviteDecision | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  /* =========================================================
     CARREGAR CONVITE
  ========================================================= */

  useEffect(() => {
    async function loadInvite() {
      if (!token) {
        setError(
          "Convite inválido.",
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data =
          await getPublicFreelancerInvite(
            token,
          );

        setInvite(data);
      } catch (error: any) {
        console.log(error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Não foi possível carregar este convite.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadInvite();
  }, [token]);


  /* =========================================================
     RESPONDER
  ========================================================= */

  async function handleResponse(
    decision: PublicFreelancerInviteDecision,
  ) {
    if (
      !token ||
      responding
    ) {
      return;
    }

    try {
      setResponding(decision);
      setError(null);

      const response =
        await respondPublicFreelancerInvite(
          token,
          decision,
        );

      setInvite(
        response.invite,
      );
    } catch (error: any) {
      console.log(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Não foi possível registrar sua resposta.",
      );
    } finally {
      setResponding(null);
    }
  }


  /* =========================================================
     HELPERS
  ========================================================= */

  function formatDate(
    value?: string | null,
  ) {
    if (!value) {
      return "Não informado";
    }

    return new Date(
      value,
    ).toLocaleString(
      "pt-BR",
    );
  }


  function getTypeLabel(
    type: PublicFreelancerInvite["tipo_convite"],
  ) {
    switch (type) {
      case "freelancer":
        return "Freelancer";

      case "contratacao":
        return "Contratação";

      case "parceria":
        return "Parceria";

      default:
        return type;
    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#f7f9fc]
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div className="text-center">
          <Loader2
            size={34}
            className="
              mx-auto
              animate-spin
              text-blue-600
            "
          />

          <p
            className="
              mt-4
              text-gray-500
            "
          >
            Carregando convite...
          </p>
        </div>
      </main>
    );
  }


  /* =========================================================
     ERRO SEM CONVITE
  ========================================================= */

  if (
    error &&
    !invite
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#f7f9fc]
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div
          className="
            w-full
            max-w-lg
            rounded-3xl
            border
            border-gray-200
            bg-white
            p-8
            text-center
            shadow-sm
          "
        >
          <XCircle
            size={46}
            className="
              mx-auto
              text-red-500
            "
          />

          <h1
            className="
              mt-5
              text-2xl
              font-bold
              text-[#080E2F]
            "
          >
            Convite indisponível
          </h1>

          <p
            className="
              mt-3
              text-gray-500
            "
          >
            {error}
          </p>
        </div>
      </main>
    );
  }


  if (!invite) {
    return null;
  }


  const answered =
    invite.status === "aceito" ||
    invite.status === "recusado";

  const expired =
    invite.status === "expirado";

  const canRespond =
    invite.status === "enviado" ||
    invite.status === "visualizado";


  return (
    <main
      className="
        min-h-screen
        bg-[#f7f9fc]
        px-4
        py-8
        sm:px-6
        lg:py-12
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-3xl
        "
      >
        {/* LOGO / MARCA */}
        <div
          className="
            mb-7
            text-center
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-[#080E2F]
                text-white
              "
            >
              S
            </div>

            <div className="text-left">
              <p
                className="
                  text-lg
                  font-bold
                  tracking-wide
                  text-[#080E2F]
                "
              >
                SIRROS
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Academy
              </p>
            </div>
          </div>
        </div>


        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          {/* CABEÇALHO */}
          <div
            className="
              border-b
              border-gray-100
              p-6
              sm:p-8
            "
          >
            <div
              className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div>
                <div
                  className="
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-500/10
                    text-blue-600
                  "
                >
                  <BriefcaseBusiness
                    size={23}
                  />
                </div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-blue-600
                  "
                >
                  Convite profissional
                </p>

                <h1
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    text-[#080E2F]
                    sm:text-3xl
                  "
                >
                  {invite.oportunidade}
                </h1>

                <p
                  className="
                    mt-2
                    text-gray-500
                  "
                >
                  Olá,{" "}
                  <strong>
                    {invite.profissional_nome}
                  </strong>
                  . Você recebeu uma oportunidade
                  através do Sirros Academy.
                </p>
              </div>

              <span
                className="
                  w-fit
                  rounded-full
                  bg-blue-500/10
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-blue-600
                "
              >
                {getTypeLabel(
                  invite.tipo_convite,
                )}
              </span>
            </div>
          </div>


          {/* INFORMAÇÕES */}
          <div
            className="
              grid
              grid-cols-1
              gap-4
              p-6
              sm:grid-cols-2
              sm:p-8
            "
          >
            {invite.dispositivo_nome && (
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-blue-600
                  "
                >
                  <Cpu size={17} />

                  Dispositivo
                </div>

                <p
                  className="
                    mt-2
                    font-semibold
                    text-[#080E2F]
                  "
                >
                  {invite.dispositivo_nome}
                </p>

                {invite.dispositivo_modelo && (
                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                  >
                    {invite.dispositivo_modelo}
                  </p>
                )}
              </div>
            )}


            {invite.certificacao_nome && (
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-green-600
                  "
                >
                  <Award size={17} />

                  Certificação
                </div>

                <p
                  className="
                    mt-2
                    font-semibold
                    text-[#080E2F]
                  "
                >
                  {invite.certificacao_nome}
                </p>
              </div>
            )}


            <div
              className="
                rounded-2xl
                border
                border-gray-100
                p-4
                sm:col-span-2
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-gray-600
                "
              >
                <Clock3 size={17} />

                Prazo para resposta
              </div>

              <p
                className="
                  mt-2
                  font-semibold
                  text-[#080E2F]
                "
              >
                {formatDate(
                  invite.prazo_resposta_em,
                )}
              </p>
            </div>


            {invite.mensagem && (
              <div
                className="
                  rounded-2xl
                  bg-gray-50
                  p-5
                  sm:col-span-2
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#080E2F]
                  "
                >
                  Mensagem
                </p>

                <p
                  className="
                    mt-2
                    whitespace-pre-wrap
                    text-sm
                    leading-6
                    text-gray-600
                  "
                >
                  {invite.mensagem}
                </p>
              </div>
            )}
          </div>


          {/* RESPOSTA */}
          <div
            className="
              border-t
              border-gray-100
              p-6
              sm:p-8
            "
          >
            {error && (
              <div
                className="
                  mb-5
                  rounded-2xl
                  bg-red-500/10
                  p-4
                  text-sm
                  text-red-600
                "
              >
                {error}
              </div>
            )}


            {invite.status === "aceito" && (
              <div
                className="
                  rounded-2xl
                  bg-green-500/10
                  p-5
                  text-center
                "
              >
                <CheckCircle2
                  size={35}
                  className="
                    mx-auto
                    text-green-600
                  "
                />

                <h2
                  className="
                    mt-3
                    text-lg
                    font-bold
                    text-green-700
                  "
                >
                  Convite aceito
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-green-700/80
                  "
                >
                  Sua resposta foi registrada com sucesso.
                </p>
              </div>
            )}


            {invite.status === "recusado" && (
              <div
                className="
                  rounded-2xl
                  bg-red-500/10
                  p-5
                  text-center
                "
              >
                <XCircle
                  size={35}
                  className="
                    mx-auto
                    text-red-500
                  "
                />

                <h2
                  className="
                    mt-3
                    text-lg
                    font-bold
                    text-red-600
                  "
                >
                  Convite recusado
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-red-500
                  "
                >
                  Sua resposta foi registrada.
                </p>
              </div>
            )}


            {expired && (
              <div
                className="
                  rounded-2xl
                  bg-purple-500/10
                  p-5
                  text-center
                "
              >
                <Clock3
                  size={35}
                  className="
                    mx-auto
                    text-purple-600
                  "
                />

                <h2
                  className="
                    mt-3
                    text-lg
                    font-bold
                    text-purple-700
                  "
                >
                  Convite expirado
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-purple-600
                  "
                >
                  O prazo para responder esta oportunidade terminou.
                </p>
              </div>
            )}


            {canRespond &&
              !answered &&
              !expired && (
                <>
                  <div className="mb-5">
                    <h2
                      className="
                        text-lg
                        font-bold
                        text-[#080E2F]
                      "
                    >
                      Responder convite
                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                      "
                    >
                      Escolha como deseja responder
                      a esta oportunidade.
                    </p>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3
                      sm:grid-cols-2
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        responding !== null
                      }
                      onClick={() =>
                        void handleResponse(
                          "aceito",
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-green-600
                        px-5
                        py-3.5
                        font-semibold
                        text-white
                        transition
                        hover:bg-green-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {responding ===
                      "aceito" ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <CheckCircle2
                          size={18}
                        />
                      )}

                      Aceitar oportunidade
                    </button>

                    <button
                      type="button"
                      disabled={
                        responding !== null
                      }
                      onClick={() =>
                        void handleResponse(
                          "recusado",
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        border-red-200
                        bg-white
                        px-5
                        py-3.5
                        font-semibold
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {responding ===
                      "recusado" ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <XCircle
                          size={18}
                        />
                      )}

                      Recusar
                    </button>
                  </div>
                </>
              )}
          </div>
        </section>


        <p
          className="
            mt-6
            text-center
            text-xs
            text-gray-400
          "
        >
          Sirros Academy • Plataforma de Treinamento
        </p>
      </div>
    </main>
  );
}