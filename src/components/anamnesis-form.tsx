"use client";

import { type FormEvent } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

const HEALTH_OPTIONS = [
  "Gravidez",
  "Pressão alta",
  "Cirurgia recente",
  "Problema de pele ou ferida",
  "Alergia a óleos",
  "Nenhuma das anteriores",
] as const;

const METHOD_OPTIONS = [
  "Escalda-pés",
  "Massagem Facial",
  "Massagem Relaxante",
  "Terapia de Pedras Quentes",
] as const;

const fieldClass =
  "mt-1 w-full border-0 border-b border-sand bg-transparent px-0 py-1 text-sm text-ink outline-none transition-colors placeholder:text-stone/45 focus:border-gold";

function value(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

export function AnamnesisForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const health = data.getAll("saude").map(String);

    const text = [
      "Olá! Estou usando o site como correspondência. Quero fazer a minha anamnese e agendar um horário.",
      "",
      `Nome: ${value(data, "nome")}`,
      `Idade: ${value(data, "idade")}`,
      `Terapia que mais interessou no site: ${value(data, "metodo")}`,
      `O que me traz: ${value(data, "motivo")}`,
      `Onde sinto tensão: ${value(data, "regiao")}`,
      `Saúde: ${health.length ? health.join(", ") : "Não informado"}`,
      `Horário desejado: ${value(data, "horario") || "A combinar"}`,
      value(data, "observacoes")
        ? `Observações: ${value(data, "observacoes")}`
        : null,
      "",
      "O profissional avalia e indica o cuidado que eu preciso.",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-sand bg-cream p-4 md:p-5"
    >
      <div>
        <p className="font-display text-lg font-semibold">Anamnese</p>
        <p className="mt-1 text-xs leading-5 text-stone">
          Conte um pouco de você. O profissional avalia e indica o cuidado.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_5rem]">
        <label className="block">
          <span className="text-xs font-medium text-ink">Nome</span>
          <input
            name="nome"
            type="text"
            required
            autoComplete="name"
            placeholder="Seu nome"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-ink">Idade</span>
          <input
            name="idade"
            type="number"
            required
            min={16}
            max={120}
            inputMode="numeric"
            placeholder="34"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-ink">O que te traz</span>
        <input
          name="motivo"
          type="text"
          required
          placeholder="Relaxar, dor, tensão no trabalho…"
          className={fieldClass}
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-ink">Onde sente tensão</span>
        <input
          name="regiao"
          type="text"
          required
          placeholder="Costas, pescoço, ombros…"
          className={fieldClass}
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-ink">
          Qual das terapias que você viu no site mais te interessou?
        </span>
        <select name="metodo" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Escolha uma opção
          </option>
          {METHOD_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="mt-3">
        <legend className="text-xs font-medium text-ink">
          Alguma condição de saúde
        </legend>
        <div className="mt-1.5 grid gap-1 sm:grid-cols-2">
          {HEALTH_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center gap-1.5 text-xs text-stone"
            >
              <input
                type="checkbox"
                name="saude"
                value={option}
                className="size-3.5 accent-gold"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-ink">Horário desejado</span>
          <input
            name="horario"
            type="text"
            placeholder="Ex.: terça à tarde"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-ink">Observações</span>
          <input
            name="observacoes"
            type="text"
            placeholder="Opcional"
            className={fieldClass}
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex bg-espresso px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-gold hover:text-espresso"
      >
        Enviar no WhatsApp
      </button>
    </form>
  );
}
