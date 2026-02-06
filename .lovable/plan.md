# 📋 INSTRUIR - Plano de Análise e Finalização do Backend

## 🎯 Resumo Executivo

### O que é o INSTRUIR?
**INSTRUIR** é uma plataforma de marketplace digital que conecta **alunos** a **profissionais de ensino verificados** (instrutores de direção, professores de idiomas, música, etc.) e **empresas/autoescolas**, promovendo a formalização e regulamentação do setor de ensino particular no Brasil.

### Problema que Resolve
1. **Informalidade no mercado de instrutores** - Milhares de profissionais atuam sem verificação de credenciais
2. **Falta de transparência** - Alunos não têm como verificar antecedentes e qualificações
3. **Desorganização de agendamentos** - Processos manuais via WhatsApp/telefone
4. **Dificuldade de acesso** - Alunos não encontram profissionais próximos facilmente
5. **Falta de rastreabilidade** - Sem histórico de aulas, pagamentos e avaliações

### Valor para Utilidade Pública
- **Segurança cidadã**: Verificação de antecedentes criminais e CNH de instrutores
- **Formalização do trabalho**: Incentivo à regularização de profissionais
- **Transparência**: Avaliações públicas e histórico verificável
- **Acessibilidade**: Localização geográfica de profissionais por região
- **Regulamentação**: Alinhamento com DETRAN e órgãos reguladores

---

## 📊 Análise da Estrutura Atual

### ✅ O que já existe (Implementado)

#### Banco de Dados (Supabase)
| Tabela | Status | Descrição |
|--------|--------|-----------|
| `profiles` | ✅ Completo | Dados básicos do usuário |
| `user_roles` | ✅ Completo | Sistema de permissões |
| `professionals` | ✅ Completo | Dados do profissional |
| `students` | ✅ Completo | Dados do aluno |
| `companies` | ✅ Completo | Empresas/Autoescolas |
| `service_packages` | ✅ Completo | Pacotes de aulas |
| `sessions` | ✅ Completo | Agendamentos de aulas |
| `reviews` | ✅ Completo | Avaliações |
| `availability` | ✅ Completo | Disponibilidade |
| `conversations` | ✅ Completo | Chat em tempo real |
| `messages` | ✅ Completo | Mensagens do chat |
| `notifications` | ✅ Completo | Notificações |

#### Autenticação e Segurança
- ✅ Autenticação via Supabase Auth
- ✅ Verificação de e-mail obrigatória
- ✅ RLS (Row Level Security) em todas as tabelas
- ✅ Função `has_role` para controle de acesso
- ✅ Trigger automático para criação de perfis

#### Frontend
- ✅ Sistema de navegação (Home/Chat/Perfil)
- ✅ Mapa interativo com Google Maps
- ✅ Perfis de instrutores e autoescolas
- ✅ Sistema de avaliações
- ✅ Chat em tempo real
- ✅ Tema claro/escuro

---

## 🚨 Áreas Críticas para Utilidade Pública

### 1. DADOS PESSOAIS E PRIVACIDADE (LGPD)
**Status: 🔴 Crítico - Precisa implementar**

#### Campos faltantes no banco:
```sql
-- Tabela professionals - Adicionar:
- cpf (criptografado)
- data_nascimento
- rg
- orgao_emissor
- endereco_completo (criptografado)
- cep
- numero_cnh
- categoria_cnh (A, B, AB, etc.)
- validade_cnh
- documento_cnh_url (storage)
- documento_antecedentes_url (storage)
- foto_documento_url (storage)

-- Tabela profiles - Adicionar:
- cpf (criptografado)
- data_nascimento
- genero
- endereco_completo
- cep
- aceite_termos_uso (timestamp)
- aceite_lgpd (timestamp)
```

#### Medidas de segurança necessárias:
- [ ] Criptografia de dados sensíveis (CPF, endereço)
- [ ] Política de retenção de dados
- [ ] Logs de acesso a dados pessoais
- [ ] Opção de exclusão de conta (direito ao esquecimento)
- [ ] Exportação de dados pessoais

### 2. VERIFICAÇÃO DE CREDENCIAIS
**Status: 🟡 Parcial - Campos existem, falta integração**

#### Sistema de verificação necessário:
| Verificação | Status | Integração |
|-------------|--------|------------|
| Identidade (RG/CPF) | 🟡 Campo existe | Validação manual |
| CNH | 🟡 Campo existe | API DETRAN |
| Antecedentes Criminais | 🟡 Campo existe | API Polícia Federal |
| Veículo (placa/documento) | 🔴 Falta campo | API DETRAN |
| Endereço | 🟡 Campo existe | API ViaCEP |

