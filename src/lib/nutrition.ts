export type Food = {
  name: string;
  amount: string;
  p: number;
  c: number;
  f: number;
};

export type Meal = {
  id: string;
  name: string;
  when: string;
  foods: Food[];
};

export type Menu = {
  id: string;
  title: string;
  blurb: string;
  meals: Meal[];
};

export function foodKcal(food: Food) {
  return food.p * 4 + food.c * 4 + food.f * 9;
}

export function sumFoods(foods: Food[]) {
  return foods.reduce(
    (total, food) => ({
      kcal: total.kcal + foodKcal(food),
      p: total.p + food.p,
      c: total.c + food.c,
      f: total.f + food.f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );
}

export function menuTotals(menu: Menu) {
  return sumFoods(menu.meals.flatMap((meal) => meal.foods));
}

export const TRAINING_MENU: Menu = {
  id: "treino",
  title: "Dia de treino",
  blurb:
    "Proteína em toda refeição e carboidrato perto do treino. É o prato de segunda, terça, quinta e sexta.",
  meals: [
    {
      id: "cafe",
      name: "Café",
      when: "Ao acordar",
      foods: [
        { name: "Ovos", amount: "2 unidades", p: 13, c: 1, f: 10 },
        { name: "Aveia em flocos", amount: "40 g", p: 5, c: 26, f: 3 },
        { name: "Mamão", amount: "150 g", p: 1, c: 15, f: 0 },
      ],
    },
    {
      id: "manha",
      name: "Lanche da manhã",
      when: "Meio da manhã",
      foods: [
        {
          name: "Iogurte grego natural, sem açúcar",
          amount: "170 g",
          p: 15,
          c: 7,
          f: 8,
        },
        { name: "Chia", amount: "10 g", p: 2, c: 4, f: 3 },
      ],
    },
    {
      id: "almoco",
      name: "Almoço",
      when: "Prato principal",
      foods: [
        { name: "Peito de frango grelhado", amount: "150 g", p: 46, c: 0, f: 5 },
        { name: "Arroz cozido", amount: "4 colheres (100 g)", p: 3, c: 28, f: 0 },
        { name: "Feijão cozido", amount: "1 concha (80 g)", p: 5, c: 13, f: 1 },
        { name: "Salada crua", amount: "à vontade", p: 1, c: 5, f: 0 },
        { name: "Brócolis", amount: "100 g", p: 3, c: 7, f: 0 },
        { name: "Azeite", amount: "1 colher de chá", p: 0, c: 0, f: 5 },
      ],
    },
    {
      id: "pre",
      name: "Antes do treino",
      when: "1h a 1h30 antes",
      foods: [
        { name: "Goma de tapioca", amount: "30 g", p: 0, c: 27, f: 0 },
        { name: "Frango desfiado", amount: "80 g", p: 25, c: 0, f: 3 },
        { name: "Banana", amount: "1 média", p: 1, c: 21, f: 0 },
        { name: "Castanha de caju", amount: "15 g", p: 3, c: 5, f: 7 },
      ],
    },
    {
      id: "jantar",
      name: "Jantar",
      when: "Depois do treino",
      foods: [
        { name: "Tilápia grelhada", amount: "140 g", p: 29, c: 0, f: 2 },
        { name: "Batata-doce cozida", amount: "150 g", p: 2, c: 30, f: 0 },
        { name: "Salada e legumes", amount: "1 prato", p: 2, c: 8, f: 0 },
        { name: "Azeite", amount: "1 colher de chá", p: 0, c: 0, f: 5 },
      ],
    },
  ],
};

export const REST_MENU: Menu = {
  id: "descanso",
  title: "Dia de descanso",
  blurb:
    "A proteína continua. O carboidrato desce um pouco porque não tem treino. Quarta, sábado à noite e domingo.",
  meals: [
    {
      id: "cafe",
      name: "Café",
      when: "Ao acordar",
      foods: [
        { name: "Ovos", amount: "2 unidades", p: 13, c: 1, f: 10 },
        { name: "Aveia em flocos", amount: "30 g", p: 4, c: 20, f: 2 },
        { name: "Mamão", amount: "150 g", p: 1, c: 15, f: 0 },
      ],
    },
    {
      id: "manha",
      name: "Lanche da manhã",
      when: "Meio da manhã",
      foods: [
        {
          name: "Iogurte grego natural, sem açúcar",
          amount: "170 g",
          p: 15,
          c: 7,
          f: 8,
        },
        { name: "Chia", amount: "10 g", p: 2, c: 4, f: 3 },
      ],
    },
    {
      id: "almoco",
      name: "Almoço",
      when: "Prato principal",
      foods: [
        { name: "Peito de frango grelhado", amount: "150 g", p: 46, c: 0, f: 5 },
        { name: "Arroz cozido", amount: "3 colheres (70 g)", p: 2, c: 20, f: 0 },
        { name: "Feijão cozido", amount: "1 concha (80 g)", p: 5, c: 13, f: 1 },
        { name: "Salada crua", amount: "à vontade", p: 1, c: 5, f: 0 },
        { name: "Brócolis", amount: "100 g", p: 3, c: 7, f: 0 },
        { name: "Azeite", amount: "1 colher de chá", p: 0, c: 0, f: 5 },
      ],
    },
    {
      id: "tarde",
      name: "Lanche da tarde",
      when: "Fome do meio da tarde",
      foods: [
        {
          name: "Iogurte grego natural, sem açúcar",
          amount: "170 g",
          p: 15,
          c: 7,
          f: 8,
        },
        { name: "Castanha de caju", amount: "15 g", p: 3, c: 5, f: 7 },
        { name: "Maçã", amount: "1 unidade", p: 0, c: 14, f: 0 },
      ],
    },
    {
      id: "jantar",
      name: "Jantar",
      when: "Noite",
      foods: [
        { name: "Omelete", amount: "2 ovos", p: 13, c: 1, f: 10 },
        { name: "Legumes refogados", amount: "1 xícara", p: 2, c: 8, f: 3 },
        { name: "Batata-doce cozida", amount: "100 g", p: 1, c: 20, f: 0 },
        { name: "Salada", amount: "à vontade", p: 1, c: 5, f: 0 },
      ],
    },
  ],
};

export const MENUS = [TRAINING_MENU, REST_MENU];

export function plateAdjustment(targetKcal: number | null, menuKcal: number) {
  if (targetKcal == null) {
    return {
      title: "Base até entrar a altura",
      text: "Este cardápio é o ponto de partida. Quando a altura estiver em Peso, o Melk diz se aumenta o arroz ou se segura o azeite.",
    };
  }
  const diff = targetKcal - menuKcal;
  if (diff > 180) {
    return {
      title: `Cabe mais uns ${Math.round(diff / 10) * 10} kcal`,
      text: "Aumenta arroz, batata-doce, fruta ou aveia. Não aumenta só o azeite. A proteína deste prato já cobre o dia.",
    };
  }
  if (diff < -180) {
    return {
      title: `Passa uns ${Math.round(Math.abs(diff) / 10) * 10} kcal do alvo`,
      text: "Tira a castanha e diminui o arroz ou a batata. Deixa frango, ovo, iogurte e peixe. Sem isso, o peito e o glúteo somem primeiro.",
    };
  }
  return {
    title: "Perto do seu alvo",
    text: "Pode repetir este prato. Se a fome apertar à noite, adiciona iogurte natural, não biscoito.",
  };
}

export const SWAPS = [
  {
    title: "Frango",
    text: "Patinho ou coxão mole grelhado, lata de atum em água ou dois ovos a mais. A quantidade de proteína fica parecida.",
  },
  {
    title: "Arroz",
    text: "Batata, mandioca, macarrão ou cuscuz, na mesma mão fechada de comida. Não troca por suco.",
  },
  {
    title: "Iogurte grego",
    text: "Iogurte natural com mais um ovo ou um scoop de whey, se você já usa. Whey não é obrigatório.",
  },
  {
    title: "Tilápia",
    text: "Qualquer peixe branco, frango ou uma omelete caprichada.",
  },
];

export const SHOPPING = [
  {
    group: "Proteína",
    items: [
      "Peito de frango, cerca de 1,6 kg",
      "Tilápia ou outro peixe branco, 500 g",
      "Ovos, 20 unidades",
      "Iogurte grego natural sem açúcar, cerca de 1,2 kg",
    ],
  },
  {
    group: "Carboidrato",
    items: [
      "Aveia, 400 g",
      "Arroz, 1 kg",
      "Feijão, 500 g",
      "Batata-doce, 1 kg",
      "Goma de tapioca, 200 g",
      "Banana, mamão e maçã",
    ],
  },
  {
    group: "Junto",
    items: [
      "Folhas, tomate, pepino e brócolis",
      "Azeite",
      "Chia",
      "Castanha de caju, 150 g",
      "Café e canela",
      "Creatina, se for usar: 5 g por dia",
    ],
  },
];

export const RULES = [
  {
    title: "Proteína em toda refeição",
    text: "Ovo, iogurte, frango, carne ou peixe. É o que segura peito, glúteo e coxa enquanto a barriga define.",
  },
  {
    title: "Carboidrato no dia de perna",
    text: "Arroz, batata, tapioca e fruta. Cortar carbo deixa o treino fraco e o bumbum não cresce.",
  },
  {
    title: "Barriga não chapa de abdominal",
    text: "Chapa com o déficit leve, quando ele existe, com fibra, sono e menos inchaço. O core só firma.",
  },
  {
    title: "Salada grande, azeite medido",
    text: "Folhas e legumes à vontade. O azeite é uma colher de chá, não um fio livre.",
  },
  {
    title: "Água no dia inteiro",
    text: "Perto de 35 ml por quilo. Em 68 kg, são uns 2,4 litros. Refrigerante e suco de caixinha ficam de fora na maior parte da semana.",
  },
  {
    title: "Álcool atrapalha os dois lados",
    text: "Piora o sono, a fome do dia seguinte e a recuperação do glúteo. Se sair, janta proteína e salada e não passa fome no outro dia para compensar.",
  },
  {
    title: "Creatina é opcional e simples",
    text: "5 g todo dia, inclusive domingo, com uma refeição. A balança pode subir de 0,5 a 1,5 kg de água dentro do músculo. Não é gordura e a cintura não cresce por causa disso.",
  },
];

export const MORNING_TRAINING =
  "Se treinar de manhã, inverte: banana e tapioca antes de sair, ovos e aveia quando voltar. O jantar continua valendo.";
