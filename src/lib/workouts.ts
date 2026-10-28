export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  feel: string;
  cue: string;
  avoid: string;
  ifPain: string;
  swap: string;
};

export type WorkoutDay = {
  kind: "workout";
  id: string;
  weekday: number;
  code: string;
  title: string;
  focus: string;
  minutes: string;
  summary: string;
  shortTip: string;
  warmup: string[];
  exercises: Exercise[];
};

export type RestDay = {
  kind: "rest";
  id: string;
  weekday: number;
  title: string;
  summary: string;
  ideas: string[];
};

export type DayPlan = WorkoutDay | RestDay;

const glute: WorkoutDay = {
  kind: "workout",
  id: "a",
  weekday: 1,
  code: "A",
  title: "Glúteo em foco",
  focus: "Bumbum e posterior",
  minutes: "50 min",
  summary:
    "O dia que constrói o glúteo. Elevação pélvica pesada, stiff e búlgaro. A coxa trabalha junto, o peito descansa.",
  shortTip:
    "Se o tempo apertar, faz elevação pélvica, stiff e búlgaro. O resto é extra.",
  warmup: [
    "5 minutos de bike ou caminhada.",
    "2 séries leves de ponte no chão, 12 repetições.",
    "1 série leve de stiff, só para achar a postura.",
  ],
  exercises: [
    {
      id: "a-thrust",
      name: "Elevação pélvica",
      sets: 4,
      reps: "8–10",
      restSec: 120,
      feel: "Glúteo",
      cue: "Escápulas no banco, queixo perto do peito. Sobe até o quadril estender e segura 1 segundo. O calcanhar empurra o chão.",
      avoid: "Não arqueia a lombar no topo para subir mais.",
      ifPain: "Se a lombar doer, diminui a amplitude e cola o queixo no peito.",
      swap: "Sem banco, faz a ponte no chão com um halter no quadril.",
    },
    {
      id: "a-stiff",
      name: "Stiff com barra ou halteres",
      sets: 3,
      reps: "8–12",
      restSec: 90,
      feel: "Posterior",
      cue: "Joelho levemente dobrado o tempo todo. Quadril vai para trás e a barra desce rente à coxa, até o posterior alongar.",
      avoid: "Não arredonda as costas para descer mais.",
      ifPain: "Se a lombar cansar antes do posterior, troca pelo stiff unilateral.",
      swap: "Halteres nas mãos servem do mesmo jeito.",
    },
    {
      id: "a-bulgaro",
      name: "Agachamento búlgaro",
      sets: 3,
      reps: "8–12 cada perna",
      restSec: 90,
      feel: "Glúteo",
      cue: "O pé de trás só apoia. Inclina o tronco um pouco à frente e desce até a coxa de trás quase no chão.",
      avoid: "Não deixa o joelho da frente cair para dentro.",
      ifPain: "Se o joelho doer, faz afundo reverso com o passo mais curto.",
      swap: "Afundo reverso.",
    },
    {
      id: "a-abducao",
      name: "Cadeira abdutora",
      sets: 3,
      reps: "12–15",
      restSec: 60,
      feel: "Glúteo",
      cue: "Tronco levemente à frente. Abre com controle, segura 1 segundo e volta sem bater o peso.",
      avoid: "Não usa o corpo inteiro para empurrar.",
      ifPain: "Se a virilha pinicar, diminui a abertura.",
      swap: "Na polia, na altura do tornozelo, abrindo a perna.",
    },
    {
      id: "a-coice",
      name: "Coice na polia",
      sets: 3,
      reps: "12–15 cada",
      restSec: 60,
      feel: "Glúteo",
      cue: "Tronco apoiado e coluna quieta. O movimento é curto: só o quadril estende. Aperta em cima.",
      avoid: "Não joga a lombar para trás.",
      ifPain: "Se a lombar entrar no movimento, diminui a carga e a amplitude.",
      swap: "Hiperextensão 45°, quadril empurrado no banco, olhando para baixo.",
    },
  ],
};