### 3. DADOS DO VEÍCULO
**Status: 🟡 Parcial - Precisa expandir**

#### Campos faltantes:
```sql
-- Tabela professionals ou nova tabela vehicles:
- placa_veiculo
- renavam
- chassi
- documento_veiculo_url
- seguro_obrigatorio (DPVAT)
- vistoria_detran_url
- validade_vistoria
- seguro_particular
- validade_seguro
```

### 4. ZONA DE ATENDIMENTO
**Status: 🟡 Parcial - Precisa melhorar**

#### Campos faltantes:
```sql
-- Tabela professionals:
- raio_atendimento_km (número)
- bairros_atendidos (array)
- cidades_atendidas (array)
- aceita_deslocamento (boolean)
- taxa_deslocamento_km (número)
```

### 5. DADOS BANCÁRIOS/FINANCEIROS
**Status: 🔴 Crítico - Não existe**

#### Nova tabela necessária:
```sql
CREATE TABLE professional_bank_accounts (
  id UUID PRIMARY KEY,
  professional_id UUID REFERENCES professionals(id),
  banco_codigo TEXT,
  banco_nome TEXT,
  agencia TEXT,
  conta TEXT,
  tipo_conta TEXT, -- corrente, poupança, pagamento
  titular_nome TEXT,
  titular_cpf TEXT (criptografado),
  pix_tipo TEXT, -- cpf, email, telefone, aleatoria
  pix_chave TEXT (criptografado),
  comprovante_url TEXT,
  verificado BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 6. HISTÓRICO E AUDITORIA
**Status: 🔴 Crítico - Não existe**

#### Tabelas necessárias:
```sql
-- Logs de auditoria
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action TEXT,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP
);

