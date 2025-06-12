import { supabase } from './Supabase';

// =============================================================================
// ATENÇÃO IMPORTANTE SOBRE IDs:
// O esquema de banco de dados fornecido usa IDs do tipo INTEGER (SERIAL PRIMARY KEY).
// No entanto, o sistema de autenticação do Supabase (auth.users) usa IDs do tipo UUID (string).
// Para que as funcionalidades de amizade, treinos e metas funcionem corretamente
// vinculadas aos usuários autenticados pelo Supabase, é CRÍTICO que o 'id'
// da sua tabela 'Usuario' seja do tipo UUID e que ele seja o mesmo 'id'
// do usuário no 'auth.users'.
//
// As interfaces e funções abaixo usarão 'number' para IDs conforme seu esquema,
// mas você DEVE garantir que a sincronização entre auth.users.id (UUID) e
// public.Usuario.id (INTEGER) seja feita corretamente no seu banco de dados
// (por exemplo, usando triggers e funções de conversão, ou, idealmente,
// alterando o tipo de 'id' em 'public.Usuario' para UUID).
// =============================================================================

// =============================================================================
// Interfaces de Entidades (Baseadas no seu esquema SQL)
// =============================================================================

export interface Usuario {
  id: number; // No seu esquema é INTEGER, mas para integração com auth.users, UUID (string) é recomendado
  nome: string;
  email: string;
  senha?: string; // Senhas não devem ser armazenadas diretamente aqui se usar Supabase Auth
  tipo: 'student' | 'trainer';
  avatar_url?: string; // Adicionado para compatibilidade com a lógica existente
  created_at?: string; // Adicionado para compatibilidade com a lógica existente
  updated_at?: string; // Adicionado para compatibilidade com a lógica existente
}

export interface Amizade {
  id: number;
  usuario_id_1: number;
  usuario_id_2: number;
  status: 'pending' | 'accepted' | 'blocked';
  created_at?: string;
  updated_at?: string;
}

export interface Meta {
  id: number;
  aluno_id: number;
  descricao: string;
  data_criacao: string;
  eh_primaria: boolean;
}

export interface Exercicio {
  id: number;
  nome: string;
  descricao: string;
}

export interface Treino {
  id: number;
  nome: string;
  descricao: string;
  treinador_id: number;
  // A estrutura do seu esquema não tem 'exercises' diretamente aqui.
  // Isso será tratado via TreinoExercicio.
  // Para compatibilidade com o código existente, manteremos uma representação aqui,
  // mas a persistência será via TreinoExercicio.
  exercises?: TreinoExercicioDetail[]; // Detalhes dos exercícios para exibição
  is_shared?: boolean; // Para compatibilidade com a lógica de compartilhamento
  student_id?: number; // Para compatibilidade com a lógica de atribuição
  created_at?: string; // Adicionado para compatibilidade com a lógica existente
  updated_at?: string; // Adicionado para compatibilidade com a lógica existente
}

export interface TreinoExercicio {
  id: number;
  treino_id: number;
  exercicio_id: number;
  series: number;
  repeticoes: number;
  carga: number;
}

// Interface para representar um exercício com seus detalhes de TreinoExercicio
export interface TreinoExercicioDetail extends Exercicio {
  series: number;
  repeticoes: number;
  carga: number;
}

export interface TreinoAluno {
  id: number;
  aluno_id: number;
  treino_id: number;
  dia_da_semana: string;
}

export interface MedidasAluno {
  id: number;
  aluno_id: number;
  treinador_id: number;
  data_registro: string;
  peso?: number;
  altura?: number;
  cintura?: number;
  quadril?: number;
}

export interface Enderecos {
  id: number;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}

export interface Cliente {
  id: number;
  id_usuario: number;
  objetivo?: string;
  nome?: string; // Redundante com Usuario.nome
  cpf?: string;
  email?: string; // Redundante com Usuario.email
  data_nascimento?: string;
  sexo?: string;
  telefone_1?: string;
  telefone_2?: string;
  id_endereco?: number;
}

// =============================================================================
// Serviços de Banco de Dados (Adaptados ao seu esquema)
// =============================================================================

export class UsuarioService {
  static async getUsuarioProfile(usuarioId: number): Promise<Usuario | null> {
    try {
      const { data, error } = await supabase
        .from('Usuario')
        .select('*')
        .eq('id', usuarioId)
        .single();
      if (error) throw error;
      return data as Usuario;
    } catch (error) {
      console.error('Erro ao obter perfil do Usuario:', error);
      return null;
    }
  }

