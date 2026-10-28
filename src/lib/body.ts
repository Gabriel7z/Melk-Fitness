import { formatNumber } from "@/lib/format";
import { BODY_SCAN, scanMatches } from "@/lib/scan";
import type { ActivityLevel, CheckIn, Profile } from "@/lib/types";

export const ACTIVITY: Record<
  ActivityLevel,
  { label: string; detail: string; factor: number }
> = {
  leve: {
    label: "Leve",
    detail: "Treino 2 ou 3 vezes e passo o dia sentada",
    factor: 1.4,
  },
  moderado: {
    label: "Moderado",
    detail: "Os 4 treinos Melk na semana",
    factor: 1.55,
  },
  alto: {
    label: "Alto",
    detail: "Os 4 treinos e caminho bastante no resto do dia",
    factor: 1.7,
  },
};

export type PlanMode = "deficit" | "recomp" | "maintenance" | "surplus";

export type Assessment = {
  heightCm: number;
  weightKg: number;
  age: number;
  ageAssumed: boolean;
  bmi: number;
  bmiLabel: string;
  healthyMin: number;
  healthyMax: number;
  referenceKg: number;
  mode: PlanMode;
  modeLabel: string;
  goalLow: number;
  goalHigh: number;
  headline: string;
  detail: string;
  bmr: number;
  tdee: number;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  waterMl: number;
  kcalNote: string;
  bmrMeasured: boolean;
};

export function proteinGrams(weightKg: number) {
  return Math.round((weightKg * 2) / 5) * 5;
}

export function waterMl(weightKg: number) {
  return Math.round((weightKg * 35) / 50) * 50;
}

export function bmiOf(weightKg: number, heightCm: number) {
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
}

