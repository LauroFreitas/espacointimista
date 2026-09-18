import { Reveal } from "@/components/reveal";

const faqs = [
  {
    question: "Posso me alimentar antes da terapia?",
    answer:
      "Sim. Prefira uma alimentação leve e deixe pelo menos 1 hora de intervalo antes da massagem.",
  },
  {
    question: "Preciso tomar banho antes da sessão?",
    answer:
      "Para que você aproveite plenamente a experiência, sugerimos chegar ao atendimento com o corpo limpo e preparado para receber o cuidado. Evite, se possível, perfumes, loções ou cremes corporais antes da sessão. Utilizamos produtos profissionais de fragrância neutra, preservando a harmonia dos aromas e a experiência sensorial preparada para você. Pequenos detalhes fazem parte do cuidado.",
  },
  {
    question: "Preciso agendar a sessão?",
    answer:
      "Sim. Cada sessão é só sua, com hora marcada, para a sala já estar pronta quando você chegar.",
  },
  {
    question: "Eu escolho a terapia ou o profissional indica?",
    answer:
      "Você diz qual terapia do site mais te interessou. Na anamnese, o profissional avalia o seu corpo e indica o cuidado certo.",
  },
  {
    question: "Qual é o horário de atendimento?",
    answer:
      "Segunda a sexta, das 7h às 11h e das 14h às 18h.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="bg-ivory px-6 py-20 md:px-8 md:py-24">
      <Reveal className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-rose">Dúvidas</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
          Perguntas frequentes
        </h2>

        <div className="mt-10 divide-y divide-sand/70 border-y border-sand/70">
          {faqs.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left font-display text-lg font-semibold leading-snug text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-gold transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