  static async updateUsuarioProfile(usuarioId: number, updates: Partial<Omit<Usuario, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Usuario')
        .update(updates)
        .eq('id', usuarioId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil do Usuario:', error);
      return false;
    }
  }

  static async searchUsuarios(query: string, currentUsuarioId: number): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('Usuario')
        .select('id, nome, email, tipo') // Seleciona apenas campos relevantes para busca
        .neq('id', currentUsuarioId)
        .or(`nome.ilike.%${query}%,email.ilike.%${query}%`);
      if (error) throw error;
      return data as Usuario[];
    } catch (error) {
      console.error('Erro ao buscar Usuarios:', error);
      return [];
    }
  }
}

export class AmizadeService {
  static async sendFriendRequest(usuario_id_1: number, usuario_id_2: number): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('Amizade')
        .select('id')
        .or(`and(usuario_id_1.eq.${usuario_id_1},usuario_id_2.eq.${usuario_id_2}),and(usuario_id_1.eq.${usuario_id_2},usuario_id_2.eq.${usuario_id_1})`);

      if (existing && existing.length > 0) {
        throw new Error('Amizade já existe ou solicitação já enviada');
      }

      const { error } = await supabase
        .from('Amizade')
        .insert({ usuario_id_1, usuario_id_2, status: 'pending' });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao enviar solicitação de amizade:', error);
      return false;
    }
  }

  static async acceptFriendRequest(amizadeId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Amizade')
        .update({ status: 'accepted' })
        .eq('id', amizadeId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao aceitar solicitação de amizade:', error);
      return false;
    }
  }

  static async removeFriend(usuario_id_1: number, usuario_id_2: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Amizade')
        .delete()
        .or(`and(usuario_id_1.eq.${usuario_id_1},usuario_id_2.eq.${usuario_id_2}),and(usuario_id_1.eq.${usuario_id_2},usuario_id_2.eq.${usuario_id_1})`);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao remover amigo:', error);
      return false;
    }
  }

  static async getFriends(usuarioId: number): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('Amizade')
        .select(`
          *,
          usuario1:Usuario!Amizade_usuario_id_1_fkey(id, nome, email, tipo, avatar_url),
          usuario2:Usuario!Amizade_usuario_id_2_fkey(id, nome, email, tipo, avatar_url)
        `)
        .or(`usuario_id_1.eq.${usuarioId},usuario_id_2.eq.${usuarioId}`)
        .eq('status', 'accepted');

      if (error) throw error;

      const friends = data?.map(amizade => {
        return amizade.usuario_id_1 === usuarioId ? amizade.usuario2 : amizade.usuario1;
      }) || [];

      return friends as Usuario[];
    } catch (error) {
      console.error('Erro ao obter amigos:', error);
      return [];
    }
  }

  static async getPendingRequests(usuarioId: number): Promise<Amizade[]> {
    try {
      const { data, error } = await supabase
        .from('Amizade')
        .select(`
          *,
          remetente:Usuario!Amizade_usuario_id_1_fkey(id, nome, email, tipo, avatar_url)
        `) // Renomeado para 'remetente' para clareza
        .eq('usuario_id_2', usuarioId) // O receptor é o usuário atual
        .eq('status', 'pending');
      if (error) throw error;
      return data as Amizade[];
    } catch (error) {
      console.error('Erro ao obter solicitações pendentes:', error);
      return [];
    }
  }
}

// Define a new interface to match the exact structure returned by the Supabase select for TreinoAluno
interface TreinoAlunoQueryResult {
  treino: Treino[]; // Supabase returns related data as an array, even if single
  dia_da_semana: string;
}

export class TreinoService {
  static async createTreino(treino: Omit<Treino, 'id' | 'exercises' | 'is_shared' | 'student_id' | 'created_at' | 'updated_at'>, exercises: Omit<TreinoExercicio, 'id' | 'treino_id'>[]): Promise<Treino | null> {
    try {
      const { data, error } = await supabase
        .from('Treino')
        .insert(treino)
        .select()
        .single();

      if (error) throw error;

      if (data && exercises.length > 0) {
        const treinoId = data.id;
        const treinoExercicios = exercises.map(ex => ({ ...ex, treino_id: treinoId }));
        const { error: exError } = await supabase
          .from('TreinoExercicio')
          .insert(treinoExercicios);
        if (exError) throw exError;
      }
      return data as Treino;
    } catch (error) {
      console.error('Erro ao criar Treino:', error);
      return null;
    }
  }

