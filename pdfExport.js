// NOVO CÓDIGO para pdfExport.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos botões de exportação
    const exportWorkoutPdfButton = document.getElementById('export-workout-pdf-button');
    const exportDietPdfButton = document.getElementById('export-diet-pdf-button');

    // Adiciona event listeners aos botões
    if (exportWorkoutPdfButton) {
        exportWorkoutPdfButton.addEventListener('click', exportCurrentWorkoutToPdf);
    }
    if (exportDietPdfButton) {
        exportDietPdfButton.addEventListener('click', exportCurrentDietToPdf);
    }

    /**
     * Exporta o treino atualmente selecionado para um arquivo PDF com TEXTO.
     * --- CÓDIGO CORRIGIDO ---
     */
    function exportCurrentWorkoutToPdf() {
        const currentWorkoutName = localStorage.getItem('currentWorkoutName');
        const allWorkouts = JSON.parse(localStorage.getItem('allWorkouts')) || {};
        const workoutData = allWorkouts[currentWorkoutName] || [];

        if (!workoutData || workoutData.length === 0) {
            alert(`Não há exercícios para exportar no treino "${currentWorkoutName}".`);
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4'); // 'p' = portrait, 'mm' = millimeters, 'a4' = A4 size

        // ---- Configurações do Documento ----
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15; // margem de 1.5 cm
        let y = margin; // Posição vertical inicial
        
        // ---- INÍCIO DA ALTERAÇÃO 1: Definir a largura máxima do texto ----
        const maxWidth = doc.internal.pageSize.width - margin * 2;
        // ---- FIM DA ALTERAÇÃO 1 ----

        // ---- Função para adicionar uma nova página se necessário ----
        function checkPageBreak(requiredHeight) {
            if (y + requiredHeight > pageHeight - margin) {
                doc.addPage();
                y = margin; // Reseta a posição para o topo da nova página
            }
        }

        // ---- Título do Treino ----
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(`Treino: ${currentWorkoutName}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 15; // Aumenta o espaçamento após o título

        // ---- Lista de Exercícios ----
        workoutData.forEach((exercise, index) => {
            // A altura estimada agora é mais flexível, mas mantemos uma verificação mínima
            const minimumBlockHeight = 35; 
            checkPageBreak(minimumBlockHeight);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`${index + 1}. ${exercise.name}`, margin, y);
            y += 7;

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.text(`Séries: ${exercise.sets} | Repetições: ${exercise.reps} | Carga: ${exercise.exerciseLoad || 'N/A'}`, margin, y);
            y += 6;
            doc.text(`Descanso: ${exercise.restTime || 'N/A'}`, margin, y);
            y += 6;

            // ---- INÍCIO DA ALTERAÇÃO 2: Lógica de quebra de linha para Observações ----
            
            // 1. Monta o texto completo que será impresso
            const observationText = `Observações: ${exercise.observation || 'N/A'}`;

            // 2. Usa a função splitTextToSize para quebrar o texto em linhas
            const observationLines = doc.splitTextToSize(observationText, maxWidth);
            
            // 3. Verifica se o bloco de texto cabe na página atual
            checkPageBreak(observationLines.length * 6); // Estima 6mm de altura por linha

            // 4. Imprime cada linha do array gerado
            observationLines.forEach(line => {
                doc.text(line, margin, y);
                y += 6; // Incrementa a posição Y para a próxima linha
            });

            // ---- FIM DA ALTERAÇÃO 2 ----
            
            y += 5; // Espaço antes da linha
            doc.setDrawColor(200, 200, 200); // Cor da linha (cinza claro)
            doc.line(margin, y, doc.internal.pageSize.width - margin, y); // Linha separadora
            y += 10; // Espaço após a linha
        });

        // Salva o PDF
        doc.save(`Treino_${currentWorkoutName}.pdf`);
    }

    /**
     * Exporta a dieta atualmente selecionada para um arquivo PDF com TEXTO.
     * (Esta função permanece inalterada)
     */
    function exportCurrentDietToPdf() {
        // ... seu código original da dieta aqui ...
        const currentDietName = localStorage.getItem('currentDietNameDiet');
        const allDiets = JSON.parse(localStorage.getItem('allDiets')) || {};
        const dietData = allDiets[currentDietName] || [];

        if (!dietData || dietData.length === 0) {
            alert(`Não há itens para exportar na dieta "${currentDietName}".`);
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // ---- Configurações do Documento ----
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        let y = margin;

        function checkPageBreak(requiredHeight) {
            if (y + requiredHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        }

        // ---- Título da Dieta ----
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(`Plano de Dieta: ${currentDietName}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 15;

        // ---- Agrupamento e Ordenação das Refeições ----
        const mealsGrouped = {};
        dietData.forEach(item => {
            const key = `${item.mealName}-${item.mealTime || 'sem-horario'}`;
            if (!mealsGrouped[key]) {
                mealsGrouped[key] = { mealName: item.mealName, mealTime: item.mealTime, items: [] };
            }
            mealsGrouped[key].items.push(item);
        });

        const sortedMeals = Object.values(mealsGrouped).sort((a, b) => {
            if (a.mealTime && b.mealTime) return a.mealTime.localeCompare(b.mealTime);
            if (!a.mealTime && b.mealTime) return 1;
            if (a.mealTime && !b.mealTime) return -1;
            return a.mealName.localeCompare(b.mealName);
        });

        // ---- Renderização das Refeições ----
        sortedMeals.forEach(mealGroup => {
            checkPageBreak(20); // Espaço para o cabeçalho da refeição

            const mealHeaderText = `${mealGroup.mealName} ${mealGroup.mealTime ? `(${mealGroup.mealTime})` : ''}`;
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(mealHeaderText, margin, y);
            y += 8;

            let mealKcal = 0, mealProtein = 0, mealCarb = 0;

            mealGroup.items.forEach(item => {
                checkPageBreak(15); // Espaço para cada item
                doc.setFontSize(11);
                doc.setFont("helvetica", "normal");
                
                doc.text(`- ${item.foodName} (${item.quantity}g)`, margin + 2, y);
                y += 6;
                doc.text(`  Kcal: ${item.calculatedKcal || '0'} | Prot: ${item.calculatedProtein || '0'}g | Carb: ${item.calculatedCarb || '0'}g`, margin + 4, y);
                y += 6;

                mealKcal += parseFloat(item.calculatedKcal || 0);
                mealProtein += parseFloat(item.calculatedProtein || 0);
                mealCarb += parseFloat(item.calculatedCarb || 0);
            });
            
            // Sumário da refeição
            checkPageBreak(10);
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.text(`Total da Refeição: ${mealKcal.toFixed(1)} kcal | ${mealProtein.toFixed(1)}g Prot | ${mealCarb.toFixed(1)}g Carb`, margin, y);
            y += 10;
        });

        // ---- Sumário Geral ----
        checkPageBreak(30); // Espaço para o sumário geral
        let totalKcal = 0, totalProtein = 0, totalCarb = 0;
        dietData.forEach(item => {
            totalKcal += parseFloat(item.calculatedKcal || 0);
            totalProtein += parseFloat(item.calculatedProtein || 0);
            totalCarb += parseFloat(item.calculatedCarb || 0);
        });

        y += 10; // Espaço antes do sumário geral
        doc.setDrawColor(100, 100, 100);
        doc.line(margin, y, doc.internal.pageSize.width - margin, y);
        y += 10;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Total Geral da Dieta:", margin, y);
        y += 8;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Calorias Totais: ${totalKcal.toFixed(1)} kcal`, margin, y);
        y += 7;
        doc.text(`Proteínas Totais: ${totalProtein.toFixed(1)} g`, margin, y);
        y += 7;
        doc.text(`Carboidratos Totais: ${totalCarb.toFixed(1)} g`, margin, y);

        // Salva o PDF
        doc.save(`Dieta_${currentDietName}.pdf`);
    }
});
