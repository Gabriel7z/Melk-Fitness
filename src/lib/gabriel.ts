export type GabrielExercise = {
  id: string;
  name: string;
  machine: string;
  where: string;
  dose: string;
  photo: string;
  alt: string;
  cue: string;
  stop: string;
};

export type GabrielDay = {
  id: string;
  code: string;
  title: string;
  when: string;
  summary: string;
  exercises: GabrielExercise[];
};

export const GABRIEL_DAYS: GabrielDay[] = [
  {
    id: "a",
    code: "A",
    title: "Perna e peito",
    when: "Segunda",
    summary: "A perna trabalha com a lombar apoiada. O peito empurra na máquina, sem tirar as costas do banco.",
    exercises: [
      {
        id: "a-deadbug",
        name: "Dead bug",
        machine: "Colchonete, no chão",
        where: "Área de abdominal ou qualquer espaço no chão. Não é cadeira.",
        dose: "2 séries de 8 de cada lado",
        photo: "/maquinas/deadbug.jpg",
        alt: "Dead bug no chão, um braço e a perna oposta estendidos.",
        cue: "A lombar fica colada no chão o tempo todo. Desce um braço e a perna oposta, devagar, e volta.",
        stop: "Se a lombar descolar ou a dor descer para a perna, encurta o movimento.",
      },
      {
        id: "a-press",
        name: "Leg press",
        machine: "Leg press 45°",
        where: "A plataforma inclinada, com o banco embaixo. O nome na plaquinha costuma ser leg press 45.",
        dose: "3 séries de 10",
        photo: "/maquinas/leg-press.jpg",
        alt: "Leg press 45 graus, costas no banco e pés na plataforma.",
        cue: "Pés no meio da plataforma, um pouco altos. Desce só até a lombar continuar colada no banco.",
        stop: "Não trava o joelho no alto e não deixa o quadril enrolar no fundo.",
      },
      {
        id: "a-flexora",
        name: "Flexora",
        machine: "Cadeira flexora",
        where: "Fileira das cadeiras de coxa. Sentado, com o rolo atrás do tornozelo. Se a academia só tiver a mesa, de bruços, o rolo é o mesmo e o quadril não sai do banco.",
        dose: "3 séries de 12",
        photo: "",
        alt: "",
        cue: "Puxa o calcanhar para baixo, ou para o glúteo na mesa, sem usar o tronco.",
        stop: "Se a lombar arquear para ajudar, o peso está alto.",
      },
      {
        id: "a-supino",
        name: "Supino",
        machine: "Supino na máquina, sentado",
        where: "Área de peito. É a cadeira com dois pegadores na frente do peito, que se empurra para a frente. Não é o voador, em que o cotovelo abre para o lado.",
        dose: "3 séries de 10",
        photo: "",
        alt: "",
        cue: "Costas e lombar inteiras no encosto. Empurra para a frente e volta até o cotovelo passar um pouco do tronco.",
        stop: "Se precisar tirar a lombar do banco para completar, diminui o peso.",
      },
      {
        id: "a-remada",
        name: "Remada",
        machine: "Remada com apoio de peito",
        where: "Máquina em que o peito encosta numa almofada e os braços puxam para trás. Se não tiver, usa a remada baixa: sentado no cabo, pegador na barriga, tronco alto.",
        dose: "3 séries de 10",
        photo: "",
        alt: "",
        cue: "Puxa o cotovelo para trás, perto do corpo. O peito fica alto e a lombar não arredonda.",
        stop: "Balançar o tronco para trazer o peso é sinal de baixar a carga.",
      },
      {
        id: "a-lateral",
        name: "Prancha lateral",
        machine: "Chão, sem máquina",
        where: "No colchonete, de lado. Apoia o antebraço e o joelho de baixo.",
        dose: "2 séries de 20 segundos de cada lado",
        photo: "",
        alt: "",
        cue: "Quadril alto, corpo reto do joelho ao ombro. Não gira para a frente.",
        stop: "Se a lombar latejar, apoia o joelho e encurta o tempo.",
      },
    ],
  },
  {
    id: "b",
    code: "B",
    title: "Costas e glúteo",
    when: "Quarta",
    summary: "O glúteo sobe no chão e no goblet. As costas puxam na polia, com o tronco quieto.",
    exercises: [
      {
        id: "b-ponte",
        name: "Ponte de glúteo",
        machine: "Colchonete, no chão",
        where: "Deitado de barriga para cima, joelhos dobrados, pé inteiro no chão. Sem barra.",
        dose: "3 séries de 10",
        photo: "/maquinas/ponte.jpg",
        alt: "Ponte no chão, quadril elevado e joelhos dobrados.",
        cue: "Costela para baixo. Sobe o quadril até o corpo alinhar e aperta o glúteo. Não empurra a lombar para o alto.",
        stop: "Dor na frente do quadril ou na lombar: desce menos.",
      },
      {
        id: "b-goblet",
        name: "Agachamento goblet",
        machine: "Um halter e um banco",
        where: "Peso livre. O halter fica na frente do peito. O banco serve de cadeira: desce até encostar e sobe.",
        dose: "3 séries de 8",
        photo: "/maquinas/goblet.jpg",
        alt: "Agachamento goblet com o halter na frente do corpo.",
        cue: "Pé na largura do quadril. Desce sentando para trás, joelho na direção do pé, lombar reta.",
        stop: "Se a lombar arredondar antes de chegar no banco, usa um banco mais alto.",
      },
      {
        id: "b-puxada",
        name: "Puxada",
        machine: "Puxada pela frente",
        where: "Polia alta, sentado, com a trava nas coxas. A barra desce em direção ao alto do peito.",
        dose: "3 séries de 10",
        photo: "/maquinas/puxada.jpg",
        alt: "Puxada pela frente, barra em direção ao alto do peito.",
        cue: "Puxa a barra até o peito, cotovelo para baixo. O tronco quase não vai para trás.",
        stop: "Puxar por trás da nuca fica de fora.",
      },
      {
        id: "b-face",
        name: "Face pull",
        machine: "Polia alta com corda",
        where: "A polia na altura do rosto, ou um pouco acima. A corda vem em direção da testa.",
        dose: "3 séries de 12",
        photo: "/maquinas/facepull.jpg",
        alt: "Face pull, corda indo em direção da testa.",
        cue: "Puxa a corda abrindo as mãos para o lado das orelhas. Cotovelo alto, peito aberto, lombar quieta.",
        stop: "Se o peso fizer o corpo ir para trás, está pesado.",
      },
      {
        id: "b-panturrilha",
        name: "Panturrilha",
        machine: "Panturrilha sentada",
        where: "Cadeira baixa com a almofada em cima do joelho e a ponta do pé numa plataforma. Empurra a ponta do pé para baixo.",
        dose: "2 séries de 12",
        photo: "",
        alt: "",
        cue: "Sobe na ponta e desce até o calcanhar passar um pouco da plataforma. O tronco fica no encosto.",
        stop: "Não dá tranco embaixo.",
      },
      {
        id: "b-bird",
        name: "Bird dog",
        machine: "Colchonete, no chão",
        where: "Quatro apoios, mão embaixo do ombro e joelho embaixo do quadril.",
        dose: "2 séries de 8 de cada lado",
        photo: "",
        alt: "",
        cue: "Estende um braço e a perna oposta até ficarem na linha das costas. O quadril não gira.",
        stop: "Se a lombar cair, fica só no braço, sem a perna.",
      },
    ],
  },
  {
    id: "c",
    code: "C",
    title: "Ombro e posterior",
    when: "Sexta",
    summary: "O posterior da coxa e o ombro entram com a coluna apoiada. A caminhada fecha o dia, com pouco peso na mão.",
    exercises: [
      {
        id: "c-step",
        name: "Step",
        machine: "Banco ou step baixo",
        where: "Um banco na altura do joelho, ou mais baixo. Se a lombar reclamar, troca pela cadeira extensora: rolo na frente do tornozelo, 3 séries de 12, sem tranco.",
        dose: "3 séries de 8 de cada perna",
        photo: "/maquinas/step.jpg",
        alt: "Step-up, um pé em cima do banco.",
        cue: "Sobe com a perna de cima, tronco alto. O pé de baixo só acompanha.",
        stop: "Não usa o impulso da perna de baixo para subir.",
      },
      {
        id: "c-flexora",
        name: "Flexora",
        machine: "Cadeira flexora",
        where: "A mesma cadeira do dia A. Sentado, rolo atrás do tornozelo.",
        dose: "3 séries de 12",
        photo: "",
        alt: "",
        cue: "O movimento é só do joelho. O quadril fica parado no banco.",
        stop: "Dor que desce para a perna: para a série.",
      },
      {
        id: "c-remada",
        name: "Remada baixa",
        machine: "Remada baixa",
        where: "Cabo baixo, sentado, com o pegador na frente. Puxa até a barriga.",
        dose: "3 séries de 10",
        photo: "/maquinas/remada.jpg",
        alt: "Remada sentada, puxando o pegador até a barriga.",
        cue: "Tronco alto, como se o peito fosse o primeiro a chegar. Puxa o cotovelo para trás.",
        stop: "Arredondar a lombar para alcançar o pegador é o ponto de parar e aproximar o banco.",
      },
      {
        id: "c-desenvolvimento",
        name: "Desenvolvimento",
        machine: "Desenvolvimento na máquina, sentado",
        where: "Cadeira com os pegadores na altura do ombro, empurrando para cima. O encosto segura as costas.",
        dose: "3 séries de 10",
        photo: "",
        alt: "",
        cue: "Lombar no encosto. Sobe até o cotovelo quase esticar e desce até a mão chegar perto da orelha.",
        stop: "Se a lombar sair do banco, o banco está mal ajustado ou o peso passou.",
      },
      {
        id: "c-caminhada",
        name: "Caminhada com halteres",
        machine: "Dois halteres leves",
        where: "No corredor da academia, onde dá para andar reto. O halter fica ao lado da coxa, braço solto.",
        dose: "3 voltas de uns 20 metros",
        photo: "",
        alt: "",
        cue: "Passo normal, cabeça alta, ombro longe da orelha. O peso é leve o bastante para não inclinar para um lado.",
        stop: "Se a lombar cansar antes da mão, larga o halter e só caminha.",
      },
      {
        id: "c-deadbug",
        name: "Dead bug",
        machine: "Colchonete, no chão",
        where: "O mesmo colchonete do dia A.",
        dose: "2 séries de 8 de cada lado",
        photo: "/maquinas/deadbug.jpg",
        alt: "Dead bug no chão, um braço e a perna oposta estendidos.",
        cue: "Lombar colada. O movimento é lento, um lado de cada vez.",
        stop: "Pressa faz a lombar descolar. Aí a série acaba.",
      },
    ],
  },
];

export const GABRIEL_SKIP = [
  "Levantamento terra e stiff. A barra longe do corpo pede a lombar.",
  "Agachamento com a barra nas costas. O peso desce direto na coluna.",
  "Abdominal de flexão, no chão ou na polia. Arredondar a lombar com força é o que fica de fora.",
  "Leg press até o fundo, quando o quadril enrola e a lombar sai do banco.",
  "Puxada por trás da nuca.",
];

export function gabrielDay(id: string) {
  return GABRIEL_DAYS.find((day) => day.id === id);
}

/** Segunda A, quarta B, sexta C. Nos outros dias a sessão é a que ficou faltando. */
export function gabrielToday(weekday: number) {
  if (weekday === 1) return "a";
  if (weekday === 3) return "b";
  if (weekday === 5) return "c";
  return null;
}
