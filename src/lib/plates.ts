import type { Food, Meal, Menu } from "@/lib/nutrition";

export type PlateKind = "treino" | "leve";

export type DayPlate = Menu & {
  kind: PlateKind;
};

type Aisle = NonNullable<Food["aisle"]>;

function food(
  name: string,
  amount: string,
  p: number,
  c: number,
  fat: number,
  shop: string,
  aisle: Aisle,
): Food {
  return { name, amount, p, c, f: fat, shop, aisle };
}

function meal(id: string, name: string, when: string, foods: Food[]): Meal {
  return { id, name, when, foods };
}

function plate(
  id: string,
  kind: PlateKind,
  title: string,
  blurb: string,
  meals: Meal[],
): DayPlate {
  return { id, kind, title, blurb, meals };
}

const ovos2 = food("Ovos", "2 unidades", 13, 1, 10, "Ovos", "Proteína");
const ovo1 = food("Ovo", "1 unidade", 6, 0, 5, "Ovos", "Proteína");
const aveia40 = food("Aveia em flocos", "40 g", 5, 26, 3, "Aveia", "Carboidrato");
const aveia30 = food("Aveia em flocos", "30 g", 4, 20, 2, "Aveia", "Carboidrato");
const mamao = food("Mamão", "150 g", 1, 15, 0, "Mamão", "Carboidrato");
const iogurte = food(
  "Iogurte grego natural, sem açúcar",
  "170 g",
  15,
  7,
  8,
  "Iogurte grego natural",
  "Proteína",
);
const chia = food("Chia", "10 g", 2, 4, 3, "Chia", "Junto");
const frango150 = food("Peito de frango grelhado", "150 g", 46, 0, 5, "Peito de frango", "Proteína");
const frango120 = food("Peito de frango grelhado", "120 g", 37, 0, 4, "Peito de frango", "Proteína");
const frango80 = food("Frango desfiado", "80 g", 25, 0, 3, "Peito de frango", "Proteína");
const arroz130 = food("Arroz cozido", "5 colheres (130 g)", 4, 36, 0, "Arroz", "Carboidrato");
const arroz100 = food("Arroz cozido", "4 colheres (100 g)", 3, 28, 0, "Arroz", "Carboidrato");
const arroz70 = food("Arroz cozido", "3 colheres (70 g)", 2, 20, 0, "Arroz", "Carboidrato");
const feijao = food("Feijão cozido", "1 concha (80 g)", 5, 13, 1, "Feijão", "Carboidrato");
const salada = food("Salada crua", "à vontade", 1, 5, 0, "Folhas e legumes", "Junto");
const brocolis = food("Brócolis", "100 g", 3, 7, 0, "Folhas e legumes", "Junto");
const azeite = food("Azeite", "1 colher de chá", 0, 0, 5, "Azeite", "Junto");
const tapioca = food("Goma de tapioca", "30 g", 0, 27, 0, "Goma de tapioca", "Carboidrato");
const banana = food("Banana", "1 média", 1, 21, 0, "Banana", "Carboidrato");
const batata150 = food("Batata-doce cozida", "150 g", 2, 30, 0, "Batata-doce", "Carboidrato");
const batata100 = food("Batata-doce cozida", "100 g", 1, 20, 0, "Batata-doce", "Carboidrato");
const maca = food("Maçã", "1 unidade", 0, 14, 0, "Maçã", "Carboidrato");
const pao2 = food("Pão integral", "2 fatias", 8, 24, 2, "Pão integral", "Carboidrato");
const pao1 = food("Pão integral", "1 fatia", 4, 12, 1, "Pão integral", "Carboidrato");
const patinho160 = food("Patinho grelhado", "160 g", 44, 0, 8, "Patinho", "Proteína");
const patinho130 = food("Patinho grelhado", "130 g", 36, 0, 6, "Patinho", "Proteína");
const macarrao180 = food("Macarrão cozido", "180 g", 9, 50, 1, "Macarrão", "Carboidrato");
const cuscuz = food("Cuscuz de milho", "40 g", 1, 30, 1, "Cuscuz de milho", "Carboidrato");
const mandioca = food("Mandioca cozida", "120 g", 1, 36, 0, "Mandioca", "Carboidrato");
const batataIng = food("Batata cozida", "150 g", 3, 26, 0, "Batata", "Carboidrato");
const atum = food("Atum em água, escorrido", "1 lata (120 g)", 28, 0, 2, "Atum em água", "Proteína");
const carne = food("Carne moída magra", "120 g cozida", 32, 0, 8, "Carne moída magra", "Proteína");
const abobrinha = food("Abobrinha", "100 g", 1, 3, 0, "Folhas e legumes", "Junto");
const legumes = food("Legumes refogados", "1 xícara", 2, 8, 3, "Folhas e legumes", "Junto");
const castanha = food("Castanha de caju", "15 g", 3, 5, 7, "Castanha de caju", "Junto");

