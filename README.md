# Documentação do Projeto GYMUP+ (Versão Expo)

## Visão Geral

GYMUP+ é um aplicativo mobile desenvolvido com React Native e Expo que permite a interação entre alunos e treinadores para gerenciamento de treinos de academia. O aplicativo oferece funcionalidades específicas para cada tipo de usuário, permitindo que treinadores criem e atribuam treinos, enquanto alunos podem visualizar seus treinos, definir metas e compartilhar com amigos.

## Estrutura do Projeto

O projeto foi organizado seguindo uma arquitetura modular, com separação clara de responsabilidades:

```
GYMUPPlus/
├── assets/           # Imagens e recursos estáticos
├── src/
│   ├── api/          # Backend simulado e serviços
│   ├── assets/       # Recursos específicos de componentes
│   ├── components/   # Componentes reutilizáveis
│   ├── hooks/        # Hooks personalizados
│   ├── navigation/   # Configuração de navegação
│   ├── screens/      # Telas do aplicativo
│   │   ├── auth/     # Telas de autenticação
│   │   ├── student/  # Telas específicas para alunos
│   │   └── trainer/  # Telas específicas para treinadores
│   ├── services/     # Serviços e utilitários
│   ├── themes/       # Configuração de temas (claro/escuro)
│   └── utils/        # Funções utilitárias
└── App.tsx           # Componente principal
```

## Funcionalidades Principais

### Para Alunos (My Account)

1. **Visualização de Treinos**: Acesso aos treinos atribuídos pelo treinador
2. **Compartilhamento de Treinos**: Possibilidade de compartilhar treinos com amigos via QR Code ou link
3. **Lista de Amigos**: Gerenciamento de amigos com busca por ID ou nome
4. **Metas e Progresso**: Definição e acompanhamento de metas com visualização gráfica
5. **Temas**: Alternância entre tema claro e escuro

### Para Treinadores (Trainers)

1. **Atribuição de Treinos**: Capacidade de atribuir treinos específicos para alunos
2. **Consulta de Treinos**: Visualização dos treinos disponíveis na API
3. **Criação de Treinos**: Interface para criar novos treinos com exercícios personalizados
4. **Gerenciamento de Alunos**: Adição e edição de alunos vinculados ao treinador

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para desenvolvimento React Native simplificado
- **TypeScript**: Linguagem de programação tipada
- **React Navigation**: Biblioteca para navegação entre telas
- **Context API**: Gerenciamento de estado global
- **React Native Chart Kit**: Visualização de gráficos
- **React Native QR Code SVG**: Geração de QR Codes

## Backend Simulado

O aplicativo utiliza um backend simulado através do Context API para demonstrar as funcionalidades sem necessidade de um servidor real. Os dados são armazenados localmente durante a sessão do aplicativo.

## Temas

O aplicativo suporta temas claro e escuro, com alternância automática baseada nas preferências do sistema ou manual pelo usuário.

## Instruções para Execução

Para executar o projeto em um ambiente de desenvolvimento:

1. Instale as dependências:
   ```
   npm install
   ```

2. Inicie o aplicativo:
   ```
   npx expo start
   ```

3. Use o aplicativo Expo Go no seu dispositivo para escanear o QR code ou execute em um emulador.

## Próximos Passos

Para uma versão de produção, seria necessário:

1. Implementar um backend real com autenticação
2. Configurar armazenamento persistente de dados
3. Adicionar testes automatizados
4. Configurar CI/CD para implantação contínua
5. Publicar nas lojas de aplicativos (Google Play e App Store)

## Considerações Finais

O GYMUP+ foi desenvolvido como um protótipo funcional que demonstra as principais funcionalidades solicitadas. A arquitetura foi pensada para permitir fácil expansão e manutenção futura.
