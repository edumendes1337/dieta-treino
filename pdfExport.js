// pdfExport.js

document.addEventListener('DOMContentLoaded', () => {
    // Obtenha referências aos botões de exportação
    const exportWorkoutPdfButton = document.getElementById('export-workout-pdf-button');
    const exportDietPdfButton = document.getElementById('export-diet-pdf-button');

    // Adicione event listeners aos botões
    if (exportWorkoutPdfButton) {
        exportWorkoutPdfButton.addEventListener('click', exportCurrentWorkoutToPdf);
    }
    if (exportDietPdfButton) {
        exportDietPdfButton.addEventListener('click', exportCurrentDietToPdf);
    }

    /**
     * Exporta o treino atualmente selecionado para um arquivo PDF.
     */
    function exportCurrentWorkoutToPdf() {
        // Obtenha o nome do treino atual do localStorage
        const currentWorkoutName = localStorage.getItem('currentWorkoutName');
        // Obtenha todos os treinos do localStorage
        const allWorkouts = JSON.parse(localStorage.getItem('allWorkouts')) || {};
        const workoutData = allWorkouts[currentWorkoutName] || [];

        if (!workoutData || workoutData.length === 0) {
            alert(`Não há exercícios para exportar no treino "${currentWorkoutName}".`);
            return;
        }

        // Crie um elemento div temporário para renderizar o conteúdo do PDF
        const pdfContentDiv = document.createElement('div');
        pdfContentDiv.style.width = '210mm'; // Largura A4
        pdfContentDiv.style.padding = '10mm';
        pdfContentDiv.style.backgroundColor = '#fff'; // Fundo branco para o PDF
        pdfContentDiv.style.boxSizing = 'border-box'; // Inclui padding na largura

        // Título do Treino
        const title = document.createElement('h1');
        title.textContent = `Treino: ${currentWorkoutName}`;
        title.style.textAlign = 'center';
        title.style.color = '#333';
        pdfContentDiv.appendChild(title);

        // Lista de Exercícios
        const workoutListUl = document.createElement('ul');
        workoutListUl.style.listStyle = 'none';
        workoutListUl.style.padding = '0';
        workoutListUl.style.marginTop = '20px';

        workoutData.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.style.marginBottom = '15px';
            li.style.padding = '10px';
            li.style.border = '1px solid #ddd';
            li.style.borderRadius = '8px';
            li.style.textAlign = 'left';
            li.style.backgroundColor = '#f9f9f9';

            li.innerHTML = `
                <strong>${index + 1}. ${exercise.name}</strong><br>
                Séries: ${exercise.sets}<br>
                Repetições: ${exercise.reps}<br>
                Carga: ${exercise.exerciseLoad || 'N/A'}<br>
                Descanso: ${exercise.restTime || 'N/A'}<br>
                Observações: ${exercise.observation || 'N/A'}
            `;
            workoutListUl.appendChild(li);
        });
        pdfContentDiv.appendChild(workoutListUl);

        // Adicione o div temporário ao corpo do documento (fora da tela visível)
        pdfContentDiv.style.position = 'absolute';
        pdfContentDiv.style.left = '-9999px';
        document.body.appendChild(pdfContentDiv);

        // Use html2canvas para renderizar o div como uma imagem
        html2canvas(pdfContentDiv, { scale: 2 }).then(canvas => { // Aumente a escala para melhor qualidade
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf; // Acesse jsPDF do objeto global window
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' para retrato, 'mm' para milímetros, 'a4' para tamanho A4

            const imgWidth = 210; // Largura A4 em mm
            const pageHeight = 297; // Altura A4 em mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Treino_${currentWorkoutName}.pdf`);

            // Remova o div temporário
            document.body.removeChild(pdfContentDiv);
        }).catch(error => {
            console.error("Erro ao gerar PDF do treino:", error);
            alert("Ocorreu um erro ao exportar o treino para PDF.");
            document.body.removeChild(pdfContentDiv); // Garante que o div seja removido mesmo em erro
        });
    }

    /**
     * Exporta a dieta atualmente selecionada para um arquivo PDF.
     */
    function exportCurrentDietToPdf() {
        // Obtenha o nome da dieta atual do localStorage
        const currentDietName = localStorage.getItem('currentDietNameDiet');
        // Obtenha todos os planos de dieta do localStorage
        const allDiets = JSON.parse(localStorage.getItem('allDiets')) || {};
        const dietData = allDiets[currentDietName] || [];

        if (!dietData || dietData.length === 0) {
            alert(`Não há itens para exportar na dieta "${currentDietName}".`);
            return;
        }

        // Crie um elemento div temporário para renderizar o conteúdo do PDF
        const pdfContentDiv = document.createElement('div');
        pdfContentDiv.style.width = '210mm'; // Largura A4
        pdfContentDiv.style.padding = '10mm';
        pdfContentDiv.style.backgroundColor = '#fff';
        pdfContentDiv.style.boxSizing = 'border-box';

        // Título da Dieta
        const title = document.createElement('h1');
        title.textContent = `Dieta: ${currentDietName}`;
        title.style.textAlign = 'center';
        title.style.color = '#333';
        pdfContentDiv.appendChild(title);

        // Agrupar itens por refeição e horário para exibição no PDF
        const mealsGrouped = {};
        dietData.forEach(item => {
            const key = `${item.mealName}-${item.mealTime || 'sem-horario'}`;
            if (!mealsGrouped[key]) {
                mealsGrouped[key] = {
                    mealName: item.mealName,
                    mealTime: item.mealTime,
                    items: []
                };
            }
            mealsGrouped[key].items.push(item);
        });

        const sortedMeals = Object.values(mealsGrouped).sort((a, b) => {
            if (a.mealTime && b.mealTime) {
                return a.mealTime.localeCompare(b.mealTime);
            }
            if (!a.mealTime && b.mealTime) return 1;
            if (a.mealTime && !b.mealTime) return -1;
            return a.mealName.localeCompare(b.mealName);
        });

        sortedMeals.forEach(mealGroup => {
            const mealSectionDiv = document.createElement('div');
            mealSectionDiv.style.marginBottom = '20px';
            mealSectionDiv.style.border = '1px solid #e0e0e0';
            mealSectionDiv.style.borderRadius = '8px';
            mealSectionDiv.style.padding = '15px';
            mealSectionDiv.style.backgroundColor = '#f9f9f9';

            const mealHeader = document.createElement('h3');
            mealHeader.textContent = `${mealGroup.mealName} ${mealGroup.mealTime ? `(${mealGroup.mealTime})` : '(Horário não definido)'}`;
            mealHeader.style.color = '#007bff';
            mealHeader.style.marginTop = '0';
            mealHeader.style.marginBottom = '10px';
            mealSectionDiv.appendChild(mealHeader);

            const mealItemsList = document.createElement('ul');
            mealItemsList.style.listStyle = 'none';
            mealItemsList.style.padding = '0';
            mealItemsList.style.margin = '0';

            let mealKcal = 0;
            let mealProtein = 0;
            let mealCarb = 0;

            mealGroup.items.forEach(item => {
                const li = document.createElement('li');
                li.style.marginBottom = '8px';
                li.style.padding = '10px';
                li.style.backgroundColor = '#fff';
                li.style.border = '1px solid #eee';
                li.style.borderRadius = '6px';
                li.style.textAlign = 'left';

                li.innerHTML = `
                    <strong>${item.foodName}</strong> (${item.quantity}g)<br>
                    Kcal: ${item.calculatedKcal || '0'} | Prot: ${item.calculatedProtein || '0'}g | Carb: ${item.calculatedCarb || '0'}g<br>
                    Obs: ${item.observation || 'N/A'}
                `;
                mealItemsList.appendChild(li);

                mealKcal += parseFloat(item.calculatedKcal);
                mealProtein += parseFloat(item.calculatedProtein);
                mealCarb += parseFloat(item.calculatedCarb);
            });
            mealSectionDiv.appendChild(mealItemsList);

            const mealSummaryDiv = document.createElement('div');
            mealSummaryDiv.style.backgroundColor = '#e2f0fb';
            mealSummaryDiv.style.padding = '10px';
            mealSummaryDiv.style.borderRadius = '8px';
            mealSummaryDiv.style.marginTop = '15px';
            mealSummaryDiv.style.fontWeight = 'bold';
            mealSummaryDiv.style.color = '#0056b3';
            mealSummaryDiv.style.textAlign = 'left';
            mealSummaryDiv.innerHTML = `
                <p style="margin: 0;">Total da Refeição: ${mealKcal.toFixed(1)} kcal | ${mealProtein.toFixed(1)}g Prot | ${mealCarb.toFixed(1)}g Carb</p>
            `;
            mealSectionDiv.appendChild(mealSummaryDiv);

            pdfContentDiv.appendChild(mealSectionDiv);
        });

        // Total Geral da Dieta
        let totalKcal = 0;
        let totalProtein = 0;
        let totalCarb = 0;
        dietData.forEach(item => {
            totalKcal += parseFloat(item.calculatedKcal);
            totalProtein += parseFloat(item.calculatedProtein);
            totalCarb += parseFloat(item.calculatedCarb);
        });

        const totalSummaryDiv = document.createElement('div');
        totalSummaryDiv.style.marginTop = '30px';
        totalSummaryDiv.style.padding = '20px';
        totalSummaryDiv.style.backgroundColor = '#f0f8ff';
        totalSummaryDiv.style.borderRadius = '10px';
        totalSummaryDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
        totalSummaryDiv.style.textAlign = 'left';
        totalSummaryDiv.innerHTML = `
            <h3>Total Geral da Dieta:</h3>
            <p>Calorias Totais: <span>${totalKcal.toFixed(1)}</span> kcal</p>
            <p>Proteínas Totais: <span>${totalProtein.toFixed(1)}</span> g</p>
            <p>Carboidratos Totais: <span>${totalCarb.toFixed(1)}</span> g</p>
        `;
        pdfContentDiv.appendChild(totalSummaryDiv);


        // Adicione o div temporário ao corpo do documento (fora da tela visível)
        pdfContentDiv.style.position = 'absolute';
        pdfContentDiv.style.left = '-9999px';
        document.body.appendChild(pdfContentDiv);

        // Use html2canvas para renderizar o div como uma imagem
        html2canvas(pdfContentDiv, { scale: 2 }).then(canvas => { // Aumente a escala para melhor qualidade
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf; // Acesse jsPDF do objeto global window
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' para retrato, 'mm' para milímetros, 'a4' para tamanho A4

            const imgWidth = 210; // Largura A4 em mm
            const pageHeight = 297; // Altura A4 em mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Dieta_${currentDietName}.pdf`);

            // Remova o div temporário
            document.body.removeChild(pdfContentDiv);
        }).catch(error => {
            console.error("Erro ao gerar PDF da dieta:", error);
            alert("Ocorreu um erro ao exportar a dieta para PDF.");
            document.body.removeChild(pdfContentDiv); // Garante que o div seja removido mesmo em erro
        });
    }
});