const thighChest: WorkoutDay = {
  kind: "workout",
  id: "b",
  weekday: 2,
  code: "B",
  title: "Coxa e peito",
  focus: "Quadríceps e peito",
  minutes: "65 min",
  summary:
    "A coxa ganha grossura no agachamento, no leg press e na extensora. O peito entra no final para não sumir.",
  shortTip: "Se passar de 70 minutos, tira o afundo. Não tira o supino.",
  warmup: [
    "5 minutos de bike.",
    "2 séries leves do agachamento, com a barra vazia ou o hack sem carga.",
    "1 série leve de supino, só com a barra.",
  ],
  exercises: [
    {
      id: "b-agacho",
      name: "Agachamento livre ou hack",
      sets: 4,
      reps: "6–10",
      restSec: 120,
      feel: "Quadríceps",
      cue: "Pé inteiro no chão. Desce pelo menos até a coxa paralela. O joelho acompanha a ponta do pé.",
      avoid: "Não deixa o calcanhar subir.",
      ifPain: "Se o joelho doer no livre, vai para o hack ou para o leg press.",
      swap: "Hack squat.",
    },
    {
      id: "b-press",
      name: "Leg press 45°",
      sets: 3,
      reps: "10–12",
      restSec: 90,
      feel: "Quadríceps",
      cue: "Pés na largura do quadril, no meio da plataforma. Desce até a lombar ainda encostar no banco. Não trava o joelho em cima.",
      avoid: "Não desce tanto a ponto de o quadril enrolar.",
      ifPain: "Se o joelho reclamar, sobe um pouco os pés na plataforma e diminui a amplitude.",
      swap: "Agachamento goblet, se a máquina estiver cheia.",
    },
    {
      id: "b-extensora",
      name: "Cadeira extensora",
      sets: 3,
      reps: "12–15",
      restSec: 60,
      feel: "Quadríceps",
      cue: "Sobe e segura 1 segundo. Desce em 3 segundos, com as costas coladas no banco.",
      avoid: "Não joga o tronco para ganhar impulso.",
      ifPain: "Se o joelho doer no topo, para um pouco antes de estender tudo.",
      swap: "Mais uma série controlada no leg press.",
    },
    {
      id: "b-afundo",
      name: "Afundo caminhando",
      sets: 3,
      reps: "8–10 cada",
      restSec: 90,
      feel: "Coxa",
      cue: "Passo longo o bastante para o joelho de trás descer reto. Tronco alto. A força sai da perna da frente.",
      avoid: "Não bate o joelho de trás no chão.",
      ifPain: "Se o equilíbrio atrapalhar, faz o afundo parado no lugar.",
      swap: "Afundo estático com halteres.",
    },
    {
      id: "b-supino",
      name: "Supino reto",
      sets: 4,
      reps: "6–10",
      restSec: 120,
      feel: "Peito",
      cue: "Escápula firme no banco e pé no chão. Desce a barra na linha do peito, com o cotovelo a uns 45 graus. Sobe sem tirar o ombro do banco.",
      avoid: "Não quica a barra no peito.",
      ifPain: "Se o ombro doer, faz o supino na máquina, com o mesmo controle.",
      swap: "Supino na máquina ou com halteres.",
    },
    {
      id: "b-inclinado",
      name: "Supino inclinado com halteres",
      sets: 3,
      reps: "8–12",
      restSec: 90,
      feel: "Peito",
      cue: "Banco a uns 30 graus. Desce os halteres até a linha do peito, sem abrir demais o cotovelo.",
      avoid: "Não sobe o banco até virar um exercício de ombro.",
      ifPain: "Se o ombro pinicar, diminui a inclinação e a amplitude.",
      swap: "Supino inclinado na máquina.",
    },
    {
      id: "b-crucifixo",
      name: "Crucifixo na polia",
      sets: 2,
      reps: "12–15",
      restSec: 60,
      feel: "Peito",
      cue: "Polias na altura do peito. Cotovelo levemente dobrado e parado. Junta as mãos na frente e aperta o peito.",
      avoid: "Não transforma em supino, dobrando e estendendo o cotovelo.",
      ifPain: "Se o ombro doer, faz o crucifixo na máquina, com menos abertura.",
      swap: "Crucifixo na máquina ou flexão com os joelhos no chão.",
    },
  ],
};