export function bmiLabel(bmi: number) {
  if (bmi < 18.5) return "Abaixo da faixa";
  if (bmi < 25) return "Faixa saudável";
  if (bmi < 30) return "Acima da faixa";
  return "Bem acima da faixa";
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function assess(profile: Profile): Assessment | null {
  const heightCm = profile.heightCm;
  if (heightCm == null || heightCm < 140 || heightCm > 210) return null;

  const weightKg = profile.weightKg;
  const ageAssumed = profile.age == null;
  const age = profile.age ?? 25;
  const meters = heightCm / 100;
  const bmi = weightKg / (meters * meters);
  const healthyMin = 18.5 * meters * meters;
  const healthyMax = 24.9 * meters * meters;
  const referenceKg = 22 * meters * meters;
  const scan = scanMatches(profile) ? BODY_SCAN : null;
  const mifflin = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const base = scan ? scan.bmr : mifflin;
  const tdee = base * ACTIVITY[profile.activity].factor;
  const kg = formatNumber(weightKg, 1);
  const imc = formatNumber(bmi, 1);

  let mode: PlanMode = "maintenance";
  let goalLow = weightKg;
  let goalHigh = weightKg;
  let headline = "";
  let detail = "";
  let kcalRaw = tdee;

  if (scan && bmi < 27) {
    mode = "recomp";
    goalLow = weightKg - 2;
    goalHigh = weightKg;
    headline = "O peso fica. A gordura sai.";
    detail = `A avaliação de ${scan.dateLabel} mediu ${formatNumber(scan.fatPercent, 1)}% de gordura (${formatNumber(scan.fatKg, 1)} kg) em ${formatNumber(scan.weightKg, 2)} kg. O IMC de hoje, ${imc}, está na faixa saudável. O que a balança chamou de “levemente acima” é a gordura, marcada como alta. O músculo esquelético já veio excelente: ${formatNumber(scan.skeletalMusclePercent, 1)}%, ${formatNumber(scan.skeletalMuscleKg, 1)} kg. A proteína da ficha veio baixa, ${formatNumber(scan.proteinPercent, 1)}%. A balança sugeriu perder ${formatNumber(scan.scaleCutKg, 1)} kg e ir para perto de ${scan.scaleTargetKg} kg. Esse corte levaria peito e glúteo junto. A meta é ficar entre ${formatNumber(goalLow, 1)} e ${formatNumber(goalHigh, 1)} kg, com a gordura caminhando de ${formatNumber(scan.fatPercent, 1)}% para perto de ${scan.fatGoalPercent}%, e mais músculo na coxa e no glúteo. Gordura visceral ${scan.visceralFat} já está numa faixa tranquila.`;
    kcalRaw = tdee - 200;
  } else if (bmi >= 27) {
    mode = "deficit";
    const target = 24 * meters * meters;
    goalLow = target - 1;
    goalHigh = target + 1;
    headline = "Dá para definir. O caminho é devagar.";
    detail = `Com esta altura, ${kg} kg dá IMC ${imc}, acima da faixa em que a barriga costuma ficar mais chapada. O alvo de balança, por enquanto, fica perto de ${formatNumber(target, 1)} kg. O corte é pequeno, de umas 250 kcal, com carbo no prato. Descer mais rápido que isso leva o peito e o glúteo embora.`;
    kcalRaw = tdee - 250;
  } else if (bmi >= 25) {
    mode = "deficit";
    const target = 23 * meters * meters;
    goalLow = target - 1;
    goalHigh = target + 1;
    headline = "Um ajuste fino, não uma dieta.";
    detail = `${kg} kg nesta altura é IMC ${imc}. Dá para secar um pouco a cintura e ainda construir coxa e glúteo. A balança pode caminhar para perto de ${formatNumber(target, 1)} kg. A comida continua grande: proteína alta, arroz e batata no dia de treino, déficit de só umas 250 kcal.`;
    kcalRaw = tdee - 250;
  } else if (bmi >= 23) {
    mode = "recomp";
    goalLow = Math.max(healthyMin, weightKg - 2);
    goalHigh = weightKg + 0.5;
    headline = "O peso já serve. A forma é que muda.";
    detail = `IMC ${imc} está na faixa saudável. Para barriga mais chapada e glúteo maior ao mesmo tempo, a conta é recomposição: comer quase na manutenção e treinar pesado. A balança pode ir para algo entre ${formatNumber(goalLow, 1)} e ${formatNumber(goalHigh, 1)} kg, ou quase não sair do lugar, enquanto a cintura desce e o quadril sobe.`;
    kcalRaw = tdee - 100;
  } else if (bmi >= 20) {
    mode = "maintenance";
    goalLow = weightKg - 0.5;
    goalHigh = weightKg + 1.5;
    headline = "Este peso já é de definição.";
    detail = `${kg} kg nesta altura (IMC ${imc}) já está num ponto ótimo. Não precisa emagrecer para chegar no objetivo. A barriga fica mais chapada com core, postura, sono e comida organizada. Glúteo e coxa crescem se a comida der conta do treino. Se a balança subir 1 kg e a cintura não subir, é músculo.`;
    kcalRaw = tdee;
  } else {
    mode = "surplus";
    goalLow = weightKg;
    goalHigh = Math.min(healthyMax, weightKg + 3);
    headline = "Para crescer coxa e glúteo, precisa comer.";
    detail = `IMC ${imc} está baixo para quem quer mais volume na perna. Um superávit leve, com proteína, coloca massa onde o treino pede e ainda segura o peito. Passar fome aqui faz o contrário do que você quer.`;
    kcalRaw = tdee + 200;
  }

  const protein =
    scan && mode === "recomp"
      ? Math.round((weightKg * 2.2) / 5) * 5
      : proteinGrams(weightKg);
  const fat = Math.round((weightKg * 0.9) / 5) * 5;
  const floor = Math.max(1700, protein * 4 + fat * 9 + 130 * 4);
  let kcal = Math.round(kcalRaw);
  let kcalNote = scan
    ? `Repouso de ${formatNumber(scan.bmr)} kcal medido na bioimpedância em ${scan.dateLabel}. O gasto do treino entra em cima disso.`
    : "";
  if (kcal < floor) {
    kcal = Math.round(floor);
    kcalNote = `${kcalNote} A conta pedia menos comida. Segurei num piso para o peito e o glúteo não pagarem a conta.`.trim();
  }
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const modeLabel: Record<PlanMode, string> = {
    deficit: "Déficit leve",
    recomp: "Recomposição",
    maintenance: "Manutenção",
    surplus: "Superávit leve",
  };

  return {
    heightCm,
    weightKg,
    age,
    ageAssumed,
    bmi,
    bmiLabel: bmiLabel(bmi),
    healthyMin,
    healthyMax,
    referenceKg,
    mode,
    modeLabel: modeLabel[mode],
    goalLow: round1(goalLow),
    goalHigh: round1(goalHigh),
    headline,
    detail,
    bmr: Math.round(base),
    tdee: Math.round(tdee),
    kcal,
    protein,
    fat,
    carbs,
    waterMl: waterMl(weightKg),
    kcalNote,
    bmrMeasured: scan != null,
  };
}

export const HEIGHT_ROWS = [150, 155, 160, 165, 170, 175, 180];

export function closestHeight(heightCm: number | null) {
  if (heightCm == null) return null;
  return HEIGHT_ROWS.reduce((best, height) =>
    Math.abs(height - heightCm) < Math.abs(best - heightCm) ? height : best,
  );
}

type MeasureKey = "waistCm" | "hipCm" | "thighCm" | "chestCm";

export function measureDelta(checkins: CheckIn[], key: MeasureKey) {
  const points = checkins
    .filter((item) => item[key] != null)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
  if (points.length < 2) return null;
  const first = points[0]?.[key];
  const last = points[points.length - 1]?.[key];
  if (first == null || last == null) return null;
  return { first, last, delta: last - first, count: points.length };
}

export function buildInsight(checkins: CheckIn[]) {
  if (checkins.length === 0) return null;
  if (checkins.length === 1 || checkins.every((item) => !hasMeasure(item))) {
    return "Primeira marca feita. Anota de novo em duas semanas, de manhã, antes de comer, com a mesma fita e a mesma roupa.";
  }

  const bits: string[] = [];
  const waist = measureDelta(checkins, "waistCm");
  const hip = measureDelta(checkins, "hipCm");
  const thigh = measureDelta(checkins, "thighCm");
  const chest = measureDelta(checkins, "chestCm");

  if (waist) bits.push(phrase("A cintura", waist.delta, "cm", true));
  if (hip) bits.push(phrase("O quadril", hip.delta, "cm", false));
  if (thigh) bits.push(phrase("A coxa", thigh.delta, "cm", false));
  if (chest) bits.push(phrase("O peito", chest.delta, "cm", false));

  if (bits.length === 0) {
    const weights = checkins
      .filter((item) => item.weightKg != null)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));
    if (weights.length >= 2) {
      const delta =
        (weights[weights.length - 1]?.weightKg ?? 0) -
        (weights[0]?.weightKg ?? 0);
      return `A balança mudou ${formatSigned(delta, "kg")} desde a primeira anotação. Sem cintura, quadril, coxa e peito, esse número não diz se o objetivo está andando.`;
    }
    return "Quando tiver duas datas com as mesmas medidas, eu comparo cintura, quadril, coxa e peito.";
  }

  let ending = "Segue o plano por mais duas semanas antes de mudar a comida.";
  if (waist && waist.delta <= -0.5 && chest && chest.delta < -1) {
    ending =
      "A cintura caiu, mas o peito também. Sobe um pouco o arroz. O peito some quando a comida aperta.";
  } else if (waist && waist.delta <= -0.5 && hip && hip.delta >= 0) {
    ending =
      "Cintura para baixo e quadril segurando ou subindo: é exatamente o desenho do plano.";
  } else if (hip && hip.delta <= -1 && thigh && thigh.delta <= -1) {
    ending =
      "Quadril e coxa desceram juntos. A comida pode estar baixa demais para o objetivo de crescer embaixo.";
  } else if (waist && waist.delta >= 1 && hip && hip.delta >= 1) {
    ending =
      "Tudo subiu, inclusive a cintura. Segura o azeite e a castanha por uma semana e mantém a proteína.";
  }

  return `${bits.join(" ")} ${ending}`;
}

function hasMeasure(item: CheckIn) {
  return (
    item.waistCm != null ||
    item.hipCm != null ||
    item.thighCm != null ||
    item.chestCm != null ||
    item.weightKg != null
  );
}

function phrase(label: string, delta: number, unit: string, lowerIsBetter: boolean) {
  if (Math.abs(delta) < 0.4) return `${label} ficou estável.`;
  const direction = delta > 0 ? "subiu" : "desceu";
  const good = lowerIsBetter ? delta < 0 : delta > 0;
  const tone = good ? "Isso ajuda o objetivo." : "Vale olhar a comida.";
  return `${label} ${direction} ${formatNumber(Math.abs(delta), 1)} ${unit}. ${tone}`;
}

function formatSigned(delta: number, unit: string) {
  const sign = delta > 0 ? "+" : "−";
  return `${sign}${formatNumber(Math.abs(delta), 1)} ${unit}`;
}

export { formatSigned };