  static async getUsuarioTreinos(alunoId: number): Promise<Treino[]> {
    try {
      const { data, error } = await supabase
        .from('TreinoAluno')
        .select(`
          treino:Treino(id, nome, descricao, treinador_id),
          dia_da_semana
        `)
        .eq('aluno_id', alunoId);

      if (error) throw error;

      // Explicitly cast the data to the new query result interface
      const typedData: TreinoAlunoQueryResult[] = (data || []) as TreinoAlunoQueryResult[];

      const treinosComExercicios: Treino[] = [];
      for (const item of typedData) {
        // Access the first element of the 'treino' array, as it's expected to be a single object
        const treino = item.treino[0];

        if (treino) {
          const { data: exerciciosData, error: exerciciosError } = await supabase
            .from('TreinoExercicio')
            .select(`
              series, repeticoes, carga,
              exercicio:Exercicio(id, nome, descricao)
            `)
            .eq('treino_id', treino.id);

          if (exerciciosError) throw exerciciosError;

          const exercisesDetail =
            exerciciosData?.flatMap(te =>
              te.exercicio.map(ex => ({
                ...ex,
                series: te.series,
                repeticoes: te.repeticoes,
                carga: te.carga,
              }))
            ) || [];


          treinosComExercicios.push({
            ...treino,
            exercises: exercisesDetail,
            is_shared: false,
            student_id: alunoId,
          });
        }
      }
      return treinosComExercicios;
    } catch (error) {
      console.error('Erro ao obter treinos do Usuario:', error);
      return [];
    }
  }

  static async getTreinadorTreinos(treinadorId: number): Promise<Treino[]> {
    try {
      const { data, error } = await supabase
        .from('Treino')
        .select('*,TreinoExercicio(series, repeticoes, carga, exercicio:Exercicio(id, nome, descricao))')
        .eq('treinador_id', treinadorId)
        .order('id', { ascending: false });

      if (error) throw error;

      const treinosComExercicios: Treino[] = [];
      for (const treino of (data || []) as any[]) { // Usar 'any[]' temporariamente para flexibilidade
        const exercisesDetail = treino.TreinoExercicio?.map((te: any) => ({
          id: te.exercicio.id,
          nome: te.exercicio.nome,
          descricao: te.exercicio.descricao,
          series: te.series,
          repeticoes: te.repeticoes,
          carga: te.carga,
        })) || [];

        treinosComExercicios.push({
          id: treino.id,
          nome: treino.nome,
          descricao: treino.descricao,
          treinador_id: treino.treinador_id,
          exercises: exercisesDetail,
        });
      }
      return treinosComExercicios;
    } catch (error) {
      console.error('Erro ao obter treinos do Treinador:', error);
      return [];
    }
  }

  static async assignTreinoToAluno(treinoAlunoData: Omit<TreinoAluno, 'id'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('TreinoAluno')
        .insert(treinoAlunoData);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atribuir treino ao Aluno:', error);
      return false;
    }
  }

  static async shareTreinoWithFriend(treinoId: number, friendId: number): Promise<boolean> {
    try {
      // Primeiro, obter o treino original e seus exercícios
      const { data: originalTreino, error: fetchError } = await supabase
        .from('Treino')
        .select('*,TreinoExercicio(exercicio_id, series, repeticoes, carga)')
        .eq('id', treinoId)
        .single();

      if (fetchError) throw fetchError;

      // Criar uma cópia do treino para o amigo
      const { data: newTreino, error: insertTreinoError } = await supabase
        .from('Treino')
        .insert({
          nome: `${originalTreino.nome} (Compartilhado)`,
          descricao: originalTreino.descricao,
          treinador_id: originalTreino.treinador_id, // Mantém o treinador original
        })
        .select()
        .single();

      if (insertTreinoError) throw insertTreinoError;

      // Atribuir o novo treino ao amigo (como se fosse um aluno)
      const { error: assignError } = await supabase
        .from('TreinoAluno')
        .insert({
          aluno_id: friendId,
          treino_id: newTreino.id,
          dia_da_semana: 'Compartilhado' // Ou algum valor padrão/lógico
        });
      if (assignError) throw assignError;

      // Copiar os exercícios para o novo treino
      if (newTreino && originalTreino.TreinoExercicio && originalTreino.TreinoExercicio.length > 0) {
        const newTreinoExercicios = originalTreino.TreinoExercicio.map((te: any) => ({
          treino_id: newTreino.id,
          exercicio_id: te.exercicio_id,
          series: te.series,
          repeticoes: te.repeticoes,
          carga: te.carga,
        }));
        const { error: insertExError } = await supabase
          .from('TreinoExercicio')
          .insert(newTreinoExercicios);
        if (insertExError) throw insertExError;
      }

      return true;
    } catch (error) {
      console.error('Erro ao compartilhar Treino:', error);
      return false;
    }
  }

  static async deleteTreino(treinoId: number): Promise<boolean> {
    try {
      // Primeiro, deletar as entradas em TreinoExercicio e TreinoAluno
      await supabase.from('TreinoExercicio').delete().eq('treino_id', treinoId);
      await supabase.from('TreinoAluno').delete().eq('treino_id', treinoId);

      const { error } = await supabase
        .from('Treino')
        .delete()
        .eq('id', treinoId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar Treino:', error);
      return false;
    }
  }
}