const gluteCore: WorkoutDay = {
  kind: "workout",
  id: "c",
  weekday: 4,
  code: "C",
  title: "Glúteo e barriga",
  focus: "Glúteo, posterior e core",
  minutes: "55 min",
  summary:
    "Segundo dia de glúteo na semana, com posterior e um abdômen que não alarga a cintura.",
  shortTip:
    "Se a lombar estiver cansada da segunda, troca o sumô pelo leg press com o pé alto.",
  warmup: [
    "5 minutos de bike.",
    "10 aberturas de quadril de cada lado, sem pressa.",
    "1 série leve do agachamento sumô.",
  ],
  exercises: [
    {
      id: "c-sumo",
      name: "Agachamento sumô",
      sets: 4,
      reps: "8–12",
      restSec: 120,
      feel: "Glúteo",
      cue: "Pés bem abertos, pontas para fora. Desce no meio, joelho na direção do pé, peito alto. O halter fica entre as pernas.",
      avoid: "Não deixa o joelho cair para dentro na subida.",
      ifPain: "Se o quadril reclamar da abertura, fecha um pouco os pés.",
      swap: "Leg press com os pés altos e abertos.",
    },
    {
      id: "c-flexora",
      name: "Mesa flexora",
      sets: 3,
      reps: "10–12",
      restSec: 75,
      feel: "Posterior",
      cue: "Quadril colado no banco. Puxa a ponta do pé para a canela, sobe o rolo e desce devagar.",
      avoid: "Não tira a bacia do banco para ajudar.",
      ifPain: "Se a panturrilha cãibrar, diminui a carga e mantém a ponta do pé puxada.",
      swap: "Flexora em pé ou stiff mais leve.",
    },
    {
      id: "c-step",
      name: "Step-up no banco",
      sets: 3,
      reps: "8–10 cada",
      restSec: 90,
      feel: "Glúteo",
      cue: "Banco na altura do joelho ou um pouco abaixo. Sobe empurrando o calcanhar da perna de cima, sem impulso da de baixo.",
      avoid: "Não usa a perna de trás para pular.",
      ifPain: "Se o joelho doer, baixa o banco.",
      swap: "Búlgaro com menos amplitude.",
    },
    {
      id: "c-ponte",
      name: "Ponte com joelho aberto",
      sets: 3,
      reps: "15–20",
      restSec: 60,
      feel: "Glúteo",
      cue: "Deitada, pés juntos e joelhos abertos. Sobe o quadril, aperta 1 segundo e mantém a costela baixa.",
      avoid: "Não sobe tão alto a ponto de apoiar só na lombar.",
      ifPain: "Se a virilha incomodar, abre menos o joelho.",
      swap: "Ponte com os pés na largura do quadril.",
    },
    {
      id: "c-polia",
      name: "Abdominal na polia",
      sets: 3,
      reps: "12–15",
      restSec: 60,
      feel: "Abdômen",
      cue: "Ajoelhada de frente para a polia, corda perto da cabeça. Arredonda a coluna e leva as costelas em direção da bacia. O quadril quase não mexe.",
      avoid: "Não puxa com o braço.",
      ifPain: "Se a lombar doer, pula este e faz só o dead bug.",
      swap: "Abdominal curto no chão, com a lombar apoiada.",
    },
    {
      id: "c-dead",
      name: "Dead bug",
      sets: 3,
      reps: "8 cada lado",
      restSec: 45,
      feel: "Abdômen",
      cue: "Lombar colada no chão o tempo todo. Estica um braço e a perna oposta, devagar, e volta. Se a lombar descolar, encurta o movimento.",
      avoid: "Não deixa a barriga estufar.",
      ifPain: "Se não conseguir manter a lombar no chão, mexe só o braço.",
      swap: "Mais uma série de prancha.",
    },
    {
      id: "c-prancha",
      name: "Prancha",
      sets: 3,
      reps: "30–45 s",
      restSec: 45,
      feel: "Abdômen",
      cue: "Cotovelo sob o ombro, glúteo contraído, costela fechada. O corpo é uma tábua só.",
      avoid: "Não deixa o quadril cair nem sobe a bunda.",
      ifPain: "Se o ombro doer, apoia as mãos num banco.",
      swap: "Dead bug extra.",
    },
  ],
};

