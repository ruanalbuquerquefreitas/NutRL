document.getElementById('diet-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Pegar valores do formulário
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseInt(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const goal = document.getElementById('goal').value;

    // 1. Calcular TMB (Harris-Benedict)
    let tmb;
    if (gender === 'male') {
        tmb = 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age);
    } else {
        tmb = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    }

    // 2. Calcular TDEE (Gasto Energético Total)
    const tdee = tmb * activity;

    // 3. Ajustar calorias conforme objetivo
    let targetCalories;
    if (goal === 'lose') {
        targetCalories = tdee - 500; // Déficit de 500kcal
    } else if (goal === 'gain') {
        targetCalories = tdee + 500; // Superávit de 500kcal
    } else {
        targetCalories = tdee; // Manutenção
    }

    // 4. Calcular Macros (Aproximado)
    // Proteína: 2g/kg (ganho/perda) ou 1.5g/kg (manutenção)
    // Gordura: 0.8g/kg a 1g/kg
    // Carboidratos: Restante
    let proteinPerKg = (goal === 'maintain') ? 1.6 : 2.0;
    let fatPerKg = 0.9;

    const proteinGrams = weight * proteinPerKg;
    const fatGrams = weight * fatPerKg;
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const carbCalories = targetCalories - (proteinCalories + fatCalories);
    const carbGrams = carbCalories / 4;

    // Atualizar UI
    document.getElementById('tmb-val').innerText = Math.round(tmb);
    document.getElementById('tdee-val').innerText = Math.round(tdee);
    document.getElementById('goal-val').innerText = Math.round(targetCalories);
    
    document.getElementById('prot-val').innerText = Math.round(proteinGrams) + 'g';
    document.getElementById('carb-val').innerText = Math.round(carbGrams) + 'g';
    document.getElementById('fat-val').innerText = Math.round(fatGrams) + 'g';

    // Gerar Cardápio Sugerido
    generateMealPlan(goal);

    // Mostrar resultados
    document.getElementById('result-container').classList.remove('hidden');
    
    // Scroll suave para o resultado
    document.getElementById('result-container').scrollIntoView({ behavior: 'smooth' });
});

function generateMealPlan(goal) {
    const mealContent = document.getElementById('meal-plan-content');
    let meals = [];

    if (goal === 'lose') {
        meals = [
            { name: 'Café da Manhã', items: 'Omelete de 2 ovos com espinafre, 1 fatia de pão integral, café sem açúcar.' },
            { name: 'Lanche da Manhã', items: '1 maçã ou 10 amêndoas.' },
            { name: 'Almoço', items: '150g de peito de frango grelhado, 3 colheres de arroz integral, salada verde à vontade com azeite.' },
            { name: 'Lanche da Tarde', items: 'Iogurte desnatado com 1 colher de farelo de aveia.' },
            { name: 'Jantar', items: 'Filé de peixe grelhado, brócolis no vapor e uma porção pequena de batata doce.' }
        ];
    } else if (goal === 'gain') {
        meals = [
            { name: 'Café da Manhã', items: '3 ovos mexidos, 2 fatias de pão integral com pasta de amendoim, 1 banana.' },
            { name: 'Lanche da Manhã', items: 'Shake de proteína ou 1 sanduíche de atum.' },
            { name: 'Almoço', items: '200g de carne bovina magra, 6 colheres de arroz, 1 concha de feijão, salada e 1 fruta.' },
            { name: 'Lanche da Tarde', items: 'Iogurte grego com granola e mel.' },
            { name: 'Jantar', items: '150g de frango, 200g de macarrão integral com molho de tomate natural, legumes variados.' }
        ];
    } else {
        meals = [
            { name: 'Café da Manhã', items: '2 ovos, 1 fatia de queijo branco, 1 fatia de pão integral, suco de laranja natural.' },
            { name: 'Lanche da Manhã', items: 'Mix de castanhas ou uma fruta da estação.' },
            { name: 'Almoço', items: '150g de proteína (frango/peixe/carne), 4 colheres de arroz, feijão e salada colorida.' },
            { name: 'Lanche da Tarde', items: 'Vitamina de fruta com leite desnatado e aveia.' },
            { name: 'Jantar', items: 'Sopa de legumes com frango desfiado ou sanduíche natural completo.' }
        ];
    }

    mealContent.innerHTML = '';
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal';
        mealDiv.innerHTML = `<h5>${meal.name}</h5><p>${meal.items}</p>`;
        mealContent.appendChild(mealDiv);
    });
}
