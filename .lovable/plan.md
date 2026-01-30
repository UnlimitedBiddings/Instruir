
# Plano: Integração de Autoescolas no MVP

## Resumo Executivo

Adicionar **5 autoescolas** ao sistema de mapa, cada uma com **5 instrutores vinculados**, permitindo que alunos explorem tanto profissionais autônomos quanto autoescolas com seus pacotes de aulas.

---

## 1. Dados Mock das Autoescolas

Criar dados de 5 autoescolas localizadas em diferentes regiões de São Paulo:

| Autoescola | Região | Instrutores | Pacotes |
|------------|--------|-------------|---------|
| Auto Escola Paulista | Paulista/Centro | 5 | 3 pacotes |
| CFC Pinheiros | Pinheiros/Itaim | 5 | 3 pacotes |
| Auto Escola Moema | Moema/Brooklin | 5 | 3 pacotes |
| CFC Vila Mariana | Vila Mariana/Saúde | 5 | 3 pacotes |
| Auto Escola Consolação | Consolação/Higienópolis | 5 | 3 pacotes |

**Total: 25 instrutores vinculados a autoescolas + 15 autônomos existentes = 40 profissionais**

---

## 2. Estrutura dos Pacotes de Aulas

Cada autoescola oferecerá 3 pacotes:

| Pacote | Aulas | Preço | Inclui |
|--------|-------|-------|--------|
| Básico | 10 aulas | R$ 750 | Aulas práticas |
| Completo | 20 aulas | R$ 1.400 | Aulas + simulado + taxa DETRAN |
| Premium | 30 aulas | R$ 1.950 | Tudo + aulas extras de reforço |

---

## 3. Arquivos a Serem Modificados/Criados

### 3.1 Mock Data (`src/data/mockData.ts`)
- Adicionar `mockDrivingSchools` com 5 autoescolas
- Adicionar `mockSchoolInstructors` com 25 instrutores (5 por escola)
- Atualizar `mockInstructors` para incluir todos (autônomos + vinculados)
- Cada instrutor vinculado terá `providerType: 'company'` e `companyId`

### 3.2 Novo Componente: Card de Autoescola
**Arquivo:** `src/components/school/SchoolCard.tsx`
- Card animado para exibir autoescolas
- Mostra logo, nome, avaliação, quantidade de instrutores
- Badge indicando "Autoescola Verificada"
- Preview dos pacotes disponíveis

### 3.3 Nova Página: Perfil da Autoescola
**Arquivo:** `src/pages/student/SchoolProfilePage.tsx`
- Header com logo e informações da empresa
- Lista de pacotes de aulas com preços
- Grid de instrutores vinculados (clicáveis)
- Avaliações da autoescola
- Botão para agendar ou entrar em contato

### 3.4 Atualização: Página Explorar
**Arquivo:** `src/pages/student/ExplorePage.tsx`
- Adicionar toggle: "Autônomos" | "Autoescolas" | "Todos"
- Seção separada para autoescolas quando em modo "Autoescolas"
- Indicador visual nos cards de instrutores vinculados

### 3.5 Atualização: Mapa
**Arquivo:** `src/components/map/InstructorMap.tsx`
- Marcadores diferenciados para autoescolas (ícone de prédio)
- InfoWindow customizado para autoescolas
- Filtro por tipo de provedor

### 3.6 Atualização: Card do Instrutor
**Arquivo:** `src/components/instructor/AnimatedInstructorCard.tsx`
- Badge indicando se é vinculado a uma autoescola
- Link para a autoescola quando aplicável

### 3.7 Rotas
**Arquivo:** `src/App.tsx`
- Nova rota: `/school/:id` → `SchoolProfilePage`

---

## 4. Fluxo de Navegação

```text
ExplorePage
    │
    ├── Toggle: Autônomos/Autoescolas/Todos
    │
    ├── [Lista/Mapa de Autônomos]
    │       └── InstructorCard → InstructorProfilePage
    │
    └── [Lista/Mapa de Autoescolas]
            └── SchoolCard → SchoolProfilePage
                    │
                    ├── Ver Pacotes
                    └── Ver Instrutores → InstructorProfilePage
```

---

## 5. Design Visual

### Diferenciação Visual

| Elemento | Autônomo | Autoescola |
|----------|----------|------------|
| Marcador no mapa | Avatar circular | Ícone de prédio com logo |
| Badge | "Verificado" (verde) | "Autoescola" (azul) |
| Card | Individual | Mostra logo + qtd instrutores |

### Cores
- Autônomos: Verde (accent atual)
- Autoescolas: Azul (#3B82F6)

---

## 6. Detalhes Técnicos

### Tipos a adicionar em `src/types/index.ts`
- `DrivingSchool` já existe como alias de `Company`
- `ServicePackage` já existe
- Adicionar campo `location` ao tipo `Company` para exibição no mapa

### Componentes Reutilizados
- `RatingStars` para avaliações
- `VerificationBadge` adaptado para empresas
- Animações do Framer Motion consistentes

### Responsividade
- Cards adaptados para mobile
- Scroll horizontal de pacotes
- Grid responsivo de instrutores na página da escola

---

## 7. Ordem de Implementação

1. **Atualizar tipos** - Adicionar `location` ao `Company`
2. **Criar mock data** - 5 autoescolas + 25 instrutores
3. **Criar SchoolCard** - Componente de card de autoescola
4. **Criar SchoolProfilePage** - Página de perfil
5. **Atualizar ExplorePage** - Toggle e seções
6. **Atualizar InstructorMap** - Marcadores de autoescolas
7. **Atualizar AnimatedInstructorCard** - Badge de vínculo
8. **Adicionar rota** - /school/:id

---

## Resultado Esperado

Após a implementação, o aluno poderá:

1. Alternar entre visualizar autônomos, autoescolas ou todos
2. Ver autoescolas no mapa com marcadores diferenciados
3. Acessar o perfil de uma autoescola com seus pacotes
4. Ver os instrutores vinculados à autoescola
5. Agendar aulas diretamente ou através de pacotes
6. Identificar visualmente se um instrutor é autônomo ou vinculado
