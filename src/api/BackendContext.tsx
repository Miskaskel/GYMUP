import React, { createContext, useState, useContext } from 'react';

// Tipos para os dados do backend simulado
export type User = {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'trainer';
  friends?: string[]; // IDs dos amigos (apenas para alunos)
  students?: string[]; // IDs dos alunos (apenas para treinadores)
  trainers?: string[]; // IDs dos treinadores (apenas para alunos)
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  createdBy: string; // ID do treinador
  assignedTo: string[]; // IDs dos alunos
  createdAt: string;
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number; // em segundos
  description?: string;
  imageUrl?: string;
};

export type Goal = {
  id: string;
  userId: string;
  type: 'weight' | 'workout_frequency' | 'measurements' | 'muscle_mass';
  target: number;
  current: number;
  unit: string;
  startDate: string;
  targetDate: string;
  history: {date: string, value: number}[];
};

export type Progress = {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
  };
};

// Contexto para o backend simulado
type BackendContextType = {
  users: User[];
  workouts: Workout[];
  goals: Goal[];
  progress: Progress[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  addWorkout: (workout: Workout) => void;
  assignWorkout: (workoutId: string, studentId: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, current: number) => void;
  addProgress: (progress: Progress) => void;
  addFriend: (userId: string, friendId: string) => void;
  addStudent: (trainerId: string, studentId: string) => void;
  getWorkoutsForUser: (userId: string) => Workout[];
  getGoalsForUser: (userId: string) => Goal[];
  getProgressForUser: (userId: string) => Progress[];
  getFriendsForUser: (userId: string) => User[];
  getStudentsForTrainer: (trainerId: string) => User[];
};

// Dados iniciais para o backend simulado
const initialUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    type: 'student',
    friends: [],
    trainers: ['3']
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    type: 'student',
    friends: [],
    trainers: ['3']
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    email: 'carlos@example.com',
    type: 'trainer',
    students: ['1', '2']
  }
];

const initialWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Treino de Pernas',
    description: 'Foco em quadríceps, posteriores e panturrilhas',
    exercises: [
      {
        id: '1',
        name: 'Agachamento',
        sets: 4,
        reps: 12,
        rest: 60,
        description: 'Mantenha a coluna reta e desça até as coxas ficarem paralelas ao chão'
      },
      {
        id: '2',
        name: 'Leg Press',
        sets: 3,
        reps: 15,
        rest: 60,
        description: 'Mantenha os joelhos alinhados com os pés'
      }
    ],
    createdBy: '3',
    assignedTo: ['1'],
    createdAt: new Date().toISOString()
  }
];

const initialGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    type: 'weight',
    target: 75,
    current: 80,
    unit: 'kg',
    startDate: new Date().toISOString(),
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      {date: new Date().toISOString(), value: 80}
    ]
  }
];

const initialProgress: Progress[] = [
  {
    id: '1',
    userId: '1',
    date: new Date().toISOString(),
    weight: 80,
    muscleMass: 35,
    measurements: {
      chest: 95,
      waist: 85,
      hips: 100,
      arms: 35,
      legs: 60
    }
  }
];

// Criação do contexto
const BackendContext = createContext<BackendContextType | undefined>(undefined);

// Hook personalizado para usar o backend simulado
export const useBackend = () => {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
};

// Provedor do backend simulado
export const BackendProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [progress, setProgress] = useState<Progress[]>(initialProgress);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Funções para manipular os dados
  const addUser = (user: User) => {
    setUsers([...users, user]);
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const assignWorkout = (workoutId: string, studentId: string) => {
    setWorkouts(workouts.map(workout => 
      workout.id === workoutId 
        ? { ...workout, assignedTo: [...workout.assignedTo, studentId] } 
        : workout
    ));
  };

  const addGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  const updateGoal = (goalId: string, current: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            current, 
            history: [...goal.history, {date: new Date().toISOString(), value: current}] 
          } 
        : goal
    ));
  };

  const addProgress = (newProgress: Progress) => {
    setProgress([...progress, newProgress]);
  };

  const addFriend = (userId: string, friendId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, friends: [...(user.friends || []), friendId] } 
        : user
    ));
  };

  const addStudent = (trainerId: string, studentId: string) => {
    setUsers(users.map(user => {
      if (user.id === trainerId) {
        return { ...user, students: [...(user.students || []), studentId] };
      }
      if (user.id === studentId) {
        return { ...user, trainers: [...(user.trainers || []), trainerId] };
      }
      return user;
    }));
  };

  // Funções para obter dados filtrados
  const getWorkoutsForUser = (userId: string) => {
    return workouts.filter(workout => 
      workout.assignedTo.includes(userId) || workout.createdBy === userId
    );
  };

  const getGoalsForUser = (userId: string) => {
    return goals.filter(goal => goal.userId === userId);
  };

  const getProgressForUser = (userId: string) => {
    return progress.filter(p => p.userId === userId);
  };

  const getFriendsForUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.friends) return [];
    return users.filter(u => user.friends?.includes(u.id));
  };

  const getStudentsForTrainer = (trainerId: string) => {
    const trainer = users.find(u => u.id === trainerId);
    if (!trainer || !trainer.students) return [];
    return users.filter(u => trainer.students?.includes(u.id));
  };

  return (
    <BackendContext.Provider value={{
      users,
      workouts,
      goals,
      progress,
      currentUser,
      setCurrentUser,
      addUser,
      addWorkout,
      assignWorkout,
      addGoal,
      updateGoal,
      addProgress,
      addFriend,
      addStudent,
      getWorkoutsForUser,
      getGoalsForUser,
      getProgressForUser,
      getFriendsForUser,
      getStudentsForTrainer
    }}>
      {children}
    </BackendContext.Provider>
  );
};
