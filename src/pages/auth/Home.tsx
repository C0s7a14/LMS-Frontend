import StatsCard from "../../components/StatsCard";
import CourseCard from "../../components/CourseCard";

import {
  BookOpen,
  GraduationCap,
  Clock3,
  TrendingUp,
} from "lucide-react";


interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: "aluno" | "adm" | "cliente";
}

function getUserFromStorage(): UserData {
  return JSON.parse(
    localStorage.getItem("user") || "{}"
  );
}


export default function Home() {

const user = getUserFromStorage();

  return (
    <div className="space-y-6">

      {/* Header */}
        <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center md:text-left mt-15 md:mt-0">
          <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
            bem vindo{" "}
            <span className="text-blue-500 font-bold">
              {user?.name || "usuario"}
            </span>{" "}
            a Sirros academy
          </h1>

          <p className="text-gray-500 dark:text-gray-300 text-sm md:text-base">
            Continue aprendendo e alcance seus objetivos.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >
        <StatsCard
          title="Cursos Matriculados"
          value="3"
          subtitle="Ativos"
          icon={BookOpen}
          iconColor="text-white"
          iconBg="bg-blue-500"
        />

        <StatsCard
          title="Cursos Concluídos"
          value="1"
          subtitle="Parabéns!"
          icon={GraduationCap}
          iconColor="text-white"
          iconBg="bg-green-500"
        />

        <StatsCard
          title="Horas de Estudo"
          value="12.5h"
          subtitle="Este mês"
          icon={Clock3}
          iconColor="text-white"
          iconBg="bg-purple-500"
        />

        <StatsCard
          title="Progresso Geral"
          value="45%"
          subtitle="Em andamento"
          icon={TrendingUp}
          iconColor="text-white"
          iconBg="bg-orange-500"
        />
      </div>

      {/* Conteúdo */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-5
        "
      >
        {/* Cursos */}
        <div
          className="
            xl:col-span-2
            bg-white
            dark:bg-[#091a2c]
            border
            border-gray-200
            dark:border-white/10
            rounded-3xl
            p-4
            md:p-5
            dark:shadow-sm
            dark:shadow-blue-500
          "
        >
          <div className="flex items-center justify-between mb-5  ">
            <h2 className="text-black dark:text-white text-lg md:text-xl font-semibold">
              Cursos em Andamento
            </h2>

            <button className="text-blue-500 dark:text-blue-400 text-sm font-bold cursor-pointer hover:text-blue-300">
              Ver todos
            </button>
          </div>

          <div className="space-y-4 ">
            <CourseCard
              title="Instalação Gateway IoT"
              progress={65}
              subtitle="SIROS Gateway IoT"
              progressColor="bg-blue-700 dark:bg-blue-500"
            />

            <CourseCard
              title="Sensor de Temperatura"
              progress={30}
              subtitle="SIROS Sensor IoT"
              progressColor="bg-green-600 dark:bg-green-500"
            />

            <CourseCard
              title="Atuador Smart"
              progress={15}
              subtitle="SIROS Automação"
              progressColor="bg-purple-600 dark:bg-purple-500"
            />
          </div>
        </div>

        {/* Próximas aulas */}
        <div
          className="
            bg-white
            dark:bg-[#091a2c]
            border
            border-gray-200
            dark:border-white/10
            rounded-3xl
            p-4
            md:p-5
            shadow-2xl
            dark:shadow-sm
            dark:shadow-blue-500
            
          "
        >
          <h2 className="text-black dark:text-white text-lg md:text-xl font-semibold mb-5">
            Próximas Aulas
          </h2>

          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0d2238] rounded-2xl p-4 border border-gray-200 dark:border-white/5 shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-sm dark:shadow-xs
            dark:shadow-blue-500 dark:hover:shadow-sm">
              <h3 className="text-black dark:text-white font-medium">
                Configuração de Rede
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Gateway IoT
              </p>

              <span className="text-blue-500 dark:text-blue-400 text-sm mt-3 block">
                20min
              </span>
            </div>

            <div className="bg-white dark:bg-[#0d2238] rounded-2xl p-4 border border-gray-200 dark:border-white/5 shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-sm dark:shadow-xs
            dark:shadow-blue-500 dark:hover:shadow-sm">
              <h3 className="text-black dark:text-white font-medium">
                Calibração Inicial
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Sensor Temperatura
              </p>

              <span className="text-blue-500 dark:text-blue-400 text-sm mt-3 block">
                35min
              </span>
            </div>

             <div className="bg-white dark:bg-[#0d2238] rounded-2xl p-4 border border-gray-200 dark:border-white/5 shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-sm dark:shadow-xs
            dark:shadow-blue-500 dark:hover:shadow-sm">
              <h3 className="text-black dark:text-white font-medium">
                Instalação 
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Sensor Temperatura
              </p>

              <span className="text-blue-500 dark:text-blue-400 text-sm mt-3 block">
                35min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}