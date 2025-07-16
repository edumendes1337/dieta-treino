// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos do DOM para a tela de login
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');

    // Elementos de Navegação Principal
    const showWorkoutsButton = document.getElementById('show-workouts-button');
    const showDietButton = document.getElementById('show-diet-button');

    // Elementos para gerenciamento de treinos (tela principal)
    const workoutManagementScreen = document.getElementById('workout-management-screen');
    const workoutSelector = document.getElementById('workout-selector');
    const addWorkoutButton = document.getElementById('add-workout-button');
    const deleteWorkoutButton = document.getElementById('delete-workout-button');
    const startTrainingButton = document.getElementById('start-training-button');

    // Elementos para adicionar/editar exercícios (parte da tela principal)
    const predefinedExercisesSelect = document.getElementById('predefined-exercises');
    const exerciseNameInput = document.getElementById('exercise-name');
    const setsInput = document.getElementById('sets');
    const repsInput = document.getElementById('reps');
    const exerciseLoadInput = document.getElementById('exercise-load'); // Novo elemento
    const restTimeInput = document.getElementById('rest-time');
    const observationInput = document.getElementById('observation');
    const addExerciseButton = document.getElementById('add-exercise-button');
    const workoutList = document.getElementById('workout-list');

    // Elementos para a nova tela de treino
    const trainingScreenContainer = document.getElementById('training-screen-container');
    const trainingWorkoutNameDisplay = document.getElementById('training-workout-name');
    const currentExerciseDisplay = document.getElementById('current-exercise-display');
    const setsRemainingDisplay = document.getElementById('sets-remaining-display');
    const restTimerDisplay = document.getElementById('rest-timer-display');
    const startRestButton = document.getElementById('start-rest-button');
    const previousExerciseButton = document.getElementById('previous-exercise-button');
    const nextExerciseButton = document.getElementById('next-exercise-button');
    const finishWorkoutButton = document.getElementById('finish-workout-button');
    const workoutFinishedMessage = document.getElementById('workout-finished-message');
    const allExercisesOverview = document.getElementById('all-exercises-overview');

    // Elementos para a nova tela de dieta
    const dietScreenContainer = document.getElementById('diet-screen-container');
    const dietSelector = document.getElementById('diet-selector');
    const addDietButton = document.getElementById('add-diet-button');
    const deleteDietButton = document.getElementById('delete-diet-button');
    const predefinedFoodsSelect = document.getElementById('predefined-foods');
    const mealNameInput = document.getElementById('meal-name');
    const mealTimeInput = document.getElementById('meal-time'); // Novo elemento
    const foodItemNameInput = document.getElementById('food-item-name');
    const foodQuantityInput = document.getElementById('food-quantity');
    const dietItemObservationInput = document.getElementById('diet-item-observation');
    const addDietItemButton = document.getElementById('add-diet-item-button');
    const dietMealsContainer = document.getElementById('diet-meals-container');
    const totalKcalDisplay = document.getElementById('total-kcal');
    const totalProteinDisplay = document.getElementById('total-protein');
    const totalCarbDisplay = document.getElementById('total-carb');


    // --- Configurações de Login (Autenticação no próprio código) ---
    const CORRECT_USERNAME = 'user'; // Nome de usuário para login
    const CORRECT_PASSWORD = '123';   // Senha para login

    // --- Variáveis de Estado da Aplicação ---
    let allWorkouts = {}; // Objeto para armazenar todos os treinos (ex: {'Treino A': [], 'Treino B': []})
    let currentWorkoutName = 'Treino Padrão'; // O nome do treino atualmente selecionado
    let currentTrainingWorkout = []; // O array de exercícios do treino que está sendo executado
    let currentExerciseIndex = 0;    // Índice do exercício atual na tela de treino
    let currentSetIndex = 0;         // Índice da série atual para o exercício
    let restTimerInterval;           // Variável para armazenar o ID do setInterval do timer de descanso

    let allDiets = {}; // Objeto para armazenar todos os planos de dieta
    let currentDietName = 'Dieta Padrão'; // O nome da dieta atualmente selecionada

    // --- Banco de Dados de Alimentos (Valores por 100g) ---
    const predefinedFoodsData = [
        { name: 'Arroz, integral, cozido', kcal_per_100g: 123.5348925, protein_per_100g: 2.58825, carb_per_100g: 25.80975 },
        { name: 'Arroz, integral, cru', kcal_per_100g: 359.678002032609, protein_per_100g: 7.32328586956522, carb_per_100g: 77.4507141304348 },
        { name: 'Arroz, tipo 1, cozido', kcal_per_100g: 128.258485666667, protein_per_100g: 2.52081666666667, carb_per_100g: 28.05985 },
        { name: 'Arroz, tipo 1, cru', kcal_per_100g: 357.789273115942, protein_per_100g: 7.15853985507246, carb_per_100g: 78.7595434782609 },
        { name: 'Arroz, tipo 2, cozido', kcal_per_100g: 130.119648333333, protein_per_100g: 2.56841666666667, carb_per_100g: 28.1925833333333 },
        { name: 'Arroz, tipo 2, cru', kcal_per_100g: 358.116761456522, protein_per_100g: 7.24188297101449, carb_per_100g: 78.8814503623188 },
        { name: 'Aveia, flocos, crua', kcal_per_100g: 393.822689449275, protein_per_100g: 13.9210260869565, carb_per_100g: 66.6356405797102 },
        { name: 'Biscoito, doce, maisena', kcal_per_100g: 442.819390144928, protein_per_100g: 8.07252173913043, carb_per_100g: 75.2341449275362 },
        { name: 'Biscoito, doce, recheado com chocolate', kcal_per_100g: 471.824779710145, protein_per_100g: 6.39721739130435, carb_per_100g: 70.5494492753623 },
        { name: 'Biscoito, doce, recheado com morango', kcal_per_100g: 471.174736231884, protein_per_100g: 5.71982608695652, carb_per_100g: 71.0135072463768 },
        { name: 'Biscoito, doce, wafer, recheado de chocolate', kcal_per_100g: 502.456857971014, protein_per_100g: 5.56452173913044, carb_per_100g: 67.5354782608696 },
        { name: 'Biscoito, doce, wafer, recheado de morango', kcal_per_100g: 513.446182608696, protein_per_100g: 4.51704347826087, carb_per_100g: 67.3529565217391 },
        { name: 'Biscoito, salgado, cream cracker', kcal_per_100g: 431.73228115942, protein_per_100g: 10.0551304347826, carb_per_100g: 68.731536231884 },
        { name: 'Bolo, mistura para', kcal_per_100g: 418.633333333333, protein_per_100g: 6.15942028985507, carb_per_100g: 84.7139130434783 },
        { name: 'Bolo, pronto, aipim', kcal_per_100g: 323.851666666667, protein_per_100g: 4.41666666666667, carb_per_100g: 47.864 },
        { name: 'Bolo, pronto, chocolate', kcal_per_100g: 410.013666666667, protein_per_100g: 6.22291666666667, carb_per_100g: 54.71775 },
        { name: 'Bolo, pronto, coco', kcal_per_100g: 333.437666666667, protein_per_100g: 5.66666666666667, carb_per_100g: 52.276 },
        { name: 'Bolo, pronto, milho', kcal_per_100g: 311.387, protein_per_100g: 4.80416666666667, carb_per_100g: 45.1088333333333 },
        { name: 'Canjica, branca, crua', kcal_per_100g: 357.60259, protein_per_100g: 7.2, carb_per_100g: 78.061 },
        { name: 'Canjica, com leite integral', kcal_per_100g: 112.456777220465, protein_per_100g: 2.36060004234314, carb_per_100g: 23.6277332909902 },
        { name: 'Cereais, milho, flocos, com sal', kcal_per_100g: 369.59975, protein_per_100g: 7.29166666666667, carb_per_100g: 80.835 },
        { name: 'Cereais, milho, flocos, sem sal', kcal_per_100g: 363.338316666667, protein_per_100g: 6.875, carb_per_100g: 80.4483333333333 },
        { name: 'Cereais, mingau, milho, infantil', kcal_per_100g: 394.42752173913, protein_per_100g: 6.43115942028986, carb_per_100g: 87.2655072463768 },
        { name: 'Cereais, mistura para vitamina, trigo, cevada e aveia', kcal_per_100g: 381.133333333333, protein_per_100g: 8.89583333333333, carb_per_100g: 81.6175 },
        { name: 'Cereal matinal, milho', kcal_per_100g: 365.354163768116, protein_per_100g: 7.15579710144928, carb_per_100g: 83.8242028985507 },
        { name: 'Cereal matinal, milho, açúcar', kcal_per_100g: 376.555253623188, protein_per_100g: 4.74275362318841, carb_per_100g: 88.8405797101449 },
        { name: 'Creme de arroz, pó', kcal_per_100g: 386.001190336398, protein_per_100g: 7.02694977474213, carb_per_100g: 83.8693835585912 },
        { name: 'Creme de milho, pó', kcal_per_100g: 333.034192670544, protein_per_100g: 4.82083333333333, carb_per_100g: 86.1485 },
        { name: 'Curau, milho verde', kcal_per_100g: 78.4338183136558, protein_per_100g: 2.36060004234314, carb_per_100g: 13.9443999576569 },
        { name: 'Curau, milho verde, mistura para', kcal_per_100g: 402.286577435315, protein_per_100g: 2.22291666666667, carb_per_100g: 79.8164166666667 },
        { name: 'Farinha, de arroz, enriquecida', kcal_per_100g: 363.056480181223, protein_per_100g: 1.26933329264323, carb_per_100g: 85.5040000406901 },
        { name: 'Farinha, de centeio, integral', kcal_per_100g: 335.777662799327, protein_per_100g: 12.515066502889, carb_per_100g: 73.2982668304443 },
        { name: 'Farinha, de milho, amarela', kcal_per_100g: 350.58693322738, protein_per_100g: 7.1875, carb_per_100g: 79.0791666666667 },
        { name: 'Farinha, de rosca', kcal_per_100g: 370.578096666667, protein_per_100g: 11.3809996191661, carb_per_100g: 75.7856666666667 },
        { name: 'Farinha, de trigo', kcal_per_100g: 360.472978550725, protein_per_100g: 9.79078260869565, carb_per_100g: 75.0925507246377 },
        { name: 'Farinha, láctea, de cereais', kcal_per_100g: 414.850517391304, protein_per_100g: 11.8791304347826, carb_per_100g: 77.7708695652174 },
        { name: 'Lasanha, massa fresca, cozida', kcal_per_100g: 163.763666666667, protein_per_100g: 5.8125, carb_per_100g: 32.5221666666667 },
        { name: 'Lasanha, massa fresca, crua', kcal_per_100g: 220.305666666667, protein_per_100g: 7.00833333333333, carb_per_100g: 45.0583333333333 },
        { name: 'Macarrão, instantâneo', kcal_per_100g: 435.864780533333, protein_per_100g: 8.79168, carb_per_100g: 62.4316533333333 },
        { name: 'Macarrão, trigo, cru', kcal_per_100g: 371.122613043478, protein_per_100g: 9.99565217391304, carb_per_100g: 77.944347826087 },
        { name: 'Macarrão, trigo, cru, com ovos', kcal_per_100g: 370.567113333333, protein_per_100g: 10.3208, carb_per_100g: 76.6225333333334 },
        { name: 'Milho, amido, cru', kcal_per_100g: 361.366823878261, protein_per_100g: 0.597826086956522, carb_per_100g: 87.1488439130435 },
        { name: 'Milho, fubá, cru', kcal_per_100g: 353.482268115942, protein_per_100g: 7.21376811594203, carb_per_100g: 78.8728985507246 },
        { name: 'Milho, verde, cru', kcal_per_100g: 138.166565, protein_per_100g: 6.58958333333333, carb_per_100g: 28.55575 },
        { name: 'Milho, verde, enlatado, drenado', kcal_per_100g: 97.5648942028985, protein_per_100g: 3.22826086956522, carb_per_100g: 17.1350724637681 },
        { name: 'Mingau tradicional, pó', kcal_per_100g: 373.421466666667, protein_per_100g: 0.583333333333333, carb_per_100g: 89.3366666666667 },
        { name: 'Pamonha, barra para cozimento, pré-cozida', kcal_per_100g: 171.219111666667, protein_per_100g: 2.55208333333333, carb_per_100g: 30.6849166666667 },
        { name: 'Pão, aveia, forma', kcal_per_100g: 343.085366666667, protein_per_100g: 12.35, carb_per_100g: 59.5666666666667 },
        { name: 'Pão, de soja', kcal_per_100g: 308.726323333333, protein_per_100g: 11.343, carb_per_100g: 56.5103333333333 },
        { name: 'Pão, glúten, forma', kcal_per_100g: 252.99403, protein_per_100g: 11.9509996000926, carb_per_100g: 44.119 },
        { name: 'Pão, milho, forma', kcal_per_100g: 292.01349, protein_per_100g: 8.303, carb_per_100g: 56.397 },
        { name: 'Pão, trigo, forma, integral', kcal_per_100g: 253.193618333333, protein_per_100g: 9.42516666666667, carb_per_100g: 49.9415 },
        { name: 'Pão, trigo, francês', kcal_per_100g: 299.810150434783, protein_per_100g: 7.9535652173913, carb_per_100g: 58.6464347826087 },
        { name: 'Pão, trigo, sovado', kcal_per_100g: 310.96494, protein_per_100g: 8.398, carb_per_100g: 61.452 },
        { name: 'Pastel, de carne, cru', kcal_per_100g: 288.70207151599, protein_per_100g: 10.7406996405919, carb_per_100g: 42.0166336927414 },
        { name: 'Pastel, de carne, frito', kcal_per_100g: 388.374651624968, protein_per_100g: 10.1041996618907, carb_per_100g: 43.7678003381093 },
        { name: 'Pastel, de queijo, cru', kcal_per_100g: 308.474433887374, protein_per_100g: 9.853399670283, carb_per_100g: 45.9479336630503 },
        { name: 'Pastel, de queijo, frito', kcal_per_100g: 422.112080039319, protein_per_100g: 8.70959970855713, carb_per_100g: 48.1327336247762 },
        { name: 'Pastel, massa, crua', kcal_per_100g: 310.202514333333, protein_per_100g: 6.9027, carb_per_100g: 57.3796333333333 },
        { name: 'Pastel, massa, frita', kcal_per_100g: 569.672459333333, protein_per_100g: 6.0192, carb_per_100g: 49.3431333333333 },
        { name: 'Pipoca, com óleo de soja, sem sal', kcal_per_100g: 448.334261847198, protein_per_100g: 9.92708333333334, carb_per_100g: 70.3125833333333 },
        { name: 'Polenta, pré-cozida', kcal_per_100g: 102.741166666667, protein_per_100g: 2.29166666666667, carb_per_100g: 23.3116666666667 },
        { name: 'Torrada, pão francês', kcal_per_100g: 377.422283, protein_per_100g: 10.5241, carb_per_100g: 74.5559 },
        { name: 'Abóbora, cabotian, cozida', kcal_per_100g: 48.0437425, protein_per_100g: 1.44375, carb_per_100g: 10.7609166666667 },
        { name: 'Abóbora, cabotian, crua', kcal_per_100g: 38.5992942028986, protein_per_100g: 1.7463768115942, carb_per_100g: 8.36028985507247 },
        { name: 'Abóbora, menina brasileira, crua', kcal_per_100g: 13.6056739130435, protein_per_100g: 0.608695652173913, carb_per_100g: 3.30130434782609 },
        { name: 'Abóbora, moranga, crua', kcal_per_100g: 12.364436231884, protein_per_100g: 0.960144927536232, carb_per_100g: 2.66652173913043 },
        { name: 'Abóbora, moranga, refogada', kcal_per_100g: 29.0038220317562, protein_per_100g: 0.39375, carb_per_100g: 5.98191666666666 },
        { name: 'Abóbora, pescoço, crua', kcal_per_100g: 24.4662679497004, protein_per_100g: 0.670833333333333, carb_per_100g: 6.12283333333334 },
        { name: 'Abobrinha, italiana, cozida', kcal_per_100g: 15.03852, protein_per_100g: 1.125, carb_per_100g: 2.97700000000001 },
        { name: 'Abobrinha, italiana, crua', kcal_per_100g: 19.2791260869565, protein_per_100g: 1.14130434782609, carb_per_100g: 4.29202898550724 },
        { name: 'Abobrinha, italiana, refogada', kcal_per_100g: 24.4296021876534, protein_per_100g: 1.06875, carb_per_100g: 4.18691666666666 },
        { name: 'Abobrinha, paulista, crua', kcal_per_100g: 30.8107022288163, protein_per_100g: 0.639583333333333, carb_per_100g: 7.86742 },
        { name: 'Acelga, crua', kcal_per_100g: 20.9423424999999, protein_per_100g: 1.44375, carb_per_100g: 4.63091666666666 },
        { name: 'Agrião, cru', kcal_per_100g: 16.5788014492753, protein_per_100g: 2.68840579710145, carb_per_100g: 2.25159420289854 },
        { name: 'Aipo, cru', kcal_per_100g: 19.0914566449706, protein_per_100g: 0.758333333333333, carb_per_100g: 4.27233333333334 },
        { name: 'Alface, americana, crua', kcal_per_100g: 8.79490323686605, protein_per_100g: 0.608333333333333, carb_per_100g: 1.74533333333335 },
        { name: 'Alface, crespa, crua', kcal_per_100g: 10.6808565217392, protein_per_100g: 1.34782608695652, carb_per_100g: 1.69550724637683 },
        { name: 'Alface, lisa, crua', kcal_per_100g: 13.8209014492753, protein_per_100g: 1.68840579710145, carb_per_100g: 2.42826086956522 },
        { name: 'Alface, roxa, crua', kcal_per_100g: 12.716997363468, protein_per_100g: 0.90625, carb_per_100g: 2.49341666666666 },
        { name: 'Alfavaca, crua', kcal_per_100g: 29.1836130810579, protein_per_100g: 2.65833333333333, carb_per_100g: 5.241 },
        { name: 'Alho, cru', kcal_per_100g: 113.12987826087, protein_per_100g: 7.01086956521739, carb_per_100g: 23.9057971014493 },
        { name: 'Alho-poró, cru', kcal_per_100g: 31.5079193532467, protein_per_100g: 1.4125, carb_per_100g: 6.87816666666667 },
        { name: 'Almeirão, cru', kcal_per_100g: 18.0344289855072, protein_per_100g: 1.76811594202899, carb_per_100g: 3.33521739130435 },
        { name: 'Almeirão, refogado', kcal_per_100g: 65.0819108288685, protein_per_100g: 1.70416666666667, carb_per_100g: 5.70149999999999 },
        { name: 'Batata, baroa, cozida', kcal_per_100g: 80.1197625, protein_per_100g: 0.852083333333333, carb_per_100g: 18.9475833333333 },
        { name: 'Batata, baroa, crua', kcal_per_100g: 100.984923188406, protein_per_100g: 1.04710144927536, carb_per_100g: 23.9828985507246 },
        { name: 'Batata, doce, cozida', kcal_per_100g: 76.7596105034352, protein_per_100g: 0.641666666666667, carb_per_100g: 18.4223333333333 },
        { name: 'Batata, doce, crua', kcal_per_100g: 118.241375362319, protein_per_100g: 1.25724637681159, carb_per_100g: 28.1960869565217 },
        { name: 'Batata, frita, tipo chips, industrializada', kcal_per_100g: 542.73467338419, protein_per_100g: 5.58333333333333, carb_per_100g: 51.2223333333333 },
        { name: 'Batata, inglesa, cozida', kcal_per_100g: 51.5884766362707, protein_per_100g: 1.16458333333333, carb_per_100g: 11.94375 },
        { name: 'Batata, inglesa, crua', kcal_per_100g: 64.3702260869565, protein_per_100g: 1.77173913043478, carb_per_100g: 14.6882608695652 },
        { name: 'Batata, inglesa, frita', kcal_per_100g: 267.157422502041, protein_per_100g: 4.96666666666667, carb_per_100g: 35.6403333333333 },
        { name: 'Batata, inglesa, sauté', kcal_per_100g: 67.8879361506303, protein_per_100g: 1.29166666666667, carb_per_100g: 14.093 },
        { name: 'Berinjela, cozida', kcal_per_100g: 18.8452855568131, protein_per_100g: 0.677083333333333, carb_per_100g: 4.46824999999999 },
        { name: 'Berinjela, crua', kcal_per_100g: 19.6277536231884, protein_per_100g: 1.22101449275362, carb_per_100g: 4.42898550724637 },
        { name: 'Beterraba, cozida', kcal_per_100g: 32.1543243314028, protein_per_100g: 1.29375, carb_per_100g: 7.23491666666666 },
        { name: 'Beterraba, crua', kcal_per_100g: 48.8285086956521, protein_per_100g: 1.94565217391304, carb_per_100g: 11.1110144927536 },
        { name: 'Biscoito, polvilho doce', kcal_per_100g: 437.549, protein_per_100g: 1.29166666666667, carb_per_100g: 80.5353333333333 },
        { name: 'Brócolis, cozido', kcal_per_100g: 24.6361631113688, protein_per_100g: 2.13333333333333, carb_per_100g: 4.36666666666666 },
        { name: 'Brócolis, cru', kcal_per_100g: 25.495131884058, protein_per_100g: 3.64492753623188, carb_per_100g: 4.02507246376812 },
        { name: 'Cará, cozido', kcal_per_100g: 77.5849133333334, protein_per_100g: 1.52916666666667, carb_per_100g: 18.8525 },
        { name: 'Cará, cru', kcal_per_100g: 95.6331347826087, protein_per_100g: 2.28260869565217, carb_per_100g: 22.9540579710145 },
        { name: 'Caruru, cru', kcal_per_100g: 34.03162971735, protein_per_100g: 3.2, carb_per_100g: 5.97399999999999 },
        { name: 'Catalonha, crua', kcal_per_100g: 23.8884122573733, protein_per_100g: 1.86875, carb_per_100g: 4.75224999999999 },
        { name: 'Catalonha, refogada', kcal_per_100g: 63.4492691488266, protein_per_100g: 1.95, carb_per_100g: 4.80933333333334 },
        { name: 'Cebola, crua', kcal_per_100g: 39.4200463768116, protein_per_100g: 1.71014492753623, carb_per_100g: 8.8531884057971 },
        { name: 'Cebolinha, crua', kcal_per_100g: 19.5158855072464, protein_per_100g: 1.86594202898551, carb_per_100g: 3.37072463768116 },
        { name: 'Cenoura, cozida', kcal_per_100g: 29.8617777101596, protein_per_100g: 0.847916666666667, carb_per_100g: 6.68674999999999 },
        { name: 'Cenoura, crua', kcal_per_100g: 34.1353884057971, protein_per_100g: 1.32246376811594, carb_per_100g: 7.66 },
        { name: 'Chicória, crua', kcal_per_100g: 13.8371202898551, protein_per_100g: 1.13768115942029, carb_per_100g: 2.85333333333334 },
        { name: 'Chuchu, cozido', kcal_per_100g: 18.539790531377, protein_per_100g: 0.414583333333333, carb_per_100g: 4.79341666666667 },
        { name: 'Chuchu, cru', kcal_per_100g: 16.9789188405797, protein_per_100g: 0.699275362318841, carb_per_100g: 4.13739130434783 },
        { name: 'Coentro, folhas desidratadas', kcal_per_100g: 309.070746804476, protein_per_100g: 20.875, carb_per_100g: 47.955 },
        { name: 'Couve, manteiga, crua', kcal_per_100g: 27.0566971014493, protein_per_100g: 2.8731884057971, carb_per_100g: 4.33347826086956 },
        { name: 'Couve, manteiga, refogada', kcal_per_100g: 90.3448154261112, protein_per_100g: 1.66666666666667, carb_per_100g: 8.70766666666667 },
        { name: 'Couve-flor, crua', kcal_per_100g: 22.5633492753623, protein_per_100g: 1.90579710144928, carb_per_100g: 4.51753623188406 },
        { name: 'Couve-flor, cozida', kcal_per_100g: 19.1141406147282, protein_per_100g: 1.23958333333333, carb_per_100g: 3.87541666666668 },
        { name: 'Espinafre, Nova Zelândia, cru', kcal_per_100g: 16.0956942028985, protein_per_100g: 1.9963768115942, carb_per_100g: 2.5736231884058 },
        { name: 'Espinafre, Nova Zelândia, refogado', kcal_per_100g: 67.2536517506639, protein_per_100g: 2.71875, carb_per_100g: 4.23858333333334 },
        { name: 'Farinha, de mandioca, crua', kcal_per_100g: 360.869698550725, protein_per_100g: 1.55434782608696, carb_per_100g: 87.8989855072464 },
        { name: 'Farinha, de mandioca, torrada', kcal_per_100g: 365.268975, protein_per_100g: 1.22916666666667, carb_per_100g: 89.1941666666667 },
        { name: 'Farinha, de puba', kcal_per_100g: 360.179774879932, protein_per_100g: 1.61666666666667, carb_per_100g: 87.2853333333333 },
        { name: 'Fécula, de mandioca', kcal_per_100g: 330.850558333333, protein_per_100g: 0.520833333333333, carb_per_100g: 81.1491666666667 },
        { name: 'Feijão, broto, cru', kcal_per_100g: 38.7232363754113, protein_per_100g: 4.16666666666667, carb_per_100g: 7.75833333333333 },
        { name: 'Inhame, cru', kcal_per_100g: 96.699831884058, protein_per_100g: 2.05072463768116, carb_per_100g: 23.2326086956522 },
        { name: 'Jiló, cru', kcal_per_100g: 27.3651434782609, protein_per_100g: 1.40217391304348, carb_per_100g: 6.19115942028986 },
        { name: 'Jurubeba, crua', kcal_per_100g: 125.811635, protein_per_100g: 4.4125, carb_per_100g: 23.0591666666667 },
        { name: 'Mandioca, cozida', kcal_per_100g: 125.35825, protein_per_100g: 0.575, carb_per_100g: 30.09 },
        { name: 'Mandioca, crua', kcal_per_100g: 151.416956521739, protein_per_100g: 1.1304347826087, carb_per_100g: 36.1695652173913 },
        { name: 'Mandioca, farofa, temperada', kcal_per_100g: 405.693941666667, protein_per_100g: 2.0625, carb_per_100g: 80.3041666666667 },
        { name: 'Mandioca, frita', kcal_per_100g: 300.055243389149, protein_per_100g: 1.38125, carb_per_100g: 50.2514166666667 },
        { name: 'Manjericão, cru', kcal_per_100g: 21.1476768115942, protein_per_100g: 1.98550724637681, carb_per_100g: 3.64449275362319 },
        { name: 'Maxixe, cru', kcal_per_100g: 13.7472360869565, protein_per_100g: 1.39130434782609, carb_per_100g: 2.72869565217391 },
        { name: 'Mostarda, folha, crua', kcal_per_100g: 18.1073890521725, protein_per_100g: 2.11041666666667, carb_per_100g: 3.23658333333333 },
        { name: 'Nhoque, batata, cozido', kcal_per_100g: 180.775273993413, protein_per_100g: 5.85833333333333, carb_per_100g: 36.78 },
        { name: 'Nabo, cru', kcal_per_100g: 18.1866246376812, protein_per_100g: 1.20289855072464, carb_per_100g: 4.14710144927538 },
        { name: 'Palmito, juçara, em conserva', kcal_per_100g: 23.1997164340813, protein_per_100g: 1.79166666666667, carb_per_100g: 4.32833333333333 },
        { name: 'Palmito, pupunha, em conserva', kcal_per_100g: 29.4319633333333, protein_per_100g: 2.45833333333333, carb_per_100g: 5.509 },
        { name: 'Pão, de queijo, assado', kcal_per_100g: 363.077913333333, protein_per_100g: 5.12083333333333, carb_per_100g: 34.2415 },
        { name: 'Pão, de queijo, cru', kcal_per_100g: 294.538, protein_per_100g: 3.648, carb_per_100g: 38.512 },
        { name: 'Pepino, cru', kcal_per_100g: 9.53369130434782, protein_per_100g: 0.869565217391304, carb_per_100g: 2.03710144927535 },
        { name: 'Pimentão, amarelo, cru', kcal_per_100g: 27.9274594202898, protein_per_100g: 1.22463768115942, carb_per_100g: 5.96202898550725 },
        { name: 'Pimentão, verde, cru', kcal_per_100g: 21.2858811594203, protein_per_100g: 1.05072463768116, carb_per_100g: 4.89260869565218 },
        { name: 'Pimentão, vermelho, cru', kcal_per_100g: 23.281363768116, protein_per_100g: 1.03985507246377, carb_per_100g: 5.46681159420291 },
        { name: 'Polvilho, doce', kcal_per_100g: 351.226733333333, protein_per_100g: 0.43, carb_per_100g: 86.7733333333333 },
        { name: 'Quiabo, cru', kcal_per_100g: 29.9392621500691, protein_per_100g: 1.91875, carb_per_100g: 6.37391666666667 },
        { name: 'Rabanete, cru', kcal_per_100g: 13.7381260869565, protein_per_100g: 1.39130434782609, carb_per_100g: 2.72536231884058 },
        { name: 'Repolho, branco, cru', kcal_per_100g: 17.1188028985507, protein_per_100g: 0.876811594202899, carb_per_100g: 3.85985507246377 },
        { name: 'Repolho, roxo, cru', kcal_per_100g: 30.9075029543241, protein_per_100g: 1.90833333333333, carb_per_100g: 7.204 },
        { name: 'Repolho, roxo, refogado', kcal_per_100g: 41.7735252897143, protein_per_100g: 1.80208333333333, carb_per_100g: 7.56158333333333 },
        { name: 'Rúcula, crua', kcal_per_100g: 13.1332566072941, protein_per_100g: 1.76666666666667, carb_per_100g: 2.21966666666666 },
        { name: 'Salsa, crua', kcal_per_100g: 33.4241115942029, protein_per_100g: 3.25724637681159, carb_per_100g: 5.70608695652173 },
        { name: 'Seleta de legumes, enlatada', kcal_per_100g: 56.5337724637681, protein_per_100g: 3.42028985507246, carb_per_100g: 12.6697101449275 },
        { name: 'Serralha, crua', kcal_per_100g: 30.3979341666666, protein_per_100g: 2.67291666666667, carb_per_100g: 4.94675 },
        { name: 'Taioba, crua', kcal_per_100g: 34.2089183333333, protein_per_100g: 2.89583333333333, carb_per_100g: 5.43049999999999 },
        { name: 'Tomate, com semente, cru', kcal_per_100g: 15.3351565217392, protein_per_100g: 1.09782608695652, carb_per_100g: 3.13884057971015 },
        { name: 'Tomate, extrato', kcal_per_100g: 60.9334336521739, protein_per_100g: 2.43478260869565, carb_per_100g: 14.9586173913043 },
        { name: 'Tomate, molho industrializado', kcal_per_100g: 38.4465494604906, protein_per_100g: 1.375, carb_per_100g: 7.71166666666668 },
        { name: 'Tomate, purê', kcal_per_100g: 27.9368797101449, protein_per_100g: 1.36231884057971, carb_per_100g: 6.89434782608695 },
        { name: 'Tomate, salada', kcal_per_100g: 20.5469091666666, protein_per_100g: 0.810416666666667, carb_per_100g: 5.11791666666666 },
        { name: 'Vagem, crua', kcal_per_100g: 24.8983579710145, protein_per_100g: 1.78623188405797, carb_per_100g: 5.34710144927536 },
        { name: 'Abacate, cru', kcal_per_100g: 96.1547086956522, protein_per_100g: 1.23913043478261, carb_per_100g: 6.0308695652174 },
        { name: 'Abacaxi, cru', kcal_per_100g: 48.3222130434782, protein_per_100g: 0.858695652173913, carb_per_100g: 12.3346376811594 },
        { name: 'Abacaxi, polpa, congelada', kcal_per_100g: 30.5917991943359, protein_per_100g: 0.466666666666667, carb_per_100g: 7.79866666666666 },
        { name: 'Abiu, cru', kcal_per_100g: 62.4240984085401, protein_per_100g: 0.833333333333333, carb_per_100g: 14.927 },
        { name: 'Açaí, polpa, com xarope de guaraná e glucose', kcal_per_100g: 110.29759, protein_per_100g: 0.720833333333333, carb_per_100g: 21.4551666666667 },
        { name: 'Açaí, polpa, congelada', kcal_per_100g: 58.0453688728213, protein_per_100g: 0.797916666666667, carb_per_100g: 6.20841666666667 },
        { name: 'Acerola, crua', kcal_per_100g: 33.46227, protein_per_100g: 0.90625, carb_per_100g: 7.96641666666667 },
        { name: 'Acerola, polpa, congelada', kcal_per_100g: 21.9368, protein_per_100g: 0.591666666666667, carb_per_100g: 5.54133333333333 },
        { name: 'Ameixa, calda, enlatada', kcal_per_100g: 182.84662, protein_per_100g: 0.408333333333333, carb_per_100g: 46.8926666666667 },
        { name: 'Ameixa, crua', kcal_per_100g: 52.5424826086957, protein_per_100g: 0.771739130434783, carb_per_100g: 13.8515942028986 },
        { name: 'Ameixa, em calda, enlatada, drenada', kcal_per_100g: 177.359185315371, protein_per_100g: 1.025, carb_per_100g: 47.658 },
        { name: 'Atemóia, crua', kcal_per_100g: 96.9715874479214, protein_per_100g: 0.970833333333333, carb_per_100g: 25.3321666666667 },
        { name: 'Banana, da terra, crua', kcal_per_100g: 128.024452173913, protein_per_100g: 1.43478260869565, carb_per_100g: 33.6652173913044 },
        { name: 'Banana, doce em barra', kcal_per_100g: 280.105192550639, protein_per_100g: 2.16875, carb_per_100g: 75.6665833333333 },
        { name: 'Banana, figo, crua', kcal_per_100g: 105.08265, protein_per_100g: 1.13125, carb_per_100g: 27.8044166666667 },
        { name: 'Banana, maçã, crua', kcal_per_100g: 86.8053304347826, protein_per_100g: 1.7536231884058, carb_per_100g: 22.3363768115942 },
        { name: 'Banana, nanica, crua', kcal_per_100g: 91.528847826087, protein_per_100g: 1.39855072463768, carb_per_100g: 23.848115942029 },
        { name: 'Banana, ouro, crua', kcal_per_100g: 112.366047826087, protein_per_100g: 1.48188405797101, carb_per_100g: 29.3414492753623 },
        { name: 'Banana, pacova, crua', kcal_per_100g: 77.9095279250741, protein_per_100g: 1.22708333333333, carb_per_100g: 20.3125833333333 },
        { name: 'Banana, prata, crua', kcal_per_100g: 98.2497021739131, protein_per_100g: 1.26811594202899, carb_per_100g: 25.956884057971 },
        { name: 'Cacau, cru', kcal_per_100g: 74.29148, protein_per_100g: 0.954166666666666, carb_per_100g: 19.4111666666667 },
        { name: 'Cajá-Manga, cru', kcal_per_100g: 45.5809687737227, protein_per_100g: 1.27916666666667, carb_per_100g: 11.4341666666667 },
        { name: 'Cajá, polpa, congelada', kcal_per_100g: 26.3322693110506, protein_per_100g: 0.589583333333333, carb_per_100g: 6.37441666666666 },
        { name: 'Caju, cru', kcal_per_100g: 43.0650685217391, protein_per_100g: 0.971014492753623, carb_per_100g: 10.2889888405797 },
        { name: 'Caju, polpa, congelada', kcal_per_100g: 36.56868, protein_per_100g: 0.48125, carb_per_100g: 9.35074999999999 },
        { name: 'Caju, suco concentrado, envasado', kcal_per_100g: 45.1086266666667, protein_per_100g: 0.404166666666667, carb_per_100g: 10.7338333333333 },
        { name: 'Caqui, chocolate, cru', kcal_per_100g: 71.3500181116462, protein_per_100g: 0.35625, carb_per_100g: 19.32575 },
        { name: 'Carambola, crua', kcal_per_100g: 45.7408887934287, protein_per_100g: 0.870833333333333, carb_per_100g: 11.4815 },
        { name: 'Ciriguela, crua', kcal_per_100g: 75.59411, protein_per_100g: 1.39791666666667, carb_per_100g: 18.8574166666667 },
        { name: 'Cupuaçu, cru', kcal_per_100g: 49.4225587743719, protein_per_100g: 1.16041666666667, carb_per_100g: 10.4335833333333 },
        { name: 'Cupuaçu, polpa, congelada', kcal_per_100g: 48.79689, protein_per_100g: 0.84375, carb_per_100g: 11.3869166666667 },
        { name: 'Figo, cru', kcal_per_100g: 41.4471260869565, protein_per_100g: 0.967391304347826, carb_per_100g: 10.2459420289855 },
        { name: 'Figo, enlatado, em calda', kcal_per_100g: 184.360717391304, protein_per_100g: 0.561594202898551, carb_per_100g: 50.3384057971015 },
        { name: 'Fruta-pão, crua', kcal_per_100g: 67.04562, protein_per_100g: 1.08125, carb_per_100g: 17.1744166666667 },
        { name: 'Goiaba, branca, com casca, crua', kcal_per_100g: 51.737747826087, protein_per_100g: 0.898550724637681, carb_per_100g: 12.4014492753623 },
        { name: 'Goiaba, doce em pasta', kcal_per_100g: 268.959826086957, protein_per_100g: 0.579710144927536, carb_per_100g: 74.1236231884058 },
        { name: 'Goiaba, doce, cascão', kcal_per_100g: 285.587792439004, protein_per_100g: 0.414583333333333, carb_per_100g: 78.70275 },
        { name: 'Goiaba, vermelha, com casca, crua', kcal_per_100g: 54.1699304347826, protein_per_100g: 1.08695652173913, carb_per_100g: 13.0097101449275 },
        { name: 'Graviola, crua', kcal_per_100g: 61.6218983766636, protein_per_100g: 0.845833333333333, carb_per_100g: 15.8395 },
        { name: 'Graviola, polpa, congelada', kcal_per_100g: 38.27387, protein_per_100g: 0.566666666666667, carb_per_100g: 9.78266666666666 },
        { name: 'Jabuticaba, crua', kcal_per_100g: 58.05315, protein_per_100g: 0.6125, carb_per_100g: 15.2558333333333 },
        { name: 'Jaca, crua', kcal_per_100g: 87.92035, protein_per_100g: 1.40208333333333, carb_per_100g: 22.4975833333333 },
        { name: 'Jambo, cru', kcal_per_100g: 26.9123, protein_per_100g: 0.885416666666667, carb_per_100g: 6.49425 },
        { name: 'Jamelão, cru', kcal_per_100g: 41.0097089167039, protein_per_100g: 0.545833333333333, carb_per_100g: 10.6271666666667 },
        { name: 'Kiwi, cru', kcal_per_100g: 51.1363304347826, protein_per_100g: 1.33695652173913, carb_per_100g: 11.4997101449275 },
        { name: 'Laranja, baía, crua', kcal_per_100g: 45.4381173913043, protein_per_100g: 0.978260869565218, carb_per_100g: 11.4684057971015 },
        { name: 'Laranja, baía, suco', kcal_per_100g: 36.6494826086956, protein_per_100g: 0.652173913043478, carb_per_100g: 8.69782608695652 },
        { name: 'Laranja, da terra, crua', kcal_per_100g: 51.4711286392808, protein_per_100g: 1.07708333333333, carb_per_100g: 12.8605833333333 },
        { name: 'Laranja, da terra, suco', kcal_per_100g: 40.9560073108673, protein_per_100g: 0.666666666666667, carb_per_100g: 9.57333333333334 },
        { name: 'Laranja, lima, crua', kcal_per_100g: 45.7010387806296, protein_per_100g: 1.05625, carb_per_100g: 11.53375 },
        { name: 'Laranja, lima, suco', kcal_per_100g: 39.3360939441324, protein_per_100g: 0.714583333333333, carb_per_100g: 9.16741666666668 },
        { name: 'Laranja, pêra, crua', kcal_per_100g: 36.7737652173913, protein_per_100g: 1.04347826086957, carb_per_100g: 8.94652173913044 },
        { name: 'Laranja, pêra, suco', kcal_per_100g: 32.7097536231884, protein_per_100g: 0.739130434782609, carb_per_100g: 7.55420289855072 },
        { name: 'Laranja, valência, crua', kcal_per_100g: 46.109628783385, protein_per_100g: 0.766666666666667, carb_per_100g: 11.723 },
        { name: 'Laranja, valência, suco', kcal_per_100g: 36.1963505876859, protein_per_100g: 0.483333333333333, carb_per_100g: 8.554 },
        { name: 'Limão, cravo, suco', kcal_per_100g: 14.1037333993117, protein_per_100g: 0.325, carb_per_100g: 5.24666666666666 },
        { name: 'Limão, galego, suco', kcal_per_100g: 22.2250434782609, protein_per_100g: 0.565217391304348, carb_per_100g: 7.32144927536232 },
        { name: 'Limão, tahiti, cru', kcal_per_100g: 31.8181534301639, protein_per_100g: 0.939583333333333, carb_per_100g: 11.0844166666667 },
        { name: 'Maçã, Argentina, com casca, crua', kcal_per_100g: 62.5318183662891, protein_per_100g: 0.225, carb_per_100g: 16.588 },
        { name: 'Maçã, Fuji, com casca, crua', kcal_per_100g: 55.5152, protein_per_100g: 0.286666666666667, carb_per_100g: 15.1533333333333 },
        { name: 'Macaúba, crua', kcal_per_100g: 404.281876666667, protein_per_100g: 2.0829, carb_per_100g: 13.9454333333333 },
        { name: 'Mamão, doce em calda, drenado', kcal_per_100g: 195.627474821786, protein_per_100g: 0.19375, carb_per_100g: 54.0035833333333 },
        { name: 'Mamão, Formosa, cru', kcal_per_100g: 45.3407478260869, protein_per_100g: 0.815217391304348, carb_per_100g: 11.5547826086956 },
        { name: 'Mamão, Papaia, cru', kcal_per_100g: 40.1567689422966, protein_per_100g: 0.45625, carb_per_100g: 10.43975 },
        { name: 'Mamão verde, doce em calda, drenado', kcal_per_100g: 209.376254458904, protein_per_100g: 0.316666666666667, carb_per_100g: 57.6366666666667 },
        { name: 'Manga, Haden, crua', kcal_per_100g: 63.5003183387915, protein_per_100g: 0.408333333333333, carb_per_100g: 16.6626666666667 },
        { name: 'Manga, Palmer, crua', kcal_per_100g: 72.4867380916873, protein_per_100g: 0.410416666666667, carb_per_100g: 19.35225 },
        { name: 'Manga, polpa, congelada', kcal_per_100g: 48.30588, protein_per_100g: 0.38125, carb_per_100g: 12.5184166666667 },
        { name: 'Manga, Tommy Atkins, crua', kcal_per_100g: 50.6921826086956, protein_per_100g: 0.855072463768116, carb_per_100g: 12.7715942028985 },
        { name: 'Maracujá, cru', kcal_per_100g: 68.4395086956521, protein_per_100g: 1.98913043478261, carb_per_100g: 12.2642028985507 },
        { name: 'Maracujá, polpa, congelada', kcal_per_100g: 38.7597, protein_per_100g: 0.8125, carb_per_100g: 9.59749999999999 },
        { name: 'Maracujá, suco concentrado, envasado', kcal_per_100g: 41.96732, protein_per_100g: 0.766666666666667, carb_per_100g: 9.63599999999999 },
        { name: 'Melancia, crua', kcal_per_100g: 32.6066260869565, protein_per_100g: 0.884057971014493, carb_per_100g: 8.13927536231884 },
        { name: 'Melão, cru', kcal_per_100g: 29.3693913043478, protein_per_100g: 0.677536231884058, carb_per_100g: 7.52579710144927 },
        { name: 'Mexerica, Murcote, crua', kcal_per_100g: 57.5927784746488, protein_per_100g: 0.883333333333333, carb_per_100g: 14.862 },
        { name: 'Mexerica, Rio, crua', kcal_per_100g: 36.8713500000001, protein_per_100g: 0.65, carb_per_100g: 9.33700000000001 },
        { name: 'Morango, cru', kcal_per_100g: 30.1479173913044, protein_per_100g: 0.894927536231884, carb_per_100g: 6.81840579710146 },
        { name: 'Nêspera, crua', kcal_per_100g: 42.5391988681952, protein_per_100g: 0.308333333333333, carb_per_100g: 11.5286666666667 },
        { name: 'Pequi, cru', kcal_per_100g: 204.96677, protein_per_100g: 2.33541666666667, carb_per_100g: 12.9729166666667 },
        { name: 'Pêra, Park, crua', kcal_per_100g: 60.58859, protein_per_100g: 0.235416666666667, carb_per_100g: 16.0749166666667 },
        { name: 'Pêra, Williams, crua', kcal_per_100g: 53.3090478260869, protein_per_100g: 0.565217391304348, carb_per_100g: 14.0247826086956 },
        { name: 'Pêssego, Aurora, cru', kcal_per_100g: 36.3275990245342, protein_per_100g: 0.825, carb_per_100g: 9.32100000000001 },
        { name: 'Pêssego, enlatado, em calda', kcal_per_100g: 63.1424347826087, protein_per_100g: 0.706521739130435, carb_per_100g: 16.8801449275362 },
        { name: 'Pinha, crua', kcal_per_100g: 88.4735276668668, protein_per_100g: 1.48541666666667, carb_per_100g: 22.4479166666667 },
        { name: 'Pitanga, crua', kcal_per_100g: 41.41553, protein_per_100g: 0.929166666666666, carb_per_100g: 10.2441666666667 },
        { name: 'Pitanga, polpa, congelada', kcal_per_100g: 19.1054595023592, protein_per_100g: 0.285416666666667, carb_per_100g: 4.75858333333333 },
        { name: 'Romã, crua', kcal_per_100g: 55.739, protein_per_100g: 0.404166666666667, carb_per_100g: 15.1058333333333 },
        { name: 'Tamarindo, cru', kcal_per_100g: 275.695642694414, protein_per_100g: 3.20625, carb_per_100g: 72.53175 },
        { name: 'Tangerina, Poncã, crua', kcal_per_100g: 37.8305999999999, protein_per_100g: 0.847826086956522, carb_per_100g: 9.60999999999999 },
        { name: 'Tangerina, Poncã, suco', kcal_per_100g: 36.1088, protein_per_100g: 0.521739130434783, carb_per_100g: 8.8 },
        { name: 'Tucumã, cru', kcal_per_100g: 262.015195072393, protein_per_100g: 2.09375, carb_per_100g: 26.4745833333333 },
        { name: 'Umbu, cru', kcal_per_100g: 37.01669, protein_per_100g: 0.841666666666667, carb_per_100g: 9.39533333333333 },
        { name: 'Umbu, polpa, congelada', kcal_per_100g: 33.94329, protein_per_100g: 0.5125, carb_per_100g: 8.78683333333333 },
        { name: 'Uva, Itália, crua', kcal_per_100g: 52.8731000000001, protein_per_100g: 0.746376811594203, carb_per_100g: 13.5733333333333 },
        { name: 'Uva, Rubi, crua', kcal_per_100g: 49.06129, protein_per_100g: 0.608333333333333, carb_per_100g: 12.6953333333333 },
        { name: 'Uva, suco concentrado, envasado', kcal_per_100g: 57.65536, protein_per_100g: 0, carb_per_100g: 14.708 },
        { name: 'Azeite, de dendê', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Azeite, de oliva, extra virgem', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Manteiga, com sal', kcal_per_100g: 725.968926845999, protein_per_100g: 0.41470000743866, carb_per_100g: 0.0632999925613329 },
        { name: 'Manteiga, sem sal', kcal_per_100g: 757.540460725997, protein_per_100g: 0.395560007095337, carb_per_100g: 0 },
        { name: 'Margarina, com óleo hidrogenado, com sal (65% de lipídeos)', kcal_per_100g: 596.119516956329, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Margarina, com óleo hidrogenado, sem sal (80% de lipídeos)', kcal_per_100g: 722.525625804901, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Margarina, com óleo interesterificado, com sal (65% de lipídeos)', kcal_per_100g: 594.451693333333, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Margarina, com óleo interesterificado, sem sal (65% de lipídeos)', kcal_per_100g: 593.13749023819, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Óleo, de babaçu', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Óleo, de canola', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Óleo, de girassol', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Óleo, de milho', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Óleo, de pequi', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Óleo, de soja', kcal_per_100g: 884, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Abadejo, filé, congelado, assado', kcal_per_100g: 111.615503451188, protein_per_100g: 23.525, carb_per_100g: 0 },
        { name: 'Abadejo, filé, congelado,cozido', kcal_per_100g: 91.1035483955542, protein_per_100g: 19.3458333333333, carb_per_100g: 0 },
        { name: 'Abadejo, filé, congelado, cru', kcal_per_100g: 59.1130332485835, protein_per_100g: 13.0833333333333, carb_per_100g: 0 },
        { name: 'Abadejo, filé, congelado, grelhado', kcal_per_100g: 129.643525902867, protein_per_100g: 27.6104166666667, carb_per_100g: 0 },
        { name: 'Atum, conserva em óleo', kcal_per_100g: 165.910560578903, protein_per_100g: 26.1875, carb_per_100g: 0 },
        { name: 'Atum, fresco, cru', kcal_per_100g: 117.501, protein_per_100g: 25.68, carb_per_100g: 0 },
        { name: 'Bacalhau, salgado, cru', kcal_per_100g: 135.892966666667, protein_per_100g: 29.0366666666667, carb_per_100g: 0 },
        { name: 'Bacalhau, salgado, refogado', kcal_per_100g: 139.66070105354, protein_per_100g: 23.9791666666667, carb_per_100g: 1.22416666666668 },
        { name: 'Cação, posta, com farinha de trigo, frita', kcal_per_100g: 208.332743725975, protein_per_100g: 24.9520833333333, carb_per_100g: 3.10058333333333 },
        { name: 'Cação, posta, cozida', kcal_per_100g: 116.014480687658, protein_per_100g: 25.5895833333333, carb_per_100g: 0 },
        { name: 'Cação, posta, crua', kcal_per_100g: 83.3330250195662, protein_per_100g: 17.8541666666667, carb_per_100g: 0 },
        { name: 'Camarão, Rio Grande, grande, cozido', kcal_per_100g: 90.0136800963084, protein_per_100g: 18.9666666666667, carb_per_100g: 0 },
        { name: 'Camarão, Rio Grande, grande, cru', kcal_per_100g: 47.1834367054304, protein_per_100g: 9.99166666666667, carb_per_100g: 0 },
        { name: 'Camarão, Sete Barbas, sem cabeça, com casca, frito', kcal_per_100g: 231.246153850873, protein_per_100g: 18.3875, carb_per_100g: 2.87983333333333 },
        { name: 'Caranguejo, cozido', kcal_per_100g: 82.7215015078386, protein_per_100g: 18.4791666666667, carb_per_100g: 0 },
        { name: 'Corimba, cru', kcal_per_100g: 128.1554, protein_per_100g: 17.3666666666667, carb_per_100g: -0.0266666666666662 },
        { name: 'Corimbatá, assado', kcal_per_100g: 261.452439410567, protein_per_100g: 19.8979166666667, carb_per_100g: 0 },
        { name: 'Corimbatá, cozido', kcal_per_100g: 238.696104867339, protein_per_100g: 20.13125, carb_per_100g: 0 },
        { name: 'Corvina de água doce, crua', kcal_per_100g: 101.009033333333, protein_per_100g: 18.9166666666667, carb_per_100g: 0 },
        { name: 'Corvina do mar, crua', kcal_per_100g: 94, protein_per_100g: 18.57, carb_per_100g: 0 },
        { name: 'Corvina grande, assada', kcal_per_100g: 146.528141125361, protein_per_100g: 26.7666666666667, carb_per_100g: 0 },
        { name: 'Corvina grande, cozida', kcal_per_100g: 100.078124552965, protein_per_100g: 23.4375, carb_per_100g: 0 },
        { name: 'Dourada de água doce, fresca', kcal_per_100g: 131.20831472377, protein_per_100g: 18.8104166666667, carb_per_100g: 0 },
        { name: 'Lambari, congelado, cru', kcal_per_100g: 130.840311009487, protein_per_100g: 16.8125, carb_per_100g: 0 },
        { name: 'Lambari, congelado, frito', kcal_per_100g: 326.868399886608, protein_per_100g: 28.425, carb_per_100g: 0 },
        { name: 'Lambari, fresco, cru', kcal_per_100g: 151.598346503218, protein_per_100g: 15.6520833333333, carb_per_100g: 0 },
        { name: 'Manjuba, com farinha de trigo, frita', kcal_per_100g: 343.550458723068, protein_per_100g: 23.45, carb_per_100g: 10.2403333333333 },
        { name: 'Manjuba, frita', kcal_per_100g: 349.325231455366, protein_per_100g: 30.1395833333333, carb_per_100g: 0 },
        { name: 'Merluza, filé, assado', kcal_per_100g: 121.910218333333, protein_per_100g: 26.6041666666667, carb_per_100g: 0 },
        { name: 'Merluza, filé, cru', kcal_per_100g: 89.1308666666666, protein_per_100g: 16.6066666666667, carb_per_100g: 0 },
        { name: 'Merluza, filé, frito', kcal_per_100g: 191.627478375832, protein_per_100g: 26.9291666666667, carb_per_100g: 0 },
        { name: 'Pescada, branca, crua', kcal_per_100g: 110.8763, protein_per_100g: 16.2633333333333, carb_per_100g: 0 },
        { name: 'Pescada, branca, frita', kcal_per_100g: 223.039732369304, protein_per_100g: 27.35625, carb_per_100g: 0 },
        { name: 'Pescada, filé, com farinha de trigo, frito', kcal_per_100g: 283.425214431961, protein_per_100g: 21.4354166666667, carb_per_100g: 5.03325000000001 },
        { name: 'Pescada, filé, cru', kcal_per_100g: 107.205566666667, protein_per_100g: 16.65, carb_per_100g: 0 },
        { name: 'Pescada, filé, frito', kcal_per_100g: 154.270025, protein_per_100g: 28.5875, carb_per_100g: 0 },
        { name: 'Pescada, filé, molho escabeche', kcal_per_100g: 141.958322875023, protein_per_100g: 11.75, carb_per_100g: 5.01533333333334 },
        { name: 'Pescadinha, crua', kcal_per_100g: 76.4089083333333, protein_per_100g: 15.4791666666667, carb_per_100g: 0 },
        { name: 'Pintado, assado', kcal_per_100g: 191.559141127586, protein_per_100g: 36.45, carb_per_100g: 0 },
        { name: 'Pintado, cru', kcal_per_100g: 91.0832333333333, protein_per_100g: 18.5566666666667, carb_per_100g: 0 },
        { name: 'Pintado, grelhado', kcal_per_100g: 152.190088333333, protein_per_100g: 30.7958333333333, carb_per_100g: 0 },
        { name: 'Porquinho, cru', kcal_per_100g: 93.0245666666667, protein_per_100g: 20.49, carb_per_100g: 0 },
        { name: 'Salmão, filé, com pele, fresco, grelhado', kcal_per_100g: 228.731775135318, protein_per_100g: 23.91875, carb_per_100g: 0 },
        { name: 'Salmão, sem pele, fresco, cru', kcal_per_100g: 169.781579910556, protein_per_100g: 19.2520833333333, carb_per_100g: 0 },
        { name: 'Salmão, sem pele, fresco, grelhado', kcal_per_100g: 242.706569487095, protein_per_100g: 26.1416666666667, carb_per_100g: 0 },
        { name: 'Sardinha, assada', kcal_per_100g: 164.350788333333, protein_per_100g: 32.1791666666667, carb_per_100g: 0 },
        { name: 'Sardinha, conserva em óleo', kcal_per_100g: 284.981004871249, protein_per_100g: 15.9395833333333, carb_per_100g: 0 },
        { name: 'Sardinha, frita', kcal_per_100g: 257.0407, protein_per_100g: 33.3833333333333, carb_per_100g: 0 },
        { name: 'Sardinha, inteira, crua', kcal_per_100g: 113.900366666667, protein_per_100g: 21.0766666666667, carb_per_100g: 0 },
        { name: 'Tucunaré, filé, congelado, cru', kcal_per_100g: 87.686483549277, protein_per_100g: 17.9583333333333, carb_per_100g: -0.0450000000000079 },
        { name: 'Apresuntado', kcal_per_100g: 128.857255812009, protein_per_100g: 13.45, carb_per_100g: 2.862 },
        { name: 'Caldo de carne, tablete', kcal_per_100g: 240.623333333333, protein_per_100g: 7.82, carb_per_100g: 15.0533333333333 },
        { name: 'Caldo de galinha, tablete', kcal_per_100g: 251.445666666667, protein_per_100g: 6.27916666666667, carb_per_100g: 10.6455 },
        { name: 'Carne, bovina, acém, moído, cozido', kcal_per_100g: 212.4204, protein_per_100g: 26.6866666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, acém, moído, cru', kcal_per_100g: 136.562333333333, protein_per_100g: 19.42, carb_per_100g: 0 },
        { name: 'Carne, bovina, acém, sem gordura, cozido', kcal_per_100g: 214.610566666667, protein_per_100g: 27.27, carb_per_100g: 0 },
        { name: 'Carne, bovina, acém, sem gordura, cru', kcal_per_100g: 144.029433333333, protein_per_100g: 20.8166666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, almôndegas, cruas', kcal_per_100g: 189.256666666667, protein_per_100g: 12.3125, carb_per_100g: 9.79416666666665 },
        { name: 'Carne, bovina, almôndegas, fritas', kcal_per_100g: 271.813, protein_per_100g: 18.15625, carb_per_100g: 14.28675 },
        { name: 'Carne, bovina, bucho, cozido', kcal_per_100g: 133.022866666667, protein_per_100g: 21.64, carb_per_100g: 0 },
        { name: 'Carne, bovina, bucho, cru', kcal_per_100g: 137.303166666667, protein_per_100g: 20.53, carb_per_100g: 0 },
        { name: 'Carne, bovina, capa de contra-filé, com gordura, crua', kcal_per_100g: 216.908966666667, protein_per_100g: 19.1966666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, capa de contra-filé, com gordura, grelhada', kcal_per_100g: 311.702666666667, protein_per_100g: 30.6866666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, capa de contra-filé, sem gordura, crua', kcal_per_100g: 131.062466666667, protein_per_100g: 21.54, carb_per_100g: 0 },
        { name: 'Carne, bovina, capa de contra-filé, sem gordura, grelhada', kcal_per_100g: 239.443633333333, protein_per_100g: 35.0633333333333, carb_per_100g: -0.00666666666667481 },
        { name: 'Carne, bovina, charque, cozido', kcal_per_100g: 262.780142262181, protein_per_100g: 36.3645833333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, charque, cru', kcal_per_100g: 248.861018107454, protein_per_100g: 22.7145833333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, contra-filé, à milanesa', kcal_per_100g: 351.592659198999, protein_per_100g: 20.6125, carb_per_100g: 12.1745 },
        { name: 'Carne, bovina, contra-filé de costela, cru', kcal_per_100g: 202.4374, protein_per_100g: 19.8, carb_per_100g: 0 },
        { name: 'Carne, bovina, contra-filé de costela, grelhado', kcal_per_100g: 274.914266666667, protein_per_100g: 29.88, carb_per_100g: 0 },
        { name: 'Carne, bovina, contra-filé, com gordura, cru', kcal_per_100g: 205.8567, protein_per_100g: 21.15, carb_per_100g: 0 },
        { name: 'Carne, bovina, contra-filé, com gordura, grelhado', kcal_per_100g: 278.053566666667, protein_per_100g: 32.3966666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, contra-filé, sem gordura, cru', kcal_per_100g: 156.615833333333, protein_per_100g: 23.9966666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, contra-filé, sem gordura, grelhado', kcal_per_100g: 193.691566666667, protein_per_100g: 35.8833333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, costela, assada', kcal_per_100g: 373.038866666667, protein_per_100g: 28.8066666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, costela, crua', kcal_per_100g: 357.722466666667, protein_per_100g: 16.7066666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, coxão duro, sem gordura, cozido', kcal_per_100g: 216.616066666667, protein_per_100g: 31.88, carb_per_100g: 0 },
        { name: 'Carne, bovina, coxão duro, sem gordura, cru', kcal_per_100g: 147.966333333333, protein_per_100g: 21.5133333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, coxão mole, sem gordura, cozido', kcal_per_100g: 218.6751, protein_per_100g: 32.3833333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, coxão mole, sem gordura, cru', kcal_per_100g: 169.065966666667, protein_per_100g: 21.23, carb_per_100g: 0 },
        { name: 'Carne, bovina, cupim, assado', kcal_per_100g: 330.100290833333, protein_per_100g: 28.63125, carb_per_100g: 0 },
        { name: 'Carne, bovina, cupim, cru', kcal_per_100g: 221.3975, protein_per_100g: 19.5366666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, fígado, cru', kcal_per_100g: 141.045866666667, protein_per_100g: 20.7133333333333, carb_per_100g: 1.10666666666667 },
        { name: 'Carne, bovina, fígado, grelhado', kcal_per_100g: 225.0264, protein_per_100g: 29.86, carb_per_100g: 4.2 },
        { name: 'Carne, bovina, filé mingnon, sem gordura, cru', kcal_per_100g: 142.864266666667, protein_per_100g: 21.6, carb_per_100g: 0 },
        { name: 'Carne, bovina, filé mingnon, sem gordura, grelhado', kcal_per_100g: 219.7026, protein_per_100g: 32.8, carb_per_100g: 0 },
        { name: 'Carne, bovina, flanco, sem gordura, cozido', kcal_per_100g: 195.575366666667, protein_per_100g: 29.3766666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, flanco, sem gordura, cru', kcal_per_100g: 141.4601, protein_per_100g: 19.9966666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, fraldinha, com gordura, cozida', kcal_per_100g: 338.445733333333, protein_per_100g: 24.24, carb_per_100g: 0 },
        { name: 'Carne, bovina, fraldinha, com gordura, crua', kcal_per_100g: 220.723766666667, protein_per_100g: 17.5833333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, lagarto, cozido', kcal_per_100g: 222.468566666667, protein_per_100g: 32.8633333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, lagarto, cru', kcal_per_100g: 134.864566666667, protein_per_100g: 20.5433333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, língua, cozida', kcal_per_100g: 314.9016, protein_per_100g: 21.3666666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, língua, crua', kcal_per_100g: 215.249766666667, protein_per_100g: 17.09, carb_per_100g: 0 },
        { name: 'Carne, bovina, maminha, crua', kcal_per_100g: 152.765866666667, protein_per_100g: 20.9333333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, maminha, grelhada', kcal_per_100g: 153.089675833333, protein_per_100g: 30.7354166666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, miolo de alcatra, sem gordura, cru', kcal_per_100g: 162.871233333333, protein_per_100g: 21.61, carb_per_100g: 0 },
        { name: 'Carne, bovina, miolo de alcatra, sem gordura, grelhado', kcal_per_100g: 241.363966666667, protein_per_100g: 31.93, carb_per_100g: 0 },
        { name: 'Carne, bovina, músculo, sem gordura, cozido', kcal_per_100g: 193.800333333333, protein_per_100g: 31.2333333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, músculo, sem gordura, cru', kcal_per_100g: 141.581, protein_per_100g: 21.56, carb_per_100g: 0 },
        { name: 'Carne, bovina, paleta, com gordura, crua', kcal_per_100g: 158.7099, protein_per_100g: 21.41, carb_per_100g: 0 },
        { name: 'Carne, bovina, paleta, sem gordura, cozida', kcal_per_100g: 193.6524, protein_per_100g: 29.72, carb_per_100g: 0 },
        { name: 'Carne, bovina, paleta, sem gordura, crua', kcal_per_100g: 140.9415, protein_per_100g: 21.03, carb_per_100g: 0 },
        { name: 'Carne, bovina, patinho, sem gordura, cru', kcal_per_100g: 133.4689, protein_per_100g: 21.7233333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, patinho, sem gordura, grelhado', kcal_per_100g: 219.259266666667, protein_per_100g: 35.9, carb_per_100g: 0 },
        { name: 'Carne, bovina, peito, sem gordura, cozido', kcal_per_100g: 338.473133333333, protein_per_100g: 22.2466666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, peito, sem gordura, cru', kcal_per_100g: 259.275633333333, protein_per_100g: 17.5566666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, picanha, com gordura, crua', kcal_per_100g: 212.879433333333, protein_per_100g: 18.8233333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, picanha, com gordura, grelhada', kcal_per_100g: 288.767091666667, protein_per_100g: 26.4208333333333, carb_per_100g: 0 },
        { name: 'Carne, bovina, picanha, sem gordura, crua', kcal_per_100g: 133.522366666667, protein_per_100g: 21.25, carb_per_100g: 0 },
        { name: 'Carne, bovina, picanha, sem gordura, grelhada', kcal_per_100g: 238.468133333333, protein_per_100g: 31.9066666666667, carb_per_100g: 0 },
        { name: 'Carne, bovina, seca, cozida', kcal_per_100g: 312.799033691446, protein_per_100g: 26.93125, carb_per_100g: 0 },
        { name: 'Carne, bovina, seca, crua', kcal_per_100g: 312.748427903652, protein_per_100g: 19.6583333333333, carb_per_100g: 0 },
        { name: 'Coxinha de frango, frita', kcal_per_100g: 283.048, protein_per_100g: 9.61041666666667, carb_per_100g: 34.5205833333333 },
        { name: 'Croquete, de carne, cru', kcal_per_100g: 245.771925297141, protein_per_100g: 12.04375, carb_per_100g: 13.9495833333333 },
        { name: 'Croquete, de carne, frito', kcal_per_100g: 346.742014647404, protein_per_100g: 16.8625, carb_per_100g: 18.1461666666667 },
        { name: 'Empada de frango, pré-cozida, assada', kcal_per_100g: 358.191666666667, protein_per_100g: 6.94375, carb_per_100g: 47.4929166666667 },
        { name: 'Empada, de frango, pré-cozida', kcal_per_100g: 377.479666666667, protein_per_100g: 7.34375, carb_per_100g: 35.5289166666667 },
        { name: 'Frango, asa, com pele, crua', kcal_per_100g: 213.188333333333, protein_per_100g: 18.1, carb_per_100g: 0 },
        { name: 'Frango, caipira, inteiro, com pele, cozido', kcal_per_100g: 242.889326666667, protein_per_100g: 23.8833333333333, carb_per_100g: 0 },
        { name: 'Frango, caipira, inteiro, sem pele, cozido', kcal_per_100g: 195.760296666667, protein_per_100g: 29.575, carb_per_100g: 0 },
        { name: 'Frango, coração, cru', kcal_per_100g: 221.502833333333, protein_per_100g: 12.5833333333333, carb_per_100g: 0 },
        { name: 'Frango, coração, grelhado', kcal_per_100g: 207.273643333333, protein_per_100g: 22.4395833333333, carb_per_100g: 0.607416666666658 },
        { name: 'Frango, coxa, com pele, assada', kcal_per_100g: 215.11864753294, protein_per_100g: 28.4916666666667, carb_per_100g: 0.05833333333334 },
        { name: 'Frango, coxa, com pele, crua', kcal_per_100g: 161.474733333333, protein_per_100g: 17.0933333333333, carb_per_100g: 0 },
        { name: 'Frango, coxa, sem pele, cozida', kcal_per_100g: 167.428032164415, protein_per_100g: 26.8583333333333, carb_per_100g: 0 },
        { name: 'Frango, coxa, sem pele, crua', kcal_per_100g: 119.947466666667, protein_per_100g: 17.8133333333333, carb_per_100g: 0.019999999999997 },
        { name: 'Frango, fígado, cru', kcal_per_100g: 106.484566666667, protein_per_100g: 17.5866666666667, carb_per_100g: -0.0233333333333381 },
        { name: 'Frango, filé, à milanesa', kcal_per_100g: 220.87278, protein_per_100g: 28.4604166666667, carb_per_100g: 7.51291666666666 },
        { name: 'Frango, inteiro, com pele, cru', kcal_per_100g: 226.319166666667, protein_per_100g: 16.4433333333333, carb_per_100g: 0 },
        { name: 'Frango, inteiro, sem pele, assado', kcal_per_100g: 187.337796666667, protein_per_100g: 28.025, carb_per_100g: 0 },
        { name: 'Frango, inteiro, sem pele, cozido', kcal_per_100g: 170.389975833333, protein_per_100g: 24.9854166666667, carb_per_100g: 0 },
        { name: 'Frango, inteiro, sem pele, cru', kcal_per_100g: 129.0964, protein_per_100g: 20.5866666666667, carb_per_100g: 0 },
        { name: 'Frango, peito, com pele, assado', kcal_per_100g: 211.683149530729, protein_per_100g: 33.4166666666667, carb_per_100g: 0 },
        { name: 'Frango, peito, com pele, cru', kcal_per_100g: 149.465266666667, protein_per_100g: 20.78, carb_per_100g: 0 },
        { name: 'Frango, peito, sem pele, cozido', kcal_per_100g: 162.874763346314, protein_per_100g: 31.46875, carb_per_100g: 0 },
        { name: 'Frango, peito, sem pele, cru', kcal_per_100g: 119.159266666667, protein_per_100g: 21.5266666666667, carb_per_100g: 0 },
        { name: 'Frango, peito, sem pele, grelhado', kcal_per_100g: 159.185007192612, protein_per_100g: 32.0333333333333, carb_per_100g: 0 },
        { name: 'Frango, sobrecoxa, com pele, assada', kcal_per_100g: 259.604769166667, protein_per_100g: 28.7020833333333, carb_per_100g: 0 },
        { name: 'Frango, sobrecoxa, com pele, crua', kcal_per_100g: 254.5322, protein_per_100g: 15.46, carb_per_100g: 0 },
        { name: 'Frango, sobrecoxa, sem pele, assada', kcal_per_100g: 232.883396666667, protein_per_100g: 29.175, carb_per_100g: 0 },
        { name: 'Frango, sobrecoxa, sem pele, crua', kcal_per_100g: 161.7963, protein_per_100g: 17.57, carb_per_100g: 0 },
        { name: 'Hambúrguer, bovino, cru', kcal_per_100g: 214.836, protein_per_100g: 13.15625, carb_per_100g: 4.15375 },
        { name: 'Hambúrguer, bovino, frito', kcal_per_100g: 258.283, protein_per_100g: 19.9729166666667, carb_per_100g: 6.32008333333333 },
        { name: 'Hambúrguer, bovino, grelhado', kcal_per_100g: 209.831666666667, protein_per_100g: 13.15625, carb_per_100g: 11.3334166666667 },
        { name: 'Lingüiça, frango, crua', kcal_per_100g: 218.108814166667, protein_per_100g: 14.2395833333333, carb_per_100g: 0 },
        { name: 'Lingüiça, frango, frita', kcal_per_100g: 245.461006666667, protein_per_100g: 18.3166666666667, carb_per_100g: 0 },
        { name: 'Lingüiça, frango, grelhada', kcal_per_100g: 243.6585675, protein_per_100g: 18.1895833333333, carb_per_100g: 0 },
        { name: 'Lingüiça, porco, crua', kcal_per_100g: 227.203450833333, protein_per_100g: 16.0645833333333, carb_per_100g: 0 },
        { name: 'Lingüiça, porco, frita', kcal_per_100g: 279.543589166667, protein_per_100g: 20.4520833333333, carb_per_100g: 0 },
        { name: 'Lingüiça, porco, grelhada', kcal_per_100g: 296.489609166667, protein_per_100g: 23.16875, carb_per_100g: 0 },
        { name: 'Mortadela', kcal_per_100g: 268.819989016732, protein_per_100g: 11.9520833333333, carb_per_100g: 5.81591666666666 },
        { name: 'Peru, congelado, assado', kcal_per_100g: 163.071397931377, protein_per_100g: 26.2020833333333, carb_per_100g: 0 },
        { name: 'Peru, congelado, cru', kcal_per_100g: 93.7224338261286, protein_per_100g: 18.0833333333333, carb_per_100g: 0 },
        { name: 'Porco, bisteca, crua', kcal_per_100g: 164.115336592992, protein_per_100g: 21.5, carb_per_100g: 0 },
        { name: 'Porco, bisteca, frita', kcal_per_100g: 311.169045334856, protein_per_100g: 33.7479166666667, carb_per_100g: 0 },
        { name: 'Porco, bisteca, grelhada', kcal_per_100g: 280.084034902771, protein_per_100g: 28.8895833333333, carb_per_100g: 0 },
        { name: 'Porco, costela, assada', kcal_per_100g: 402.168447450837, protein_per_100g: 30.2229166666667, carb_per_100g: 0 },
        { name: 'Porco, costela, crua', kcal_per_100g: 255.606342061361, protein_per_100g: 18, carb_per_100g: 0 },
        { name: 'Porco, lombo, assado', kcal_per_100g: 210.234665579637, protein_per_100g: 35.725, carb_per_100g: 0 },
        { name: 'Porco, lombo, cru', kcal_per_100g: 175.625195250114, protein_per_100g: 22.6041666666667, carb_per_100g: 0 },
        { name: 'Porco, orelha, salgada, crua', kcal_per_100g: 258.491758333333, protein_per_100g: 18.5208333333333, carb_per_100g: 0 },
        { name: 'Porco, pernil, assado', kcal_per_100g: 262.259606666667, protein_per_100g: 32.1333333333333, carb_per_100g: 0 },
        { name: 'Porco, pernil, cru', kcal_per_100g: 186.05575, protein_per_100g: 20.125, carb_per_100g: 0 },
        { name: 'Porco, rabo, salgado, cru', kcal_per_100g: 377.4152575, protein_per_100g: 15.58125, carb_per_100g: 0 },
        { name: 'Presunto, com capa de gordura', kcal_per_100g: 127.849212665637, protein_per_100g: 14.3708333333333, carb_per_100g: 1.3975 },
        { name: 'Presunto, sem capa de gordura', kcal_per_100g: 93.7432807208697, protein_per_100g: 14.2916666666667, carb_per_100g: 2.14566666666667 },
        { name: 'Quibe, assado', kcal_per_100g: 136.228876141588, protein_per_100g: 14.59375, carb_per_100g: 12.86125 },
        { name: 'Quibe, cru', kcal_per_100g: 109.490669294755, protein_per_100g: 12.3541666666667, carb_per_100g: 10.7741666666667 },
        { name: 'Quibe, frito', kcal_per_100g: 253.83130886964, protein_per_100g: 14.8895833333333, carb_per_100g: 12.3374166666667 },
        { name: 'Salame', kcal_per_100g: 397.842506534934, protein_per_100g: 25.8104166666667, carb_per_100g: 2.90625000000001 },
        { name: 'Toucinho, cru', kcal_per_100g: 592.531175, protein_per_100g: 11.4791666666667, carb_per_100g: 0 },
        { name: 'Toucinho, frito', kcal_per_100g: 696.564006666667, protein_per_100g: 27.2833333333333, carb_per_100g: 0 },
        { name: 'Bebida láctea, pêssego', kcal_per_100g: 55.1648333333333, protein_per_100g: 2.13333333333333, carb_per_100g: 7.57000000000001 },
        { name: 'Creme de Leite', kcal_per_100g: 221.483541275133, protein_per_100g: 1.50780669371287, carb_per_100g: 4.50952663962046 },
        { name: 'Iogurte, natural', kcal_per_100g: 51.4895333333333, protein_per_100g: 4.06333333333333, carb_per_100g: 1.91666666666666 },
        { name: 'Iogurte, natural, desnatado', kcal_per_100g: 41.4927112815583, protein_per_100g: 3.83438006877899, carb_per_100g: 5.77395333333333 },
        { name: 'Iogurte, sabor abacaxi', kcal_per_100g: 0, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Iogurte, sabor morango', kcal_per_100g: 69.5656, protein_per_100g: 2.71, carb_per_100g: 9.69333333333334 },
        { name: 'Iogurte, sabor pêssego', kcal_per_100g: 67.8494, protein_per_100g: 2.53, carb_per_100g: 9.43333333333334 },
        { name: 'Leite, condensado', kcal_per_100g: 312.5726, protein_per_100g: 7.67, carb_per_100g: 56.9966666666667 },
        { name: 'Leite, de cabra', kcal_per_100g: 66.4157418865433, protein_per_100g: 3.0709067217509, carb_per_100g: 5.24609333333333 },
        { name: 'Leite, de vaca, achocolatado', kcal_per_100g: 82.8209962719936, protein_per_100g: 2.09902003765106, carb_per_100g: 14.1583133333333 },
        { name: 'Leite, de vaca, desnatado, pó', kcal_per_100g: 361.608, protein_per_100g: 34.69, carb_per_100g: 53.0433333333333 },
        { name: 'Leite, de vaca, desnatado, UHT', kcal_per_100g: 0, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Leite, de vaca, integral', kcal_per_100g: 0, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Leite, de vaca, integral, pó', kcal_per_100g: 496.6503, protein_per_100g: 25.42, carb_per_100g: 39.18 },
        { name: 'Leite, fermentado', kcal_per_100g: 69.621474, protein_per_100g: 1.89486, carb_per_100g: 15.6744733333333 },
        { name: 'Queijo, minas, frescal', kcal_per_100g: 264.273128, protein_per_100g: 17.41102, carb_per_100g: 3.24031333333333 },
        { name: 'Queijo, minas, meia cura', kcal_per_100g: 320.72181773326, protein_per_100g: 21.2113737138112, carb_per_100g: 3.57295961952209 },
        { name: 'Queijo, mozarela', kcal_per_100g: 329.870718420887, protein_per_100g: 22.6490004062653, carb_per_100g: 3.04933292706807 },
        { name: 'Queijo, parmesão', kcal_per_100g: 452.963755333333, protein_per_100g: 35.5536133333333, carb_per_100g: 1.66072 },
        { name: 'Queijo, pasteurizado', kcal_per_100g: 303.079803333333, protein_per_100g: 9.35733333333333, carb_per_100g: 5.67633333333333 },
        { name: 'Queijo, petit suisse, morango', kcal_per_100g: 121.105954, protein_per_100g: 5.78666, carb_per_100g: 18.4620066666667 },
        { name: 'Queijo, prato', kcal_per_100g: 359.880462405055, protein_per_100g: 22.6617604064941, carb_per_100g: 1.87857292683919 },
        { name: 'Queijo, requeijão, cremoso', kcal_per_100g: 256.578148666667, protein_per_100g: 9.62954666666667, carb_per_100g: 2.43245333333333 },
        { name: 'Queijo, ricota', kcal_per_100g: 139.73178, protein_per_100g: 12.6005, carb_per_100g: 3.78616666666667 },
        { name: 'Bebida isotônica, sabores variados', kcal_per_100g: 25.6133333333333, protein_per_100g: 0, carb_per_100g: 6.40333333333334 },
        { name: 'Café, infusão 10%', kcal_per_100g: 9.07086859961352, protein_per_100g: 0.7125, carb_per_100g: 1.47866666666667 },
        { name: 'Cana, aguardente 1', kcal_per_100g: 215.6616, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Cana, caldo de', kcal_per_100g: 65.3435982689857, protein_per_100g: 0, carb_per_100g: 18.151 },
        { name: 'Cerveja, pilsen 2', kcal_per_100g: 40.7201885506287, protein_per_100g: 0.5625, carb_per_100g: 3.3175 },
        { name: 'Chá, erva-doce, infusão 5%', kcal_per_100g: 1.39705997387564, protein_per_100g: 0, carb_per_100g: 0.391333333333321 },
        { name: 'Chá, mate, infusão 5%', kcal_per_100g: 2.73074995112414, protein_per_100g: 0, carb_per_100g: 0.642999999999993 },
        { name: 'Chá, preto, infusão 5%', kcal_per_100g: 2.24790995796521, protein_per_100g: 0, carb_per_100g: 0.629666666666665 },
        { name: 'Coco, água de', kcal_per_100g: 21.5085942405065, protein_per_100g: 0, carb_per_100g: 5.28466666666667 },
        { name: 'Refrigerante, tipo água tônica', kcal_per_100g: 30.7794, protein_per_100g: 0, carb_per_100g: 7.95333333333334 },
        { name: 'Refrigerante, tipo cola', kcal_per_100g: 33.5142, protein_per_100g: 0, carb_per_100g: 8.66000000000001 },
        { name: 'Refrigerante, tipo guaraná', kcal_per_100g: 38.7, protein_per_100g: 0, carb_per_100g: 10 },
        { name: 'Refrigerante, tipo laranja', kcal_per_100g: 45.6273, protein_per_100g: 0, carb_per_100g: 11.79 },
        { name: 'Refrigerante, tipo limão', kcal_per_100g: 39.7191, protein_per_100g: 0, carb_per_100g: 10.2633333333333 },
        { name: 'Omelete, de queijo', kcal_per_100g: 268.006772182425, protein_per_100g: 15.5708333333333, carb_per_100g: 0.437166666666668 },
        { name: 'Ovo, de codorna, inteiro, cru', kcal_per_100g: 176.8939, protein_per_100g: 13.6875, carb_per_100g: 0.772499999999999 },
        { name: 'Ovo, de galinha, clara, cozida/10minutos', kcal_per_100g: 59.4356966666667, protein_per_100g: 13.4479166666667, carb_per_100g: 0 },
        { name: 'Ovo, de galinha, gema, cozida/10minutos', kcal_per_100g: 352.67334, protein_per_100g: 15.9, carb_per_100g: 1.56000000000001 },
        { name: 'Ovo, de galinha, inteiro, cozido/10minutos', kcal_per_100g: 145.70017, protein_per_100g: 13.29375, carb_per_100g: 0.614916666666674 },
        { name: 'Ovo, de galinha, inteiro, cru', kcal_per_100g: 143.111733333333, protein_per_100g: 13.03, carb_per_100g: 1.63666666666667 },
        { name: 'Ovo, de galinha, inteiro, frito', kcal_per_100g: 240.187224009117, protein_per_100g: 15.6166666666667, carb_per_100g: 1.19366666666666 },
        { name: 'Achocolatado, pó', kcal_per_100g: 401.02, protein_per_100g: 4.20333333333333, carb_per_100g: 91.1766666666667 },
        { name: 'Açúcar, cristal', kcal_per_100g: 386.845724, protein_per_100g: 0.32, carb_per_100g: 99.61 },
        { name: 'Açúcar, mascavo', kcal_per_100g: 368.554822524389, protein_per_100g: 0.758333333333333, carb_per_100g: 94.45 },
        { name: 'Açúcar, refinado', kcal_per_100g: 386.574824, protein_per_100g: 0.32, carb_per_100g: 99.54 },
        { name: 'Chocolate, ao leite', kcal_per_100g: 539.586666666667, protein_per_100g: 7.22, carb_per_100g: 59.5766666666667 },
        { name: 'Chocolate, ao leite, com castanha do Pará', kcal_per_100g: 558.876333333333, protein_per_100g: 7.4125, carb_per_100g: 55.3768333333333 },
        { name: 'Chocolate, ao leite, dietético', kcal_per_100g: 556.824333333333, protein_per_100g: 6.89791666666667, carb_per_100g: 56.3234166666667 },
        { name: 'Chocolate, meio amargo', kcal_per_100g: 474.917769973274, protein_per_100g: 4.86244343217214, carb_per_100g: 62.4228899011612 },
        { name: 'Cocada branca', kcal_per_100g: 448.84545242331, protein_per_100g: 1.12183337370555, carb_per_100g: 81.3831666262945 },
        { name: 'Doce, de abóbora, cremoso', kcal_per_100g: 198.936063049634, protein_per_100g: 0.916666666666667, carb_per_100g: 54.6133333333333 },
        { name: 'Doce, de leite, cremoso', kcal_per_100g: 306.310130231059, protein_per_100g: 5.47829343159994, carb_per_100g: 59.4933732350667 },
        { name: 'Geléia, mocotó, natural', kcal_per_100g: 106.086666666667, protein_per_100g: 2.125, carb_per_100g: 24.2316666666667 },
        { name: 'Glicose de milho', kcal_per_100g: 292.118405299187, protein_per_100g: 0, carb_per_100g: 79.38 },
        { name: 'Maria mole', kcal_per_100g: 301.235887537, protein_per_100g: 3.81285013103485, carb_per_100g: 73.5534832022985 },
        { name: 'Maria mole, coco queimado', kcal_per_100g: 306.631896997018, protein_per_100g: 3.93495013523102, carb_per_100g: 75.0593831981023 },
        { name: 'Marmelada', kcal_per_100g: 257.241473193804, protein_per_100g: 0.4, carb_per_100g: 70.7633333333333 },
        { name: 'Mel, de abelha', kcal_per_100g: 309.242666666667, protein_per_100g: 0, carb_per_100g: 84.0333333333333 },
        { name: 'Melado', kcal_per_100g: 296.506491231918, protein_per_100g: 0, carb_per_100g: 76.6166666666667 },
        { name: 'Quindim', kcal_per_100g: 411.348721570849, protein_per_100g: 4.7375, carb_per_100g: 46.2988333333333 },
        { name: 'Rapadura', kcal_per_100g: 351.958122101545, protein_per_100g: 0.989583333333333, carb_per_100g: 90.7924166666667 },
        { name: 'Café, pó, torrado', kcal_per_100g: 418.618666666667, protein_per_100g: 14.7, carb_per_100g: 65.7533333333333 },
        { name: 'Capuccino, pó', kcal_per_100g: 417.406666666667, protein_per_100g: 11.3125, carb_per_100g: 73.6141666666666 },
        { name: 'Fermento em pó, químico', kcal_per_100g: 89.7220666511218, protein_per_100g: 0.475333318710327, carb_per_100g: 43.9113333479563 },
        { name: 'Fermento, biológico, levedura, tablete', kcal_per_100g: 89.7948670305888, protein_per_100g: 16.9569994783401, carb_per_100g: 7.69866718832652 },
        { name: 'Gelatina, sabores variados, pó', kcal_per_100g: 380.2229, protein_per_100g: 8.88666666666667, carb_per_100g: 89.2233333333333 },
        { name: 'Sal, dietético', kcal_per_100g: 0, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Sal, grosso', kcal_per_100g: 0, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Shoyu', kcal_per_100g: 60.9277498753866, protein_per_100g: 3.3125, carb_per_100g: 11.6475 },
        { name: 'Tempero a base de sal', kcal_per_100g: 21.33, protein_per_100g: 2.66666666666667, carb_per_100g: 2.07333333333334 },
        { name: 'Azeitona, preta, conserva', kcal_per_100g: 194.153847020984, protein_per_100g: 1.1625, carb_per_100g: 5.5445 },
        { name: 'Azeitona, verde, conserva', kcal_per_100g: 136.93643, protein_per_100g: 0.947916666666667, carb_per_100g: 4.10175 },
        { name: 'Chantilly, spray, com gordura vegetal', kcal_per_100g: 314.956000266667, protein_per_100g: 0.525, carb_per_100g: 16.8550000666667 },
        { name: 'Leite, de coco', kcal_per_100g: 166.160301615546, protein_per_100g: 1.0140667031606, carb_per_100g: 2.19459996350605 },
        { name: 'Maionese, tradicional com ovos', kcal_per_100g: 302.152677687824, protein_per_100g: 0.58125, carb_per_100g: 7.89975 },
        { name: 'Acarajé', kcal_per_100g: 289.211666666667, protein_per_100g: 8.34583333333333, carb_per_100g: 19.1138333333333 },
        { name: 'Arroz carreteiro', kcal_per_100g: 153.772, protein_per_100g: 10.8291666666667, carb_per_100g: 11.5848333333333 },
        { name: 'Baião de dois, arroz e feijão-de-corda', kcal_per_100g: 135.681333333333, protein_per_100g: 6.23958333333333, carb_per_100g: 20.41775 },
        { name: 'Barreado', kcal_per_100g: 164.975234047413, protein_per_100g: 18.26875, carb_per_100g: 0.23625 },
        { name: 'Bife à cavalo, com contra filé', kcal_per_100g: 291.229509244959, protein_per_100g: 23.6604166666667, carb_per_100g: 0 },
        { name: 'Bolinho de arroz', kcal_per_100g: 273.514333333333, protein_per_100g: 8.03958333333333, carb_per_100g: 41.68275 },
        { name: 'Camarão à baiana', kcal_per_100g: 100.783043004036, protein_per_100g: 7.94166666666667, carb_per_100g: 3.17366666666667 },
        { name: 'Charuto, de repolho', kcal_per_100g: 78.2347292222182, protein_per_100g: 6.77916666666667, carb_per_100g: 10.1331666666667 },
        { name: 'Cuscuz, de milho, cozido com sal', kcal_per_100g: 113.459481666667, protein_per_100g: 2.15625, carb_per_100g: 25.2814166666667 },
        { name: 'Cuscuz, paulista', kcal_per_100g: 142.123, protein_per_100g: 2.55833333333333, carb_per_100g: 22.5136666666667 },
        { name: 'Cuxá, molho', kcal_per_100g: 80.0916156365077, protein_per_100g: 5.64375, carb_per_100g: 5.73891666666667 },
        { name: 'Dobradinha', kcal_per_100g: 124.500200833333, protein_per_100g: 19.7729166666667, carb_per_100g: 0 },
        { name: 'Estrogonofe de carne', kcal_per_100g: 173.141364318013, protein_per_100g: 15.03125, carb_per_100g: 2.97541666666667 },
        { name: 'Estrogonofe de frango', kcal_per_100g: 156.806103013237, protein_per_100g: 17.5520833333333, carb_per_100g: 2.59391666666666 },
        { name: 'Feijão tropeiro mineiro', kcal_per_100g: 151.561856830955, protein_per_100g: 10.1708333333333, carb_per_100g: 19.5818333333333 },
        { name: 'L', kcal_per_100g: 116.933457311034, protein_per_100g: 8.67083333333333, carb_per_100g: 11.6418333333333 },
        { name: 'Frango, com açafrão', kcal_per_100g: 112.783768841227, protein_per_100g: 9.69791666666667, carb_per_100g: 4.06208333333332 },
        { name: 'Macarrão, molho bolognesa', kcal_per_100g: 119.53177144556, protein_per_100g: 4.93429983488719, carb_per_100g: 22.5223668317795 },
        { name: 'Maniçoba', kcal_per_100g: 134.222893400987, protein_per_100g: 9.95833333333333, carb_per_100g: 3.41933333333333 },
        { name: 'Quibebe', kcal_per_100g: 86.349230299592, protein_per_100g: 8.55625, carb_per_100g: 6.64408333333332 },
        { name: 'Salada, de legumes, com maionese', kcal_per_100g: 96.1035883984566, protein_per_100g: 1.05, carb_per_100g: 8.92399999999999 },
        { name: 'Salada, de legumes, cozida no vapor', kcal_per_100g: 35.4081042984724, protein_per_100g: 2.00625, carb_per_100g: 7.08908333333333 },
        { name: 'Salpicão, de frango', kcal_per_100g: 147.864596134027, protein_per_100g: 13.925, carb_per_100g: 4.56899999999999 },
        { name: 'Sarapatel', kcal_per_100g: 122.981858212431, protein_per_100g: 18.4729166666667, carb_per_100g: 1.09408333333334 },
        { name: 'Tabule', kcal_per_100g: 57.4534766884806, protein_per_100g: 2.04632997322082, carb_per_100g: 10.5810033601125 },
        { name: 'Tacacá', kcal_per_100g: 46.8891771512032, protein_per_100g: 6.95833333333333, carb_per_100g: 3.39 },
        { name: 'Tapioca, com manteiga', kcal_per_100g: 347.826556257824, protein_per_100g: 0.0895833333333333, carb_per_100g: 63.59175 },
        { name: 'Tucupi, com pimenta-de-cheiro', kcal_per_100g: 27.1837984027266, protein_per_100g: 2.05625, carb_per_100g: 4.73774999999999 },
        { name: 'Vaca atolada', kcal_per_100g: 144.89697968479, protein_per_100g: 5.12291666666667, carb_per_100g: 10.0614166666667 },
        { name: 'Vatapá', kcal_per_100g: 254.893285724155, protein_per_100g: 5.99783354918162, carb_per_100g: 9.74849978415171 },
        { name: 'Virado à paulista', kcal_per_100g: 306.94678645132, protein_per_100g: 10.18125, carb_per_100g: 14.1090833333333 },
        { name: 'Yakisoba', kcal_per_100g: 112.802041253408, protein_per_100g: 7.51666666666667, carb_per_100g: 18.2513333333333 },
        { name: 'Amendoim, grão, cru', kcal_per_100g: 544.052655799433, protein_per_100g: 27.1908001899719, carb_per_100g: 20.3135333333333 },
        { name: 'Amendoim, torrado, salgado', kcal_per_100g: 605.781092917019, protein_per_100g: 22.4751801570257, carb_per_100g: 18.702486509641 },
        { name: 'Ervilha, em vagem', kcal_per_100g: 88.0935819997785, protein_per_100g: 7.45208333333333, carb_per_100g: 14.2275833333333 },
        { name: 'Ervilha, enlatada, drenada', kcal_per_100g: 73.8447043478261, protein_per_100g: 4.59782608695652, carb_per_100g: 13.4421739130435 },
        { name: 'Feijão, carioca, cozido', kcal_per_100g: 76.4240856666667, protein_per_100g: 4.775, carb_per_100g: 13.5910333333333 },
        { name: 'Feijão, carioca, cru', kcal_per_100g: 329.026736231884, protein_per_100g: 19.981884057971, carb_per_100g: 61.2214492753623 },
        { name: 'Feijão, fradinho, cozido', kcal_per_100g: 78.0088966666667, protein_per_100g: 5.09375, carb_per_100g: 13.4995833333333 },
        { name: 'Feijão, fradinho, cru', kcal_per_100g: 339.164766666667, protein_per_100g: 20.2083333333333, carb_per_100g: 61.24 },
        { name: 'Feijão, jalo, cozido', kcal_per_100g: 92.73992, protein_per_100g: 6.14375, carb_per_100g: 16.49525 },
        { name: 'Feijão, jalo, cru', kcal_per_100g: 327.905266666667, protein_per_100g: 20.1041666666667, carb_per_100g: 61.4791666666667 },
        { name: 'Feijão, preto, cozido', kcal_per_100g: 77.0272666666667, protein_per_100g: 4.47916666666667, carb_per_100g: 14.0051666666667 },
        { name: 'Feijão, preto, cru', kcal_per_100g: 323.565711594203, protein_per_100g: 21.3442028985507, carb_per_100g: 58.752463768116 },
        { name: 'Feijão, rajado, cozido', kcal_per_100g: 84.7018527334929, protein_per_100g: 5.5375, carb_per_100g: 15.2675 },
        { name: 'Feijão, rajado, cru', kcal_per_100g: 325.844411162734, protein_per_100g: 17.2708333333333, carb_per_100g: 62.9291666666667 },
        { name: 'Feijão, rosinha, cozido', kcal_per_100g: 67.8662287714283, protein_per_100g: 4.53958333333333, carb_per_100g: 11.82275 },
        { name: 'Feijão, rosinha, cru', kcal_per_100g: 336.961911127567, protein_per_100g: 20.9166666666667, carb_per_100g: 62.2233333333333 },
        { name: 'Feijão, roxo, cozido', kcal_per_100g: 76.8933823179006, protein_per_100g: 5.72083333333333, carb_per_100g: 12.9081666666667 },
        { name: 'Feijão, roxo, cru', kcal_per_100g: 331.414977456729, protein_per_100g: 22.1666666666667, carb_per_100g: 59.9866666666667 },
        { name: 'Grão-de-bico, cru', kcal_per_100g: 354.7028765891, protein_per_100g: 21.2291666666667, carb_per_100g: 57.8841666666667 },
        { name: 'Guandu, cru', kcal_per_100g: 344.133651284993, protein_per_100g: 18.9645833333333, carb_per_100g: 64.0004166666667 },
        { name: 'Lentilha, cozida', kcal_per_100g: 92.6387662522991, protein_per_100g: 6.31041666666667, carb_per_100g: 16.30225 },
        { name: 'Lentilha, crua', kcal_per_100g: 339.141240203553, protein_per_100g: 23.1521739130435, carb_per_100g: 62.0044927536232 },
        { name: 'Paçoca, amendoim', kcal_per_100g: 486.927086464524, protein_per_100g: 15.9958333333333, carb_per_100g: 52.3761666666667 },
        { name: 'Pé-de-moleque, amendoim', kcal_per_100g: 503.190365839956, protein_per_100g: 13.1622400919596, carb_per_100g: 54.730426574707 },
        { name: 'Soja, farinha', kcal_per_100g: 403.955845810399, protein_per_100g: 36.0301002407074, carb_per_100g: 38.4398997592926 },
        { name: 'Soja, extrato solúvel, natural, fluido', kcal_per_100g: 39.1048552753508, protein_per_100g: 2.38107001590729, carb_per_100g: 4.27526333333334 },
        { name: 'Soja, extrato solúvel, pó', kcal_per_100g: 458.895729437868, protein_per_100g: 35.6875002384186, carb_per_100g: 28.4828333333333 },
        { name: 'Soja, queijo (tofu)', kcal_per_100g: 64.4850940738902, protein_per_100g: 6.55317671044668, carb_per_100g: 2.12682333333333 },
        { name: 'Tremoço, cru', kcal_per_100g: 381.278173960129, protein_per_100g: 33.575, carb_per_100g: 43.7863333333333 },
        { name: 'Tremoço, em conserva', kcal_per_100g: 120.642585344871, protein_per_100g: 11.1083333333333, carb_per_100g: 12.3893333333333 },
        { name: 'Amêndoa, torrada, salgada', kcal_per_100g: 580.74695455607, protein_per_100g: 18.5547593851089, carb_per_100g: 29.54724 },
        { name: 'Castanha-de-caju, torrada, salgada', kcal_per_100g: 570.167626501619, protein_per_100g: 18.5093673327764, carb_per_100g: 29.134966000557 },
        { name: 'Castanha-do-Brasil, crua', kcal_per_100g: 642.963071681069, protein_per_100g: 14.53634010156, carb_per_100g: 15.07865989844 },
        { name: 'Coco, cru', kcal_per_100g: 406.48735310781, protein_per_100g: 3.69183412310697, carb_per_100g: 10.401665876893 },
        { name: 'Coco, verde, cru', kcal_per_100g: 0, protein_per_100g: 0, carb_per_100g: 0 },
        { name: 'Farinha, de mesocarpo de babaçu, crua', kcal_per_100g: 328.771400244834, protein_per_100g: 1.40626671727498, carb_per_100g: 79.1730666160583 },
        { name: 'Gergelim, semente', kcal_per_100g: 583.546714754549, protein_per_100g: 21.1646674283346, carb_per_100g: 21.6176659049988 },
        { name: 'Linhaça, semente', kcal_per_100g: 495.096113843651, protein_per_100g: 14.0838671735128, carb_per_100g: 43.3121994931539 },
        { name: 'Pinhão, cozido', kcal_per_100g: 174.369902, protein_per_100g: 2.98036666666667, carb_per_100g: 43.9176333333333 },
        { name: 'Pupunha, cozida', kcal_per_100g: 218.533880876601, protein_per_100g: 2.52291666666667, carb_per_100g: 29.5694166666667 },
        { name: 'Noz, crua', kcal_per_100g: 620.060019790567, protein_per_100g: 13.9708005027771, carb_per_100g: 18.3638661638896 }
    ];

    // --- Exercícios Padrão (existente) ---
    const defaultExercises = [
        'Agachamento Livre', 'Supino Reto', 'Remada Curvada', 'Desenvolvimento Militar',
        'Levantamento Terra', 'Rosca Direta', 'Tríceps Testa', 'Leg Press', 'Cadeira Extensora',
        'Cadeira Flexora', 'Panturrilha em Pé', 'Abdominal Crunch', 'Prancha'
    ];

    /**
     * Verifica o status de login do usuário no localStorage.
     * Se estiver logado, mostra a aplicação; caso contrário, mostra a tela de login.
     */
    function checkLoginStatus() {
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn === 'true') {
            showWorkoutManagementScreen(); // Mostra a interface de gerenciamento de treinos por padrão
        } else {
            showLogin(); // Mostra a interface de login
        }
    }

    /**
     * Exibe a tela de login e oculta as outras telas.
     */
    function showLogin() {
        loginContainer.style.display = 'block';
        appContainer.style.display = 'none';
        trainingScreenContainer.style.display = 'none';
        dietScreenContainer.style.display = 'none'; // Oculta a tela de dieta
        loginError.textContent = '';
        usernameInput.value = '';
        passwordInput.value = '';
    }

    /**
     * Exibe a tela de gerenciamento de treinos e oculta as outras telas.
     */
    function showWorkoutManagementScreen() {
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block'; // Garante que o container geral da aplicação esteja visível
        workoutManagementScreen.style.display = 'flex'; // Exibe a tela de gerenciamento
        trainingScreenContainer.style.display = 'none';
        dietScreenContainer.style.display = 'none';

        showWorkoutsButton.classList.add('active');
        showDietButton.classList.remove('active');

        loadAllWorkouts();
        populatePredefinedExercises();
        renderWorkoutSelector();
        loadCurrentWorkoutExercises();
    }

    /**
     * Exibe a tela de treino e oculta as outras telas.
     * Prepara a tela de treino para o início.
     */
    function showTrainingScreen() {
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block'; // Garante que o container geral da aplicação esteja visível
        workoutManagementScreen.style.display = 'none';
        trainingScreenContainer.style.display = 'flex'; // Exibe a tela de treino
        dietScreenContainer.style.display = 'none';

        // Inicializa o treino
        currentTrainingWorkout = allWorkouts[currentWorkoutName] || [];
        trainingWorkoutNameDisplay.textContent = `Treino: ${currentWorkoutName}`;
        currentExerciseIndex = 0;
        currentSetIndex = 0;
        workoutFinishedMessage.style.display = 'none';

        displayCurrentExercise();
        renderAllExercisesInTrainingView();
    }

    /**
     * Exibe a tela de dieta e oculta as outras telas.
     */
    function showDietScreen() {
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block'; // Garante que o container geral da aplicação esteja visível
        workoutManagementScreen.style.display = 'none';
        trainingScreenContainer.style.display = 'none';
        dietScreenContainer.style.display = 'flex'; // Exibe a tela de dieta

        showWorkoutsButton.classList.remove('active');
        showDietButton.classList.add('active');

        loadAllDiets(); // Carrega todos os planos de dieta
        populatePredefinedFoods(); // Preenche o select de alimentos
        renderDietSelector(); // Renderiza o seletor de dietas
        loadCurrentDietItems(); // Carrega os itens da dieta atual
    }

    // Event listeners para os botões de navegação principal
    showWorkoutsButton.addEventListener('click', showWorkoutManagementScreen);
    showDietButton.addEventListener('click', showDietScreen);

    // Event listener para o botão de login
    loginButton.addEventListener('click', () => {
        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredUsername === CORRECT_USERNAME && enteredPassword === CORRECT_PASSWORD) {
            localStorage.setItem('loggedIn', 'true');
            showWorkoutManagementScreen();
        } else {
            loginError.textContent = 'Usuário ou senha incorretos.';
        }
    });

    // Event listener para o botão de logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        showLogin();
    });

    // --- Gerenciamento de Treinos (Variações) ---

    /**
     * Carrega todos os treinos do localStorage.
     * Se não houver treinos, inicializa com um 'Treino Padrão'.
     */
    function loadAllWorkouts() {
        allWorkouts = JSON.parse(localStorage.getItem('allWorkouts')) || {};
        if (Object.keys(allWorkouts).length === 0) {
            allWorkouts['Treino Padrão'] = [];
            saveAllWorkouts();
        }
        currentWorkoutName = localStorage.getItem('currentWorkoutName') || Object.keys(allWorkouts)[0];
        if (!allWorkouts[currentWorkoutName]) {
            currentWorkoutName = Object.keys(allWorkouts)[0];
            localStorage.setItem('currentWorkoutName', currentWorkoutName);
        }
    }

    /**
     * Salva todos os treinos no localStorage.
     */
    function saveAllWorkouts() {
        localStorage.setItem('allWorkouts', JSON.stringify(allWorkouts));
        localStorage.setItem('currentWorkoutName', currentWorkoutName);
    }

    /**
     * Preenche o dropdown de seleção de treinos.
     */
    function renderWorkoutSelector() {
        workoutSelector.innerHTML = '';
        for (const name in allWorkouts) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            workoutSelector.appendChild(option);
        }
        workoutSelector.value = currentWorkoutName;
    }

    /**
     * Carrega e exibe os exercícios do treino atualmente selecionado na tela de gerenciamento.
     */
    function loadCurrentWorkoutExercises() {
        const workoutsForCurrentPlan = allWorkouts[currentWorkoutName] || [];
        workoutList.innerHTML = '';
        workoutsForCurrentPlan.forEach(addExerciseToDOM);
    }

    // Event listener para mudar o treino selecionado
    workoutSelector.addEventListener('change', (event) => {
        currentWorkoutName = event.target.value;
        saveAllWorkouts();
        loadCurrentWorkoutExercises();
    });

    // Event listener para adicionar um novo treino
    addWorkoutButton.addEventListener('click', () => {
        const newName = prompt('Digite o nome do novo treino:');
        if (newName && newName.trim() !== '' && !allWorkouts[newName.trim()]) {
            allWorkouts[newName.trim()] = [];
            currentWorkoutName = newName.trim();
            saveAllWorkouts();
            renderWorkoutSelector();
            loadCurrentWorkoutExercises();
        } else if (newName && allWorkouts[newName.trim()]) {
            alert('Já existe um treino com este nome.');
        }
    });

    // Event listener para excluir o treino atual
    deleteWorkoutButton.addEventListener('click', () => {
        if (Object.keys(allWorkouts).length === 1) {
            alert('Você não pode excluir o último treino. Crie um novo antes de excluir este.');
            return;
        }
        if (confirm(`Tem certeza que deseja excluir o treino "${currentWorkoutName}"?`)) {
            delete allWorkouts[currentWorkoutName];
            currentWorkoutName = Object.keys(allWorkouts)[0];
            saveAllWorkouts();
            renderWorkoutSelector();
            loadCurrentWorkoutExercises();
        }
    });

    // Event listener para iniciar o treino selecionado
    startTrainingButton.addEventListener('click', () => {
        if (allWorkouts[currentWorkoutName] && allWorkouts[currentWorkoutName].length > 0) {
            showTrainingScreen();
        } else {
            alert('O treino selecionado não possui exercícios. Adicione exercícios antes de iniciar.');
        }
    });

    // --- Gerenciamento de Exercícios (na tela principal) ---

    /**
     * Preenche o dropdown de exercícios padrão.
     */
    function populatePredefinedExercises() {
        predefinedExercisesSelect.innerHTML = '<option value="">-- Selecione um Exercício --</option>';
        defaultExercises.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise;
            option.textContent = exercise;
            predefinedExercisesSelect.appendChild(option);
        });
    }

    // Event listener para preencher o campo de nome do exercício ao selecionar um padrão
    predefinedExercisesSelect.addEventListener('change', (event) => {
        exerciseNameInput.value = event.target.value;
    });

    /**
     * Função para validar o formato das repetições (número ou X-Y).
     * @param {string} repsString - A string de repetições a ser validada.
     * @returns {boolean} - True se o formato for válido, false caso contrário.
     */
    function isValidRepsFormat(repsString) {
        if (!repsString || repsString.trim() === '') {
            return false;
        }
        // Verifica se é um número único e positivo
        const singleNum = parseInt(repsString);
        if (!isNaN(singleNum) && singleNum > 0) {
            return true;
        }
        // Verifica se é um formato X-Y
        const rangeMatch = repsString.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
            const lowerBound = parseInt(rangeMatch[1]);
            const upperBound = parseInt(rangeMatch[2]);
            return lowerBound > 0 && upperBound > 0 && lowerBound <= upperBound;
        }
        return false;
    }

    /**
     * Adiciona um exercício ao DOM (interface do usuário na tela de gerenciamento).
     * Cria os elementos HTML para exibir o exercício e seus botões de ação.
     * @param {Object} exercise - O objeto de exercício a ser adicionado.
     */
    function addExerciseToDOM(exercise) {
        const li = document.createElement('li');
        li.dataset.id = exercise.id;

        const exerciseDetails = document.createElement('div');
        exerciseDetails.classList.add('exercise-details');

        // Exibe as repetições como string, seja número ou range
        const mainInfo = document.createElement('span');
        mainInfo.textContent = `${exercise.name} - ${exercise.sets} Séries - ${exercise.reps} Repetições`;
        exerciseDetails.appendChild(mainInfo);

        // Exibe a carga, mostrando "N/A" se estiver vazia
        const loadInfo = document.createElement('span');
        loadInfo.classList.add('load-info');
        loadInfo.textContent = `Carga: ${exercise.exerciseLoad || 'N/A'}`; // Exibe N/A se vazio
        exerciseDetails.appendChild(loadInfo);

        // Exibe o tempo de descanso, mostrando "N/A" se estiver vazio
        const restInfo = document.createElement('span');
        restInfo.classList.add('rest-time-info');
        restInfo.textContent = `Descanso: ${exercise.restTime || 'N/A'}`; // Exibe N/A se vazio
        exerciseDetails.appendChild(restInfo);

        // Exibe as observações, mostrando "N/A" se estiver vazio
        const obsInfo = document.createElement('p');
        obsInfo.classList.add('observation-info');
        obsInfo.textContent = `Obs: ${exercise.observation || 'N/A'}`; // Exibe N/A se vazio
        exerciseDetails.appendChild(obsInfo);

        li.appendChild(exerciseDetails);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('exercise-buttons');

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => editExercise(exercise.id));
        buttonsDiv.appendChild(editButton);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeExercise(exercise.id));
        buttonsDiv.appendChild(removeButton);

        li.appendChild(buttonsDiv);

        workoutList.appendChild(li);
    }

    // Event listener para o botão de adicionar exercício
    addExerciseButton.addEventListener('click', () => {
        const name = exerciseNameInput.value.trim();
        const sets = parseInt(setsInput.value);
        const reps = repsInput.value.trim();
        const exerciseLoad = exerciseLoadInput.value.trim(); // Captura a carga
        const restTime = restTimeInput.value.trim();
        const observation = observationInput.value.trim();

        if (name && !isNaN(sets) && sets > 0 && isValidRepsFormat(reps)) {
            if (!allWorkouts[currentWorkoutName]) {
                allWorkouts[currentWorkoutName] = [];
            }

            const newExercise = {
                id: Date.now(),
                name: name,
                sets: sets,
                reps: reps,
                exerciseLoad: exerciseLoad, // Salva a carga
                restTime: restTime,
                observation: observation
            };
            allWorkouts[currentWorkoutName].push(newExercise);
            saveAllWorkouts();
            addExerciseToDOM(newExercise);

            exerciseNameInput.value = '';
            setsInput.value = '';
            repsInput.value = '';
            exerciseLoadInput.value = ''; // Limpa o campo de carga
            restTimeInput.value = '';
            observationInput.value = '';
            predefinedExercisesSelect.value = '';
        } else {
            alert('Por favor, preencha o nome do exercício, séries e repetições corretamente (séries devem ser números maiores que zero; repetições podem ser um número ou um formato "X-Y", onde X e Y são números maiores que zero e X <= Y).');
        }
    });

    /**
     * Remove um exercício da lista e do localStorage.
     * @param {number} id - O ID único do exercício a ser removido.
     */
    function removeExercise(id) {
        if (!allWorkouts[currentWorkoutName]) return;

        allWorkouts[currentWorkoutName] = allWorkouts[currentWorkoutName].filter(exercise => exercise.id !== id);
        saveAllWorkouts();
        loadCurrentWorkoutExercises();
    }

    /**
     * Edita um exercício existente na lista e no localStorage.
     * @param {number} id - O ID único do exercício a ser editado.
     */
    function editExercise(id) {
        if (!allWorkouts[currentWorkoutName]) return;

        const exerciseToEdit = allWorkouts[currentWorkoutName].find(exercise => exercise.id === id);

        if (exerciseToEdit) {
            const newName = prompt('Novo nome do exercício:', exerciseToEdit.name);
            const newSets = parseInt(prompt('Novas séries:', exerciseToEdit.sets));
            const newReps = prompt('Novas repetições (ex: 6-8 ou 10):', exerciseToEdit.reps || '');
            const newExerciseLoad = prompt('Nova carga (ex: 10kg, 5lb):', exerciseToEdit.exerciseLoad || ''); // Edita a carga
            const newRestTime = prompt('Novo tempo de descanso (ex: 60s):', exerciseToEdit.restTime || '');
            const newObservation = prompt('Novas observações:', exerciseToEdit.observation || '');

            if (newName !== null && newSets !== null && newReps !== null && newName.trim() !== '' && !isNaN(newSets) && newSets > 0 && isValidRepsFormat(newReps)) {
                exerciseToEdit.name = newName.trim();
                exerciseToEdit.sets = newSets;
                exerciseToEdit.reps = newReps.trim();
                exerciseToEdit.exerciseLoad = newExerciseLoad.trim(); // Salva a carga editada
                exerciseToEdit.restTime = newRestTime.trim();
                exerciseToEdit.observation = newObservation.trim();
                saveAllWorkouts();
                loadCurrentWorkoutExercises();
            } else {
                alert('Edição cancelada ou dados inválidos. Por favor, preencha o nome do exercício, séries e repetições corretamente (séries devem ser números maiores que zero; repetições podem ser um número ou um formato "X-Y", onde X e Y são números maiores que zero e X <= Y).');
            }
        }
    }

    // --- Lógica da Tela de Treino ---

    /**
     * Exibe os detalhes do exercício atual na tela de treino.
     */
    function displayCurrentExercise() {
        clearInterval(restTimerInterval);
        restTimerDisplay.textContent = '';
        startRestButton.disabled = false;
        workoutFinishedMessage.style.display = 'none';

        if (currentTrainingWorkout.length === 0) {
            currentExerciseDisplay.innerHTML = 'Nenhum exercício neste treino.';
            setsRemainingDisplay.textContent = '';
            startRestButton.style.display = 'none';
            nextExerciseButton.style.display = 'none';
            previousExerciseButton.style.display = 'none';
            workoutFinishedMessage.style.display = 'block';
            finishWorkoutButton.textContent = 'Voltar para Gerenciamento';
            return;
        }

        if (currentExerciseIndex >= currentTrainingWorkout.length) {
            currentExerciseDisplay.innerHTML = 'Treino Finalizado!';
            setsRemainingDisplay.textContent = '';
            startRestButton.style.display = 'none';
            nextExerciseButton.style.display = 'none';
            previousExerciseButton.style.display = 'none';
            workoutFinishedMessage.style.display = 'block';
            finishWorkoutButton.textContent = 'Voltar para Gerenciamento';
            return;
        }

        const exercise = currentTrainingWorkout[currentExerciseIndex];
        const setsRemaining = exercise.sets - currentSetIndex;

        currentExerciseDisplay.innerHTML = `
            <h3>${exercise.name}</h3>
            <p>Séries: ${exercise.sets}</p>
            <p>Repetições: ${exercise.reps}</p>
            <p>Carga: ${exercise.exerciseLoad || 'N/A'}</p> <!-- Exibe a carga, mostrando N/A se vazio -->
            <p>Descanso: ${exercise.restTime || 'N/A'}</p>
            <p>Observações: ${exercise.observation || 'N/A'}</p>
        `;
        setsRemainingDisplay.textContent = `Séries restantes: ${setsRemaining}`;

        if (currentExerciseIndex > 0) {
            previousExerciseButton.style.display = 'block';
        } else {
            previousExerciseButton.style.display = 'none';
        }

        if (currentExerciseIndex < currentTrainingWorkout.length - 1) {
            nextExerciseButton.style.display = 'block';
        } else {
            nextExerciseButton.style.display = 'none';
        }

        if (setsRemaining <= 0) {
            startRestButton.style.display = 'none';
            setsRemainingDisplay.textContent = 'Todas as séries concluídas para este exercício.';
        } else {
            startRestButton.style.display = 'block';
        }

        updateOverviewHighlight();
    }

    /**
     * Renderiza a lista de todos os exercícios do treino atual na visão geral.
     */
    function renderAllExercisesInTrainingView() {
        allExercisesOverview.innerHTML = '<h4>Todos os Exercícios:</h4><ul id="overview-list"></ul>';
        const overviewList = document.getElementById('overview-list');
        currentTrainingWorkout.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${exercise.name}`;
            li.dataset.index = index;
            overviewList.appendChild(li);
        });
        updateOverviewHighlight();
    }

    /**
     * Atualiza o destaque do exercício atual na visão geral.
     */
    function updateOverviewHighlight() {
        const overviewItems = allExercisesOverview.querySelectorAll('#overview-list li');
        overviewItems.forEach((item, index) => {
            if (index === currentExerciseIndex) {
                item.classList.add('current-exercise-highlight');
            } else {
                item.classList.remove('current-exercise-highlight');
            }
        });
    }

    // Event listener para o botão "Iniciar Descanso"
    startRestButton.addEventListener('click', () => {
        const exercise = currentTrainingWorkout[currentExerciseIndex];
        let restSeconds = parseInt(exercise.restTime) || 0;

        if (restSeconds <= 0) {
            alert('Tempo de descanso não definido ou inválido para este exercício. Prossiga para a próxima série.');
            currentSetIndex++;
            handleSetCompletion();
            return;
        }

        startRestButton.disabled = true;
        restTimerDisplay.textContent = `Descanso: ${restSeconds}s`;

        restTimerInterval = setInterval(() => {
            restSeconds--;
            restTimerDisplay.textContent = `Descanso: ${restSeconds}s`;

            if (restSeconds <= 0) {
                clearInterval(restTimerInterval);
                restTimerDisplay.textContent = 'Descanso finalizado!';
                startRestButton.disabled = false;
                currentSetIndex++;
                handleSetCompletion();
            }
        }, 1000);
    });

    /**
     * Lida com a conclusão de uma série: verifica se todas as séries do exercício foram feitas
     * e avança para o próximo exercício se necessário.
     */
    function handleSetCompletion() {
        const exercise = currentTrainingWorkout[currentExerciseIndex];
        const setsRemaining = exercise.sets - currentSetIndex;

        setsRemainingDisplay.textContent = `Séries restantes: ${setsRemaining}`;

        if (setsRemaining <= 0) {
            startRestButton.style.display = 'none';
            restTimerDisplay.textContent = 'Todas as séries concluídas para este exercício.';
            setsRemainingDisplay.textContent = '';
        }
    }

    // Event listener para o botão "Próximo Exercício"
    nextExerciseButton.addEventListener('click', () => {
        if (currentExerciseIndex < currentTrainingWorkout.length - 1) {
            currentExerciseIndex++;
            currentSetIndex = 0;
            displayCurrentExercise();
        }
    });

    // Event listener para o botão "Exercício Anterior"
    previousExerciseButton.addEventListener('click', () => {
        if (currentExerciseIndex > 0) {
            currentExerciseIndex--;
            currentSetIndex = 0;
            displayCurrentExercise();
        }
    });

    // Event listener para o botão "Finalizar Treino" (ou voltar para gerenciamento)
    finishWorkoutButton.addEventListener('click', () => {
        clearInterval(restTimerInterval);
        showWorkoutManagementScreen();
    });

    // --- Gerenciamento de Dieta ---

    /**
     * Carrega todos os planos de dieta do localStorage.
     * Se não houver planos, inicializa com uma 'Dieta Padrão'.
     */
    function loadAllDiets() {
        allDiets = JSON.parse(localStorage.getItem('allDiets')) || {};
        if (Object.keys(allDiets).length === 0) {
            allDiets['Dieta Padrão'] = [];
            saveAllDiets();
        }
        currentDietName = localStorage.getItem('currentDietNameDiet') || Object.keys(allDiets)[0];
        if (!allDiets[currentDietName]) { // Se a dieta salva não existir mais
            currentDietName = Object.keys(allDiets)[0];
            localStorage.setItem('currentDietNameDiet', currentDietName);
        }
    }

    /**
     * Salva todos os planos de dieta no localStorage.
     */
    function saveAllDiets() {
        localStorage.setItem('allDiets', JSON.stringify(allDiets));
        localStorage.setItem('currentDietNameDiet', currentDietName);
    }

    /**
     * Preenche o dropdown de seleção de dietas.
     */
    function renderDietSelector() {
        dietSelector.innerHTML = '';
        for (const name in allDiets) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dietSelector.appendChild(option);
        }
        dietSelector.value = currentDietName;
    }

    /**
     * Carrega e exibe os itens da dieta atualmente selecionada.
     */
    function loadCurrentDietItems() {
        const dietPlan = allDiets[currentDietName] || [];
        dietMealsContainer.innerHTML = ''; // Limpa o container antes de recarregar

        // Agrupa os itens por nome da refeição e depois por horário
        const mealsGrouped = {};
        dietPlan.forEach(item => {
            // Usa o nome da refeição e o horário para criar uma chave única para o agrupamento
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

        // Converte o objeto agrupado em um array e ordena por horário
        const sortedMeals = Object.values(mealsGrouped).sort((a, b) => {
            // Ordena primeiro por horário (se ambos tiverem), depois por nome da refeição
            if (a.mealTime && b.mealTime) {
                return a.mealTime.localeCompare(b.mealTime);
            }
            // Coloca itens sem horário no final
            if (!a.mealTime && b.mealTime) return 1;
            if (a.mealTime && !b.mealTime) return -1;
            return a.mealName.localeCompare(b.mealName); // Ordena por nome se horários forem iguais ou ausentes
        });

        sortedMeals.forEach(mealGroup => {
            addMealSectionToDOM(mealGroup.mealName, mealGroup.mealTime, mealGroup.items);
        });

        // Calcula e exibe os totais gerais
        calculateAndDisplayOverallDietTotals();
    }

    /**
     * Adiciona uma seção de refeição ao DOM e seus itens.
     * @param {string} mealName - O nome da refeição.
     * @param {string} mealTime - O horário da refeição.
     * @param {Array<Object>} items - Os itens de alimento para esta refeição.
     */
    function addMealSectionToDOM(mealName, mealTime, items) {
        const mealSectionDiv = document.createElement('div');
        mealSectionDiv.classList.add('meal-section');
        mealSectionDiv.dataset.mealName = mealName;
        mealSectionDiv.dataset.mealTime = mealTime;

        const mealHeader = document.createElement('h3');
        // Exibe o horário da refeição, mostrando "Horário não definido" se estiver vazio
        mealHeader.textContent = `${mealName} ${mealTime ? `(${mealTime})` : '(Horário não definido)'}`;

        const mealButtonsDiv = document.createElement('div');
        mealButtonsDiv.classList.add('meal-buttons');

        const editMealButton = document.createElement('button');
        editMealButton.textContent = 'Editar Refeição';
        editMealButton.classList.add('edit-button');
        editMealButton.addEventListener('click', () => editMeal(mealName, mealTime)); // Passa o horário também
        mealButtonsDiv.appendChild(editMealButton);

        const deleteMealButton = document.createElement('button');
        deleteMealButton.textContent = 'Excluir Refeição';
        deleteMealButton.classList.add('remove-button');
        deleteMealButton.addEventListener('click', () => deleteMeal(mealName, mealTime)); // Passa o horário também
        mealButtonsDiv.appendChild(deleteMealButton);

        mealHeader.appendChild(mealButtonsDiv);
        mealSectionDiv.appendChild(mealHeader);

        const mealItemsList = document.createElement('ul');
        mealItemsList.classList.add('meal-items-list');
        mealSectionDiv.appendChild(mealItemsList);

        let mealKcal = 0;
        let mealProtein = 0;
        let mealCarb = 0;

        items.forEach(item => {
            const li = document.createElement('li');
            li.dataset.id = item.id;

            const itemDetails = document.createElement('div');
            itemDetails.classList.add('meal-item-details');
            itemDetails.innerHTML = `
                <strong>${item.foodName}</strong> (${item.quantity}g)<br>
                <span>Kcal: ${item.calculatedKcal || '0'} | Prot: ${item.calculatedProtein || '0'}g | Carb: ${item.calculatedCarb || '0'}g</span>
                <span>Obs: ${item.observation || 'N/A'}</span>
            `;
            li.appendChild(itemDetails);

            const itemButtons = document.createElement('div');
            itemButtons.classList.add('diet-item-buttons');

            const editItemButton = document.createElement('button');
            editItemButton.textContent = 'Editar';
            editItemButton.classList.add('edit-button');
            editItemButton.addEventListener('click', () => editDietItem(mealName, mealTime, item.id)); // Passa o horário
            itemButtons.appendChild(editItemButton);

            const removeItemButton = document.createElement('button');
            removeItemButton.textContent = 'Remover';
            removeItemButton.classList.add('remove-button');
            removeItemButton.addEventListener('click', () => removeDietItem(mealName, mealTime, item.id)); // Passa o horário
            itemButtons.appendChild(removeItemButton);

            li.appendChild(itemButtons);
            mealItemsList.appendChild(li);

            mealKcal += parseFloat(item.calculatedKcal);
            mealProtein += parseFloat(item.calculatedProtein);
            mealCarb += parseFloat(item.calculatedCarb);
        });

        const mealSummaryDiv = document.createElement('div');
        mealSummaryDiv.classList.add('meal-summary');
        mealSummaryDiv.innerHTML = `
            <p>Total da Refeição: ${mealKcal.toFixed(1)} kcal | ${mealProtein.toFixed(1)}g Prot | ${mealCarb.toFixed(1)}g Carb</p>
        `;
        mealSectionDiv.appendChild(mealSummaryDiv);

        dietMealsContainer.appendChild(mealSectionDiv);
    }

    /**
     * Preenche o dropdown de alimentos padrão.
     */
    function populatePredefinedFoods() {
        predefinedFoodsSelect.innerHTML = '<option value="">-- Selecione um Alimento --</option>';
        predefinedFoodsData.forEach(food => {
            const option = document.createElement('option');
            option.value = food.name;
            option.textContent = food.name;
            predefinedFoodsSelect.appendChild(option);
        });
    }

    // Event listener para preencher o campo de nome do alimento ao selecionar um padrão
    predefinedFoodsSelect.addEventListener('change', (event) => {
        foodItemNameInput.value = event.target.value;
    });

    /**
     * Calcula as calorias, proteínas e carboidratos para um dado alimento e quantidade.
     * @param {string} foodName - O nome do alimento.
     * @param {number} quantityGrams - A quantidade do alimento em gramas.
     * @returns {Object} - Um objeto com kcal, protein e carb calculados.
     */
    function calculateMacros(foodName, quantityGrams) {
        const food = predefinedFoodsData.find(f => f.name === foodName);
        if (!food) {
            return { kcal: 0, protein: 0, carb: 0 };
        }
        const factor = quantityGrams / 100; // Valores são baseados em 100g
        return {
            kcal: (food.kcal_per_100g * factor).toFixed(1),
            protein: (food.protein_per_100g * factor).toFixed(1),
            carb: (food.carb_per_100g * factor).toFixed(1)
        };
    }

    // Event listener para adicionar um novo item à dieta
    addDietItemButton.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();
        const mealTime = mealTimeInput.value; // Captura o horário
        const foodName = foodItemNameInput.value.trim();
        const quantity = parseInt(foodQuantityInput.value);
        const observation = dietItemObservationInput.value.trim();

        if (mealName && foodName && !isNaN(quantity) && quantity > 0) {
            const macros = calculateMacros(foodName, quantity);

            if (!allDiets[currentDietName]) {
                allDiets[currentDietName] = [];
            }

            const newDietItem = {
                id: Date.now(),
                mealName: mealName,
                mealTime: mealTime, // Salva o horário
                foodName: foodName,
                quantity: quantity,
                calculatedKcal: macros.kcal,
                calculatedProtein: macros.protein,
                calculatedCarb: macros.carb,
                observation: observation
            };

            allDiets[currentDietName].push(newDietItem);
            saveAllDiets();
            loadCurrentDietItems(); // Recarrega a lista para mostrar o novo item e totais

            // Limpa os campos (mantém o nome da refeição e horário para adicionar mais itens à mesma refeição)
            // mealNameInput.value = '';
            // mealTimeInput.value = '';
            foodItemNameInput.value = '';
            foodQuantityInput.value = '';
            dietItemObservationInput.value = '';
            predefinedFoodsSelect.value = '';
        } else {
            alert('Por favor, preencha o nome da refeição, alimento e quantidade (em gramas) corretamente.');
        }
    });

    /**
     * Remove um item da dieta de uma refeição específica.
     * @param {string} mealName - O nome da refeição.
     * @param {string} mealTime - O horário da refeição.
     * @param {number} itemId - O ID do item a ser removido.
     */
    function removeDietItem(mealName, mealTime, itemId) {
        if (!allDiets[currentDietName]) return;

        allDiets[currentDietName] = allDiets[currentDietName].filter(item => !(item.mealName === mealName && item.mealTime === mealTime && item.id === itemId));
        saveAllDiets();
        loadCurrentDietItems();
    }

    /**
     * Edita um item da dieta de uma refeição específica.
     * @param {string} oldMealName - O nome original da refeição.
     * @param {string} oldMealTime - O horário original da refeição.
     * @param {number} itemId - O ID do item a ser editado.
     */
    function editDietItem(oldMealName, oldMealTime, itemId) {
        if (!allDiets[currentDietName]) return;

        const itemToEdit = allDiets[currentDietName].find(item => item.mealName === oldMealName && item.mealTime === oldMealTime && item.id === itemId);

        if (itemToEdit) {
            const newFoodName = prompt('Novo nome do alimento:', itemToEdit.foodName);
            const newQuantity = parseInt(prompt('Nova quantidade (gramas):', itemToEdit.quantity));
            const newObservation = prompt('Novas observações:', itemToEdit.observation || '');
            const newMealName = prompt('Novo nome da refeição:', itemToEdit.mealName); // Permite mudar a refeição
            const newMealTime = prompt('Novo horário da refeição (HH:MM):', itemToEdit.mealTime || ''); // Permite mudar o horário

            if (newFoodName !== null && !isNaN(newQuantity) && newQuantity > 0 && newMealName !== null) {
                const macros = calculateMacros(newFoodName.trim(), newQuantity);
                itemToEdit.foodName = newFoodName.trim();
                itemToEdit.quantity = newQuantity;
                itemToEdit.calculatedKcal = macros.kcal;
                itemToEdit.calculatedProtein = macros.protein;
                itemToEdit.calculatedCarb = macros.carb;
                itemToEdit.observation = newObservation.trim();
                itemToEdit.mealName = newMealName.trim(); // Atualiza o nome da refeição
                itemToEdit.mealTime = newMealTime.trim(); // Atualiza o horário da refeição
                saveAllDiets();
                loadCurrentDietItems();
            } else {
                alert('Edição cancelada ou dados inválidos. Por favor, preencha o nome do alimento, a quantidade (em gramas) e o nome da refeição corretamente.');
            }
        }
    }

    /**
     * Exclui uma seção de refeição inteira.
     * @param {string} mealName - O nome da refeição a ser excluída.
     * @param {string} mealTime - O horário da refeição a ser excluída.
     */
    function deleteMeal(mealName, mealTime) {
        if (confirm(`Tem certeza que deseja excluir a refeição "${mealName} (${mealTime})" e todos os seus itens?`)) {
            if (!allDiets[currentDietName]) return;

            // Filtra removendo todos os itens que correspondem ao nome e horário da refeição
            allDiets[currentDietName] = allDiets[currentDietName].filter(item => !(item.mealName === mealName && item.mealTime === mealTime));
            saveAllDiets();
            loadCurrentDietItems();
        }
    }


    /**
     * Calcula e exibe os totais de macros para a dieta completa.
     */
    function calculateAndDisplayOverallDietTotals() {
        let totalKcal = 0;
        let totalProtein = 0;
        let totalCarb = 0;

        const dietPlan = allDiets[currentDietName] || [];
        dietPlan.forEach(item => {
            totalKcal += parseFloat(item.calculatedKcal);
            totalProtein += parseFloat(item.calculatedProtein);
            totalCarb += parseFloat(item.calculatedCarb);
        });

        totalKcalDisplay.textContent = totalKcal.toFixed(1);
        totalProteinDisplay.textContent = totalProtein.toFixed(1);
        totalCarbDisplay.textContent = totalCarb.toFixed(1);
    }

    // Event listener para mudar a dieta selecionada
    dietSelector.addEventListener('change', (event) => {
        currentDietName = event.target.value;
        saveAllDiets();
        loadCurrentDietItems();
    });

    // Event listener para adicionar uma nova dieta
    addDietButton.addEventListener('click', () => {
        const newName = prompt('Digite o nome da nova dieta:');
        if (newName && newName.trim() !== '' && !allDiets[newName.trim()]) {
            allDiets[newName.trim()] = [];
            currentDietName = newName.trim();
            saveAllDiets();
            renderDietSelector();
            loadCurrentDietItems();
        } else if (newName && allDiets[newName.trim()]) {
            alert('Já existe uma dieta com este nome.');
        }
    });

    // Event listener para excluir a dieta atual
    deleteDietButton.addEventListener('click', () => {
        if (Object.keys(allDiets).length === 1) {
            alert('Você não pode excluir a última dieta. Crie uma nova antes de excluir esta.');
            return;
        }
        if (confirm(`Tem certeza que deseja excluir a dieta "${currentDietName}"?`)) {
            delete allDiets[currentDietName];
            currentDietName = Object.keys(allDiets)[0];
            saveAllDiets();
            renderDietSelector();
            loadCurrentDietItems();
        }
    });


    // Inicializa a aplicação verificando o status de login ao carregar a página
    checkLoginStatus();
});