function dayMeals(id: string, rows: [string, string, Food[]][]): Meal[] {
  return rows.map(([name, when, foods], index) =>
    meal(`${id}-${index}`, name, when, foods),
  );
}

export type FoodCycle = {
  id: string;
  name: string;
  training: DayPlate[];
  rest: DayPlate[];
};

const treinoBlurb =
  "Proteína em toda refeição e carboidrato perto do treino. Segunda, terça, quinta e sexta.";
const leveBlurb =
  "A proteína continua. O carboidrato desce porque não é dia de perna. Quarta, sábado e domingo.";

export const CYCLES: FoodCycle[] = [
  {
    id: "a",
    name: "Frango, patinho e arroz",
    training: [
      plate("a-t1", "treino", "Frango, arroz e tapioca", treinoBlurb, dayMeals("a-t1", [
        ["Café", "Ao acordar", [ovos2, aveia40, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, arroz130, feijao, salada, brocolis, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [tapioca, frango80, banana, pao1]],
        ["Jantar", "Depois do treino", [frango120, batata150, salada, azeite]],
      ])),
      plate("a-t2", "treino", "Patinho e macarrão", treinoBlurb, dayMeals("a-t2", [
        ["Café", "Ao acordar", [ovos2, pao2, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, aveia30]],
        ["Almoço", "Prato principal", [patinho160, macarrao180, salada, abobrinha, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [banana, pao1, ovo1]],
        ["Jantar", "Depois do treino", [frango150, arroz100, brocolis, azeite]],
      ])),
      plate("a-t3", "treino", "Frango, cuscuz e batata", treinoBlurb, dayMeals("a-t3", [
        ["Café", "Ao acordar", [ovos2, cuscuz, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, arroz130, feijao, salada, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [tapioca, frango80, banana]],
        ["Jantar", "Depois do treino", [patinho160, batata150, brocolis, azeite]],
      ])),
      plate("a-t4", "treino", "Atum, arroz e pão", treinoBlurb, dayMeals("a-t4", [
        ["Café", "Ao acordar", [ovos2, pao2, banana]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, mamao]],
        ["Almoço", "Prato principal", [atum, arroz130, feijao, salada, brocolis, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [tapioca, frango80, banana]],
        ["Jantar", "Depois do treino", [frango150, batata150, salada, azeite]],
      ])),
      plate("a-t5", "treino", "Carne, mandioca e tapioca", treinoBlurb, dayMeals("a-t5", [
        ["Café", "Ao acordar", [ovos2, aveia40, maca]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [carne, arroz100, feijao, salada, abobrinha, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [tapioca, frango80, banana, pao1]],
        ["Jantar", "Depois do treino", [frango150, mandioca, brocolis, azeite]],
      ])),
    ],
    rest: [
      plate("a-r1", "leve", "Frango e arroz", leveBlurb, dayMeals("a-r1", [
        ["Café", "Ao acordar", [ovos2, aveia30, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, arroz100, feijao, salada, brocolis, azeite]],
        ["Lanche da tarde", "Meio da tarde", [iogurte, maca, castanha]],
        ["Jantar", "Noite", [frango120, batata150, salada, pao1]],
      ])),
      plate("a-r2", "leve", "Patinho e legumes", leveBlurb, dayMeals("a-r2", [
        ["Café", "Ao acordar", [ovos2, aveia30, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [patinho160, arroz100, feijao, salada, azeite]],
        ["Lanche da tarde", "Meio da tarde", [iogurte, banana]],
        ["Jantar", "Noite", [frango120, arroz70, legumes, batata100]],
      ])),
      plate("a-r3", "leve", "Omelete e iogurte", leveBlurb, dayMeals("a-r3", [
        ["Café", "Ao acordar", [ovos2, aveia40, maca]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, arroz100, feijao, salada, brocolis, azeite]],
        ["Lanche da tarde", "Meio da tarde", [iogurte, banana]],
        ["Jantar", "Noite", [ovos2, frango80, batata100, salada]],
      ])),
      plate("a-r4", "leve", "Frango e mandioca", leveBlurb, dayMeals("a-r4", [
        ["Café", "Ao acordar", [ovos2, cuscuz, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte]],
        ["Almoço", "Prato principal", [frango150, mandioca, feijao, salada, abobrinha, azeite]],
        ["Lanche da tarde", "Meio da tarde", [ovo1, pao2, maca, castanha]],
        ["Jantar", "Noite", [frango150, batata100, salada]],
      ])),
    ],
  },
  {
    id: "b",
    name: "Carne, macarrão e cuscuz",
    training: [
      plate("b-t1", "treino", "Carne, arroz e feijão", treinoBlurb, dayMeals("b-t1", [
        ["Café", "Ao acordar", [ovos2, pao2, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, aveia30]],
        ["Almoço", "Prato principal", [carne, arroz130, feijao, salada, brocolis, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [tapioca, frango80, banana]],
        ["Jantar", "Depois do treino", [frango150, batataIng, salada, azeite]],
      ])),
      plate("b-t2", "treino", "Frango, mandioca e pão", treinoBlurb, dayMeals("b-t2", [
        ["Café", "Ao acordar", [ovos2, aveia40, banana]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, mandioca, feijao, salada, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [pao2, frango80, maca]],
        ["Jantar", "Depois do treino", [patinho160, arroz100, brocolis, azeite]],
      ])),
      plate("b-t3", "treino", "Patinho, batata e cuscuz", treinoBlurb, dayMeals("b-t3", [
        ["Café", "Ao acordar", [ovos2, cuscuz, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, pao1]],
        ["Almoço", "Prato principal", [patinho160, batataIng, feijao, salada, abobrinha, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [tapioca, frango80, banana]],
        ["Jantar", "Depois do treino", [frango150, arroz100, brocolis, azeite]],
      ])),
      plate("b-t4", "treino", "Ovos, macarrão e frango", treinoBlurb, dayMeals("b-t4", [
        ["Café", "Ao acordar", [ovos2, aveia40, maca]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, banana]],
        ["Almoço", "Prato principal", [frango150, macarrao180, salada, brocolis, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [pao2, ovo1, mamao]],
        ["Jantar", "Depois do treino", [patinho160, batata150, salada, azeite]],
      ])),
      plate("b-t5", "treino", "Frango, tapioca e batata", treinoBlurb, dayMeals("b-t5", [
        ["Café", "Ao acordar", [ovos2, pao2, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, arroz100, feijao, salada, abobrinha, azeite]],
        ["Antes do treino", "1h a 1h30 antes", [tapioca, frango80, banana, pao1]],
        ["Jantar", "Depois do treino", [carne, batata150, brocolis, azeite]],
      ])),
    ],
    rest: [
      plate("b-r1", "leve", "Carne e abobrinha", leveBlurb, dayMeals("b-r1", [
        ["Café", "Ao acordar", [ovos2, aveia30, maca]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [carne, arroz100, feijao, salada, abobrinha, azeite]],
        ["Lanche da tarde", "Meio da tarde", [iogurte, banana, pao1]],
        ["Jantar", "Noite", [frango150, batata100, legumes, salada]],
      ])),
      plate("b-r2", "leve", "Frango e legumes", leveBlurb, dayMeals("b-r2", [
        ["Café", "Ao acordar", [ovos2, pao1, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, arroz100, feijao, salada, brocolis, azeite]],
        ["Lanche da tarde", "Meio da tarde", [iogurte, maca, castanha]],
        ["Jantar", "Noite", [frango120, batata150, legumes]],
      ])),
      plate("b-r3", "leve", "Omelete, pão e fruta", leveBlurb, dayMeals("b-r3", [
        ["Café", "Ao acordar", [ovos2, pao2, maca]],
        ["Lanche da manhã", "Meio da manhã", [iogurte, chia]],
        ["Almoço", "Prato principal", [frango150, arroz100, feijao, salada, azeite]],
        ["Lanche da tarde", "Meio da tarde", [iogurte, banana]],
        ["Jantar", "Noite", [ovos2, frango80, batata100, legumes, salada]],
      ])),
      plate("b-r4", "leve", "Patinho e cuscuz", leveBlurb, dayMeals("b-r4", [
        ["Café", "Ao acordar", [ovos2, cuscuz, mamao]],
        ["Lanche da manhã", "Meio da manhã", [iogurte]],
        ["Almoço", "Prato principal", [patinho130, arroz70, feijao, salada, brocolis, azeite]],
        ["Lanche da tarde", "Meio da tarde", [ovo1, pao2, banana, castanha]],
        ["Jantar", "Noite", [frango150, batata100, salada]],
      ])),
    ],
  },
];