-- Histórico de verificações
CREATE TABLE verification_history (
  id UUID PRIMARY KEY,
  professional_id UUID,
  verification_type TEXT,
  status TEXT,
  verified_by UUID,
  verification_date TIMESTAMP,
  expiry_date TIMESTAMP,
  document_url TEXT,
  notes TEXT
);
```

---

## 📐 Plano de Implementação

### Fase 1: Fundação de Dados (Prioridade Alta)
**Estimativa: 2-3 dias**

1. **Migração do banco de dados**
   - Adicionar campos de dados pessoais
   - Criar tabela de contas bancárias
   - Criar tabela de veículos expandida
   - Criar tabela de auditoria

2. **Storage seguro**
   - Bucket para documentos (CNH, RG, antecedentes)
   - Bucket para fotos de perfil
   - Bucket para documentos de veículos
   - Políticas de acesso restrito

### Fase 2: Formulários e Validação (Prioridade Alta)
**Estimativa: 3-4 dias**

1. **Onboarding de profissional completo**
   - Etapa 1: Dados pessoais
   - Etapa 2: Documentos (upload CNH, RG)
   - Etapa 3: Veículo (dados e documentos)
   - Etapa 4: Zona de atendimento
   - Etapa 5: Dados bancários
   - Etapa 6: Termos e aceites

2. **Validação de campos**
   - CPF válido
   - CEP com autopreenchimento
   - Placa de veículo válida
   - Conta bancária válida

### Fase 3: Integrações Externas (Prioridade Média)
**Estimativa: 5-7 dias**

1. **APIs a integrar**
   - ViaCEP (endereço)
   - Validação CPF/CNPJ
   - *Futuro: DETRAN (CNH)
   - *Futuro: Polícia Federal (antecedentes)

2. **Edge Functions necessárias**
   - `validate-cpf` - Validação de CPF
   - `validate-cep` - Busca endereço
   - `validate-vehicle` - Validação de placa
   - `process-payment` - Integração Stripe/Pix

### Fase 4: Painel Administrativo (Prioridade Média)
**Estimativa: 4-5 dias**

1. **Dashboard admin**
   - Listagem de profissionais pendentes
   - Verificação manual de documentos
   - Aprovação/rejeição de cadastros
   - Relatórios e métricas

---

## 📄 Documentação para Validação Governamental

### Informações do Produto

**Nome**: INSTRUIR  
**Tipo**: Plataforma Digital de Marketplace de Ensino  
**Categoria**: Economia Colaborativa / EdTech  
**Público-alvo**: 
- Alunos buscando profissionais de ensino
- Instrutores de direção, professores, tutores
- Autoescolas e centros de ensino

### Problema Social que Resolve

1. **Segurança no transporte**
   - Verifica se instrutores possuem CNH válida
   - Checa antecedentes criminais
   - Inspeciona veículos usados nas aulas

2. **Formalização do trabalho**
   - Incentiva emissão de MEI/CNPJ
   - Rastreia pagamentos e emissão de notas
   - Cria histórico profissional verificável

3. **Transparência para o consumidor**
   - Avaliações públicas de alunos
   - Perfis verificados com selos de confiança
   - Preços transparentes e comparáveis

### Alinhamento Regulatório

| Órgão | Alinhamento |
|-------|-------------|
| DETRAN | Verificação de CNH e veículos |
| LGPD/ANPD | Proteção de dados pessoais |
| PROCON | Transparência de preços e contratos |
| Receita Federal | CPF/CNPJ verificados |

### Métricas de Impacto

- Número de profissionais verificados
- Número de aulas realizadas
- Taxa de satisfação (avaliações)
- Índice de formalização

---

## ✅ Checklist de Implementação

### Backend (Banco de Dados)
- [x] Adicionar campos de dados pessoais em `profiles` (cpf, birth_date, gender, address, etc.)
- [x] Adicionar campos de documentos em `professionals` (rg, cnh, criminal_record, etc.)
- [x] Criar tabela `professional_bank_accounts`
- [x] Criar tabela `vehicles` (expandida com campos de seguro, inspeção, DPVAT)
- [x] Criar tabela `audit_logs`
- [x] Criar tabela `verification_history`
- [x] Configurar Storage buckets seguros (avatars, professional-documents, vehicle-documents)
- [ ] Implementar criptografia de dados sensíveis (via pgcrypto - opcional)

### Edge Functions
- [x] `validate-cpf` - Validação de CPF com algoritmo completo
- [x] `validate-cep` - Busca endereço via ViaCEP
- [x] `validate-bank-account` - Validação bancária e PIX

### Hooks React (Frontend)
- [x] `useProfessionalProfile` - Gerenciamento de perfil profissional, veículos e contas bancárias
- [x] `useUserProfile` - Gerenciamento de perfil do usuário com dados LGPD
- [x] `useDocumentUpload` - Upload seguro de documentos para Storage
- [x] `useValidation` - Validações de CPF, CEP e conta bancária
- [x] `useSessions` - Gerenciamento de aulas/sessões
- [x] `useAvailability` - Gerenciamento de disponibilidade
- [x] `useDashboardStats` - Estatísticas do dashboard

### Frontend (UI) - Fase 1
- [x] Logo e favicon personalizados
- [x] Dashboard com estatísticas para aluno e profissional
- [x] Lista de sessões próximas
- [x] Fluxo de verificação de e-mail (VerifyEmailPage)
- [x] Fluxo de redefinição de senha (ResetPasswordPage)
- [ ] Formulário de onboarding completo (profissional)
- [ ] Página de edição de perfil expandida
- [ ] Upload de documentos com preview
- [ ] Configuração de zona de atendimento (mapa)
- [ ] Gestão de conta bancária
- [ ] Termos de uso e política de privacidade

### Segurança
- [x] RLS policies em todas as tabelas novas
- [x] Storage policies com acesso restrito
- [x] Políticas de auditoria (audit_logs)
- [ ] Backup de dados (configurar no Supabase Dashboard)
- [ ] Política de retenção de dados

---

## 📈 Progresso da Implementação

| Fase | Status | Descrição |
|------|--------|-----------|
| 1. Fundação de Dados | ✅ Completo | Migrações SQL executadas, tabelas criadas |
| 2. Edge Functions | ✅ Completo | validate-cpf, validate-cep, validate-bank-account |
| 3. Hooks React | ✅ Completo | Todos os hooks de dados implementados |
| 4. Fase 1 - Estabilização | ✅ Completo | Build OK, dashboard, logo, verificação e-mail |
| 5. Fase 2 - Marketplace | 🔄 Pendente | Agendamento, pagamento, chat, filtros |
| 6. Fase 3 - Expansão | 🔄 Pendente | Avaliações, B2B2C, UX |

---

## 🚀 Próximos Passos Recomendados

1. ~~Aprovar este plano~~ ✅
2. ~~Executar migrações~~ ✅
3. **Implementar formulários** - Onboarding e edição de perfil
4. **Integrar APIs** - Validações externas
5. **Testar fluxos** - QA completo
6. **Documentar API** - Para integração com órgãos

---

*Documento gerado em: Fevereiro 2026*  
*Última atualização: Implementação de backend concluída*
*Versão: 1.1*
