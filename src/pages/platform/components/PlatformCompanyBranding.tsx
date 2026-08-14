import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import {
  Image,
  ImagePlus,
  Save,
  Upload,
  X,
} from "lucide-react";

import {
  platformApi,
} from "../../../services/platformApi";

import PlatformIconBox from "../../../components/platform/PlatformIconBox";

interface PlatformCompanyBrandingProps {
  companyId: number;

  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;

  onUpdated: () => void;
}

type BrandingField =
  | "logo"
  | "logoDark"
  | "favicon";

interface BrandingFiles {
  logo: File | null;
  logoDark: File | null;
  favicon: File | null;
}

interface BrandingPreviews {
  logo: string | null;
  logoDark: string | null;
  favicon: string | null;
}

export default function PlatformCompanyBranding({
  companyId,
  logoUrl,
  logoDarkUrl,
  faviconUrl,
  onUpdated,
}: PlatformCompanyBrandingProps) {
  const [
    files,
    setFiles,
  ] =
    useState<BrandingFiles>({
      logo: null,
      logoDark: null,
      favicon: null,
    });

  const [
    previews,
    setPreviews,
  ] =
    useState<BrandingPreviews>({
      logo: null,
      logoDark: null,
      favicon: null,
    });

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const hasChanges =
    useMemo(
      () =>
        Boolean(
          files.logo ||
            files.logoDark ||
            files.favicon
        ),
      [
        files,
      ]
    );

  useEffect(() => {
    return () => {
      Object.values(
        previews
      ).forEach(
        (preview) => {
          if (
            preview?.startsWith(
              "blob:"
            )
          ) {
            URL.revokeObjectURL(
              preview
            );
          }
        }
      );
    };
  }, [
    previews,
  ]);

  function getCurrentUrl(
    field: BrandingField
  ) {
    switch (field) {
      case "logo":
        return logoUrl;

      case "logoDark":
        return logoDarkUrl;

      case "favicon":
        return faviconUrl;
    }
  }

  function getPreview(
    field: BrandingField
  ) {
    return (
      previews[field] ||
      getCurrentUrl(field)
    );
  }

  function clearSelectedFile(
    field: BrandingField
  ) {
    const currentPreview =
      previews[field];

    if (
      currentPreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        currentPreview
      );
    }

    setFiles(
      (current) => ({
        ...current,
        [field]: null,
      })
    );

    setPreviews(
      (current) => ({
        ...current,
        [field]: null,
      })
    );
  }

  function validateFile(
    field: BrandingField,
    file: File
  ) {
    const maxSize =
      5 *
      1024 *
      1024;

    if (
      file.size >
      maxSize
    ) {
      toast.error(
        "A imagem deve possuir no máximo 5 MB."
      );

      return false;
    }

    const logoTypes =
      [
        "image/png",
        "image/jpeg",
        "image/webp",
      ];

    const faviconTypes =
      [
        "image/png",
        "image/webp",
        "image/x-icon",
        "image/vnd.microsoft.icon",
      ];

    const allowed =
      field ===
      "favicon"
        ? faviconTypes
        : logoTypes;

    if (
      !allowed.includes(
        file.type
      )
    ) {
      toast.error(
        field ===
          "favicon"
          ? "O favicon deve ser PNG, WEBP ou ICO."
          : "A logo deve ser PNG, JPG ou WEBP."
      );

      return false;
    }

    return true;
  }

  function handleFileChange(
    field: BrandingField,
    file:
      | File
      | undefined
  ) {
    if (!file) {
      return;
    }

    if (
      !validateFile(
        field,
        file
      )
    ) {
      return;
    }

    const previousPreview =
      previews[field];

    if (
      previousPreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        previousPreview
      );
    }

    const preview =
      URL.createObjectURL(
        file
      );

    setFiles(
      (current) => ({
        ...current,
        [field]: file,
      })
    );

    setPreviews(
      (current) => ({
        ...current,
        [field]: preview,
      })
    );
  }

  async function handleUpload() {
    if (!hasChanges) {
      toast.error(
        "Selecione pelo menos uma imagem."
      );

      return;
    }

    const formData =
      new FormData();

    if (files.logo) {
      formData.append(
        "logo",
        files.logo
      );
    }

    if (
      files.logoDark
    ) {
      formData.append(
        "logoDark",
        files.logoDark
      );
    }

    if (
      files.favicon
    ) {
      formData.append(
        "favicon",
        files.favicon
      );
    }

    try {
      setUploading(true);

      await platformApi.patch(
        `/platform/companies/${companyId}/branding`,
        formData
      );

      toast.success(
        "Identidade visual atualizada."
      );

      setFiles({
        logo: null,
        logoDark: null,
        favicon: null,
      });

      setPreviews({
        logo: null,
        logoDark: null,
        favicon: null,
      });

      onUpdated();
    } catch (error) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        toast.error(
          error.response?.data
            ?.error ||
            error.response?.data
              ?.message ||
            "Não foi possível atualizar as imagens."
        );

        return;
      }

      toast.error(
        "Não foi possível atualizar as imagens."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="
        w-full

        rounded-2xl
        sm:rounded-3xl

        border
        border-gray-200
        dark:border-white/10

        bg-white
        dark:bg-[#091a2c]

        p-5
        sm:p-6

        shadow-2xl
        dark:shadow-sm
      "
    >
      <div
        className="
          flex
          flex-col

          sm:flex-row
          sm:items-center
          sm:justify-between

          gap-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <PlatformIconBox
            icon={Image}
            size="sm"
            variant="soft"
          />

          <div>
            <h2
              className="
                text-lg
                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              Arquivos da Identidade
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Logo, logo para modo escuro e favicon da empresa.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            void handleUpload()
          }
          disabled={
            !hasChanges ||
            uploading
          }
          className="
            w-full
            sm:w-auto

            min-w-[170px]

            px-5
            py-3.5

            rounded-2xl

            bg-gradient-to-r
            from-blue-500
            to-purple-600

            hover:from-blue-600
            hover:to-purple-700

            text-white

            text-sm
            font-bold

            flex
            items-center
            justify-center
            gap-2

            shadow-xl

            transition-all

            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <Save size={18} />

          {uploading
            ? "Salvando..."
            : "Salvar imagens"}
        </button>
      </div>

      <div
        className="
          mt-6

          grid
          grid-cols-1
          lg:grid-cols-3

          gap-5
        "
      >
        <BrandingImageField
          title="Logo"
          description="Utilizada normalmente no modo claro."
          preview={
            getPreview(
              "logo"
            )
          }
          selectedFile={
            files.logo
          }
          accept="image/png,image/jpeg,image/webp"
          onSelect={(
            file
          ) =>
            handleFileChange(
              "logo",
              file
            )
          }
          onClear={() =>
            clearSelectedFile(
              "logo"
            )
          }
        />

        <BrandingImageField
          title="Logo Dark"
          description="Versão alternativa para fundos escuros."
          preview={
            getPreview(
              "logoDark"
            )
          }
          selectedFile={
            files.logoDark
          }
          accept="image/png,image/jpeg,image/webp"
          darkPreview
          onSelect={(
            file
          ) =>
            handleFileChange(
              "logoDark",
              file
            )
          }
          onClear={() =>
            clearSelectedFile(
              "logoDark"
            )
          }
        />

        <BrandingImageField
          title="Favicon"
          description="Ícone exibido na aba do navegador."
          preview={
            getPreview(
              "favicon"
            )
          }
          selectedFile={
            files.favicon
          }
          accept=".ico,image/x-icon,image/vnd.microsoft.icon,image/png,image/webp"
          compact
          onSelect={(
            file
          ) =>
            handleFileChange(
              "favicon",
              file
            )
          }
          onClear={() =>
            clearSelectedFile(
              "favicon"
            )
          }
        />
      </div>
    </div>
  );
}