const chestThigh: WorkoutDay = {
  kind: "workout",
  id: "d",
  weekday: 5,
  code: "D",
  title: "Peito e coxa",
  focus: "Peito descansado, coxa completa",
  minutes: "65 min",
  summary:
    "O peito começa o treino, descansado, para não murchar. Depois a coxa fecha a semana com frente, atrás e parte de dentro.",
  shortTip:
    "O peito vem primeiro de propósito. Se o relógio apertar, segura o supino e o agachamento.",
  warmup: [
    "10 rotações de ombro, devagar.",
    "1 série leve de supino, só com a barra.",
    "1 série leve de agachamento goblet.",
  ],
  exercises: [
    {
      id: "d-supino",
      name: "Supino reto",
      sets: 3,
      reps: "6–10",
      restSec: 120,
      feel: "Peito",
      cue: "Igual ao de terça: escápula firme, barra na linha do peito, cotovelo a uns 45 graus. Hoje ele vem primeiro, com o ombro fresco.",
      avoid: "Não quica a barra no peito.",
      ifPain: "Se o ombro doer, faz na máquina.",
      swap: "Supino na máquina.",
    },
    {
      id: "d-inclinado",
      name: "Supino inclinado",
      sets: 3,
      reps: "8–12",
      restSec: 90,
      feel: "Peito",
      cue: "Banco a uns 30 graus ou a máquina inclinada. Desce até a linha do peito e sobe sem tirar o ombro do apoio.",
      avoid: "Não transforma em desenvolvimento de ombro.",
      ifPain: "Se o ombro pinicar, diminui a amplitude.",
      swap: "Supino inclinado na máquina.",
    },
    {
      id: "d-flexao",
      name: "Flexão de braço",
      sets: 2,
      reps: "10–15",
      restSec: 60,
      feel: "Peito",
      cue: "Mãos um pouco mais abertas que o ombro, corpo reto, cotovelo a 45 graus. Se precisar, joelhos no chão, sem quebrar o quadril.",
      avoid: "Não deixa o quadril cair no meio do caminho.",
      ifPain: "Se o punho doer, faz o crucifixo na máquina.",
      swap: "Crucifixo na polia ou na máquina.",
    },
    {
      id: "d-goblet",
      name: "Agachamento goblet ou frontal",
      sets: 4,
      reps: "8–10",
      restSec: 120,
      feel: "Quadríceps",
      cue: "Halter junto ao peito. Tronco o mais em pé que der. Desce até o cotovelo quase tocar o joelho.",
      avoid: "Não deixa o peso cair para a frente e arredondar as costas.",
      ifPain: "Se o punho doer, faz no hack.",
      swap: "Hack squat ou leg press.",
    },
    {
      id: "d-reverso",
      name: "Afundo reverso",
      sets: 3,
      reps: "8–10 cada",
      restSec: 90,
      feel: "Coxa",
      cue: "O passo vai para trás. Desce o joelho de trás e volta com a força da perna da frente. Tronco alto.",
      avoid: "Não perde o calcanhar da frente no chão.",
      ifPain: "Se o joelho doer, encurta o passo e não desce tudo.",
      swap: "Leg press unilateral, com pouca carga no começo.",
    },
    {
      id: "d-adutora",
      name: "Cadeira adutora",
      sets: 3,
      reps: "12–15",
      restSec: 60,
      feel: "Coxa",
      cue: "Abre com controle e fecha apertando no fim. Essa é a parte de dentro da coxa, que entra no volume da perna.",
      avoid: "Não usa embalo.",
      ifPain: "Se a virilha doer, diminui a abertura.",
      swap: "Agachamento sumô mais leve.",
    },
    {
      id: "d-unilateral",
      name: "Stiff unilateral",
      sets: 3,
      reps: "8–10 cada",
      restSec: 75,
      feel: "Posterior",
      cue: "Quadril para trás, coluna neutra. A perna de trás sobe junto com o tronco. Segura num banco se o equilíbrio falhar.",
      avoid: "Não gira o quadril aberto.",
      ifPain: "Se a lombar doer, apoia uma mão no banco e diminui a carga.",
      swap: "Mesa flexora.",
    },
  ],
};