export class MetaService {
  static async createMeta(meta: Omit<Meta, 'id' | 'data_criacao'>): Promise<Meta | null> {
    try {
      const { data, error } = await supabase
        .from('Meta')
        .insert({
          ...meta,
          data_criacao: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return data as Meta;
    } catch (error) {
      console.error('Erro ao criar Meta:', error);
      return null;
    }
  }

  static async getUsuarioMetas(alunoId: number): Promise<Meta[]> {
    try {
      const { data, error } = await supabase
        .from('Meta')
        .select('*')
        .eq('aluno_id', alunoId)
        .order('data_criacao', { ascending: false });
      if (error) throw error;
      return data as Meta[];
    } catch (error) {
      console.error('Erro ao obter Metas do Usuario:', error);
      return [];
    }
    }

  static async updateMeta(metaId: number, updates: Partial<Omit<Meta, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Meta')
        .update(updates)
        .eq('id', metaId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar Meta:', error);
      return false;
    }
  }

  static async deleteMeta(metaId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Meta')
        .delete()
        .eq('id', metaId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar Meta:', error);
      return false;
    }
  }
}

export class ExercicioService {
  static async createExercicio(exercicio: Omit<Exercicio, 'id'>): Promise<Exercicio | null> {
    try {
      const { data, error } = await supabase
        .from('Exercicio')
        .insert(exercicio)
        .select()
        .single();
      if (error) throw error;
      return data as Exercicio;
    } catch (error) {
      console.error('Erro ao criar Exercicio:', error);
      return null;
    }
  }

  static async getExercicio(exercicioId: number): Promise<Exercicio | null> {
    try {
      const { data, error } = await supabase
        .from('Exercicio')
        .select('*')
        .eq('id', exercicioId)
        .single();
      if (error) throw error;
      return data as Exercicio;
    } catch (error) {
      console.error('Erro ao obter Exercicio:', error);
      return null;
    }
  }

  static async updateExercicio(exercicioId: number, updates: Partial<Omit<Exercicio, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Exercicio')
        .update(updates)
        .eq('id', exercicioId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar Exercicio:', error);
      return false;
    }
  }

  static async deleteExercicio(exercicioId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Exercicio')
        .delete()
        .eq('id', exercicioId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar Exercicio:', error);
      return false;
    }
  }
}

export class TreinoExercicioService {
  static async createTreinoExercicio(treinoExercicio: Omit<TreinoExercicio, 'id'>): Promise<TreinoExercicio | null> {
    try {
      const { data, error } = await supabase
        .from('TreinoExercicio')
        .insert(treinoExercicio)
        .select()
        .single();
      if (error) throw error;
      return data as TreinoExercicio;
    } catch (error) {
      console.error('Erro ao criar TreinoExercicio:', error);
      return null;
    }
  }

  static async getTreinoExerciciosByTreino(treinoId: number): Promise<TreinoExercicio[]> {
    try {
      const { data, error } = await supabase
        .from('TreinoExercicio')
        .select('*')
        .eq('treino_id', treinoId);
      if (error) throw error;
      return data as TreinoExercicio[];
    } catch (error) {
      console.error('Erro ao obter TreinoExercicios por Treino:', error);
      return [];
    }
  }

  static async updateTreinoExercicio(treinoExercicioId: number, updates: Partial<Omit<TreinoExercicio, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('TreinoExercicio')
        .update(updates)
        .eq('id', treinoExercicioId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar TreinoExercicio:', error);
      return false;
    }
  }

  static async deleteTreinoExercicio(treinoExercicioId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('TreinoExercicio')
        .delete()
        .eq('id', treinoExercicioId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar TreinoExercicio:', error);
      return false;
    }
  }
}

export class TreinoAlunoService {
  static async assignTreinoToAluno(treinoAluno: Omit<TreinoAluno, 'id'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('TreinoAluno')
        .insert(treinoAluno);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atribuir Treino ao Aluno:', error);
      return false;
    }
  }

  static async getTreinosByAluno(alunoId: number): Promise<TreinoAluno[]> {
    try {
      const { data, error } = await supabase
        .from('TreinoAluno')
        .select('*')
        .eq('aluno_id', alunoId);
      if (error) throw error;
      return data as TreinoAluno[];
    } catch (error) {
      console.error('Erro ao obter Treinos por Aluno:', error);
      return [];
    }
  }

  static async updateTreinoAluno(treinoAlunoId: number, updates: Partial<Omit<TreinoAluno, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('TreinoAluno')
        .update(updates)
        .eq('id', treinoAlunoId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar TreinoAluno:', error);
      return false;
    }
  }

  static async deleteTreinoAluno(treinoAlunoId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('TreinoAluno')
        .delete()
        .eq('id', treinoAlunoId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar TreinoAluno:', error);
      return false;
    }
  }
}

export class MedidasAlunoService {
  static async createMedidasAluno(medidasAluno: Omit<MedidasAluno, 'id' | 'data_registro'>): Promise<MedidasAluno | null> {
    try {
      const { data, error } = await supabase
        .from('MedidasAluno')
        .insert({
          ...medidasAluno,
          data_registro: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return data as MedidasAluno;
    } catch (error) {
      console.error('Erro ao criar MedidasAluno:', error);
      return null;
    }
  }

  static async getMedidasByAluno(alunoId: number): Promise<MedidasAluno[]> {
    try {
      const { data, error } = await supabase
        .from('MedidasAluno')
        .select('*')
        .eq('aluno_id', alunoId)
        .order('data_registro', { ascending: false });
      if (error) throw error;
      return data as MedidasAluno[];
    } catch (error) {
      console.error('Erro ao obter MedidasAluno por Aluno:', error);
      return [];
    }
    }

  static async updateMedidasAluno(medidasAlunoId: number, updates: Partial<Omit<MedidasAluno, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('MedidasAluno')
        .update(updates)
        .eq('id', medidasAlunoId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar MedidasAluno:', error);
      return false;
    }
  }

  static async deleteMedidasAluno(medidasAlunoId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('MedidasAluno')
        .delete()
        .eq('id', medidasAlunoId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar MedidasAluno:', error);
      return false;
    }
  }
}

export class EnderecosService {
  static async createEndereco(endereco: Omit<Enderecos, 'id'>): Promise<Enderecos | null> {
    try {
      const { data, error } = await supabase
        .from('Enderecos')
        .insert(endereco)
        .select()
        .single();
      if (error) throw error;
      return data as Enderecos;
    } catch (error) {
      console.error('Erro ao criar Endereco:', error);
      return null;
    }
  }

  static async getEndereco(enderecoId: number): Promise<Enderecos | null> {
    try {
      const { data, error } = await supabase
        .from('Enderecos')
        .select('*')
        .eq('id', enderecoId)
        .single();
      if (error) throw error;
      return data as Enderecos;
    } catch (error) {
      console.error('Erro ao obter Endereco:', error);
      return null;
    }
  }

  static async updateEndereco(enderecoId: number, updates: Partial<Omit<Enderecos, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Enderecos')
        .update(updates)
        .eq('id', enderecoId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar Endereco:', error);
      return false;
    }
  }

  static async deleteEndereco(enderecoId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Enderecos')
        .delete()
        .eq('id', enderecoId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar Endereco:', error);
      return false;
    }
  }
}

export class ClienteService {
  static async createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente | null> {
    try {
      const { data, error } = await supabase
        .from('Cliente')
        .insert(cliente)
        .select()
        .single();
      if (error) throw error;
      return data as Cliente;
    } catch (error) {
      console.error('Erro ao criar Cliente:', error);
      return null;
    }
  }

  static async getCliente(clienteId: number): Promise<Cliente | null> {
    try {
      const { data, error } = await supabase
        .from('Cliente')
        .select('*')
        .eq('id', clienteId)
        .single();
      if (error) throw error;
      return data as Cliente;
    } catch (error) {
      console.error('Erro ao obter Cliente:', error);
      return null;
    }
  }

  static async getClienteByUsuarioId(usuarioId: number): Promise<Cliente | null> {
    try {
      const { data, error } = await supabase
        .from('Cliente')
        .select('*')
        .eq('id_usuario', usuarioId)
        .single();
      if (error) throw error;
      return data as Cliente;
    } catch (error) {
      console.error('Erro ao obter Cliente por ID de Usuario:', error);
      return null;
    }
  }

  static async updateCliente(clienteId: number, updates: Partial<Omit<Cliente, 'id'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Cliente')
        .update(updates)
        .eq('id', clienteId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar Cliente:', error);
      return false;
    }
  }

  static async deleteCliente(clienteId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Cliente')
        .delete()
        .eq('id', clienteId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar Cliente:', error);
      return false;
    }
  }
}

