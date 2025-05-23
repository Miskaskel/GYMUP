import { useState } from 'react';

export function useAndressEditing() {
  // Estado que controla se o endereço está no modo de edição
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Campos de endereço para exibição/edição
  const [cep, setCep] = useState('61648-310');
  const [enderecoNumero, setEnderecoNumero] = useState('Rua Paraná, 2070');
  const [complemento, setComplemento] = useState('Apto 101, Bloco 01, Quadra 19');
  const [bairro, setBairro] = useState('Jurema');
  const [cidadeEstado, setCidadeEstado] = useState('Caucaia, CE');

  // Estado que controla se o card "Endereço" está expandido ou recolhido
  const [showAddress, setShowAddress] = useState(false);

  return {
    isEditingAddress,
    setIsEditingAddress,
    cep,
    setCep,
    enderecoNumero,
    setEnderecoNumero,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    cidadeEstado,
    setCidadeEstado,
    showAddress,
    setShowAddress,
  };
}

export default useAndressEditing;