const posture: WorkoutDay = {
  kind: "workout",
  id: "e",
  weekday: 6,
  code: "E",
  title: "Postura e caminhada",
  focus: "Costas, cintura e passo",
  minutes: "40 min + caminhada",
  summary:
    "Dia extra. Costas e ombro deixam o peito no lugar certo, o core não engrossa a cintura, e a caminhada ajuda a barriga sem roubar a perna.",
  shortTip:
    "Se a semana já teve os quatro treinos e você está moída, caminha e vai para casa.",
  warmup: [
    "3 minutos de bike ou remo leve.",
    "10 rotações de ombro.",
  ],
  exercises: [
    {
      id: "e-puxada",
      name: "Puxada pela frente",
      sets: 3,
      reps: "10–12",
      restSec: 75,
      feel: "Costas",
      cue: "Puxa a barra em direção ao alto do peito, peito aberto, ombro longe da orelha.",
      avoid: "Não puxa por trás da nuca.",
      ifPain: "Se o ombro doer, usa a pegada neutra e puxa só até o queixo.",
      swap: "Puxada com triângulo.",
    },
    {
      id: "e-remada",
      name: "Remada baixa",
      sets: 3,
      reps: "10–12",
      restSec: 75,
      feel: "Costas",
      cue: "Peito aberto. Puxa o pegador até a barriga, aperta as escápulas e volta sem deixar o ombro despencar.",
      avoid: "Não deita para trás para puxar mais peso.",
      ifPain: "Se a lombar cansar, apoia o peito no banco e rema com halter.",
      swap: "Remada com halteres, coluna neutra.",
    },
    {
      id: "e-face",
      name: "Face pull",
      sets: 3,
      reps: "12–15",
      restSec: 60,
      feel: "Ombro",
      cue: "Polia na altura do rosto. Puxa em direção da testa, com o cotovelo alto, e abre no fim.",
      avoid: "Não usa uma carga que vire balanço.",
      ifPain: "Se o ombro pinicar, desce um pouco a polia e alivia a carga.",
      swap: "Crucifixo inverso na máquina, leve.",
    },
    {
      id: "e-pallof",
      name: "Pallof press",
      sets: 3,
      reps: "10 cada lado",
      restSec: 45,
      feel: "Cintura",
      cue: "De lado para a polia, na altura do peito. Segura o pegador no esterno e empurra para a frente, sem deixar o tronco girar.",
      avoid: "Não gira junto com o cabo. Este exercício segura a cintura, não engrossa.",
      ifPain: "Se a lombar doer, dobra um pouco o joelho e diminui a carga.",
      swap: "Prancha lateral, 20 segundos de cada lado.",
    },
    {
      id: "e-vacuum",
      name: "Vacuum abdominal",
      sets: 3,
      reps: "20–30 s",
      restSec: 30,
      feel: "Abdômen",
      cue: "Em pé, solta o ar e puxa o umbigo para dentro e para cima, como se fosse fechar uma calça. O pescoço fica solto.",
      avoid: "Não prende o ar até passar mal.",
      ifPain: "Se der tontura, solta e respira. Faz o dead bug no lugar.",
      swap: "Dead bug.",
    },
    {
      id: "e-walk",
      name: "Caminhada inclinada",
      sets: 1,
      reps: "20–30 min",
      restSec: 0,
      feel: "Passo",
      cue: "Esteira inclinada, num ritmo em que ainda dá para falar uma frase. A mão fica leve, sem se pendurar.",
      avoid: "Não corre. Corrida longa come a recuperação da perna.",
      ifPain: "Se a canela doer, caminha no plano.",
      swap: "Caminhada na rua, 30 a 40 minutos.",
    },
  ],
};

