import { describe, expect, test } from "vitest";
import {
  availableTimesFor,
  buildCalendarDays,
} from "../../features/pets/tela-07-meus-pets/appointment-calendar";

describe("calendário de agendamento", () => {
  test("monta agosto de 2026 em uma grade completa iniciada no domingo", () => {
    const days = buildCalendarDays(new Date(2026, 7, 1, 12));

    expect(days).toHaveLength(42);
    expect(days.slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(days[6]?.getDate()).toBe(1);
    expect(days[36]?.getDate()).toBe(31);
  });

  test("varia os horários demonstrativos conforme o dia", () => {
    expect(availableTimesFor(new Date(2026, 7, 2, 12))).toEqual([
      "08:00",
      "09:30",
      "14:00",
      "16:30",
    ]);
    expect(availableTimesFor(new Date(2026, 7, 3, 12))).toEqual([
      "09:30",
      "11:00",
      "14:00",
      "15:30",
    ]);
  });
});
