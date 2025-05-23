import { useState } from 'react';

export function useProfileEditing() {
  // Estado que controla se o perfil está no modo de edição
  const [isEditingPerfil, setIsEditingPerfil] = useState(false);

  // Telefones para exibição/edição
  const [Celular, setCelular] = useState('(85) 9 9744-4969');
  const [Emergencia, setEmergencia] = useState('(__) ______________');

  // Estado que controla se o card "Dados Cadastrais" está expandido ou recolhido
  const [showPerfil, setShowPerfil] = useState(false);

  return {
    isEditingPerfil,
    setIsEditingPerfil,
    Celular,
    setCelular,
    Emergencia,
    setEmergencia,
    showPerfil,
    setShowPerfil,
  };
}
export default useProfileEditing;