const restWednesday: RestDay = {
  kind: "rest",
  id: "rest-qua",
  weekday: 3,
  title: "Descanso",
  summary:
    "O glúteo de segunda cresce hoje. Caminha se quiser, come a proteína e não encaixa outro treino de perna.",
  ideas: [
    "Caminhada leve de 20 a 40 minutos, se der vontade.",
    "Alonga o quadril: 30 segundos de cada lado, sem dor.",
    "Dorme. É parte do treino.",
  ],
};

const restSunday: RestDay = {
  kind: "rest",
  id: "rest-dom",
  weekday: 0,
  title: "Descanso",
  summary:
    "Semana fechada. Come, caminha um pouco se quiser e deixa a perna quieta para segunda começar forte.",
  ideas: [
    "Uma volta no quarteirão já serve.",
    "Prepara a proteína da semana: frango, ovos, iogurte.",
    "Não testa um treino novo de internet hoje.",
  ],
};

export const WEEK: DayPlan[] = [
  glute,
  thighChest,
  restWednesday,
  gluteCore,
  chestThigh,
  posture,
  restSunday,
];

export const WORKOUTS: WorkoutDay[] = WEEK.filter(isWorkout);

export const MAIN_WORKOUT_IDS = ["a", "b", "c", "d"];

export function isWorkout(day: DayPlan): day is WorkoutDay {
  return day.kind === "workout";
}

export function planForWeekday(weekday: number) {
  const plan = WEEK.find((day) => day.weekday === weekday);
  if (!plan) return restSunday;
  return plan;
}

export function getWorkout(id: string) {
  return WORKOUTS.find((day) => day.id === id);
}

export function totalSets(day: WorkoutDay) {
  return day.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
}

export const PROGRESS_RULES = [
  {
    title: "Sobe a carga quando couber",
    text: "Quando todas as séries chegarem no topo das repetições, com a última difícil e a forma boa, sobe o menor peso possível na próxima vez.",
  },
  {
    title: "Anota o peso no exercício",
    text: "A memória da academia engana. O número fica salvo no treino, neste celular.",
  },
  {
    title: "Dor no músculo é uma coisa. Dor na junta é outra.",
    text: "Queimar glúteo, coxa ou peito é normal. Dor aguda no joelho, no ombro ou na lombar é sinal de parar e usar a troca do exercício.",
  },
  {
    title: "A cada 6 ou 8 semanas, alivia uma",
    text: "Na semana leve, tira a última série de cada exercício e mantém a carga. Na outra, volta a subir.",
  },
];

export const DONT = [
  "Não faz só abdominal para secar a barriga. Isso não tira gordura do lugar, e oblíquo pesado pode até alargar a cintura.",
  "Não corta o arroz no dia de perna. Glúteo cresce com força e carboidrato.",
  "Não troca o supino por esteira. Peito que não é treinado some quando a comida aperta.",
  "Não treina glúteo todo dia. Ele cresce na folga entre segunda e quinta.",
  "Não desconta a balança no café do dia seguinte. Treino de perna, ciclo e creatina sobem o peso sem ser gordura.",
  "Não faz dois treinos de perna no mesmo dia para compensar falta. Repõe um treino perdido no sábado e segue.",
];
