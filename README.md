# Sirros Academy - Frontend

Frontend da **Sirros Academy**, uma plataforma web de treinamento técnico para dispositivos IoT da Sirros.

A aplicação permite que alunos acessem cursos, concluam aulas, realizem quizzes e prova final, baixem certificados, enquanto administradores gerenciam cursos, dispositivos, usuários, avaliações, documentos técnicos, relatórios e suporte IA.

Clientes podem acessar dispositivos vinculados, consultar documentação técnica e utilizar o suporte com IA.

---

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Axios
- Lucide React
- React Hot Toast
- Recharts

---

## Funcionalidades do Frontend

### Autenticação

- Login
- Cadastro
- Recuperação de senha
- Redefinição de senha
- Logout
- Redirecionamento por perfil

### Perfis

O sistema possui três perfis principais:

- `admin`
- `student`
- `client`

Cada perfil visualiza menus, rotas e funcionalidades diferentes.

---

## Área do Administrador

O administrador possui acesso ao painel administrativo.

Funcionalidades:

- Dashboard administrativo
- Gerenciamento de usuários
- Alteração de perfil de usuários
- Gerenciamento de cursos
- Criação de cursos
- Edição de cursos
- Publicação, arquivamento e controle de rascunhos
- Gerenciamento de módulos e aulas
- Criação e edição de quizzes
- Criação e edição de prova final
- Gerenciamento de dispositivos
- Cadastro de dispositivos
- Edição de dispositivos
- Exclusão de dispositivos
- Upload de documentos técnicos
- Processamento de PDFs para IA
- Gerenciamento de prompts da IA
- Vínculo de dispositivos com clientes
- Relatórios administrativos

---

## Área do Aluno

O aluno possui acesso aos cursos publicados.

Funcionalidades:

- Home do aluno
- Listagem de cursos disponíveis
- Meus cursos
- Visualização do curso
- Acesso às aulas
- Marcar aula como concluída
- Visualizar progresso
- Realizar quizzes por módulo
- Realizar prova final
- Fluxo de revisão após reprovação
- Receber certificado após aprovação
- Visualizar certificados
- Baixar certificado em PDF

---

## Área do Cliente

O cliente possui acesso aos dispositivos vinculados à sua empresa.

Funcionalidades:

- Listagem de dispositivos vinculados
- Página de detalhe do dispositivo
- Aba `Visão geral`
- Aba `Documentação`
- Aba `Suporte IA`
- Download de documentos técnicos em PDF
- Acesso ao suporte IA

Fluxo principal:

```txt
Cliente acessa Dispositivos
↓
Clica em Acessar dispositivo
↓
Visualiza informações técnicas
↓
Consulta documentação
↓
Baixa PDFs
↓
Acessa suporte IA
```

---

## Estrutura de Pastas

