import { useState } from 'react';

export function useMeasurementsEditing() {
  // Estado que controla se o endereço está no modo de edição
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);

  // Campos de endereço para exibição/edição
  const [bracodireto, setBracoDireto] = useState('');
  const [bracoesquerdo, setBracoEsquerdo] = useState('');
  const [peitoral, setPeitoral] = useState('');
  const [coxadireita, setCoxaDireita] = useState('');
  const [coxaesquerda, setCoxaEsquerda] = useState('');
  const [quadril, setQuadril] = useState('');
  const [panturilhadireita, setPanturillhaDireita] = useState('');
  const [panturilhaesquerda, setPanturillhaEsquerda] = useState('');

  // Estado que controla se o card "Endereço" está expandido ou recolhido
  const [showMeasurements, setShowMeasurements] = useState(false);

  return {
    isEditingMeasurements,
    setIsEditingMeasurements,
    bracodireto,
    setBracoDireto,
    bracoesquerdo,
    setBracoEsquerdo,
    peitoral,
    setPeitoral,
    coxadireita,
    setCoxaDireita,
    coxaesquerda,
    setCoxaEsquerda,
    quadril,
    setQuadril,
    panturilhadireita,
    setPanturillhaDireita,
    panturilhaesquerda,
    setPanturillhaEsquerda,
    showMeasurements,
    setShowMeasurements,
  };
}

export default useMeasurementsEditing;
