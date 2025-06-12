import { supabase } from '../services/Supabase';

// Função para registrar um novo usuário
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      user: data.user,
      message: 'Usuário registrado com sucesso! Verifique seu email para confirmar a conta.'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para fazer login
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
      message: 'Login realizado com sucesso!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para fazer logout
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Logout realizado com sucesso!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para obter o usuário atual
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return {
      success: true,
      user: user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para verificar se o usuário está logado
export const isUserLoggedIn = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      success: true,
      isLoggedIn: !!session,
      session: session
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para login com Google
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data,
      message: 'Redirecionando para login do Google...'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para resetar senha
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Email de recuperação enviado com sucesso!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