```txt
frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── modals/
│   │   └── ...
│   │
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── client/
│   │   └── student/
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── types/
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Pré-requisitos

Antes de rodar o frontend, tenha instalado:

- Node.js
- npm
- Git

Também é necessário que o backend esteja rodando.

Backend padrão:

```txt
http://localhost:3333
```

---

## Instalação

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `frontend`:

```env
VITE_API_URL=http://localhost:3333
```

Caso o projeto use a URL fixa dentro de `src/services/api.ts`, ajuste diretamente nesse arquivo.

---

## Rodando o Frontend

Para iniciar em modo desenvolvimento:

```bash
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:5173
```

---

## Build

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

---

## Rotas Principais

### Rotas Públicas

```txt
/
```

Tela de login.

```txt
/register
```

Tela de cadastro.

```txt
/forgot-password
```

Recuperação de senha.

```txt
/reset-password
```

Redefinição de senha.

---

## Rotas com Layout

As rotas abaixo utilizam o `DashboardLayout`.

### Aluno

```txt
/home
/courses
/courses/:courseId
/meus-cursos/avaliacao/:quizId
/certificate
/certificate/:certificateId
/settings
```

### Cliente

```txt
/devices
/devices/:deviceId
/support
/settings
```

### Administrador

```txt
/Dashboard
/create-courses
/admin/courses/:courseId/aulas
/users
/settings
```

---

## Principais Telas

### Login

Tela de autenticação do usuário.

Após login, o redirecionamento ocorre conforme o perfil:

```txt
admin   → /Dashboard
student → /home
client  → /devices
```

---

### Dashboard Admin

Tela principal do administrador.

Possui:

- Resumo geral
- Gestão de cursos
- Gestão de usuários
- Gestão de dispositivos
- Vínculo de dispositivos com clientes
- Área de IA técnica
- Relatórios administrativos

---

### Dispositivos

Tela utilizada por alunos/clientes/admin, com comportamento adaptado por perfil.

Para cliente:

- Lista apenas dispositivos vinculados
- Botão `Acessar dispositivo`
- Abre a página `/devices/:deviceId`

Para não cliente:

- Direciona para cursos do dispositivo

---

### Detalhe do Dispositivo

Página exclusiva para cliente acessar um dispositivo específico.

Abas disponíveis:

```txt
Visão geral
Documentação
Suporte IA
```

#### Visão geral

Mostra:

- Nome do dispositivo
- Modelo
- Categoria
- Descrição
- Imagem

#### Documentação

Mostra:

- PDFs vinculados ao dispositivo
- Status do documento
- Quantidade de trechos usados pela IA
- Botão para baixar o PDF

#### Suporte IA

Mostra:

- Explicação do suporte técnico
- Botão para abrir o chat com IA

---

### Suporte IA

Tela de chat técnico para clientes.

Funcionalidades:

- Seleção de dispositivo
- Envio de perguntas
- Resposta baseada na documentação técnica cadastrada
- Exibição das fontes utilizadas
- Integração com backend e agente IA

---

### Meus Cursos

Tela do aluno com seus cursos e progresso.

Mostra:

- Cursos disponíveis
- Cursos em andamento
- Cursos concluídos
- Status da tentativa
- Progresso

---

### Visualização do Curso

Tela de estudo do aluno.

Possui:

- Conteúdo da aula
- Lista de módulos
- Lista de aulas
- Progresso
- Botão para concluir aula
- Quiz de módulo
- Prova final
- Fluxo de revisão
- Liberação de certificado

---

### Avaliação

Tela usada para quizzes e prova final.

Funcionalidades:

- Exibição das questões sorteadas
- Alternativas
- Envio das respostas
- Cálculo da nota
- Retorno de aprovação ou reprovação

---

### Certificados

Tela onde o aluno visualiza certificados emitidos.

Funcionalidades:

- Lista de certificados
- Detalhe do certificado
- Download em PDF
- Código de validação

---

## Integração com API

A comunicação com o backend é feita usando Axios.

Arquivo principal:

```txt
src/services/api.ts
```

Exemplo esperado:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});
```

O token JWT deve ser enviado nas requisições protegidas.

---

## Controle de Acesso Visual

O frontend controla a exibição de menus e telas com base no `role` do usuário salvo no `localStorage`.

Exemplo de roles:

```txt
admin
student
client
```

Menus por perfil:

### Admin

- Dashboard
- Configurações

### Student

- Home
- Dispositivos
- Meus Cursos
- Certificados
- Configurações

### Client

- Dispositivos
- Suporte IA
- Configurações

---

## Dark Mode

O sistema possui suporte a modo claro e modo escuro.

O controle visual é aplicado via TailwindCSS usando classes `dark:`.

---

## Scripts Disponíveis

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build:

```bash
npm run build
```

Visualizar build:

```bash
npm run preview
```

---

## Status do Projeto

O frontend está em fase de MVP funcional.

Funcionalidades principais implementadas:

- Login
- Cadastro
- Recuperação de senha
- Rotas por perfil
- Dashboard admin
- Home do aluno
- Meus cursos
- Visualização de curso
- Quizzes
- Prova final
- Fluxo de revisão
- Certificados
- Download de certificado
- Dispositivos
- Detalhe do dispositivo para cliente
- Documentação técnica por dispositivo
- Download de PDF técnico
- Suporte IA
- Dark mode
- Layout responsivo

---

## Melhorias Futuras

- Histórico de conversas da IA
- Exportação de relatórios
- Administração avançada de certificados
- Melhorias no filtro de cursos
- Melhorias no fluxo de matrícula
- Dashboard de métricas mais avançado
- Validação pública de certificados
- Melhorias visuais nas telas administrativas

---

## Autor

Desenvolvido por **Lennon Costa Ferreira**.