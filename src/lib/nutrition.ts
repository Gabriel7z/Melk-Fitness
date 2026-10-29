export type Food = {
  name: string;
  amount: string;
  p: number;
  c: number;
  f: number;
  /** Nome na lista de compras, quando o prato usa o mesmo alimento de jeitos diferentes. */
  shop?: string;
  aisle?: "Proteína" | "Carboidrato" | "Junto";
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
      text: "Diminui o arroz ou a batata. Deixa frango, ovo, iogurte e carne. Sem isso, o peito e o glúteo somem primeiro.",
    };
  }
  return {
    title: "Perto do seu alvo",
    text: "Pode seguir este prato. Se a fome apertar à noite, adiciona iogurte natural, não biscoito.",
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
    title: "Patinho",
    text: "Coxão mole, acém magro ou frango. Grelhado ou na panela, sem fritura.",
  },
];

export const RULES = [
  {
    title: "Proteína em toda refeição",
    text: "Ovo, iogurte, frango ou carne. É o que segura peito, glúteo e coxa enquanto a barriga define.",
  },
  {
    title: "Carboidrato no dia de perna",
    text: "Arroz, batata, tapioca e fruta. Cortar carbo deixa o treino fraco e o bumbum não cresce.",
  },
  {
    title: "O cardápio troca em 15 dias",
    text: "Cada quinzena tem pratos diferentes. No dia 16 entra o outro ciclo, e depois volta o primeiro.",
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
