import logo from "../../assets/logo.png"

export default function Registro(){
 return(
    <div className="min-h-screen bg-[#2E3B7B] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0B2239] ronded-[30px] px-8 py-10 shadow-2xl">

        {/* logo*/}
        <div className="flex justify-center mb-10">
            <img src={logo} alt="Sirros logo" className="w-40"
            />
        </div>



        {/*Titulo*/}

        <div className=" text-center mb-10">
            <h1 className="text-white text-2xl font-bold mb-3"> acesse sua plataforma de treinamento IoT </h1>
 
        </div>


        {/* Formulario */}
        <form className="flex flex-col gap-6">
        {/*Nome */}
            <div className=" flex flex-col gap-2">
            <label className="text-slate-300 font-medium">
                Nome
            </label>
            
            <input
             type="Email"
             placeholder="Digite seu e-mail"
             className=" bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-400 transition-all"
            />
            </div>

              {/*EMAIL */}
            <div className=" flex flex-col gap-2">
            <label className="text-slate-300 font-medium">
                Email
            </label>
            
            <input
             type="Email"
             placeholder="Digite seu e-mail"
             className=" bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-400 transition-all"
            />
            </div>


        {/*Senha */}
        <div className="flex flex-col gap-2">
        <label className="text-slate-300 font-medium">
        Senha
        </label>

            <input
            type="password"
            placeholder="Digite sua senha"
            className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border:tranparent focus:border-blue-400 transition-all"
            
             
            />
        </div>
         {/*Senha novamente*/}
        <div className="flex flex-col gap-2">
        <label className="text-slate-300 font-medium">
        Confirme sua Senha
        </label>

            <input
            type="password"
            placeholder="Digite sua senha novamente"
            className="bg-[#3D4B97] text-white placeholder:text-slate-300 rounded-2xl px-5 py-4 outline-none border:tranparent focus:border-blue-400 transition-all"
            
             
            />
        </div>

        {/*Botões*/}
            <div className=" flex flex-col gap-5 mt-4">
                <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition-all"
                >
                Entrar
                </button>

                <button
                type="button"
                className="border border-[#28475F] hover:bg-[#132D49] text-white font-semibold py-4 rounded-2xl transition-all">
                    Já tenho conta
                </button>
            </div>
        </form>
        </div>

    </div>
 )   
}