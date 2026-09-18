import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { EspacoSection } from "@/components/espaco-section";
import { ClientsSection } from "@/components/clients-section";
import { HeroBanner } from "@/components/hero-banner";
import { TherapiesSection } from "@/components/therapies-section";
import { HopButton } from "@/components/hop-button";
import { AnamnesisForm } from "@/components/anamnesis-form";
import { FaqSection } from "@/components/faq-section";

export default function Home() {
  return (
    <div id="topo" className="bg-ivory">
      <Header />

      <HeroBanner />

      <EspacoSection />

      <TherapiesSection />

      <ClientsSection />

      <section className="bg-cream px-6 py-20 md:px-8 md:py-24">
        <Reveal className="relative mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl leading-snug font-semibold text-ink md:text-3xl">
            O corpo pede pausa. A sala já está pronta.
          </p>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-stone">
            Agende sua sessão e chegue no horário. Sem espera, sem pressa.
          </p>
          <HopButton
            href="#visita"
            className="mt-8 inline-flex bg-espresso px-7 py-3.5 text-base font-medium text-ivory transition-colors hover:bg-gold hover:text-espresso"
          >
            Agendar agora
          </HopButton>
        </Reveal>
      </section>

      <FaqSection />

      <section id="visita" className="mx-auto grid max-w-6xl scroll-mt-32 gap-16 px-6 py-24 md:grid-cols-2 md:items-start md:px-8 md:py-32">
        <Reveal>
          <p className="text-sm font-medium text-rose">Visita</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Faça a sua anamnese.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-stone">
            A anamnese é uma conversa sobre o seu corpo: o que você sente, onde
            há tensão e se existe alguma condição de saúde. Com isso, o
            profissional avalia e indica o cuidado certo para você.
          </p>

          <dl className="mt-10 space-y-5 text-base">
            <div>
              <dt className="font-medium text-ink">Horário</dt>
              <dd className="mt-1 text-stone">
                Segunda a sexta, das 7h às 11h e das 14h às 18h
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Atendimento</dt>
              <dd className="mt-1 text-stone">Individual, somente com agendamento</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={140}>
          <AnamnesisForm />
        </Reveal>
      </section>

      <footer className="border-t border-sand/70 px-6 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <Logo className="text-ink" variant="footer" />
          <p className="text-sm text-stone">
            © {new Date().getFullYear()} Espaço Intimista
          </p>
        </div>
      </footer>
    </div>
  );
}