function BrandingImageField({
  title,
  description,
  preview,
  selectedFile,
  accept,
  darkPreview = false,
  compact = false,
  onSelect,
  onClear,
}: {
  title: string;
  description: string;

  preview:
    | string
    | null;

  selectedFile:
    | File
    | null;

  accept: string;

  darkPreview?: boolean;
  compact?: boolean;

  onSelect: (
    file:
      | File
      | undefined
  ) => void;

  onClear: () => void;
}) {
  return (
    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        bg-gray-50
        dark:bg-white/[0.03]

        p-4
      "
    >
      <div>
        <h3
          className="
            font-bold

            text-[#080E2F]
            dark:text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1

            text-xs
            sm:text-sm

            text-gray-500
            dark:text-gray-400

            min-h-[40px]
          "
        >
          {description}
        </p>
      </div>

      <div
        className={`
          mt-4

          h-40

          rounded-2xl

          border
          border-dashed

          border-gray-300
          dark:border-white/10

          flex
          items-center
          justify-center

          overflow-hidden

          ${
            darkPreview
              ? "bg-[#071522]"
              : "bg-white dark:bg-[#071522]"
          }
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt={title}
            className={`
              ${
                compact
                  ? "w-16 h-16 object-contain"
                  : "w-full h-full object-contain p-5"
              }
            `}
          />
        ) : (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center

              gap-2

              text-gray-400
            "
          >
            <ImagePlus
              size={28}
            />

            <span
              className="
                text-xs
                font-medium
              "
            >
              Nenhuma imagem
            </span>
          </div>
        )}
      </div>

      {selectedFile && (
        <div
          className="
            mt-3

            flex
            items-center
            justify-between

            gap-3

            rounded-xl

            bg-blue-500/10

            px-3
            py-2
          "
        >
          <span
            className="
              min-w-0

              truncate

              text-xs
              font-medium

              text-blue-700
              dark:text-blue-300
            "
            title={
              selectedFile.name
            }
          >
            {
              selectedFile.name
            }
          </span>

          <button
            type="button"
            onClick={
              onClear
            }
            className="
              shrink-0

              text-blue-600
              dark:text-blue-300

              hover:text-red-500

              transition-colors
            "
          >
            <X size={16} />
          </button>
        </div>
      )}

      <label
        className="
          mt-4

          w-full

          px-4
          py-3

          rounded-xl

          border
          border-gray-300
          dark:border-white/10

          bg-white
          dark:bg-[#071522]

          text-sm
          font-bold

          text-[#080E2F]
          dark:text-white

          flex
          items-center
          justify-center
          gap-2

          cursor-pointer

          shadow-lg
          dark:shadow-sm

          hover:bg-gray-50
          dark:hover:bg-white/5

          transition-colors
        "
      >
        <Upload
          size={17}
        />

        Selecionar arquivo

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(
            event
          ) => {
            onSelect(
              event.target
                .files?.[0]
            );

            /*
             * Permite selecionar novamente
             * o mesmo arquivo posteriormente.
             */
            event.target.value =
              "";
          }}
        />
      </label>
    </div>
  );
}